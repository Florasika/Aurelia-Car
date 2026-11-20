/* ===== AURELIA — données & traductions ===== */

const IMG = {
  hero:     "https://images.unsplash.com/photo-1763165561886-a9391b2132c1?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000",
  black:    "https://images.pexels.com/photos/35879373/pexels-photo-35879373.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  ferrari:  "https://images.unsplash.com/photo-1589240508375-8ad32cfcfcf4?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  porsche:  "https://images.unsplash.com/photo-1704325053114-1b9750ca7bec?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  coast:    "https://images.pexels.com/photos/17597363/pexels-photo-17597363.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  white:    "https://images.pexels.com/photos/36237587/pexels-photo-36237587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  wheel:    "https://images.unsplash.com/photo-1698663198451-b66759d9ff3c?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  interior: "https://images.unsplash.com/photo-1762517366875-a1528058dcf7?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  night:    "https://images.unsplash.com/photo-1744884275743-4b075af04f62?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000",
  engine:   "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1600&q=85",
};

/* Options communes du configurateur */
const COLORS = [
  { name: "Noir Obsidienne", hex: "#0a0a0a", price: 0 },
  { name: "Blanc Alpin",     hex: "#f2f2f0", price: 1500 },
  { name: "Rouge Aurelia",   hex: "#c8102e", price: 2500 },
  { name: "Bleu Nuit",       hex: "#12233f", price: 2500 },
  { name: "Gris Nardo",      hex: "#8a8d8f", price: 3500 },
];
const WHEELS = [
  { name: "Standard 19\"", price: 0,    image: IMG.wheel },
  { name: "Sport 20\"",    price: 2800, image: IMG.wheel },
  { name: "Forgées 21\"",  price: 5200, image: IMG.wheel },
];
const INTERIORS = [
  { name: "Cuir Noir",        hex: "#111111", price: 0,    image: IMG.interior },
  { name: "Cuir Cognac",      hex: "#8b5a2b", price: 1800, image: IMG.interior },
  { name: "Alcantara Rouge",  hex: "#7a1020", price: 2400, image: IMG.interior },
  { name: "Cuir Crème",       hex: "#d8cdb8", price: 2000, image: IMG.interior },
  { name: "Carbone",          hex: "#2a2a2a", price: 3200, image: IMG.interior },
];
const TECH = [
  { name: "Pack Assistance",       price: 3200, description: "Régulateur adaptatif, maintien de voie" },
  { name: "Son premium",           price: 2900, description: "Audio haute fidélité 18 haut-parleurs" },
  { name: "Toit panoramique",      price: 2100, description: "Verre teinté électrochrome" },
  { name: "Affichage tête haute",  price: 1600, description: "Infos de conduite sur le pare-brise" },
];

