import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string[];
    canonicalUrl?: string;
    ogImage?: string;
    ogType?: string;
    twitterCard?: string;
    schema?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords = [],
    canonicalUrl,
    ogImage = 'https://growbrandi.com/og-image.jpg', // Default OG image
    ogType = 'website',
    twitterCard = 'summary_large_image',
    schema
}) => {
    const siteTitle = 'GrowBrandi';
    const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
    const currentUrl = canonicalUrl || typeof window !== 'undefined' ? window.location.href : '';

    const defaultSchema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "DigitalMarketingAgency",
        "name": "GrowBrandi",
        "image": "https://growbrandi.com/growbrandi-logo.png",
        "@id": "https://growbrandi.com",
        "url": "https://growbrandi.com",
        "telephone": "+8801755154194",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Khulna",
            "addressLocality": "Khulna",
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
        "sameAs": [
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

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Schema.org JSON-LD */}
            <script type="application/ld+json">
                {schema || defaultSchema}
            </script>
        </Helmet>
    );
};

export default SEO;
