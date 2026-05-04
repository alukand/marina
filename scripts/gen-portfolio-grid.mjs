import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const IMAGES = path.join(ROOT, "images");

function escUrl(rel) {
  return rel.split("/").map((p) => encodeURIComponent(p)).join("/");
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function slugTitle(stem) {
  const s = stem.replace(/_/g, " ").replace(/-/g, " ");
  const parts = s.split(/\s+/).filter(Boolean);
  return parts
    .map((p) => {
      if (/^img$/i.test(p)) return "Img";
      if (/^\d+$/.test(p)) return p;
      return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
    })
    .join(" ");
}

function imgDims(aspect) {
  if (aspect === "16/9") return { w: 1280, h: 720 };
  if (aspect === "3/4") return { w: 720, h: 960 };
  return { w: 800, h: 1000 };
}

function altFrom(cat, credit, stem, title) {
  const st = stem.toLowerCase();
  if (st.includes("winters-bone")) {
    return "Key makeup artist work on Winter's Bone film set — Marina Proctor";
  }
  if (st.includes("ayelet-zurer") || st.includes("ayelet")) {
    return "Red carpet makeup for Ayelet Zurer at Ben Hur premiere by Marina Proctor";
  }
  if (st === "fresh.jpg" || stem.toLowerCase() === "fresh") {
    return "Natural beauty makeup by Los Angeles makeup artist Marina Proctor";
  }
  if (st.includes("gq") || st.includes("grooming") || credit.includes("Grooming")) {
    return "Men's grooming for GQ-style editorial shoot — Marina Proctor makeup artist";
  }
  if (cat === "film") {
    return `Film set makeup continuity — Marina Proctor IATSE Local 706 — ${title}`;
  }
  if (cat === "red-carpet") {
    return `Red carpet makeup artist Los Angeles — Marina Proctor — ${title}`;
  }
  if (cat === "trailers") {
    return `Film trailer preview — TV makeup artist Los Angeles — Marina Proctor — ${title}`;
  }
  if (credit.includes("Editorial")) {
    return `Editorial print makeup Los Angeles — Marina Proctor — ${title}`;
  }
  if (credit.includes("Commercial")) {
    return `Commercial advertising makeup — photoshoot makeup artist LA — Marina Proctor — ${title}`;
  }
  if (credit.includes("Grooming")) {
    return `Men's grooming Los Angeles — Marina Proctor — ${title}`;
  }
  if (credit.includes("Beauty")) {
    return `Natural beauty makeup by Los Angeles makeup artist Marina Proctor — ${title}`;
  }
  return `Marina Proctor makeup portfolio — Los Angeles IATSE Local 706 — ${title}`;
}

function item(cat, rel, credit, label, aspect, span2) {
  const stem = path.parse(rel).name;
  const title = slugTitle(stem);
  const span = span2 ? " span-2" : "";
  const src = escUrl(rel);
  const alt = escapeAttr(altFrom(cat, credit, stem, title));
  const { w, h } = imgDims(aspect);
  return `          <div class="portfolio-item${span}" data-category="${cat}" data-title="${escapeAttr(title)}" data-credit="${credit}" data-category-label="${label}">
            <div class="portfolio-thumb" style="aspect-ratio: ${aspect}; overflow: hidden;">
              <img src="${src}" alt="${alt}" width="${w}" height="${h}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;">
            </div>
            <div class="item-overlay">
              <span class="item-title">${title}</span>
              <span class="item-category">${label}</span>
            </div>
          </div>
`;
}

function trailerItem(vid, title, idx) {
  const thumb = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
  const url = `https://www.youtube.com/watch?v=${vid}`;
  const span = idx === 0 ? " span-2" : "";
  const alt = escapeAttr(
    `Film trailer preview — hire makeup artist for film and TV — Marina Proctor — ${title}`
  );
  const { w, h } = imgDims("16/9");
  return `          <div class="portfolio-item${span}" data-category="trailers" data-title="${escapeAttr(title)}" data-credit="" data-category-label="Trailers" data-video-url="${url}">
            <div class="portfolio-thumb" style="aspect-ratio: 16/9; overflow: hidden;">
              <img src="${thumb}" alt="${alt}" width="${w}" height="${h}" loading="lazy" referrerpolicy="no-referrer" style="width:100%;height:100%;object-fit:cover;display:block;">
            </div>
            <div class="item-overlay">
              <span class="item-title">${title}</span>
              <span class="item-category">Trailers</span>
            </div>
          </div>
`;
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function listDir(sub) {
  const d = path.join(IMAGES, sub);
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((f) => fs.statSync(path.join(d, f)).isFile()).sort();
}

const beautyOrder = [
  "img-1715.jpg",
  "img-1613.jpg",
  "01f5e98b-f7fc-4fb2-893e-fc10a6e4d532.jpg",
  "laura037.jpg",
  "screen-shot-2022-11-17-at-12-02-41-pm.png",
  "screen-shot-2022-11-17-at-12-00-50-pm.png",
  "screen-shot-2022-11-17-at-12-03-37-pm.png",
  "laura1475.jpg",
  "laura1721.jpg",
  "jeanclaudevorgeack-joannagoingwebres-03.jpg",
  "jeanclaudevorgeack-joannagoingwebres-04.jpg",
  "img-9255.jpg",
  "952a8954-12a3-49a0-a13a-f36fc8904fc2.jpeg",
  "img-6327.jpg",
  "img-6326.jpg",
  "4230374.jpg",
  "2838827.jpg",
  "5823838.jpg",
  "img-0063.jpg",
  "7149908.jpg",
  "5941480.jpg",
  "jeanclaudevorgeack-alexandrawebres-011.jpg",
  "7295309.jpeg",
  "jeanclaudevorgeack-alexandrawebres-007.jpg",
  "denim-shoot.jpg",
  "svm5uww.jpeg",
  "gw0a8016.jpg",
  "fresh.jpg",
  "joni.jpg",
  "9702280.jpg",
  "3378057.jpeg",
  "phillips_1.jpg",
];

const redOrder = [
  "screen-shot-2022-03-11-at-1-22-46-pm.png",
  "screen-shot-2022-03-08-at-3-57-06-pm.png",
  "fd08e6d4-fe2c-4727-be37-b3235c156263.jpg",
  "ayelet-zurer-premiere-paramount-pictures-ben-cilwzydyb2rl.jpg",
  "ayelet-zurer-premiere-paramount-pictures-ben-piwnnpq2mxvl.jpg",
  "ayelet-zurer-premiere-paramount-pictures-ben-uvbed-r7ihnl.jpg",
  "img-4524.jpg",
  "ayelet-zurer-santa-barbara-film-festival-opening-99-ele2qosul.jpg",
  "img-4828.jpg",
  "img-4829.jpg",
  "img-4830.jpg",
  "img-4825.jpg",
  "img-1477.jpg",
  "img-1478.jpg",
  "img-5014.jpg",
  "img-5013.jpg",
  "img-5012.jpg",
  "img-3799.jpg",
];

const filmOrder = [
  "winters-bone-1_1.jpg",
  "img-2281.jpg",
  "dc1-1619.jpg",
  "johnhawkes.jpg",
  "little-accidents-4.jpg",
  "la0001-20130714-0107841-look.jpg",
  "screen-shot-2022-11-17-at-10-40-42-am.png",
  "screen-shot-2022-11-17-at-10-57-11-am.png",
  "screen-shot-2016-09-10-at-11-19-21-am.png",
  "071b2745-b104-4357-b433-62717b2568b6.jpg",
  "83adf632-b184-422a-b95e-86441073b3af.jpg",
  "screen-shot-2022-11-17-at-11-07-07-am.png",
  "timthumb-php.jpg",
  "conman-113-0100.jpg",
  "55cdd6ef-f6f0-430c-81e7-09fa2c3f5bdb-1-105-c.jpg",
  "normal-cm0044.jpg",
  "482ffae6-75fc-468c-8dde-9b5fa7a1293c-1-105-c.jpg",
  "screen-shot-2016-09-10-at-11-20-29-am.png",
  "milo-conman.jpg",
  "gigi2-900x600.jpg",
  "screen-shot-2016-09-10-at-11-22-02-am.png",
  "callis-chair1.jpg",
  "con-man-episode-7.png",
];

const trailerIds = [
  "bE_X2pDRXyY",
  "48tbNVLrTZA",
  "fiGqkZO9p1Y",
  "rWEiQxvg6Jo",
  "bXNvg3Hp-HI",
  "iJtQvFOjno8",
  "HGXUdAyaMoY",
  "dL_PIMMVD_w",
  "ykMae2li-q0",
  "h30q5Z1WNg4",
  "kYVed6SGWRw",
];

const lines = [];
let ai = 0;
function aspects() {
  const a = ai % 2 === 0 ? "3/4" : "4/5";
  ai++;
  return a;
}

beautyOrder.forEach((fn, i) => {
  const rel = `images/Beauty/${fn}`;
  if (!exists(rel)) return;
  lines.push(item("print", rel, "Beauty · Print", "Print", aspects(), i === 0));
});

listDir(path.join("Print", "Editorial")).forEach((fn, i) => {
  const rel = `images/Print/Editorial/${fn}`;
  lines.push(item("print", rel, "Editorial · Print", "Print", aspects(), i === 0));
});

listDir(path.join("Print", "Commercial")).forEach((fn, i) => {
  const rel = `images/Print/Commercial/${fn}`;
  lines.push(item("print", rel, "Commercial · Print", "Print", aspects(), i === 0));
});

listDir(path.join("Print", "Mens Grooming")).forEach((fn, i) => {
  const rel = `images/Print/Mens Grooming/${fn}`;
  lines.push(item("print", rel, "Men's Grooming · Print", "Print", aspects(), i === 0));
});

redOrder.forEach((fn, i) => {
  const rel = `images/Red Carpet/${fn}`;
  if (!exists(rel)) return;
  lines.push(item("red-carpet", rel, "Red Carpet", "Red Carpet", aspects(), i === 0));
});

trailerIds.forEach((vid, idx) => {
  lines.push(trailerItem(vid, `Trailer ${idx + 1}`, idx));
});

filmOrder.forEach((fn, i) => {
  const rel = `images/Film and TV/${fn}`;
  if (!exists(rel)) return;
  lines.push(item("film", rel, "Film &amp; TV", "FILM", aspects(), i === 0));
});

const out = path.join(ROOT, "portfolio-grid-snippet.html");
fs.writeFileSync(out, lines.join("\n") + "\n", "utf8");
console.log("Wrote", out, "lines", lines.length);
