import { Express, Request, Response } from "express";

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

import { comprehensiveBlogPosts } from "./blog-seed-data";

export function generateSitemap(): string {
  const baseUrl = process.env.PRODUCTION_URL || 'https://nsgamming.xyz';
  const currentDate = new Date().toISOString().split('T')[0];

  const staticPages: SitemapUrl[] = [
    { loc: `${baseUrl}/`, changefreq: 'daily', priority: 1.0 },
    { loc: `${baseUrl}/portfolio`, changefreq: 'weekly', priority: 0.8 },
    { loc: `${baseUrl}/games`, changefreq: 'weekly', priority: 0.9 },
    { loc: `${baseUrl}/tools`, changefreq: 'weekly', priority: 0.8 },
    { loc: `${baseUrl}/blog`, changefreq: 'daily', priority: 0.9 },
    { loc: `${baseUrl}/ff-bots`, changefreq: 'weekly', priority: 0.9 },
    { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${baseUrl}/privacy-policy`, changefreq: 'monthly', priority: 0.5 },
    { loc: `${baseUrl}/terms-conditions`, changefreq: 'monthly', priority: 0.5 },
    { loc: `${baseUrl}/disclaimer`, changefreq: 'monthly', priority: 0.5 },
    { loc: `${baseUrl}/social`, changefreq: 'weekly', priority: 0.7 },
    { loc: `${baseUrl}/community`, changefreq: 'weekly', priority: 0.7 },
  ];

  // Dynamically generate blog URLs from seed data to ensure all posts are included
  const blogPages: SitemapUrl[] = comprehensiveBlogPosts.map(post => ({
    loc: `${baseUrl}/blog/${post.slug}`,
    lastmod: currentDate,
    changefreq: 'monthly',
    priority: 0.8
  }));

  const allUrls = [...staticPages, ...blogPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : `<lastmod>${currentDate}</lastmod>`}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

export function registerSitemapRoute(app: Express) {
  app.get('/sitemap.xml', (req: Request, res: Response) => {
    res.header('Content-Type', 'application/xml');
    res.send(generateSitemap());
  });
}
