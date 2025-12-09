import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SUPPORTED_LANGUAGES } from '../src/utils/localization';
import { useContactSettings } from '../src/hooks/useSiteContent';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string[];
    canonicalUrl?: string;
    ogImage?: string;
    ogImageWidth?: string;
    ogImageHeight?: string;
    ogType?: string;
    twitterCard?: string;
    twitterHandle?: string;
    schema?: string;
    additionalSchemas?: string[]; // For multiple schemas on one page
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords = [],
    canonicalUrl,
    ogImage = 'https://growbrandi.com/og-image.jpg',
    ogImageWidth = '1200',
    ogImageHeight = '630',
    ogType = 'website',
    twitterCard = 'summary_large_image',
    twitterHandle = '@growbrandi',
    schema,
    additionalSchemas = []
}) => {
    const location = useLocation();
    const { content: contactContent } = useContactSettings();
    const siteTitle = 'GrowBrandi';
    const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
    // Use window.location.href as default to capture the full localized URL
    const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');

    // Calculate base path for hreflang
    const pathname = location.pathname;
    const basePath = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://growbrandi.com';

    // Enhanced default schema with Firebase contact info
    const defaultSchema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "DigitalMarketingAgency",
        "name": "GrowBrandi",
        "image": "https://growbrandi.com/growbrandi-logo.png",
        "@id": "https://growbrandi.com",
        "url": "https://growbrandi.com",
        "telephone": contactContent?.contact_info?.phone || "+8801755154194",
        "email": contactContent?.contact_info?.email || "contact@growbrandi.com",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": contactContent?.contact_info?.address || "Khulna",
            "addressCountry": "BD"
        },
        "priceRange": "$$$",
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ],
            "opens": "00:00",
            "closes": "23:59"
        },
        "sameAs": contactContent?.social_links
            ? Object.values(contactContent.social_links).filter(url => url && typeof url === 'string')
            : [
                "https://linkedin.com/company/growbrandi",
                "https://twitter.com/growbrandi",
                "https://instagram.com/growbrandi",
                "https://dribbble.com/growbrandi"
            ]
    });

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
            <link rel="canonical" href={currentUrl} />

            {/* Hreflang Tags */}
            {SUPPORTED_LANGUAGES.map(lang => (
                <link
                    key={lang}
                    rel="alternate"
                    hrefLang={lang}
                    href={`${origin}/${lang}${basePath === '/' ? '' : basePath}`}
                />
            ))}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content={ogImageWidth} />
            <meta property="og:image:height" content={ogImageHeight} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:site" content={twitterHandle} />
            <meta name="twitter:creator" content={twitterHandle} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Schema.org JSON-LD */}
            <script type="application/ld+json">
                {schema || defaultSchema}
            </script>

            {/* Additional schemas */}
            {additionalSchemas.map((additionalSchema, index) => (
                <script key={index} type="application/ld+json">
                    {additionalSchema}
                </script>
            ))}
        </Helmet>
    );
};

export default SEO;
