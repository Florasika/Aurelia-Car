/* ===== AURELIA — photos des voitures =====
   Ordre de priorité pour chaque vue (main, front, side, rear, top, interior, engine) :
   1. une URL fournie dans la voiture :  car.photos = { side: "https://..." }
   2. un fichier dans le dossier :       photos/<marque-modele>/<vue>.jpg   (ou .webp)
      (une photo par couleur :           photos/<marque-modele>/<vue>-<couleur>.jpg)
   3. une photo libre de droits trouvée sur Wikimedia Commons (recherche à l'ouverture).
   Les résultats en ligne sont mis en cache dans le navigateur. */
const Photos = (() => {
  const norm = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const slugify = (s) => norm(s).replace(/ /g, "-");
  const slugOf = (car) => slugify(car.brand + " " + car.model);

  const VIEW_WORDS = {
    front: ["front", "avant"], side: ["side", "profile", "profil"], rear: ["rear", "back", "arriere"],
    top: ["top", "aerial", "overhead", "dessus"], interior: ["interior", "interieur", "dashboard", "cockpit", "cabin"],
    engine: ["engine", "motor", "moteur", "powertrain"],
  };
  const BAD = ["logo", "emblem", "badge", "symbol", "diagram", "drawing", "sketch", "blueprint", "brochure", "poster", "toy", "lego", "scale model", "wreck", "crash", "accident", "burnt", "burned", "fire", "map"];
  const EXCL = {
    main: [...VIEW_WORDS.interior, ...VIEW_WORDS.engine, ...VIEW_WORDS.top, "wheel", "rim", "seat", "steering"],
    front: [...VIEW_WORDS.interior, ...VIEW_WORDS.engine, "wheel", "rim"], side: [...VIEW_WORDS.interior, ...VIEW_WORDS.engine, "wheel", "rim"],
    rear: [...VIEW_WORDS.interior, ...VIEW_WORDS.engine, "wheel", "rim"], top: [...VIEW_WORDS.interior, ...VIEW_WORDS.engine, "wheel", "rim"],
    interior: [...VIEW_WORDS.engine], engine: [...VIEW_WORDS.interior, "wheel", "rim"],
  };

  const mem = new Map();
  let active = 0; const queue = [];
  const limit = (fn) => new Promise((res, rej) => {
    const run = () => { active++; fn().then(res, rej).finally(() => { active--; if (queue.length) queue.shift()(); }); };
    active < 4 ? run() : queue.push(run);
  });

  const probe = (url) => new Promise((res) => { const i = new Image(); i.onload = () => res(true); i.onerror = () => res(false); i.src = url; });
  async function local(car, view, color) {
    const base = `photos/${slugOf(car)}/${view}${color ? "-" + color : ""}`;
    for (const ext of ["jpg", "webp"]) if (await probe(`${base}.${ext}`)) return { url: `${base}.${ext}`, source: "local" };
    return null;
  }

  const strip = (h) => String(h || "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

  /* choisit la meilleure photo parmi les résultats de l'API Commons */
  function pick(car, view, data) {
    const pages = Object.values((data && data.query && data.query.pages) || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
    const bt = norm(car.brand).split(" ").filter((t) => t.length >= 3);
    const mt = norm(car.model).split(" ").filter((t) => t.length > 1 || /\d/.test(t));
    const need = Math.max(1, Math.ceil(mt.length / 2));
    const wanted = view === "main" ? [] : VIEW_WORDS[view];
    for (const p of pages) {
      const info = p.imageinfo && p.imageinfo[0];
      if (!info || !/\.(jpe?g|png|webp)$/i.test(p.title || "")) continue;
      if (!(info.width >= 800 && info.width >= info.height * 1.05)) continue;
      const title = norm(String(p.title).replace(/^File:/i, "").replace(/\.\w+$/, ""));
      const flat = title.replace(/ /g, "");
      if (bt.length && !bt.some((t) => title.includes(t))) continue;
      if (mt.filter((t) => flat.includes(t)).length < need) continue;
      if (BAD.some((w) => title.split(" ").includes(w)) || EXCL[view].some((w) => title.includes(w))) continue;
      if (wanted.length && !wanted.some((w) => title.includes(w))) continue;
      const meta = info.extmetadata || {};
      const who = strip(meta.Artist && meta.Artist.value) || "?", lic = strip(meta.LicenseShortName && meta.LicenseShortName.value) || "?";
      return { url: info.thumburl || info.url, link: info.descriptionurl, credit: `${who} · ${lic} · Wikimedia Commons`, source: "web", t: Date.now() };
    }
    return null;
  }

  async function web(car, view) {
    const ck = ["w", slugOf(car), view].join("|");
    const hit = Store.get("pc", {})[ck];
    if (hit) { if (hit.url) return hit; if (Date.now() - hit.t < 864e5) return null; }   // pas trouvé : on réessaie après 24 h
    const q = `${car.brand} ${car.model}` + (view === "main" ? "" : " " + VIEW_WORDS[view][0]);
    const url = "https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({
      action: "query", generator: "search", gsrsearch: q, gsrnamespace: "6", gsrlimit: "25",
      prop: "imageinfo", iiprop: "url|size|extmetadata", iiurlwidth: "1400", format: "json", origin: "*",
    });
    let data;
    try {
      const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 9000);
      const r = await fetch(url, { signal: ctl.signal }); clearTimeout(to); data = await r.json();
    } catch { return null; }   // erreur réseau : rien n'est mis en cache
    const best = pick(car, view, data);
    const c = Store.get("pc", {}); c[ck] = best || { t: Date.now() }; Store.set("pc", c);
    return best;
  }

  /* get(car, vue, couleurSlug?) -> { url, credit?, link?, source } | null */
  function get(car, view = "main", color = null) {
    const k = [car.id, view, color || ""].join("|");
    if (mem.has(k)) return mem.get(k);
    const p = (async () => {
      if (color) { if (car.colorPhotos && car.colorPhotos[color]) return { url: car.colorPhotos[color], source: "custom" }; return local(car, view, color); }
      if (car.photos && car.photos[view]) return { url: car.photos[view], source: "custom" };
      const l = await local(car, view, null);
      if (l) return l;
      return limit(() => web(car, view));
    })();
    mem.set(k, p);
    return p;
  }
  const hint = (car, view, color) => `photos/${slugOf(car)}/${view}${color ? "-" + color : ""}.jpg`;
  const clear = () => { mem.clear(); Store.set("pc", {}); };

  return { get, hint, clear, slugify, slugOf, pick };
})();
