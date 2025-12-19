
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface SiteSettings {
    branding: {
        logoLight: string; // URL for light mode logo
        logoDark: string;  // URL for dark mode logo
        favicon: string;   // URL for favicon
    };
    contact: {
        email: string;
        phone: string;
        address: string;
    };
    social: Array<{
        id: string;
        platform: string;
        url: string;
        icon: string;
        enabled: boolean;
    }>;
    stats: Array<{
        number: string;
        icon: string;
        label: { [key: string]: string };
    }>;
    sections?: {
        ai_use_cases?: boolean;
        services_preview?: boolean;
        slogan_generator?: boolean;
        projects_preview?: boolean;
        testimonials?: boolean;
        faq?: boolean;
        team?: boolean;
        floating_buttons?: boolean;
    };
}

export const useSiteSettings = () => {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const docRef = doc(db, 'site_settings', 'main');
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setSettings(docSnap.data() as SiteSettings);
            } else {
                setSettings(null);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching site settings:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { settings, loading };
};
