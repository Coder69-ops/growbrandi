import { useGlobalData } from '../context/GlobalDataProvider';

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
    const { settings, loading } = useGlobalData();
    // Return typed settings
    return {
        settings: settings as SiteSettings | null,
        loading: loading.settings
    };
};
