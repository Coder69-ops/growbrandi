import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.growbrandi.com';
const LANGUAGES = ['en', 'de', 'es', 'fr', 'nl'];

// Static routes configuration
const STATIC_ROUTES = [
    { path: '', priority: 1.0, changefreq: 'daily' },
    { path: 'about', priority: 1.0, changefreq: 'daily' },
    { path: 'services', priority: 1.0, changefreq: 'weekly' },
    { path: 'portfolio', priority: 0.8, changefreq: 'weekly' },
    { path: 'team', priority: 1.0, changefreq: 'weekly' },
    { path: 'process', priority: 0.8, changefreq: 'weekly' },
    { path: 'case-studies', priority: 0.8, changefreq: 'weekly' },
    { path: 'careers', priority: 0.8, changefreq: 'weekly' },
    { path: 'blog', priority: 0.8, changefreq: 'weekly' },
    { path: 'contact', priority: 1.0, changefreq: 'weekly' },
    { path: 'free-growth-call', priority: 0.8, changefreq: 'weekly' },
    // Legal
    { path: 'legal/privacy-policy', priority: 0.8, changefreq: 'weekly' },
    { path: 'legal/terms-of-service', priority: 0.8, changefreq: 'weekly' },
    { path: 'legal/cookie-policy', priority: 0.8, changefreq: 'weekly' },
    // Services sub-pages
    { path: 'services/brand-growth', priority: 1.0, changefreq: 'weekly' },
    { path: 'services/social-media-content', priority: 1.0, changefreq: 'weekly' },
    { path: 'services/ui-ux-design', priority: 0.8, changefreq: 'weekly' },
    { path: 'services/web-development', priority: 1.0, changefreq: 'weekly' },
    { path: 'services/virtual-assistance', priority: 0.8, changefreq: 'weekly' },
    { path: 'services/customer-support', priority: 0.8, changefreq: 'weekly' },
];

// Preserved team members (since we can't access Firestore directly)
const TEAM_MEMBERS = [
    'shuvo-mallick',
    'riaz-shahriar',
    'binita-biswas',
    'nijhum-nur',
    'sabrina-jui',
    'ovejit-das'
];

function generateSitemap() {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // 1. Static Routes
    STATIC_ROUTES.forEach(route => {
        LANGUAGES.forEach(lang => {
            const urlPath = route.path ? `${lang}/${route.path}` : lang;
            xml += `  <url>\n`;
            xml += `    <loc>${BASE_URL}/${urlPath}</loc>\n`;
            xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
            xml += `    <priority>${route.priority.toFixed(1)}</priority>\n`;
            xml += `  </url>\n`;
        });
    });

    // 2. Team Members
    TEAM_MEMBERS.forEach(slug => {
        LANGUAGES.forEach(lang => {
            xml += `  <url>\n`;
            xml += `    <loc>${BASE_URL}/${lang}/team/${slug}</loc>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>0.8</priority>\n`;
            xml += `  </url>\n`;
        });
    });

    // 3. Blog Posts (from existing JSON data)
    const blogDataPath = path.join(__dirname, '../src/data/sample_blog_posts.json');
    try {
        const blogData = fs.readFileSync(blogDataPath, 'utf8');
        const posts = JSON.parse(blogData);

        posts.forEach(post => {
            if (post.status === 'published' && post.slug) {
                LANGUAGES.forEach(lang => {
                    xml += `  <url>\n`;
                    xml += `    <loc>${BASE_URL}/${lang}/blog/${post.slug}</loc>\n`;
                    xml += `    <changefreq>weekly</changefreq>\n`;
                    xml += `    <priority>0.7</priority>\n`;
                    xml += `  </url>\n`;
                });
            }
        });
        console.log(`Included ${posts.length} blog posts.`);
    } catch (error) {
        console.warn('Could not read blog data, skipping blog posts in sitemap.', error.message);
    }

    xml += '</urlset>';

    // Write to public/sitemap.xml
    const outputPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(outputPath, xml);
    console.log(`Sitemap generated at: ${outputPath}`);
}

generateSitemap();
