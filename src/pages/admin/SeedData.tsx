import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { Database, Trash2, RefreshCw, Check, AlertCircle, Globe } from 'lucide-react';
import { PROJECTS, TEAM_MEMBERS, TESTIMONIALS, SERVICES, FAQ_DATA, CONTACT_INFO } from '../../../constants';

// Languages supported
const LANGUAGES = ['en', 'de', 'es', 'fr', 'nl'];

const AdminSeedData = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ [key: string]: 'idle' | 'loading' | 'success' | 'error' }>({
        projects: 'idle',
        team: 'idle',
        testimonials: 'idle',
        faqs: 'idle',
        services: 'idle',
        site_content: 'idle',
        contact_settings: 'idle'
    });
    const [counts, setCounts] = useState<{ [key: string]: number }>({});
    const [translations, setTranslations] = useState<{ [lang: string]: any }>({});
    const [translationsLoaded, setTranslationsLoaded] = useState(false);

    // Fetch all translation files on mount
    useEffect(() => {
        const fetchTranslations = async () => {
            const loadedTranslations: { [lang: string]: any } = {};
            try {
                await Promise.all(LANGUAGES.map(async (lang) => {
                    const response = await fetch(`/locales/${lang}/translation.json`);
                    const data = await response.json();
                    loadedTranslations[lang] = data;
                }));
                setTranslations(loadedTranslations);
                setTranslationsLoaded(true);
            } catch (error) {
                console.error("Failed to load translations:", error);
                alert("Failed to load translation files. Ensure they exist in public/locales.");
            }
        };
        fetchTranslations();
        fetchCounts();
    }, []);

    const fetchCounts = async () => {
        const collections = ['projects', 'team_members', 'testimonials', 'faqs', 'services', 'site_content', 'contact_settings'];
        const newCounts: { [key: string]: number } = {};

        for (const col of collections) {
            try {
                const snapshot = await getDocs(collection(db, col));
                newCounts[col] = snapshot.size;
            } catch {
                newCounts[col] = 0;
            }
        }
        setCounts(newCounts);
    };

    // Helper to resolve a key like "projects.title" into { en: "Val", de: "Val" }
    const resolve = (keyPath: string) => {
        const result: { [lang: string]: string } = {};

        // If keyPath doesn't look like a translation key (no dots), return it accurately? 
        // Or assume everything in constants is a key. 
        // In constants.ts, keys are like 'projects.machain_store.title'.

        LANGUAGES.forEach(lang => {
            const keys = keyPath.split('.');
            let value = translations[lang];
            for (const k of keys) {
                value = value?.[k];
                if (!value) break;
            }
            result[lang] = value || keyPath; // Fallback to key if not found
        });
        return result;
    };

    // --- Dynamic Data Generators ---

    const generateProjects = () => {
        return PROJECTS.map(p => ({
            ...p,
            title: resolve(p.title),
            category: p.category, // Keep as string ID
            description: resolve(p.description),
            client: resolve(p.client),
            completionTime: resolve(p.completionTime),
            technologies: p.technologies, // Keep as string[] - Tech names don't need translation usually
            results: p.results.map(r => resolve(r)), // Array of result keys
            growthMetrics: resolve(p.growthMetrics as string), // Cast to string as it seems to be a key in constants
        }));
    };

    const generateServices = () => {
        return SERVICES.map(s => ({
            ...s,
            title: resolve(s.title),
            description: resolve(s.description),
            price: resolve(s.price),
            features: s.features.map(f => resolve(f))
        }));
    };

    const generateTeam = () => {
        return TEAM_MEMBERS.map(m => ({
            ...m,
            role: resolve(m.role),
            description: resolve(m.description),
            bio: resolve(m.bio),
            achievements: m.achievements.map(a => resolve(a)),
            specialties: m.specialties.map(s => resolve(s))
        }));
    };

    const generateTestimonials = () => {
        return TESTIMONIALS.map(t => ({
            ...t,
            quote: resolve(t.quote),
            company: resolve(t.company)
            // author, rating, image are static
        }));
    };

    const generateFAQs = () => {
        return FAQ_DATA.map(f => ({
            question: resolve(f.question),
            answer: resolve(f.answer)
        }));
    };

    const generateSiteContent = () => {
        // Collect various pieces of site content
        const hero = {
            badge: resolve('hero.badge'),
            title_prefix: resolve('hero.title_prefix'),
            title_highlight: resolve('hero.title_highlight'),
            description: resolve('hero.description'),
            cta_consultation: resolve('hero.cta_consultation'),
            cta_showreel: resolve('hero.cta_showreel'),
            trusted_by: resolve('hero.trusted_by'),
            tech_stack: resolve('hero.tech_stack'),
            trustpilot_on: resolve('hero.trustpilot_on'),
            mock_viral_campaign: resolve('hero.mock_viral_campaign'),
            mock_follow: resolve('hero.mock_follow'),
            mock_views: resolve('hero.mock_views'),
            mock_likes: resolve('hero.mock_likes'),
            mock_ctr: resolve('hero.mock_ctr'),
        };

        const footer = {
            ready_to_scale: resolve('footer.ready_to_scale'),
            cta_desc: resolve('footer.cta_desc'),
            start_project: resolve('footer.start_project'),
            tagline_desc: resolve('footer.tagline_desc'),
            rated_clients: resolve('footer.rated_clients'),
            services_label: resolve('footer.services'),
            company_label: resolve('footer.company'),
            legal_label: resolve('footer.legal'),
            contact_label: resolve('footer.contact'),
            socials_label: resolve('footer.socials'),
            privacy: resolve('footer.privacy'),
            terms: resolve('footer.terms'),
            sitemap: resolve('footer.sitemap'),
            copyright: resolve('footer.copyright'),
            menu: {
                about: resolve('footer.menu.about'),
                process: resolve('footer.menu.process'),
                work: resolve('footer.menu.work'),
                team: resolve('footer.menu.team'),
                blog: resolve('footer.menu.blog'),
                careers: resolve('footer.menu.careers'),
                contact: resolve('footer.menu.contact'),
            }
        };

        const navigation = {
            home: resolve('nav.home'),
            services: resolve('nav.services'),
            company: resolve('nav.company'),
            portfolio: resolve('nav.portfolio'),
            contact: resolve('nav.contact'),
        };

        const section_headers = {
            testimonials: {
                badge: resolve('section_headers.testimonials.badge'),
                title: resolve('section_headers.testimonials.title'),
                highlight: resolve('section_headers.testimonials.highlight'),
                description: resolve('section_headers.testimonials.description'),
            },
            faq: {
                badge: resolve('section_headers.faq.badge'),
                title: resolve('section_headers.faq.title'),
                description: resolve('section_headers.faq.description'),
            },
            team: {
                badge: resolve('section_headers.team.badge'),
                title: resolve('section_headers.team.title'),
                highlight: resolve('section_headers.team.highlight'),
                description: resolve('section_headers.team.description'),
            },
            projects: {
                badge: resolve('projects_preview.badge'),
                title: resolve('projects_preview.title'),
                description: resolve('projects_preview.description'),
            }
        };

        return {
            hero,
            footer,
            navigation,
            section_headers
        };
    };

    const generateContactSettings = () => {
        return {
            page_text: {
                badge: resolve('contact_page.badge'),
                title: resolve('contact_page.title'),
                description: resolve('contact_page.description'),
            },
            form_labels: {
                name: resolve('contact_page.form.name'),
                email: resolve('contact_page.form.email'),
                subject: resolve('contact_page.form.subject'),
                message: resolve('contact_page.form.message'),
                service: resolve('contact_page.form.service'),
                budget: resolve('contact_page.form.budget'),
                submit: resolve('contact_page.form.submit'),
                sending: resolve('contact_page.form.sending'),
                success: resolve('contact_page.form.success'),
                error: resolve('contact_page.form.error'),
            },
            contact_info: {
                ...CONTACT_INFO, // Use constant contact info
                office_hours: resolve('contact_page.info.office_hours'), // Assuming key exists, or construct it
                response_time: resolve('contact_page.info.response_time'),
            },
            social_links: CONTACT_INFO.social
        };
    };


    // --- Seeding Logic ---

    const seedCollection = async (collectionName: string, data: any[], key: string) => {
        setStatus(prev => ({ ...prev, [key]: 'loading' }));
        try {
            // Delete existing docs first to ensure clean seed?
            // Actually, let's allow "Clear" to do that explicitly.
            // Just add docs.

            const batch = writeBatch(db);
            const CHUNK_SIZE = 450; // Firestore batch limit is 500

            // Process in chunks if needed (though we have small data)
            for (let i = 0; i < data.length; i++) {
                const docRef = doc(collection(db, collectionName)); // Auto ID
                batch.set(docRef, {
                    ...data[i],
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            }
            await batch.commit();

            setStatus(prev => ({ ...prev, [key]: 'success' }));
            await fetchCounts();
        } catch (error) {
            console.error(`Error seeding ${collectionName}:`, error);
            setStatus(prev => ({ ...prev, [key]: 'error' }));
        }
    };

    const seedSingleDoc = async (collectionName: string, docId: string, data: any, key: string) => {
        setStatus(prev => ({ ...prev, [key]: 'loading' }));
        try {
            await setDoc(doc(db, collectionName, docId), {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            setStatus(prev => ({ ...prev, [key]: 'success' }));
            await fetchCounts();
        } catch (error) {
            console.error(`Error seeding ${collectionName}:`, error);
            setStatus(prev => ({ ...prev, [key]: 'error' }));
        }
    };

    const clearCollection = async (collectionName: string, key: string) => {
        if (!window.confirm(`Delete all ${collectionName}? This cannot be undone.`)) return;

        setStatus(prev => ({ ...prev, [key]: 'loading' }));
        try {
            const snapshot = await getDocs(collection(db, collectionName));
            const batch = writeBatch(db);
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();

            setStatus(prev => ({ ...prev, [key]: 'idle' }));
            await fetchCounts();
        } catch (error) {
            console.error(`Error clearing ${collectionName}:`, error);
            setStatus(prev => ({ ...prev, [key]: 'error' }));
        }
    };

    const clearSingleDoc = async (collectionName: string, docId: string, key: string) => {
        if (!window.confirm(`Delete ${collectionName}? This cannot be undone.`)) return;
        setStatus(prev => ({ ...prev, [key]: 'loading' }));
        try {
            await deleteDoc(doc(db, collectionName, docId));
            setStatus(prev => ({ ...prev, [key]: 'idle' }));
            await fetchCounts();
        } catch (error) {
            console.error(`Error clearing ${collectionName}:`, error);
            setStatus(prev => ({ ...prev, [key]: 'error' }));
        }
    }

    const seedAll = async () => {
        if (!translationsLoaded) {
            alert("Translations not loaded yet. Please wait.");
            return;
        }
        setLoading(true);
        await seedCollection('projects', generateProjects(), 'projects');
        await seedCollection('team_members', generateTeam(), 'team');
        await seedCollection('testimonials', generateTestimonials(), 'testimonials');
        await seedCollection('faqs', generateFAQs(), 'faqs');
        await seedCollection('services', generateServices(), 'services');
        await seedSingleDoc('site_content', 'main', generateSiteContent(), 'site_content');
        await seedSingleDoc('contact_settings', 'main', generateContactSettings(), 'contact_settings');
        setLoading(false);
    };

    const getStatusIcon = (s: string) => {
        switch (s) {
            case 'loading': return <RefreshCw className="animate-spin" size={16} />;
            case 'success': return <Check className="text-green-500" size={16} />;
            case 'error': return <AlertCircle className="text-red-500" size={16} />;
            default: return null;
        }
    };

    const collections = [
        { key: 'projects', name: 'Projects', collection: 'projects', count: PROJECTS.length },
        { key: 'team', name: 'Team Members', collection: 'team_members', count: TEAM_MEMBERS.length },
        { key: 'testimonials', name: 'Testimonials', collection: 'testimonials', count: TESTIMONIALS.length },
        { key: 'faqs', name: 'FAQs', collection: 'faqs', count: FAQ_DATA.length },
        { key: 'services', name: 'Services', collection: 'services', count: SERVICES.length },
        { key: 'site_content', name: 'Site Content', collection: 'site_content', isSingle: true, docId: 'main' },
        { key: 'contact_settings', name: 'Contact Settings', collection: 'contact_settings', isSingle: true, docId: 'main' }
    ];

    if (!translationsLoaded) {
        return <div className="p-8 text-center text-gray-500 flex items-center justify-center gap-2">
            <RefreshCw className="animate-spin" /> Loading Translation Data...
        </div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Database size={24} /> Seed Database
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Populate Firestore with data from your codebase constants & translation files.
                    </p>
                </div>
                <button
                    onClick={seedAll}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 font-medium shadow-lg shadow-blue-500/20"
                >
                    {loading ? <RefreshCw className="animate-spin" size={18} /> : <Database size={18} />}
                    {loading ? 'Seeding...' : 'Seed All Collections'}
                </button>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4 flex items-start gap-3">
                <Globe className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" size={20} />
                <div className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Multi-Language Support:</strong> This tool dynamically pulls content from your `constants.ts` and merges it with
                    translations from `public/locales/{'{en,de,es,fr,nl}'}/translation.json`.
                    <br />
                    Ensure your translation files are up-to-date before seeding.
                </div>
            </div>

            <div className="grid gap-4">
                {collections.map(({ key, name, collection: col, count, isSingle, docId }) => (
                    <div key={key} className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700/50 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${status[key] === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                                {getStatusIcon(status[key]) || <Database size={20} />}
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                    <span className="font-medium bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs">
                                        {col}
                                    </span>
                                    {isSingle
                                        ? <span>{counts[col] ? 'Exists' : 'Not Created'}</span>
                                        : <span>{counts[col] || 0} in DB / {count} in Code</span>
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => isSingle ? clearSingleDoc(col, docId!, key) : clearCollection(col, key)}
                                disabled={status[key] === 'loading'}
                                className="flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
                            >
                                <Trash2 size={16} /> Clear
                            </button>
                            <button
                                onClick={() => {
                                    if (key === 'site_content') seedSingleDoc(col, docId!, generateSiteContent(), key);
                                    else if (key === 'contact_settings') seedSingleDoc(col, docId!, generateContactSettings(), key);
                                    else if (key === 'projects') seedCollection(col, generateProjects(), key);
                                    else if (key === 'team') seedCollection(col, generateTeam(), key);
                                    else if (key === 'testimonials') seedCollection(col, generateTestimonials(), key);
                                    else if (key === 'faqs') seedCollection(col, generateFAQs(), key);
                                    else if (key === 'services') seedCollection(col, generateServices(), key);
                                }}
                                disabled={status[key] === 'loading'}
                                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm font-medium"
                            >
                                <RefreshCw size={16} /> Seed
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminSeedData; // Force refresh
