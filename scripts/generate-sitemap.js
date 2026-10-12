import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file manually to avoid external dependency issues
const envPath = path.resolve(__dirname, '../.env');
let supabaseUrl = '';
let supabaseKey = '';

try {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      const matchUrl = line.match(/^\s*VITE_SUPABASE_URL\s*=\s*["']?([^"'\r\n]+)["']?/);
      const matchKey = line.match(/^\s*VITE_SUPABASE_PUBLISHABLE_KEY\s*=\s*["']?([^"'\r\n]+)["']?/);
      if (matchUrl) supabaseUrl = matchUrl[1];
      if (matchKey) supabaseKey = matchKey[1];
    }
  }
} catch (e) {
  console.warn("Could not read .env file:", e.message);
}

// Fallback to environment variables if present
supabaseUrl = supabaseUrl || process.env.VITE_SUPABASE_URL;
supabaseKey = supabaseKey || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const staticRoutes = [
  { path: '', changefreq: 'daily', priority: '1.0' },
  { path: 'about', changefreq: 'monthly', priority: '0.8' },
  { path: 'books', changefreq: 'monthly', priority: '0.8' },
  { path: 'courses', changefreq: 'monthly', priority: '0.7' },
  { path: 'events', changefreq: 'weekly', priority: '0.8' },
  { path: 'work-with-me', changefreq: 'monthly', priority: '0.8' },
  { path: 'podcast', changefreq: 'weekly', priority: '0.7' },
  { path: 'newsletter', changefreq: 'weekly', priority: '0.8' },
  { path: 'contact', changefreq: 'yearly', priority: '0.6' },
  { path: 'media', changefreq: 'monthly', priority: '0.7' },
  { path: 'tedxtalk', changefreq: 'yearly', priority: '0.7' },
  { path: 'publishing', changefreq: 'monthly', priority: '0.7' },
  { path: 'philanthropy', changefreq: 'yearly', priority: '0.6' },
  { path: 'privacy-policy', changefreq: 'yearly', priority: '0.4' },
];

async function generate() {
  let dynamicUrls = [];

  if (supabaseUrl && supabaseKey) {
    try {
      console.log(`Connecting to Supabase at: ${supabaseUrl}`);
      // Fetch blogs from Supabase REST API directly
      const response = await fetch(`${supabaseUrl}/rest/v1/blogs?select=id,published_at&is_published=eq.true&order=published_at.desc`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      if (response.ok) {
        const blogs = await response.json();
        dynamicUrls = blogs.map(blog => ({
          path: `newsletter/${blog.id}`,
          lastmod: blog.published_at ? blog.published_at.split('T')[0] : new Date().toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.6'
        }));
        console.log(`Fetched ${dynamicUrls.length} blog posts from Supabase for sitemap.`);
      } else {
        console.warn('Failed to fetch blogs from Supabase REST API status:', response.status);
      }
    } catch (err) {
      console.warn('Could not fetch blogs from Supabase:', err.message);
    }
  } else {
    console.warn('Supabase URL or Key not found in .env or environment. Sitemap will only contain static pages.');
  }

  const currentDate = new Date().toISOString().split('T')[0];

  const xmlEntries = [
    ...staticRoutes.map(route => `  <url>
    <loc>https://dinalundy.com/${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`),
    ...dynamicUrls.map(route => `  <url>
    <loc>https://dinalundy.com/${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`)
  ].join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;

  const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, sitemapXml, 'utf8');
  console.log(`Sitemap generated successfully at ${outputPath}`);

  const distDir = path.resolve(__dirname, '../dist');
  if (fs.existsSync(distDir)) {
    const distPath = path.resolve(distDir, 'sitemap.xml');
    fs.writeFileSync(distPath, sitemapXml, 'utf8');
    console.log(`Sitemap copied to production build at ${distPath}`);
  }
}

generate();
