#!/usr/bin/env node
/**
 * Generates public/video-sitemap.xml from published video/sermon resources.
 * Reads from Supabase using the publishable (anon) key — only public,
 * published rows are returned, which is exactly what we want indexed.
 *
 * Runs at build time via the `prebuild` npm script. If Supabase env vars
 * are missing (e.g. local dev), the script preserves an existing sitemap
 * or writes an empty but valid sitemap and exits 0 so the build never fails.
 */
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

const SITE_URL = "https://chiesadicristoitalia.it";
const OUT_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "video-sitemap.xml",
);

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY;

function escapeXml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m ? m[1] : null;
}

function sanitizeSlug(slug) {
  // Remove backticks and control characters that break URLs / XML
  return String(slug)
    .replace(/`/g, "")
    .replace(/[\x00-\x1f\x7f]/g, "");
}

function hasExistingUrls() {
  if (!existsSync(OUT_PATH)) return false;
  try {
    const content = readFileSync(OUT_PATH, "utf8");
    return content.includes("<url>");
  } catch {
    return false;
  }
}

function writeSitemap(entries) {
  if (entries.length === 0) {
    if (hasExistingUrls()) {
      console.log("⚠ No video entries found — preserving existing video-sitemap.xml");
      return;
    }
    console.warn("⚠ No video entries found — writing empty video-sitemap.xml");
  }

  const urls = entries
    .map((e) => {
      const pageUrl = `${SITE_URL}/${e.basePath}/${e.slug}`;
      return [
        "  <url>",
        `    <loc>${escapeXml(pageUrl)}</loc>`,
        "    <video:video>",
        `      <video:thumbnail_loc>https://i.ytimg.com/vi/${e.videoId}/maxresdefault.jpg</video:thumbnail_loc>`,
        `      <video:title>${escapeXml(e.title)}</video:title>`,
        `      <video:description>${escapeXml(e.description || e.title)}</video:description>`,
        `      <video:player_loc>https://www.youtube.com/embed/${e.videoId}</video:player_loc>`,
        "      <video:family_friendly>yes</video:family_friendly>",
        "      <video:live>no</video:live>",
        e.publishedAt
          ? `      <video:publication_date>${e.publishedAt}</video:publication_date>`
          : null,
        "    </video:video>",
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls}
</urlset>
`;
  if (!existsSync(dirname(OUT_PATH))) mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, xml, "utf8");
  console.log(`✓ wrote ${entries.length} videos → public/video-sitemap.xml`);
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("⚠ Supabase env not set");
    writeSitemap([]);
    return;
  }

  const endpoint = `${SUPABASE_URL}/rest/v1/resources?select=slug,title,description,media_url,published_at,type&published=eq.true&media_url=not.is.null&order=published_at.desc`;
  const res = await fetch(endpoint, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) {
    console.error(`Supabase fetch failed: ${res.status} ${res.statusText}`);
    writeSitemap([]);
    return;
  }
  const rows = await res.json();
  const entries = [];
  for (const r of rows) {
    const id = getYouTubeId(r.media_url);
    if (!id) continue;
    entries.push({
      slug: r.slug,
      title: r.title,
      description: r.description,
      videoId: id,
      publishedAt: r.published_at,
      basePath: r.type === "sermon" ? "sermoni" : "risorse",
    });
  }
  writeSitemap(entries);
}

main().catch((err) => {
  console.error("video-sitemap generation failed:", err);
  writeSitemap([]);
  process.exit(0); // never fail the build
});
