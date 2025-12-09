import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, setDoc, writeBatch, query, orderBy, limit } from 'firebase/firestore';
import { Database, Trash2, RefreshCw, Check, AlertCircle, Globe, Activity, Server, Shield, Wrench, ArrowRight, Wifi, WifiOff, BarChart2, FileText, Clock, AlertTriangle } from 'lucide-react';
// import { PROJECTS, TEAM_MEMBERS, TESTIMONIALS, SERVICES, FAQ_DATA, CONTACT_INFO } from '../../../constants'; // Removed

// Languages supported
const LANGUAGES = ['en', 'de', 'es', 'fr', 'nl'];

// Tabs Interface
// Tabs Interface
type Tab = 'seeding' | 'diagnostics' | 'monitor' | 'activity';

interface DiagnosticIssue {
    id: string;
    collection: string;
    docId: string;
    issue: string; // 'missing_order' | 'invalid_type' | 'integrity_error' | 'empty_field' | 'duplicate_order'
    details: string;
    severity: 'critical' | 'warning';
}

interface LogEntry {
    id: string;
    action: string;
    status: 'success' | 'error' | 'info';
    timestamp: Date;
    details?: string;
}

interface NetworkStats {
    rtt: number | null;
    status: 'online' | 'offline' | 'degraded';
    lastChecked: Date | null;
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
        { key: 'projects', name: 'Projects', collection: 'projects', count: 0 },
        { key: 'team', name: 'Team Members', collection: 'team_members', count: 0 },
        { key: 'testimonials', name: 'Testimonials', collection: 'testimonials', count: 0 },
        { key: 'faqs', name: 'FAQs', collection: 'faqs', count: 0 },
        { key: 'services', name: 'Services', collection: 'services', count: 0 },
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

    // Advanced Monitoring State
    const [networkStats, setNetworkStats] = useState<NetworkStats>({ rtt: null, status: 'online', lastChecked: null });
    const [activityLog, setActivityLog] = useState<LogEntry[]>([]);

    const logAction = (action: string, status: 'success' | 'error' | 'info' = 'info', details?: string) => {
        setActivityLog(prev => [{
            id: Math.random().toString(36).substr(2, 9),
            action,
            status,
            timestamp: new Date(),
            details
        }, ...prev]);
    };

    const checkNetwork = async () => {
        const start = Date.now();
        try {
            await getDocs(query(collection(db, 'projects'), limit(1))); // Light query
            const end = Date.now();
            const rtt = end - start;
            setNetworkStats({
                rtt,
                status: rtt > 500 ? 'degraded' : 'online',
                lastChecked: new Date()
            });
            // logAction('Network Check', 'info', `RTT: ${rtt}ms`); // Optional: don't spam log
        } catch (err) {
            setNetworkStats({ rtt: null, status: 'offline', lastChecked: new Date() });
            logAction('Network Check', 'error', 'Connection failed');
        }
    };

    useEffect(() => {
        const interval = setInterval(checkNetwork, 30000); // Check every 30s
        checkNetwork(); // Initial check
        return () => clearInterval(interval);
    }, []);

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
    // Generators disabled as static constants are removed.
    const generateProjects = () => [];
    const generateServices = () => [];
    const generateTeam = () => [];
    const generateTestimonials = () => [];
    const generateFAQs = () => [];

    // (Simplified generators for site_content and contact_settings for brevity, assuming same structure)
    // Updated schema matching AdminSiteContent.tsx and Hero.tsx/Footer.tsx
    // generateSiteContent removed
    // generateContactSettings removed
    const generateSiteContent = () => ({});
    const generateContactSettings = () => ({});


