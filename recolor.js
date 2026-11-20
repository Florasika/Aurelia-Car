/* ===== AURELIA — teinte automatique de la carrosserie =====
   Repère la couleur dominante de la voiture sur la photo (zone centrale) et ne change
   que les pixels de cette couleur : fond, vitres, pneus et phares restent intacts.
   Limites : impossible si la voiture est blanche / noire / grise sur la photo
   (rien à distinguer du fond) ; demande une image lisible par le navigateur (CORS). */
const Recolor = (() => {
  const cache = new Map();

  const rgb2hsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
    let h = 0, s = 0;
    if (d) {
      s = d / (1 - Math.abs(2 * l - 1));
      h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60; if (h < 0) h += 360;
    }
    return [h, s, l];
  };
  const hsl2rgb = (h, s, l) => {
    const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
    const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
    return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
  };
  const hex2rgb = (h) => { const n = parseInt(h.replace("#", ""), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const hdist = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

  const load = (url) => new Promise((res, rej) => { const i = new Image(); i.crossOrigin = "anonymous"; i.onload = () => res(i); i.onerror = rej; i.src = url; });

  /* trouve la teinte dominante saturée dans la zone centrale */
  function analyze(px, W, H) {
    const bins = new Float32Array(72), sums = [];
    let n = 0;
    for (let y = Math.floor(H * 0.3); y < H * 0.85; y += 3) {
      for (let x = Math.floor(W * 0.1); x < W * 0.9; x += 3) {
        const i = (y * W + x) * 4, [h, s, l] = rgb2hsl(px[i], px[i + 1], px[i + 2]);
        n++;
        if (s > 0.3 && l > 0.1 && l < 0.88) { bins[Math.floor(h / 5) % 72]++; sums.push(h, s, l); }
      }
    }
    let best = 0, bi = 0;
    for (let b = 0; b < 72; b++) { const w = bins[(b + 71) % 72] + bins[b] + bins[(b + 1) % 72]; if (w > best) { best = w; bi = b; } }
    if (best / n < 0.05) return null;               // pas de couleur dominante : voiture neutre
    const centre = bi * 5 + 2.5;
    let cs = 0, cl = 0, c = 0;
    for (let k = 0; k < sums.length; k += 3) if (hdist(sums[k], centre) < 15) { cs += sums[k + 1]; cl += sums[k + 2]; c++; }
    return c ? { hue: centre, s: cs / c, l: cl / c } : null;
  }

  /* applique la couleur cible ; renvoie { canvas } ou { error: "neutral" | "cors" } */
  async function tint(url, targetHex) {
    const key = url + "|" + targetHex;
    if (cache.has(key)) return cache.get(key);
    const job = (async () => {
      let img;
      try { img = await load(url); } catch { return { error: "cors" }; }
      const scale = Math.min(1, 1100 / img.naturalWidth), W = Math.round(img.naturalWidth * scale), H = Math.round(img.naturalHeight * scale);
      const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
      const ctx = cv.getContext("2d", { willReadFrequently: true }); ctx.drawImage(img, 0, 0, W, H);
      let data;
      try { data = ctx.getImageData(0, 0, W, H); } catch { return { error: "cors" }; }
      const px = data.data, ref = analyze(px, W, H);
      if (!ref) return { error: "neutral" };
      const [tr, tg, tb] = hex2rgb(targetHex), [tH, tS, tL] = rgb2hsl(tr, tg, tb), neutral = tS < 0.12;
      const g = Math.max(0.15, Math.min(3.2, Math.log(Math.max(0.03, tL)) / Math.log(Math.max(0.05, ref.l))));
      const sRatio = neutral ? 0 : Math.min(2.2, tS / Math.max(0.15, ref.s));
      for (let i = 0; i < px.length; i += 4) {
        const [h, s, l] = rgb2hsl(px[i], px[i + 1], px[i + 2]);
        const w = (1 - smooth(11, 24, hdist(h, ref.hue))) * smooth(0.14, 0.34, s);
        if (w <= 0.01) continue;
        const nl = Math.pow(l, g), ns = neutral ? tS * 0.5 : Math.min(1, s * sRatio);
        const [r2, g2, b2] = hsl2rgb(neutral ? 0 : tH, ns, nl);
        px[i] += (r2 - px[i]) * w; px[i + 1] += (g2 - px[i + 1]) * w; px[i + 2] += (b2 - px[i + 2]) * w;
      }
      ctx.putImageData(data, 0, 0);
      return { canvas: cv };
    })();
    cache.set(key, job);
    return job;
  }
  return { tint, analyze, rgb2hsl, hsl2rgb };
})();