/* Catalogue par défaut (9 voitures) */
const DEFAULT_CARS = [
  { id: "bmw-m4", brand: "BMW", model: "M4 Competition", type: "sport", price: 89900, hp: 510, range: null, acc: 3.5, top: 250, featured: false,
    img: IMG.black, gallery: [IMG.porsche, IMG.coast, IMG.hero],
    tag:  { fr: "Le coupé qui mord.", en: "The coupé that bites." },
    desc: { fr: "Six cylindres biturbo, châssis affûté et poste de conduite orienté pilote.", en: "Twin-turbo straight-six, sharpened chassis and a driver-focused cockpit." } },
  { id: "ferrari-sf90", brand: "Ferrari", model: "SF90 Stradale", type: "sport", price: 460000, hp: 1000, range: 25, acc: 2.5, top: 340, featured: true,
    img: IMG.ferrari, gallery: [IMG.coast, IMG.black, IMG.porsche],
    tag:  { fr: "1000 chevaux, zéro compromis.", en: "1000 horsepower, zero compromise." },
    desc: { fr: "Hybride rechargeable à trois moteurs électriques et V8 biturbo : la supercar de série la plus puissante de Maranello.", en: "Plug-in hybrid with three electric motors and a twin-turbo V8: Maranello's most powerful series supercar." } },
  { id: "cadillac-escalade-iq", brand: "Cadillac", model: "Escalade IQ", type: "electric", price: 129900, hp: 680, range: 460, acc: 4.7, top: 210, featured: false,
    img: IMG.night, gallery: [IMG.interior, IMG.hero, IMG.black],
    tag:  { fr: "Le grand SUV, version électrique.", en: "The full-size SUV, electrified." },
    desc: { fr: "Écran incurvé de 55 pouces, silence de cathédrale et espace pour sept.", en: "55-inch curved display, cathedral silence and room for seven." } },
  { id: "porsche-911-gt3rs", brand: "Porsche", model: "911 GT3 RS", type: "sport", price: 241000, hp: 525, range: null, acc: 3.2, top: 296, featured: true,
    img: IMG.white, gallery: [IMG.porsche, IMG.hero, IMG.coast],
    tag:  { fr: "Née sur circuit.", en: "Born on the track." },
    desc: { fr: "Atmosphérique à 9 000 tr/min, aérodynamique active et appui spectaculaire.", en: "Naturally aspirated to 9,000 rpm, active aerodynamics and spectacular downforce." } },
  { id: "audi-rs-etron-gt", brand: "Audi", model: "RS e-tron GT", type: "electric", price: 147000, hp: 646, range: 560, acc: 3.3, top: 250, featured: true,
    img: IMG.hero, gallery: [IMG.white, IMG.night, IMG.black],
    tag:  { fr: "Le Gran Turismo électrique.", en: "The electric Gran Turismo." },
    desc: { fr: "Architecture 800 volts, recharge ultra-rapide et lignes de coupé quatre portes.", en: "800-volt architecture, ultra-fast charging and four-door coupé lines." } },
  { id: "toyota-land-cruiser", brand: "Toyota", model: "Land Cruiser", type: "suv", price: 78000, hp: 305, range: null, acc: 8.0, top: 175, featured: false,
    img: IMG.coast, gallery: [IMG.night, IMG.interior, IMG.black],
    tag:  { fr: "Indestructible par nature.", en: "Indestructible by nature." },
    desc: { fr: "L'icône tout-terrain, désormais plus raffinée à bord sans rien perdre de sa légende.", en: "The off-road icon, now more refined inside without losing any of its legend." } },
  { id: "peugeot-508-pse", brand: "Peugeot", model: "508 PSE", type: "sedan", price: 69900, hp: 360, range: 42, acc: 5.2, top: 250, featured: false,
    img: IMG.black, gallery: [IMG.hero, IMG.white, IMG.interior],
    tag:  { fr: "L'élégance française, survitaminée.", en: "French elegance, supercharged." },
    desc: { fr: "Berline hybride rechargeable signée Peugeot Sport, griffes du lion et dynamique affûtée.", en: "Plug-in hybrid saloon from Peugeot Sport, lion claws and sharp dynamics." } },
  { id: "mercedes-eqs-580", brand: "Mercedes", model: "EQS 580", type: "electric", price: 135000, hp: 523, range: 780, acc: 4.3, top: 210, featured: true,
    img: IMG.porsche, gallery: [IMG.hero, IMG.night, IMG.interior],
    tag:  { fr: "La Classe S de demain.", en: "Tomorrow's S-Class." },
    desc: { fr: "Hyperscreen, aérodynamisme record et autonomie à faire oublier les bornes.", en: "Hyperscreen, record-breaking aerodynamics and a range that makes you forget the chargers." } },
  { id: "renault-megane-etech", brand: "Renault", model: "Mégane E-Tech", type: "electric", price: 38900, hp: 220, range: 450, acc: 7.4, top: 160, featured: false,
    img: IMG.hero, gallery: [IMG.coast, IMG.black, IMG.interior],
    tag:  { fr: "L'électrique à la française.", en: "Electric, the French way." },
    desc: { fr: "Compacte électrique agile, intérieur connecté et prix maîtrisé.", en: "Agile electric compact, connected interior and sensible pricing." } },
];

/* ===== Stockage local (remplace le backend) ===== */
const Store = {
  get(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem("aurelia_" + key)); return v ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) { try { localStorage.setItem("aurelia_" + key, JSON.stringify(value)); } catch {} },
  push(key, item) {
    const list = Store.get(key, []);
    list.unshift({ id: Date.now().toString(36), created: new Date().toISOString(), ...item });
    Store.set(key, list);
  },
};
const getCars = () => Store.get("cars", DEFAULT_CARS);
const getCar = (id) => getCars().find((c) => c.id === id);
const fmtPrice = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

