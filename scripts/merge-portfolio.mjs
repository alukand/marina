import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

execSync("node scripts/gen-portfolio-grid.mjs", { cwd: ROOT, stdio: "inherit" });

let html = fs.readFileSync(path.join(ROOT, "portfolio.html"), "utf8").replace(/\r\n/g, "\n");
const snip = fs.readFileSync(path.join(ROOT, "portfolio-grid-snippet.html"), "utf8");

const endStr = "\n        </div>\n      </div>\n    </section>";
const startKey = '<div class="portfolio-grid">';
const i0 = html.indexOf(startKey);
if (i0 === -1) throw new Error("start not found");
const innerStart = i0 + startKey.length;
const i1 = html.indexOf(endStr, innerStart);
if (i1 === -1) throw new Error("end not found");

const prefix = html.slice(0, innerStart);
const body = "\n\n" + snip.replace(/\s+$/, "") + "\n\n";
const tail = html.slice(i1);

html = prefix + body + tail;

html = html.replace(
  /<meta name="description" content="[^"]*">/,
  '<meta name="description" content="Portfolio of Marina Proctor — print, red carpet, trailers, and film &amp; television makeup artistry.">'
);

html = html.replace(
  /        <!-- Filter Tabs -->\s*<div class="filter-tabs">[\s\S]*?<\/div>/,
  `        <!-- Filter Tabs -->
        <div class="filter-tabs">
          <button class="filter-tab active" data-filter="all">All</button>
          <button class="filter-tab" data-filter="print">Print</button>
          <button class="filter-tab" data-filter="red-carpet">Red Carpet</button>
          <button class="filter-tab" data-filter="trailers">Trailers</button>
          <button class="filter-tab" data-filter="film">FILM</button>
        </div>`
);

fs.writeFileSync(path.join(ROOT, "portfolio.html"), html, "utf8");
fs.unlinkSync(path.join(ROOT, "portfolio-grid-snippet.html"));
console.log("Merged portfolio.html");
