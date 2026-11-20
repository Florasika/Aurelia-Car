/* ===== AURELIA — éléments communs : nav, footer, langue, thème, toasts, cartes ===== */

let LANG = Store.get("lang", "fr");
const t = (k) => (I18N[LANG] && I18N[LANG][k]) || k;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function toast(msg, isErr) {
  let box = document.getElementById("toasts");
  if (!box) { box = document.createElement("div"); box.id = "toasts"; document.body.appendChild(box); }
  const el = document.createElement("div");
  el.className = "toast" + (isErr ? " err" : "");
  el.textContent = msg;
  box.appendChild(el);
  setTimeout(() => el.remove(), 3800);
}

/* Langue */
function applyLang() {
  document.documentElement.lang = LANG;
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  const b = document.getElementById("lang-btn");
  if (b) b.textContent = LANG === "fr" ? "EN" : "FR";
}
function setLang(l) { LANG = l; Store.set("lang", l); applyLang(); document.dispatchEvent(new Event("langchange")); }

/* Thème */
function applyTheme() {
  const light = Store.get("theme", "dark") === "light";
  document.documentElement.classList.toggle("theme-light", light);
  const b = document.getElementById("theme-btn");
  if (b) b.textContent = light ? "☾" : "☀";
}
function toggleTheme() { Store.set("theme", Store.get("theme", "dark") === "light" ? "dark" : "light"); applyTheme(); }

/* Logo de marque : icône si disponible, sinon monogramme */
const monogram = (name, cls = "") => `<span class="monogram ${cls}">${esc(name.replace(/[^A-Za-zÀ-ÿ0-9 ]/g, "").split(" ").map((w) => w[0]).join("").slice(0, 3).toUpperCase())}</span>`;
function brandLogo(name, cls = "h-8 w-8") {
  const b = brandInfo(name);
  if (!b || !b.icon) return monogram(name, cls);
  return `<img data-logo="${esc(name)}" src="https://cdn.simpleicons.org/${b.icon}/ffffff" alt="${esc(name)}" loading="lazy" class="logo-adapt object-contain ${cls}">`;
}
document.addEventListener("error", (e) => {
  const el = e.target;
  if (el && el.matches && el.matches("img[data-logo]")) el.replaceWith(Object.assign(document.createElement("span"), { className: "monogram " + (el.className.match(/h-\S+|w-\S+/g) || []).join(" "), textContent: el.dataset.logo.split(" ").map((w) => w[0]).join("").slice(0, 3).toUpperCase() }));
}, true);

/* Navbar + footer */
function renderLayout() {
  const page = location.pathname.split("/").pop() || "index.html";
  const links = [
    ["models.html", "nav.models"], ["brands.html", "nav.brands"], ["configure.html", "nav.configure"], ["test-drive.html", "nav.testdrive"],
    ["services.html", "nav.services"], ["tour.html", "nav.tour"], ["contact.html", "nav.contact"],
  ];
  const nav = document.getElementById("nav");
  if (nav) nav.innerHTML = `
    <header class="glass-nav fixed top-0 w-full z-50 border-b border-white/10">
      <div class="container-custom h-20 flex items-center justify-between">
        <a href="index.html" class="font-display text-2xl tracking-[0.3em] font-light text-white no-underline">AURELIA<span style="color:#E50000">.</span></a>
        <nav class="hidden xl:flex items-center gap-7">
          ${links.map(([h, k]) => `<a href="${h}" data-i18n="${k}" class="text-xs tracking-[0.2em] uppercase no-underline ${page === h ? "text-white" : "text-neutral-400 hover:text-white"}"></a>`).join("")}
        </nav>
        <div class="flex items-center gap-3">
          <button id="lang-btn" class="font-mono text-xs w-9 h-9 border border-neutral-800 text-white hover:border-white" aria-label="Langue"></button>
          <button id="theme-btn" class="text-sm w-9 h-9 border border-neutral-800 text-white hover:border-white" aria-label="Thème"></button>
          <a href="test-drive.html" data-i18n="nav.book" class="hidden md:inline-flex btn-primary !py-3 !px-5"></a>
          <button id="burger" class="xl:hidden w-9 h-9 border border-neutral-800 text-white" aria-label="Menu">☰</button>
        </div>
      </div>
      <div id="mobile-menu" class="hidden xl:hidden border-t border-white/10 px-6 py-4 flex-col gap-2">
        ${links.map(([h, k]) => `<a href="${h}" data-i18n="${k}" class="block py-2 text-xs tracking-[0.2em] uppercase text-neutral-300 no-underline"></a>`).join("")}
      </div>
    </header>`;
  const ft = document.getElementById("footer");
  if (ft) ft.innerHTML = `
    <footer class="bg-[#050505] border-t border-neutral-900 mt-24">
      <div class="container-custom py-16 grid md:grid-cols-3 gap-10">
        <div><p class="font-display text-2xl tracking-[0.3em] font-light text-white">AURELIA<span style="color:#E50000">.</span></p><p class="text-neutral-500 text-sm mt-3" data-i18n="ft.tag"></p></div>
        <div class="text-sm space-y-2">${links.map(([h, k]) => `<a href="${h}" data-i18n="${k}" class="block text-neutral-400 hover:text-white no-underline"></a>`).join("")}</div>
        <div class="text-sm text-neutral-400 space-y-2"><p>hello@aurelia-motors.com</p><p>+33 1 42 60 38 22</p><a href="admin.html" class="overline hover:text-white no-underline">/ admin</a></div>
      </div>
      <div class="border-t border-neutral-900 py-6 text-center text-xs text-neutral-600" data-i18n="ft.demo"></div>
    </footer>`;

  document.getElementById("lang-btn")?.addEventListener("click", () => setLang(LANG === "fr" ? "en" : "fr"));
  document.getElementById("theme-btn")?.addEventListener("click", toggleTheme);
  document.getElementById("burger")?.addEventListener("click", () => { const m = document.getElementById("mobile-menu"); m.classList.toggle("hidden"); m.classList.toggle("flex"); });
}