/* ===== Traductions FR / EN ===== */
const I18N = {
  fr: {
    "nav.models": "Modèles", "nav.configure": "Configurateur", "nav.testdrive": "Essai", "nav.services": "Services", "nav.tour": "Visite 360°", "nav.contact": "Contact", "nav.book": "Réserver un essai",
    "home.overline": "/ maison automobile", "home.title": "L'art de conduire,\nredéfini.", "home.sub": "Neuf grandes marques, un seul showroom. Configurez, essayez, possédez.",
    "home.explore": "Explorer les modèles", "home.configure": "Configurer",
    "home.hl.over": "/ points forts", "home.hl.title": "Performance, technologie, design.",
    "home.perf": "Performance", "home.perf.d": "Des moteurs qui font vibrer, du V8 atmosphérique à l'électrique instantané.",
    "home.tech": "Technologie", "home.tech.d": "Interfaces fluides, assistance de conduite et connectivité native.",
    "home.design": "Design", "home.design.d": "Lignes sculptées, matériaux nobles.",
    "home.elec": "Électrique", "home.elec.d": "Jusqu'à 780 km.",
    "home.feat.over": "/ modèles phares", "home.feat.title": "La sélection de la maison.", "home.seeall": "Tout voir",
    "home.serv.over": "/ services", "home.serv.title": "Un suivi à la hauteur.",
    "svc.wash": "Detailing", "svc.wash.d": "Lavage, polish et protection céramique par nos préparateurs.",
    "svc.repair": "Réparation", "svc.repair.d": "Entretien constructeur et carrosserie, pièces d'origine.",
    "svc.custom": "Personnalisation", "svc.custom.d": "Jantes, intérieurs, covering : votre voiture, unique.",
    "svc.request": "Faire une demande",
    "home.test.over": "/ avis", "home.test.title": "Ils ont franchi le pas.",
    "home.cta.title": "Votre prochain essai commence ici.", "home.cta.sub": "Réservez un créneau en trois clics, nous préparons la voiture.", "home.cta.btn": "Réserver un essai",
    "models.title": "La collection", "models.sub": "Neuf marques, des dizaines de configurations. Filtrez à votre guise.",
    "f.brand": "Marque", "f.type": "Type", "f.price": "Prix max", "f.all": "Toutes", "f.reset": "Réinitialiser", "f.none": "Aucun modèle ne correspond.",
    "type.all": "Tous", "type.sport": "Sport", "type.suv": "SUV", "type.electric": "Électrique", "type.sedan": "Berline",
    "card.from": "À partir de",
    "d.from": "À partir de", "d.configure": "Configurer", "d.book": "Réserver un essai", "d.top": "Vitesse max", "d.power": "Puissance", "d.range": "Autonomie", "d.acc": "0–100 km/h", "d.gallery": "Galerie",
    "views": "Face,Profil,Dos,Haut",
    "c.title": "Configurateur", "c.color": "Couleur extérieure", "c.wheels": "Jantes", "c.interior": "Intérieur", "c.tech": "Options technologiques", "c.total": "Total", "c.order": "Commander",
    "c.ok": "Commande enregistrée. Notre équipe vous contacte.",
    "f.name": "Nom complet", "f.email": "Email", "f.phone": "Téléphone", "f.notes": "Notes", "f.subject": "Sujet", "f.message": "Message", "f.cancel": "Annuler",
    "td.title": "Réserver un essai", "td.sub": "Choisissez une voiture, une date et un créneau.", "td.car": "Voiture", "td.date": "Date", "td.time": "Créneau", "td.submit": "Confirmer l'essai",
    "td.ok": "Essai confirmé. Un email de confirmation vous sera envoyé (mode démo).", "td.pick": "Choisissez une date et une heure.",
    "sv.title": "Services", "sv.sub": "Prenez soin de votre voiture comme nous prenons soin de vous.", "sv.submit": "Envoyer la demande", "sv.ok": "Demande envoyée. Nous revenons vers vous rapidement.",
    "tour.title": "Visite 360°", "tour.sub": "Faites glisser l'image ou utilisez les flèches. Démarrez le moteur pour l'entendre.",
    "tour.views": "Extérieur,Profil,Arrière,Vue haute,Intérieur,Moteur", "tour.dash": "Tableau de bord live", "tour.start": "Démarrer le moteur", "tour.stop": "Arrêter le moteur",
    "ct.title": "Contact", "ct.sub": "Une question, un projet ? Écrivez-nous.", "ct.send": "Envoyer", "ct.ok": "Message envoyé. Merci !",
    "ct.addr": "12 avenue des Champs-Élysées, 75008 Paris", "ct.hours": "Lun–Sam · 9h–19h",
    "ad.title": "Administration", "ad.add": "Ajouter une voiture",
    "ft.tag": "L'art de conduire, redéfini.", "ft.demo": "Projet de démonstration. Marques et noms appartiennent à leurs propriétaires.",
  },
  en: {
    "nav.models": "Models", "nav.configure": "Configurator", "nav.testdrive": "Test drive", "nav.services": "Services", "nav.tour": "360° Tour", "nav.contact": "Contact", "nav.book": "Book a test drive",
    "home.overline": "/ automotive house", "home.title": "The art of driving,\nredefined.", "home.sub": "Nine great marques, one showroom. Configure, drive, own.",
    "home.explore": "Explore models", "home.configure": "Configure",
    "home.hl.over": "/ highlights", "home.hl.title": "Performance, technology, design.",
    "home.perf": "Performance", "home.perf.d": "Engines that stir the soul, from naturally aspirated V8 to instant electric torque.",
    "home.tech": "Technology", "home.tech.d": "Fluid interfaces, driver assistance and native connectivity.",
    "home.design": "Design", "home.design.d": "Sculpted lines, noble materials.",
    "home.elec": "Electric", "home.elec.d": "Up to 780 km.",
    "home.feat.over": "/ featured models", "home.feat.title": "The house selection.", "home.seeall": "See all",
    "home.serv.over": "/ services", "home.serv.title": "Aftercare, elevated.",
    "svc.wash": "Detailing", "svc.wash.d": "Wash, polish and ceramic protection by our detailers.",
    "svc.repair": "Repair", "svc.repair.d": "Manufacturer servicing and bodywork, genuine parts.",
    "svc.custom": "Customization", "svc.custom.d": "Wheels, interiors, wraps: make your car one of a kind.",
    "svc.request": "Make a request",
    "home.test.over": "/ testimonials", "home.test.title": "They took the leap.",
    "home.cta.title": "Your next test drive starts here.", "home.cta.sub": "Book a slot in three clicks, we prepare the car.", "home.cta.btn": "Book a test drive",
    "models.title": "The collection", "models.sub": "Nine marques, dozens of configurations. Filter as you like.",
    "f.brand": "Brand", "f.type": "Type", "f.price": "Max price", "f.all": "All", "f.reset": "Reset", "f.none": "No model matches.",
    "type.all": "All", "type.sport": "Sport", "type.suv": "SUV", "type.electric": "Electric", "type.sedan": "Sedan",
    "card.from": "From",
    "d.from": "From", "d.configure": "Configure", "d.book": "Book a test drive", "d.top": "Top speed", "d.power": "Power", "d.range": "Range", "d.acc": "0–100 km/h", "d.gallery": "Gallery",
    "views": "Front,Profile,Back,Top",
    "c.title": "Configurator", "c.color": "Exterior color", "c.wheels": "Wheels", "c.interior": "Interior", "c.tech": "Tech options", "c.total": "Total", "c.order": "Order",
    "c.ok": "Order saved. Our team will contact you.",
    "f.name": "Full name", "f.email": "Email", "f.phone": "Phone", "f.notes": "Notes", "f.subject": "Subject", "f.message": "Message", "f.cancel": "Cancel",
    "td.title": "Book a test drive", "td.sub": "Pick a car, a date and a time slot.", "td.car": "Car", "td.date": "Date", "td.time": "Time slot", "td.submit": "Confirm test drive",
    "td.ok": "Test drive confirmed. A confirmation email will follow (demo mode).", "td.pick": "Pick a date and a time.",
    "sv.title": "Services", "sv.sub": "We look after your car like we look after you.", "sv.submit": "Send request", "sv.ok": "Request sent. We'll get back to you shortly.",
    "tour.title": "360° Tour", "tour.sub": "Drag the image or use the arrows. Start the engine to hear it.",
    "tour.views": "Exterior,Profile,Back,Top,Interior,Engine", "tour.dash": "Live dashboard", "tour.start": "Start engine", "tour.stop": "Stop engine",
    "ct.title": "Contact", "ct.sub": "A question, a project? Write to us.", "ct.send": "Send", "ct.ok": "Message sent. Thank you!",
    "ct.addr": "12 avenue des Champs-Élysées, 75008 Paris", "ct.hours": "Mon–Sat · 9am–7pm",
    "ad.title": "Administration", "ad.add": "Add a car",
    "ft.tag": "The art of driving, redefined.", "ft.demo": "Demo project. Brands and names belong to their respective owners.",
  },
};
