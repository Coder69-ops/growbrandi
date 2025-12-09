import { SupportedLanguage } from './localization';

/**
 * Create BreadcrumbList schema
 */
export const createBreadcrumbSchema = (
    items: Array<{ name: string; url: string }>,
    language: SupportedLanguage
) => {
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    });
};

/**
 * Create Organization schema with dynamic contact info
 */
export const createOrganizationSchema = (contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
    socialLinks?: Record<string, string>;
}) => {
    const baseSchema: any = {
        "@context": "https://schema.org",
        "@type": "DigitalMarketingAgency",
        "name": "GrowBrandi",
        "image": "https://growbrandi.com/growbrandi-logo.png",
        "@id": "https://growbrandi.com",
        "url": "https://growbrandi.com",
        "description": "AI-Powered Digital Agency specializing in web development, design, SEO, and digital marketing",
        "priceRange": "$$$"
    };

    if (contactInfo?.phone) {
        baseSchema.telephone = contactInfo.phone;
    }

    if (contactInfo?.address) {
        baseSchema.address = {
            "@type": "PostalAddress",
            "addressLocality": contactInfo.address,
            "addressCountry": "BD"
        };
    }

    if (contactInfo?.email) {
        baseSchema.email = contactInfo.email;
    }

    if (contactInfo?.socialLinks) {
        const sameAs: string[] = [];
        Object.entries(contactInfo.socialLinks).forEach(([platform, url]) => {
            if (url && typeof url === 'string') {
                sameAs.push(url);
            }
        });
        if (sameAs.length > 0) {
            baseSchema.sameAs = sameAs;
        }
    }

    baseSchema.openingHoursSpecification = {
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
    };

    return JSON.stringify(baseSchema);
};

/**
 * Create Service schema
 */
export const createServiceSchema = (service: {
    name: string;
    description: string;
    url: string;
}) => {
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": service.name,
        "description": service.description,
        "provider": {
            "@type": "Organization",
            "name": "GrowBrandi",
            "url": "https://growbrandi.com"
        },
        "areaServed": "Worldwide",
        "url": service.url
    });
};

/**
 * Create Person schema (for team members)
 */
export const createPersonSchema = (person: {
    name: string;
    jobTitle: string;
    description?: string;
    imageUrl?: string;
    url?: string;
}) => {
    const schema: any = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": person.name,
        "jobTitle": person.jobTitle,
        "worksFor": {
            "@type": "Organization",
            "name": "GrowBrandi"
        }
    };

    if (person.description) {
        schema.description = person.description;
    }

    if (person.imageUrl) {
        schema.image = person.imageUrl;
    }

    if (person.url) {
        schema.url = person.url;
    }

    return JSON.stringify(schema);
};

/**
 * Create ContactPage schema
 */
export const createContactPageSchema = (contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
}) => {
    const schema: any = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact GrowBrandi",
        "description": "Get in touch with GrowBrandi for your digital solutions",
        "url": "https://growbrandi.com/contact"
    };

    if (contactInfo?.email || contactInfo?.phone) {
        schema.mainEntity = {
            "@type": "Organization",
            "name": "GrowBrandi"
        };

        if (contactInfo.email) {
            schema.mainEntity.email = contactInfo.email;
        }

        if (contactInfo.phone) {
            schema.mainEntity.telephone = contactInfo.phone;
        }

        if (contactInfo.address) {
            schema.mainEntity.address = {
                "@type": "PostalAddress",
                "addressLocality": contactInfo.address
            };
        }
    }

    return JSON.stringify(schema);
};
