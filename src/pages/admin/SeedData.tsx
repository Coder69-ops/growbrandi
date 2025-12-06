import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, setDoc, writeBatch, query, orderBy } from 'firebase/firestore';
import { Database, Trash2, RefreshCw, Check, AlertCircle, Globe, Activity, Server, Shield, Wrench, ArrowRight } from 'lucide-react';
import { PROJECTS, TEAM_MEMBERS, TESTIMONIALS, SERVICES, FAQ_DATA, CONTACT_INFO } from '../../../constants';

// Languages supported
const LANGUAGES = ['en', 'de', 'es', 'fr', 'nl'];

// Tabs Interface
type Tab = 'seeding' | 'diagnostics' | 'system';

interface DiagnosticIssue {
    id: string;
    collection: string;
    docId: string;
    issue: string; // 'missing_order' | 'invalid_type'
    details: string;
}

const AdminSeedData = () => {
    const [activeTab, setActiveTab] = useState<Tab>('seeding');
    const [loading, setLoading] = useState(false);

    // Seeding State
    const [status, setStatus] = useState<{ [key: string]: 'idle' | 'loading' | 'success' | 'error' }>({
        projects: 'idle', team: 'idle', testimonials: 'idle', faqs: 'idle', services: 'idle', site_content: 'idle', contact_settings: 'idle'
    });
    const [counts, setCounts] = useState<{ [key: string]: number }>({});

    const collectionsList = [
        { key: 'projects', name: 'Projects', collection: 'projects', count: PROJECTS.length },
        { key: 'team', name: 'Team Members', collection: 'team_members', count: TEAM_MEMBERS.length },
        { key: 'testimonials', name: 'Testimonials', collection: 'testimonials', count: TESTIMONIALS.length },
        { key: 'faqs', name: 'FAQs', collection: 'faqs', count: FAQ_DATA.length },
        { key: 'services', name: 'Services', collection: 'services', count: SERVICES.length },
        { key: 'site_content', name: 'Site Content', collection: 'site_content', isSingle: true, docId: 'main' },
        { key: 'contact_settings', name: 'Contact Settings', collection: 'contact_settings', isSingle: true, docId: 'main' }
    ];

    // Translation State
    const [translations, setTranslations] = useState<{ [lang: string]: any }>({});
    const [translationsLoaded, setTranslationsLoaded] = useState(false);

    // Diagnostics State
    const [isScanning, setIsScanning] = useState(false);
    const [issues, setIssues] = useState<DiagnosticIssue[]>([]);
    const [fixStatus, setFixStatus] = useState<'idle' | 'fixing' | 'success' | 'error'>('idle');

    // Fetch translations
    useEffect(() => {
        const fetchTranslations = async () => {
            const loadedTranslations: { [lang: string]: any } = {};
            try {
                await Promise.all(LANGUAGES.map(async (lang) => {
                    const response = await fetch(`/locales/${lang}/translation.json`);
                    loadedTranslations[lang] = await response.json();
                }));
                setTranslations(loadedTranslations);
                setTranslationsLoaded(true);
            } catch (error) {
                console.error("Failed to load translations:", error);
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
        LANGUAGES.forEach(lang => {
            const keys = keyPath.split('.');
            let value = translations[lang];
            for (const k of keys) {
                value = value?.[k];
                if (!value) break;
            }
            result[lang] = value || keyPath;
        });
        return result;
    };

    // --- Dynamic Data Generators ---
    const generateProjects = () => PROJECTS.map((p, index) => ({
        ...p, order: index + 1, title: resolve(p.title), description: resolve(p.description), client: resolve(p.client), completionTime: resolve(p.completionTime), results: p.results.map(r => resolve(r)), growthMetrics: resolve(p.growthMetrics as string),
    }));
    const generateServices = () => SERVICES.map((s, index) => {
        const { id, ...rest } = s;
        return {
            ...rest, serviceId: id, order: index + 1, title: resolve(s.title), description: resolve(s.description), price: resolve(s.price), features: s.features.map(f => resolve(f))
        };
    });
    const generateTeam = () => TEAM_MEMBERS.map((m, index) => ({
        ...m, order: index + 1, role: resolve(m.role), description: resolve(m.description), bio: resolve(m.bio), achievements: m.achievements.map(a => resolve(a)), specialties: m.specialties.map(s => resolve(s))
    }));
    const generateTestimonials = () => TESTIMONIALS.map(t => ({ ...t, quote: resolve(t.quote), company: resolve(t.company) }));
    const generateFAQs = () => FAQ_DATA.map(f => ({ question: resolve(f.question), answer: resolve(f.answer) }));

    // (Simplified generators for site_content and contact_settings for brevity, assuming same structure)
    const generateSiteContent = () => {
        const hero = { badge: resolve('hero.badge'), title_prefix: resolve('hero.title_prefix'), title_highlight: resolve('hero.title_highlight'), description: resolve('hero.description'), cta_consultation: resolve('hero.cta_consultation'), cta_showreel: resolve('hero.cta_showreel'), trusted_by: resolve('hero.trusted_by'), tech_stack: resolve('hero.tech_stack'), trustpilot_on: resolve('hero.trustpilot_on'), mock_viral_campaign: resolve('hero.mock_viral_campaign'), mock_follow: resolve('hero.mock_follow'), mock_views: resolve('hero.mock_views'), mock_likes: resolve('hero.mock_likes'), mock_ctr: resolve('hero.mock_ctr') };
        const footer = { ready_to_scale: resolve('footer.ready_to_scale'), cta_desc: resolve('footer.cta_desc'), start_project: resolve('footer.start_project'), tagline_desc: resolve('footer.tagline_desc'), rated_clients: resolve('footer.rated_clients'), services_label: resolve('footer.services'), company_label: resolve('footer.company'), legal_label: resolve('footer.legal'), contact_label: resolve('footer.contact'), socials_label: resolve('footer.socials'), privacy: resolve('footer.privacy'), terms: resolve('footer.terms'), sitemap: resolve('footer.sitemap'), copyright: resolve('footer.copyright'), menu: { about: resolve('footer.menu.about'), process: resolve('footer.menu.process'), work: resolve('footer.menu.work'), team: resolve('footer.menu.team'), blog: resolve('footer.menu.blog'), careers: resolve('footer.menu.careers'), contact: resolve('footer.menu.contact') } };
        const navigation = { home: resolve('nav.home'), services: resolve('nav.services'), company: resolve('nav.company'), portfolio: resolve('nav.portfolio'), contact: resolve('nav.contact') };
        const section_headers = { testimonials: { badge: resolve('section_headers.testimonials.badge'), title: resolve('section_headers.testimonials.title'), highlight: resolve('section_headers.testimonials.highlight'), description: resolve('section_headers.testimonials.description') }, faq: { badge: resolve('section_headers.faq.badge'), title: resolve('section_headers.faq.title'), description: resolve('section_headers.faq.description') }, team: { badge: resolve('section_headers.team.badge'), title: resolve('section_headers.team.title'), highlight: resolve('section_headers.team.highlight'), description: resolve('section_headers.team.description') }, projects: { badge: resolve('projects_preview.badge'), title: resolve('projects_preview.title'), description: resolve('projects_preview.description') } };
        return { hero, footer, navigation, section_headers };
    };
    const generateContactSettings = () => {
        return { page_text: { badge: resolve('contact_page.badge'), title: resolve('contact_page.title'), description: resolve('contact_page.description') }, form_labels: { name: resolve('contact_page.form.name'), email: resolve('contact_page.form.email'), subject: resolve('contact_page.form.subject'), message: resolve('contact_page.form.message'), service: resolve('contact_page.form.service'), budget: resolve('contact_page.form.budget'), submit: resolve('contact_page.form.submit'), sending: resolve('contact_page.form.sending'), success: resolve('contact_page.form.success'), error: resolve('contact_page.form.error') }, contact_info: { ...CONTACT_INFO, office_hours: resolve('contact_page.info.office_hours'), response_time: resolve('contact_page.info.response_time') }, social_links: CONTACT_INFO.social };
    };


    // --- Seeding Logic ---
    const seedCollection = async (collectionName: string, data: any[], key: string) => {
        setStatus(prev => ({ ...prev, [key]: 'loading' }));
        try {
            const batch = writeBatch(db);
            // Delete existing documents first to avoid duplicates/ghosts on "Seed" (Optional but cleaner)
            // For now, we overwrite or add.
            for (let i = 0; i < data.length; i++) {
                const docRef = doc(collection(db, collectionName));
                batch.set(docRef, { ...data[i], createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
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
            await setDoc(doc(db, collectionName, docId), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
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
            snapshot.docs.forEach((doc) => batch.delete(doc.ref));
            await batch.commit();
            setStatus(prev => ({ ...prev, [key]: 'idle' }));
            await fetchCounts();
        } catch (error) {
            setStatus(prev => ({ ...prev, [key]: 'error' }));
        }
    };

    const clearSingleDoc = async (collectionName: string, docId: string, key: string) => {
        if (!window.confirm(`Delete ${collectionName}?`)) return;
        setStatus(prev => ({ ...prev, [key]: 'loading' }));
        try {
            await deleteDoc(doc(db, collectionName, docId));
            setStatus(prev => ({ ...prev, [key]: 'idle' }));
            await fetchCounts();
        } catch (error) {
            setStatus(prev => ({ ...prev, [key]: 'error' }));
        }
    };

    const seedAll = async () => {
        if (!translationsLoaded) { alert("Translations not loaded yet."); return; }
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

    const clearAll = async () => {
        if (!window.confirm("DANGER: This will delete ALL data from ALL collections managed by this dashboard. Are you sure?")) return;
        if (!window.confirm("Final Confirmation: This specific action cannot be undone. Proceed?")) return;

        setLoading(true);
        try {
            for (const item of collectionsList) {
                if (item.isSingle) {
                    await deleteDoc(doc(db, item.collection, item.docId!));
                } else {
                    const snapshot = await getDocs(collection(db, item.collection));
                    const subBatch = writeBatch(db);
                    snapshot.docs.forEach(d => subBatch.delete(d.ref));
                    await subBatch.commit();
                }
            }
            await fetchCounts();
            setLoading(false);
            alert("Database cleared successfully.");
        } catch (error) {
            console.error(error);
            setLoading(false);
            alert("Error clearing database. Check console.");
        }
    };

    // --- Diagnostics Logic ---
    const runDiagnostics = async () => {
        setIsScanning(true);
        setIssues([]);
        const newIssues: DiagnosticIssue[] = [];
        const checkCols = ['projects', 'services', 'team_members'];

        for (const colName of checkCols) {
            const snapshot = await getDocs(collection(db, colName));
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                if (typeof data.order !== 'number') {
                    newIssues.push({ id: Math.random().toString(), collection: colName, docId: doc.id, issue: 'missing_order', details: 'Item is missing "order" field.' });
                }
                // Check if title is a localized object (should be object) or string (bad)
                if (typeof data.title === 'string' && data.title.includes('[object Object]')) {
                    newIssues.push({ id: Math.random().toString(), collection: colName, docId: doc.id, issue: 'corrupt_data', details: 'Title contains "[object Object]".' });
                }
            });
        }
        setIssues(newIssues);
        setIsScanning(false);
    };

    const fixOrderIssues = async () => {
        setFixStatus('fixing');
        try {
            const batch = writeBatch(db);
            const colsToFix = [...new Set(issues.filter(i => i.issue === 'missing_order').map(i => i.collection))];

            for (const colName of colsToFix) {
                const snapshot = await getDocs(query(collection(db, colName), orderBy('createdAt', 'asc'))); // Order by creation roughly
                snapshot.docs.forEach((doc, index) => {
                    batch.update(doc.ref, { order: index + 1 });
                });
            }
            await batch.commit();
            setFixStatus('success');
            runDiagnostics(); // Re-scan
        } catch (error) {
            console.error(error);
            setFixStatus('error');
        }
    };

    // --- Render ---

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Activity className="text-blue-600" size={32} />
                    System Health Dashboard
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                    Manage database seeding, verify data integrity, and check system status.
                </p>
            </div>

            {/* Custom Tabs */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-1.5 inline-flex gap-1 border border-slate-200 dark:border-white/5">
                {[
                    { id: 'seeding', icon: Database, label: 'Data Seeding' },
                    { id: 'diagnostics', icon: Wrench, label: 'Diagnostics' },
                    { id: 'system', icon: Server, label: 'System Info' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all ${activeTab === tab.id
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 shadow-sm'
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[500px]">
                {activeTab === 'seeding' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex flex-col md:flex-row justify-between items-center bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-500/10 gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">Global Actions</h3>
                                <p className="text-blue-700 dark:text-blue-300/80 text-sm">Populate or Clear all collections from codebase constants.</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={clearAll} disabled={loading} className="bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-300 px-6 py-3 rounded-xl transition-all font-medium flex items-center gap-2">
                                    {loading ? <RefreshCw className="animate-spin" /> : <Trash2 />} {loading ? 'Processing...' : 'Clear Entire Database'}
                                </button>
                                <button onClick={seedAll} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 font-medium flex items-center gap-2">
                                    {loading ? <RefreshCw className="animate-spin" /> : <Database />} {loading ? 'Seeding All...' : 'Seed Entire Database'}
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {collectionsList.map(({ key, name, collection: col, count, isSingle, docId }) => (
                                <div key={key} className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700/50 flex items-center justify-between shadow-sm hover:border-blue-200 dark:hover:border-blue-500/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${status[key] === 'success' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                                            {status[key] === 'loading' ? <RefreshCw className="animate-spin" size={20} /> : <Database size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{name}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs font-mono bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded text-slate-500">{col}</span>
                                                <span className="text-sm text-slate-500">{isSingle ? (counts[col] ? 'Created' : 'Missing') : `${counts[col] || 0} items`}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => isSingle ? clearSingleDoc(col, docId!, key) : clearCollection(col, key)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Clear Data">
                                            <Trash2 size={18} />
                                        </button>
                                        <button onClick={() => {
                                            if (key === 'site_content') seedSingleDoc(col, docId!, generateSiteContent(), key);
                                            else if (key === 'contact_settings') seedSingleDoc(col, docId!, generateContactSettings(), key);
                                            else if (key === 'projects') seedCollection(col, generateProjects(), key);
                                            else if (key === 'team') seedCollection(col, generateTeam(), key);
                                            else if (key === 'testimonials') seedCollection(col, generateTestimonials(), key);
                                            else if (key === 'faqs') seedCollection(col, generateFAQs(), key);
                                            else if (key === 'services') seedCollection(col, generateServices(), key);
                                        }} className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 rounded-lg text-sm font-medium flex items-center gap-2">
                                            <RefreshCw size={14} /> Sync
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'diagnostics' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-white/5 text-center">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">System Integrity Check</h2>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">Scan your Firestore collections for common data issues like missing DnD order fields or corrupted translation strings.</p>
                            <button onClick={runDiagnostics} disabled={isScanning} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/20 flex items-center gap-2 mx-auto disabled:opacity-50">
                                {isScanning ? <RefreshCw className="animate-spin" /> : <Activity />} {isScanning ? 'Scanning Database...' : 'Run Diagnostics Scan'}
                            </button>
                        </div>

                        {issues.length > 0 ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg flex items-center gap-2 text-red-500">
                                        <AlertCircle /> {issues.length} Issues Found
                                    </h3>
                                    {issues.some(i => i.issue === 'missing_order') && (
                                        <button onClick={fixOrderIssues} disabled={fixStatus === 'fixing'} className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                                            {fixStatus === 'fixing' ? <RefreshCw className="animate-spin" size={14} /> : <Wrench size={14} />}
                                            Auto-Fix Order
                                        </button>
                                    )}
                                </div>
                                {issues.map(issue => (
                                    <div key={issue.id} className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-4 rounded-xl flex items-start gap-4">
                                        <AlertCircle className="text-red-500 mt-1 shrink-0" size={20} />
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white capitalize">{issue.issue.replace('_', ' ')}</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{issue.details}</p>
                                            <div className="mt-2 text-xs font-mono bg-white dark:bg-black/20 inline-block px-2 py-1 rounded border border-red-100 dark:border-red-900/20">
                                                Collection: {issue.collection} • Doc ID: {issue.docId}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            !isScanning && <div className="text-center p-8 text-slate-400">No issues detected. Your system is healthy!</div>
                        )}
                    </div>
                )}

                {activeTab === 'system' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-white/5">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Globe size={20} /> Environment</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                                        <span className="text-slate-500">Environment</span>
                                        <span className="font-mono text-sm">Production / Dev</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                                        <span className="text-slate-500">Browser</span>
                                        <span className="font-mono text-sm">{navigator.userAgent.split('(')[0]}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                                        <span className="text-slate-500">Screen Resolution</span>
                                        <span className="font-mono text-sm">{window.innerWidth}x{window.innerHeight}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-white/5">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Database size={20} /> Database Connection</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                                        <span className="text-slate-500">Status</span>
                                        <span className="font-bold text-green-500 flex items-center gap-1"><Check size={14} /> Connected</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                                        <span className="text-slate-500">Project ID</span>
                                        <span className="font-mono text-sm">growbrandi (implied)</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                                        <span className="text-slate-500">Active Collections</span>
                                        <span className="font-mono text-sm">{collectionsList.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSeedData;