function initReveal() {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); } }), { threshold: 0.12 });
  document.querySelectorAll(".scroll-reveal").forEach((el) => io.observe(el));
}

/* Remplit les <img data-car data-view> avec la photo du bon modèle */
function hydratePhotos(root = document) {
  root.querySelectorAll("img[data-car]:not([data-done])").forEach((img) => {
    img.dataset.done = "1";
    const car = getCar(img.dataset.car);
    if (!car) return;
    Photos.get(car, img.dataset.view || "main").then((p) => {
      if (!p) return;
      img.onload = () => { img.classList.remove("opacity-0"); img.parentElement.querySelector(".ph-fb")?.classList.add("hidden"); };
      img.src = p.url;
      if (p.credit) img.title = p.credit;
    });
  });
}

/* Carte voiture */
function carCard(c) {
  return `
  <a href="car.html?id=${encodeURIComponent(c.id)}" class="car-card group block bg-[#0c0c0c] border border-neutral-900 hover:border-neutral-700 transition-colors no-underline text-white">
    <div class="studio relative aspect-[4/3] overflow-hidden">
      <div class="ph-fb absolute inset-0 flex flex-col items-center justify-center gap-3 text-neutral-500">${brandLogo(c.brand, "h-12 w-12")}<span class="overline">${esc(c.brand)}</span></div>
      <img data-car="${esc(c.id)}" data-view="main" alt="${esc(c.brand + " " + c.model)}" class="car-img absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700">
      <div class="shine absolute inset-0 overflow-hidden"></div>
      <span class="on-image absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 font-mono text-[10px] tracking-[0.2em] uppercase text-white">${t("type." + c.type)}</span>
    </div>
    <div class="p-6">
      <div class="flex items-center gap-3">${brandLogo(c.brand, "h-5 w-5")}<p class="overline">${esc(c.brand)}</p></div>
      <h3 class="font-display text-2xl mt-2">${esc(c.model)}</h3>
      <p class="text-neutral-400 text-sm mt-2">${esc((c.tag && c.tag[LANG]) || "")}</p>
      <div class="flex items-end justify-between mt-6 pt-4 border-t border-neutral-900">
        <div><p class="overline">${t("card.from")}</p><p class="font-mono text-lg">${fmtPrice(c.price)}</p></div>
        <p class="font-mono text-xs text-neutral-500">${c.hp} HP</p>
      </div>
    </div>
  </a>`;
}

/* <option> groupées par marque pour les listes de voitures */
function carOptions(cars, selectedId) {
  const groups = {};
  cars.forEach((c) => (groups[c.brand] = groups[c.brand] || []).push(c));
  return Object.keys(groups).sort((a, b) => a.localeCompare(b, "fr")).map((b) =>
    `<optgroup label="${esc(b)}">${groups[b].map((c) => `<option value="${esc(c.id)}" ${c.id === selectedId ? "selected" : ""}>${esc(c.brand + " " + c.model)}</option>`).join("")}</optgroup>`).join("");
}

function bindModal(id) {
  const m = document.getElementById(id);
  m.addEventListener("click", (e) => { if (e.target === m) m.classList.remove("open"); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") m.classList.remove("open"); });
  return { open: () => m.classList.add("open"), close: () => m.classList.remove("open") };
}

document.addEventListener("DOMContentLoaded", () => {
  renderLayout(); applyTheme(); applyLang(); initReveal(); hydratePhotos();
  document.addEventListener("langchange", () => hydratePhotos());
  document.dispatchEvent(new Event("layoutready"));
});
