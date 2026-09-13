#!/usr/bin/env node
// generate-sitemap.js — auto-generates sitemap.xml from filesystem
// Scans for index.html under each dir, maps to https://pureline.kz/, uses mtime for lastmod.
// Usage: node generate-sitemap.js

const fs = require('fs');
const path = require('path');

const base = 'https://pureline.kz';
const root = __dirname;

// Priority / changefreq rules by depth & path
function metaFor(urlPath) {
  if (urlPath === '/') return { priority: '1.0', changefreq: 'weekly' };
  if (urlPath === '/prices/') return { priority: '0.9', changefreq: 'monthly' };
  if (urlPath === '/en/') return { priority: '0.9', changefreq: 'monthly' };
  if (urlPath === '/en/prices/') return { priority: '0.8', changefreq: 'monthly' };
  if (urlPath === '/portfolio/' || urlPath === '/blog/') return { priority: '0.8', changefreq: urlPath === '/blog/' ? 'weekly' : 'monthly' };
  if (urlPath.startsWith('/blog/')) return { priority: '0.7', changefreq: 'monthly' };
  if (urlPath === '/career/') return { priority: '0.6', changefreq: 'monthly' };
  if (urlPath === '/ads/') return { priority: '0.5', changefreq: 'monthly' };
  // fallback: depth-based
  const depth = urlPath.split('/').filter(Boolean).length;
  if (depth === 1) return { priority: '0.7', changefreq: 'monthly' };
  return { priority: '0.6', changefreq: 'monthly' };
}

function toISODate(mtime) {
  return new Date(mtime).toISOString().slice(0, 10);
}

function walk(dir, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    // skip hidden, node_modules, .git, assets, css, js
    if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === '.git') continue;
    if (e.isDirectory()) {
      if (['assets', 'css', 'js'].includes(e.name)) continue;
      walk(path.join(dir, e.name), out);
    } else if (e.name === 'index.html') {
      out.push(path.join(dir, e.name));
    }
  }
}

const files = [];
walk(root, files);

files.sort();

const urls = files.map((file) => {
  const rel = path.relative(root, path.dirname(file));
  const urlPath = rel ? `/${rel}/` : '/';
  const mtime = fs.statSync(file).mtime;
  const lastmod = toISODate(mtime);
  const { priority, changefreq } = metaFor(urlPath);
  return { loc: `${base}${urlPath}`, lastmod, changefreq, priority, file };
});

// sort: root first, then by loc
urls.sort((a, b) => {
  if (a.loc === `${base}/`) return -1;
  if (b.loc === `${base}/`) return 1;
  return a.loc.localeCompare(b.loc);
});

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
for (const u of urls) {
  xml += `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>\n`;
}
xml += '</urlset>\n';

const outPath = path.join(root, 'sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');
console.log(`Generated sitemap.xml with ${urls.length} URLs:`);
for (const u of urls) console.log(`  ${u.loc} (${u.lastmod})`);
