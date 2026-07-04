// Runs before `vite dev` and `vite build` (predev/prebuild hooks).
// Writes public/sitemap.xml with static routes + dynamic blog posts and case studies.

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://harezalbaki.com";
const SUPABASE_URL = "https://rvphdtjuobaizopmtfdk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cGhkdGp1b2JhaXpvcG10ZmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MTE4NTcsImV4cCI6MjA4NTI4Nzg1N30.f9PHGvGR4Dy_QqdkzEwjKnXKF-_8okMs4Wgkqo7dM4U";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/business-growth", changefreq: "monthly", priority: "0.8" },
  { path: "/services/meta-ads", changefreq: "monthly", priority: "0.9" },
  { path: "/services/google-ads", changefreq: "monthly", priority: "0.9" },
  { path: "/services/seo", changefreq: "monthly", priority: "0.9" },
  { path: "/services/cro", changefreq: "monthly", priority: "0.9" },
  { path: "/services/marketing-consulting", changefreq: "monthly", priority: "0.9" },
  { path: "/case-studies/tahoor-studio", changefreq: "monthly", priority: "0.8" },
  { path: "/case-studies/completo", changefreq: "monthly", priority: "0.8" },
  { path: "/case-studies/light-of-hope", changefreq: "monthly", priority: "0.8" },
  { path: "/case-studies/chhayatoru", changefreq: "monthly", priority: "0.8" },
];

async function fetchRows(table: string, select: string, filter: string): Promise<any[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?select=${select}&${filter}`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

function xml(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n")
  );
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

async function main() {
  const posts = await fetchRows(
    "blog_posts",
    "slug,updated_at,published_at",
    "published_at=not.is.null"
  );

  const dynamic: SitemapEntry[] = posts.map((p) => ({
    path: `/blog/${p.slug}`,
    lastmod: (p.updated_at || p.published_at || "").slice(0, 10) || undefined,
    changefreq: "monthly" as const,
    priority: "0.7",
  }));

  // Case study slugs stay static (kept in staticEntries) because the
  // case_studies read policy is admin-only and blocks anon at build time.

  const all = [...staticEntries, ...dynamic];
  writeFileSync(resolve("public/sitemap.xml"), xml(all));
  console.log(`sitemap.xml written (${all.length} entries)`);
}

main();