    // --- Seeding Logic ---
    const seedCollection = async (collectionName: string, data: any[], key: string, idField?: string) => {
        setStatus(prev => ({ ...prev, [key]: 'loading' }));
        try {
            const batch = writeBatch(db);
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                // Use specified ID field if available, otherwise generate new ID
                const docId = idField && item[idField] ? item[idField] : doc(collection(db, collectionName)).id;
                const docRef = doc(db, collectionName, docId);

                // Remove the ID field from data if we used it as doc ID (optional, keeping for safety)
                // const { [idField]: _, ...rest } = item; 

                batch.set(docRef, { ...item, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
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
        alert("Seeding from static constants is no longer supported.");
        // Code removed
    };

    const clearAll = async () => {
        if (!window.confirm("DANGER: This will delete ALL data from ALL collections managed by this dashboard. Are you sure?")) return;
        if (!window.confirm("Final Confirmation: This specific action cannot be undone. Proceed?")) return;

        setLoading(true);
        logAction('Clear All', 'info', 'Started clearing database...');
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
            logAction('Clear All', 'success', 'Database cleared.');
        } catch (error) {
            console.error(error);
            setLoading(false);
            alert("Error clearing database. Check console.");
            logAction('Clear All', 'error', 'Failed to clear database.');
        }
    };

    // --- Diagnostics Logic ---
    const runDiagnostics = async () => {
        setIsScanning(true);
        setIssues([]);
        const newIssues: DiagnosticIssue[] = [];
        const checkCols = ['projects', 'services', 'team_members'];

        logAction('Diagnostics', 'info', 'Running deep scan...');

        // 1. Standard Checks (Order & Types)
        for (const colName of checkCols) {
            const snapshot = await getDocs(collection(db, colName));
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                if (typeof data.order !== 'number') {
                    newIssues.push({ id: Math.random().toString(), collection: colName, docId: doc.id, issue: 'missing_order', details: 'Item is missing "order" field.', severity: 'critical' });
                }
                if (typeof data.title === 'string' && data.title.includes('[object Object]')) {
                    newIssues.push({ id: Math.random().toString(), collection: colName, docId: doc.id, issue: 'corrupt_data', details: 'Title contains "[object Object]".', severity: 'critical' });
                }
            });
        }

        // 2. Deep Scan: Cross-Reference (Projects -> Category = Service ID)
        try {
            const servicesSnap = await getDocs(collection(db, 'services'));
            // Helper to get English title safely
            const getServiceId = (d: any) => d.serviceId || d.id || '';
            const validServices = new Set(servicesSnap.docs.map(d => getServiceId(d.data())));

            const projectsSnap = await getDocs(collection(db, 'projects'));
            projectsSnap.docs.forEach(doc => {
                const data = doc.data();
                const cat = data.category; // Now should be a string (Service ID)
                if (cat && typeof cat === 'string' && !validServices.has(cat) && !cat.includes('[object')) {
                    // Ignore if valid ID or if it's the broken object (which causes react error but handled by format checker)
                    newIssues.push({ id: Math.random().toString(), collection: 'projects', docId: doc.id, issue: 'integrity_error', details: `Category ID "${cat}" not found in Services.`, severity: 'warning' });
                } else if (typeof cat === 'object') {
                    newIssues.push({ id: Math.random().toString(), collection: 'projects', docId: doc.id, issue: 'invalid_type', details: `Category is Object (Localized), expected String ID.`, severity: 'critical' });
                }
                if (!data.imageUrl && !data.image) {
                    newIssues.push({ id: Math.random().toString(), collection: 'projects', docId: doc.id, issue: 'empty_field', details: 'Missing image URL', severity: 'warning' });
                }
            });
        } catch (e) {
            console.error("Deep scan error", e);
        }

        setIssues(newIssues);
        setIsScanning(false);
        if (newIssues.length > 0) {
            logAction('Diagnostics', 'error', `Scan found ${newIssues.length} issues.`);
        } else {
            logAction('Diagnostics', 'success', 'System clean. No issues found.');
        }
    };

