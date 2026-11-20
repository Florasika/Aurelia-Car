/* ===== AURELIA — éléments communs : nav, footer, langue, thème, toasts ===== */

let LANG = Store.get("lang", "fr");
const t = (k) => (I18N[LANG] && I18N[LANG][k]) || k;

function toast(msg, isErr) {
  let box = document.getElementById("toasts");
  if (!box) { box = document.createElement("div"); box.id = "toasts"; document.body.appendChild(box); }
  const el = document.createElement("div");
  el.className = "toast" + (isErr ? " err" : "");
  el.textContent = msg;
  box.appendChild(el);
  setTimeout(() => el.remove(), 3800);
}

/* Applique les traductions aux éléments [data-i18n] / [data-i18n-ph] */
function applyLang() {
  document.documentElement.lang = LANG;
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  const b = document.getElementById("lang-btn");
  if (b) b.textContent = LANG === "fr" ? "EN" : "FR";
}
function setLang(l) {
  LANG = l; Store.set("lang", l); applyLang();
  document.dispatchEvent(new Event("langchange"));
}

/* Thème */
function applyTheme() {
  const light = Store.get("theme", "dark") === "light";
  document.documentElement.classList.toggle("theme-light", light);
  const b = document.getElementById("theme-btn");
  if (b) b.textContent = light ? "☾" : "☀";
}
function toggleTheme() { Store.set("theme", Store.get("theme", "dark") === "light" ? "dark" : "light"); applyTheme(); }

/* Navbar + footer */
function renderLayout() {
  const page = location.pathname.split("/").pop() || "index.html";
  const links = [
    ["models.html", "nav.models"], ["configure.html", "nav.configure"], ["test-drive.html", "nav.testdrive"],
    ["services.html", "nav.services"], ["tour.html", "nav.tour"], ["contact.html", "nav.contact"],
  ];
  const nav = document.getElementById("nav");
  if (nav) nav.innerHTML = `
    <header class="glass-nav fixed top-0 w-full z-50 border-b border-white/10">
      <div class="container-custom h-20 flex items-center justify-between">
        <a href="index.html" class="font-display text-2xl tracking-[0.3em] font-light text-white no-underline">AURELIA<span style="color:#E50000">.</span></a>
        <nav class="hidden lg:flex items-center gap-8">
          ${links.map(([h, k]) => `<a href="${h}" data-i18n="${k}" class="text-xs tracking-[0.2em] uppercase no-underline ${page === h ? "text-white" : "text-neutral-400 hover:text-white"}"></a>`).join("")}
        </nav>
        <div class="flex items-center gap-3">
          <button id="lang-btn" class="font-mono text-xs w-9 h-9 border border-neutral-800 text-white hover:border-white" aria-label="Langue"></button>
          <button id="theme-btn" class="text-sm w-9 h-9 border border-neutral-800 text-white hover:border-white" aria-label="Thème"></button>
          <a href="test-drive.html" data-i18n="nav.book" class="hidden md:inline-flex btn-primary !py-3 !px-5"></a>
          <button id="burger" class="lg:hidden w-9 h-9 border border-neutral-800 text-white" aria-label="Menu">☰</button>
        </div>
      </div>
      <div id="mobile-menu" class="hidden lg:hidden border-t border-white/10 px-6 py-4 flex-col gap-4">
        ${links.map(([h, k]) => `<a href="${h}" data-i18n="${k}" class="block py-2 text-xs tracking-[0.2em] uppercase text-neutral-300 no-underline"></a>`).join("")}
      </div>
    </header>`;
  const ft = document.getElementById("footer");
  if (ft) ft.innerHTML = `
    <footer class="bg-[#050505] border-t border-neutral-900 mt-24">
      <div class="container-custom py-16 grid md:grid-cols-3 gap-10">
        <div>
          <p class="font-display text-2xl tracking-[0.3em] font-light text-white">AURELIA<span style="color:#E50000">.</span></p>
          <p class="text-neutral-500 text-sm mt-3" data-i18n="ft.tag"></p>
        </div>
        <div class="text-sm text-neutral-400 space-y-2">
          ${links.map(([h, k]) => `<a href="${h}" data-i18n="${k}" class="block text-neutral-400 hover:text-white no-underline"></a>`).join("")}
        </div>
        <div class="text-sm text-neutral-400 space-y-2">
          <p>hello@aurelia-motors.com</p><p>+33 1 42 60 38 22</p>
          <a href="admin.html" class="overline hover:text-white no-underline">/ admin</a>
        </div>
      </div>
      <div class="border-t border-neutral-900 py-6 text-center text-xs text-neutral-600" data-i18n="ft.demo"></div>
    </footer>`;

  document.getElementById("lang-btn")?.addEventListener("click", () => setLang(LANG === "fr" ? "en" : "fr"));
  document.getElementById("theme-btn")?.addEventListener("click", toggleTheme);
  document.getElementById("burger")?.addEventListener("click", () => {
    const m = document.getElementById("mobile-menu"); m.classList.toggle("hidden"); m.classList.toggle("flex");
  });
}

/* Révélation au scroll */
function initReveal() {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); } }), { threshold: 0.12 });
  document.querySelectorAll(".scroll-reveal").forEach((el) => io.observe(el));
}

/* Carte voiture réutilisable */
function carCard(c) {
  const tag = c.tag?.[LANG] || "";
  return `
  <a href="car.html?id=${encodeURIComponent(c.id)}" class="car-card group block bg-[#0c0c0c] border border-neutral-900 hover:border-neutral-700 transition-colors no-underline text-white">
    <div class="relative aspect-[4/3] overflow-hidden">
      <img src="${c.img}" alt="${c.brand} ${c.model}" loading="lazy" class="car-img w-full h-full object-cover">
      <div class="shine absolute inset-0 overflow-hidden"></div>
      <span class="on-image absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 font-mono text-[10px] tracking-[0.2em] uppercase text-white">${t("type." + c.type)}</span>
    </div>
    <div class="p-6">
      <p class="overline">${c.brand}</p>
      <h3 class="font-display text-2xl mt-1">${c.model}</h3>
      <p class="text-neutral-400 text-sm mt-2">${tag}</p>
      <div class="flex items-end justify-between mt-6 pt-4 border-t border-neutral-900">
        <div><p class="overline">${t("card.from")}</p><p class="font-mono text-lg">${fmtPrice(c.price)}</p></div>
        <p class="font-mono text-xs text-neutral-500">${c.hp} HP</p>
      </div>
    </div>
  </a>`;
}

/* Ouvre / ferme une modale (clic extérieur ou Échap) */
function bindModal(id) {
  const m = document.getElementById(id);
  m.addEventListener("click", (e) => { if (e.target === m) m.classList.remove("open"); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") m.classList.remove("open"); });
  return { open: () => m.classList.add("open"), close: () => m.classList.remove("open") };
}

document.addEventListener("DOMContentLoaded", () => {
  renderLayout(); applyTheme(); applyLang(); initReveal();
  document.dispatchEvent(new Event("layoutready"));
});
