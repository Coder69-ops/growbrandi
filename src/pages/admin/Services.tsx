import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { SERVICES } from '../../../constants';
import { Plus, Edit2, Trash2, Save, X, Database, ArrowLeft, Tag, DollarSign, List, Briefcase, GripVertical } from 'lucide-react';
import { LanguageTabs, LocalizedInput, LocalizedArrayInput } from '../../components/admin/LocalizedFormFields';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { SupportedLanguage, ensureLocalizedFormat, getLocalizedField } from '../../utils/localization';
import { Reorder } from 'framer-motion';
import { useStatusModal } from '../../hooks/useStatusModal';
import { SortableItem } from '../../components/admin/SortableItem';
import { Sparkles } from 'lucide-react';
import { useAutoTranslate } from '../../hooks/useAutoTranslate';

const AdminServices = () => {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentService, setCurrentService] = useState<any>(null);
    const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('en');

    const fetchServices = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'services'));
            const servicesData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id,
                    serviceId: data.serviceId || data.id // Handle both data structures (legacy/new)
                };
            }).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
            setServices(servicesData);
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleReorder = (newOrder: any[]) => {
        setServices(newOrder);
        const batch = writeBatch(db);
        newOrder.forEach((service, index) => {
            const ref = doc(db, 'services', service.id);
            batch.update(ref, { order: index + 1 });
        });
        batch.commit().catch(console.error);
    };

    const handleSeedData = async () => {
        if (!window.confirm("This will add all services from constants.ts to Firestore. Continue?")) return;
        setLoading(true);
        try {
            for (const [index, service] of SERVICES.entries()) {
                const multiLangService = {
                    serviceId: service.id,
                    order: index + 1,
                    color: service.color || 'from-blue-500 to-cyan-500',
                    title: { en: service.title },
                    description: { en: service.description },
                    price: { en: service.price },
                    features: (service.features || []).map((f: string) => ({ en: f })),
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                };
                await addDoc(collection(db, 'services'), multiLangService);
            }
            await fetchServices();
            alert("Data seeded successfully!");
        } catch (error) {
            console.error("Error seeding data:", error);
            alert("Failed to seed data.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        try {
            await deleteDoc(doc(db, 'services', id));
            showSuccess('Service Deleted', 'The service has been permanently deleted.');
            setServices(services.filter(s => s.id !== id));
        } catch (error) {
            console.error("Error deleting service:", error);
            showError('Delete Failed', 'There was an error deleting the service. Please try again.');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const serviceData: any = {
                ...currentService,
                updatedAt: serverTimestamp(),
            };

            if (currentService.id) {
                const { id, ...data } = serviceData;
                await updateDoc(doc(db, 'services', id), data);
                showSuccess('Service Updated', 'The service has been successfully updated.');
            } else {
                serviceData.createdAt = serverTimestamp();
                // Assign new service to end of list
                serviceData.order = services.length + 1;
                await addDoc(collection(db, 'services'), serviceData);
                showSuccess('Service Created', 'New service has been successfully created.');
            }
            await fetchServices();
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving service:", error);
            alert("Failed to save service.");
        } finally {
            setLoading(false);
        }
    };

    const openEdit = (service: any = {}) => {
        setCurrentService({
            serviceId: service.serviceId || '',
            color: service.color || 'from-blue-500 to-cyan-500',
            title: ensureLocalizedFormat(service.title),
            description: ensureLocalizedFormat(service.description),
            price: ensureLocalizedFormat(service.price),
            features: (service.features || []).map((f: any) => ensureLocalizedFormat(f)),
            ...service,
        });
        setActiveLanguage('en');
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setCurrentService({ ...currentService, [field]: value });
    };

    const { isTranslating, handleAutoTranslate } = useAutoTranslate(
        currentService,
        setCurrentService,
        {
            fields: ['title', 'description', 'price'],
            arrayFields: ['features']
        }
    );

    const { showSuccess, showError, StatusModal } = useStatusModal();

    // Move this logic inside the render return to keep the layout visible
    // if (loading && !isEditing) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading services...</div>;

    return (
        <AdminPageLayout
            title="Services"
            description="Manage your service offerings and pricing packages"
            actions={
                !loading && (
                    <div className="flex gap-3">
                        {services.length === 0 && (
                            <button
                                onClick={handleSeedData}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                <Database size={18} />
                                Seed Data
                            </button>
                        )}
                        <button
                            onClick={() => openEdit()}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95"
                        >
                            <Plus size={20} /> Add Service
                        </button>
                    </div>
                )
            }
        >
            {loading && !isEditing ? (
                <AdminLoader message="Loading services..." />
            ) : isEditing ? (
                <div className="glass-panel p-8 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500 hover:text-slate-900 dark:hover:text-white"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                                {currentService.id ? 'Edit Service' : 'New Service'}
                            </h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleAutoTranslate}
                                disabled={isTranslating}
                                className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Auto-translate English text to all other languages"
                            >
                                <Sparkles size={18} className={isTranslating ? "animate-spin" : ""} />
                                {isTranslating ? 'Translating...' : 'Auto Translate'}
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95"
                                disabled={loading}
                            >
                                <Save size={18} /> Save Service
                            </button>
                        </div>
                    </div>

                    <div className="mb-8">
                        <LanguageTabs activeLanguage={activeLanguage} onChange={setActiveLanguage} />
                    </div>

                    <form onSubmit={handleSave} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Briefcase size={18} className="text-blue-500" />
                                        Service Details
                                    </h3>

                                    <LocalizedInput
                                        label="Title"
                                        value={currentService.title}
                                        onChange={(v) => updateField('title', v)}
                                        activeLanguage={activeLanguage}
                                        required
                                    />
                                    <LocalizedInput
                                        label="Description"
                                        value={currentService.description}
                                        onChange={(v) => updateField('description', v)}
                                        activeLanguage={activeLanguage}
                                        type="textarea"
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <List size={18} className="text-violet-500" />
                                        Features
                                    </h3>
                                    <LocalizedArrayInput
                                        label="Features List"
                                        value={currentService.features}
                                        onChange={(v) => updateField('features', v)}
                                        activeLanguage={activeLanguage}
                                        placeholder="e.g., Meta Ads Management"
                                    />
                                </div>
                            </div>

                            {/* Sidebar Settings */}
                            <div className="space-y-6">
                                <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <DollarSign size={18} className="text-emerald-500" />
                                        Pricing & Config
                                    </h3>

                                    <LocalizedInput
                                        label="Price Display"
                                        value={currentService.price}
                                        onChange={(v) => updateField('price', v)}
                                        activeLanguage={activeLanguage}
                                        placeholder="e.g., Starting at $599"
                                    />

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Service ID (Unique)</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            value={currentService.serviceId}
                                            onChange={(e) => updateField('serviceId', e.target.value)}
                                            placeholder="performance_marketing"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Used for URL routing.</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Gradient Color</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            value={currentService.color}
                                            onChange={(e) => updateField('color', e.target.value)}
                                            placeholder="from-blue-500 to-cyan-500"
                                        />
                                        <div className={`mt-2 h-8 rounded-lg bg-gradient-to-br ${currentService.color} shadow-sm border border-slate-200/50 dark:border-slate-700/50`}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <Reorder.Group axis="y" values={services} onReorder={handleReorder} className="flex flex-col gap-4">
                    {services.map((service) => (
                        <SortableItem key={service.id} item={service}>
                            <div className="glass-card flex flex-col sm:flex-row h-full sm:h-32 overflow-hidden hover:scale-[1.01] transition-all duration-300 group pl-0">
                                {/* Visual Color Stripe/Icon Area */}
                                <div className={`w-full sm:w-24 h-32 sm:h-full bg-gradient-to-br ${service.color || 'from-blue-500 to-cyan-500'} shrink-0 flex items-center justify-center`}>
                                    <Briefcase className="text-white opacity-80" size={32} />
                                </div>

                                <div className="flex-1 p-5 flex flex-col justify-center min-w-0">
                                    <div className="flex justify-between items-start mb-2 gap-4">
                                        <div>
                                            <h3 className="font-bold text-xl text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {getLocalizedField(service.title, 'en')}
                                            </h3>
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md mt-1 inline-block">
                                                {getLocalizedField(service.price, 'en')}
                                            </span>
                                        </div>
                                        <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                onClick={() => openEdit(service)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mb-3">
                                        {getLocalizedField(service.description, 'en')}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {service.features?.slice(0, 3).map((f: any, i: number) => (
                                            <span key={i} className="text-[10px] font-medium px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                                                {getLocalizedField(f, 'en')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SortableItem>
                    ))}

                    {services.length === 0 && (
                        <div className="col-span-full py-16 text-center glass-panel border-dashed border-2 border-slate-300 dark:border-slate-700">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                                <Briefcase size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Services Found</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                                Start offering value to your clients by creating your first service package.
                            </p>
                            <button
                                onClick={() => openEdit()}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 font-medium"
                            >
                                Create First Service
                            </button>
                        </div>
                    )}
                </Reorder.Group>
            )}
            <StatusModal />
        </AdminPageLayout>
    );
};

export default AdminServices;