    const fixOrderIssues = async () => {
        setFixStatus('fixing');
        logAction('Auto-Fix', 'info', 'Attempting to fix order issues...');
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
            logAction('Auto-Fix', 'success', 'Order issues fixed successfully.');
            runDiagnostics(); // Re-scan
        } catch (error) {
            console.error(error);
            setFixStatus('error');
            logAction('Auto-Fix', 'error', 'Failed to fix order issues.');
        }
    };

    // --- Render ---

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Activity className="text-blue-600" size={32} />
                    System Health Dashboard
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                    Advanced monitoring, database seeding, and system diagnostics control center.
                </p>
            </div>

            {/* Custom Tabs */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-1.5 inline-flex gap-1 border border-slate-200 dark:border-white/5 overflow-x-auto max-w-full">
                {[
                    { id: 'seeding', icon: Database, label: 'Data Seeding' },
                    { id: 'diagnostics', icon: Wrench, label: 'Diagnostics' },
                    { id: 'monitor', icon: Activity, label: 'System Monitor' },
                    { id: 'activity', icon: FileText, label: 'Activity Log' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all whitespace-nowrap ${activeTab === tab.id
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

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
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
                                                <span className={`text-sm ${!isSingle && (!counts[col] || counts[col] === 0) ? 'text-red-500 font-medium' : 'text-slate-500'}`}>
                                                    {isSingle ? (counts[col] ? 'Created' : 'Missing') : `${counts[col] || 0} items`}
                                                </span>
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
                                            else if (key === 'services') seedCollection(col, generateServices(), key, 'serviceId');
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
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Deep System Diagnostics</h2>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">Performs a deep scan of all collections, verifying referential integrity (e.g., Projects linked to valid Services) and data field completeness.</p>
                            <button onClick={runDiagnostics} disabled={isScanning} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/20 flex items-center gap-2 mx-auto disabled:opacity-50">
                                {isScanning ? <RefreshCw className="animate-spin" /> : <Activity />} {isScanning ? 'Running Deep Scan...' : 'Start Diagnostic Scan'}
                            </button>
                        </div>

                        {issues.length > 0 ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg flex items-center gap-2 text-red-500">
                                        <AlertTriangle className="text-red-500" /> {issues.length} Issues Found
                                    </h3>
                                    {issues.some(i => i.issue === 'missing_order') && (
                                        <button onClick={fixOrderIssues} disabled={fixStatus === 'fixing'} className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                                            {fixStatus === 'fixing' ? <RefreshCw className="animate-spin" size={14} /> : <Wrench size={14} />}
                                            Auto-Fix Order
                                        </button>
                                    )}
                                </div>
                                {issues.map(issue => (
                                    <div key={issue.id} className={`border p-4 rounded-xl flex items-start gap-4 ${issue.severity === 'critical'
                                        ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30'
                                        : 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/30'
                                        }`}>
                                        <AlertCircle className={issue.severity === 'critical' ? 'text-red-500' : 'text-yellow-500'} size={20} />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-slate-900 dark:text-white capitalize">{issue.issue.replace('_', ' ')}</h4>
                                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${issue.severity === 'critical' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                                                    }`}>{issue.severity}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{issue.details}</p>
                                            <div className="mt-2 text-xs font-mono bg-white dark:bg-black/20 inline-block px-2 py-1 rounded border border-black/5 dark:border-white/10">
                                                Collection: {issue.collection} • Doc ID: {issue.docId}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            !isScanning && <div className="text-center p-8 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20 text-green-700 dark:text-green-400 font-medium">System Integrity Verified: No Issues Found</div>
                        )}
                    </div>
                )}

                {activeTab === 'monitor' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Network Panel */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => checkNetwork()} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"><RefreshCw size={16} /></button>
                                </div>
                                <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Wifi size={20} /> Network Status</h3>
                                <div className="flex items-center gap-6">
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center ${networkStats.status === 'online' ? 'bg-green-100 text-green-600' : networkStats.status === 'degraded' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                                        {networkStats.status === 'online' ? <Wifi size={40} /> : <WifiOff size={40} />}
                                    </div>
                                    <div>
                                        <div className="text-4xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
                                            {networkStats.rtt ? `${networkStats.rtt}ms` : '--'}
                                        </div>
                                        <div className={`text-sm font-medium mt-1 uppercase tracking-wide ${networkStats.status === 'online' ? 'text-green-500' : 'text-red-500'}`}>
                                            {networkStats.status}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                            <Clock size={12} /> Last checked: {networkStats.lastChecked ? networkStats.lastChecked.toLocaleTimeString() : 'Never'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Storage Visuals */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-white/5">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><BarChart2 size={20} /> Storage Distribution</h3>
                                <div className="space-y-4">
                                    {collectionsList.filter(c => !c.isSingle).map(c => (
                                        <div key={c.key}>
                                            <div className="flex justify-between text-sm mb-1.5">
                                                <span className="font-medium text-slate-700 dark:text-slate-300">{c.name}</span>
                                                <span className="font-mono text-slate-500">{counts[c.collection] || 0} docs</span>
                                            </div>
                                            <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${Math.min(((counts[c.collection] || 0) / 20) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Environment Info */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-white/5 md:col-span-2">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Globe size={20} /> Environment</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Context</div>
                                        <div className="font-mono text-slate-900 dark:text-white">Production</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Browser</div>
                                        <div className="font-mono text-slate-900 dark:text-white truncate" title={navigator.userAgent}>{navigator.userAgent.split('(')[0]}</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Resolution</div>
                                        <div className="font-mono text-slate-900 dark:text-white">{window.innerWidth} x {window.innerHeight}</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Connection</div>
                                        <div className="font-bold text-green-500 flex items-center gap-1"><Check size={14} /> Active</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-700 dark:text-slate-200">Session Activity Log</h3>
                            <button onClick={() => setActivityLog([])} className="text-xs text-red-500 hover:underline">Clear Log</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500">
                                    <tr>
                                        <th className="p-4 font-medium text-sm">Time</th>
                                        <th className="p-4 font-medium text-sm">Action</th>
                                        <th className="p-4 font-medium text-sm">Status</th>
                                        <th className="p-4 font-medium text-sm">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {activityLog.length === 0 ? (
                                        <tr><td colSpan={4} className="p-12 text-center text-slate-400">No activity recorded this session.</td></tr>
                                    ) : (
                                        activityLog.map(log => (
                                            <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="p-4 font-mono text-sm text-slate-500 whitespace-nowrap">{log.timestamp.toLocaleTimeString()}</td>
                                                <td className="p-4 font-medium text-slate-900 dark:text-white">{log.action}</td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${log.status === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        log.status === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                        }`}>
                                                        {log.status === 'success' ? <Check size={12} /> : log.status === 'error' ? <AlertTriangle size={12} /> : <Activity size={12} />}
                                                        {log.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-slate-600 dark:text-slate-300 max-w-xs md:max-w-md truncate" title={log.details}>{log.details}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSeedData;
