const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const ROUTES_FILE = path.join(ROOT_DIR, "src", "utils", "competidexRoutes.js");
const OUTPUT_FILE = path.join(ROOT_DIR, "public", "sitemap.xml");

const SITE_URL = (process.env.SITE_URL || "https://competidex.pages.dev").replace(/\/+$/, "");

function readRoutesFile() {
  return fs.readFileSync(ROUTES_FILE, "utf8");
}

function extractRouteSlugs(source) {
  const routesMatch = source.match(/export\s+const\s+ROUTES\s*=\s*\{([\s\S]*?)\};/);

  if (!routesMatch) {
    throw new Error("No se pudo encontrar el objeto ROUTES en competidexRoutes.js");
  }

  const routeBlock = routesMatch[1];
  const slugMatches = [...routeBlock.matchAll(/:\s*["'`]([^"'`]+)["'`]\s*,?/g)];

  const slugs = slugMatches
    .map((match) => match[1].trim())
    .filter(Boolean);

  return [...new Set(slugs)];
}

function buildUrls(slugs) {
  return ["/", ...slugs.map((slug) => `/${slug}`)];
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSitemapXml(urls) {
  const lastmod = new Date().toISOString().slice(0, 10);

  const entries = urls
    .map((urlPath) => {
      const fullUrl = new URL(urlPath, `${SITE_URL}/`).toString();
      return [
        "  <url>",
        `    <loc>${escapeXml(fullUrl)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        "    <changefreq>weekly</changefreq>",
        "    <priority>0.8</priority>",
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    "</urlset>",
    "",
  ].join("\n");
}

function main() {
  const source = readRoutesFile();
  const slugs = extractRouteSlugs(source);
  const urls = buildUrls(slugs);
  const sitemap = buildSitemapXml(urls);

  fs.writeFileSync(OUTPUT_FILE, sitemap, "utf8");
  console.log(`Sitemap generado en ${path.relative(ROOT_DIR, OUTPUT_FILE)}`);
}

main();
