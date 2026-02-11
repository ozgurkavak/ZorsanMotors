import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://zorsanmotors.com'; // Production URL

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/zm-console'], // Hide admin panel from Google
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
