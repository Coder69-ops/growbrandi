import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { addDoc, updateDoc, deleteDoc } from '../../lib/firestore-audit';
import { Plus, Edit2, Trash2, Save, X, Database, ArrowLeft, Briefcase, List, DollarSign, Check } from 'lucide-react';
import * as FaIcons from 'react-icons/fa';

import { LanguageTabs, LocalizedInput, LocalizedArrayInput } from '../../components/admin/LocalizedFormFields';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { SupportedLanguage, ensureLocalizedFormat, getLocalizedField } from '../../utils/localization';
import { Reorder } from 'framer-motion';
import { useStatusModal } from '../../hooks/useStatusModal';
import { SortableItem } from '../../components/admin/SortableItem';
import { Sparkles } from 'lucide-react';
import { useAutoTranslate } from '../../hooks/useAutoTranslate';
// import { logAction } from '../../services/auditService'; // Removed manual logging

// Icon Picker Component
const IconPicker = ({ value, onChange }: { value: string, onChange: (icon: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const commonIcons = [
        'FaCode', 'FaPaintBrush', 'FaBullhorn', 'FaChartLine', 'FaMobileAlt',
        'FaSearch', 'FaServer', 'FaRobot', 'FaPenNib', 'FaHandshake',
        'FaLaptopCode', 'FaPalette', 'FaRocket', 'FaCogs', 'FaGlobe'
    ];

    const filteredIcons = commonIcons.filter(icon =>
        icon.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const CurrentIcon = (FaIcons as any)[value] || FaIcons.FaBriefcase;

    return (
        <div className="relative">
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Service Icon</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
            >
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <CurrentIcon size={18} />
                </div>
                <span className="flex-1 font-medium text-slate-700 dark:text-slate-200">{value || 'Select Icon'}</span>
                {isOpen ? <X size={16} className="text-slate-400" /> : <div className="text-xs text-slate-400">Change</div>}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 z-50 w-full mt-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl p-4">
                    <input
                        type="text"
                        placeholder="Search icons..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm mb-3"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                    <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                        {filteredIcons.map(iconName => {
                            const Icon = (FaIcons as any)[iconName];
                            return (
                                <button
                                    key={iconName}
                                    type="button"
                                    onClick={() => {
                                        onChange(iconName);
                                        setIsOpen(false);
                                    }}
                                    className={`p-2 rounded-lg flex flex-col items-center gap-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${value === iconName ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600' : 'text-slate-600 dark:text-slate-400'}`}
                                >
                                    <Icon size={20} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

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
                    serviceId: data.serviceId || data.id
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

    const { showSuccess, showError, StatusModal } = useStatusModal();

    const handleSeedData = async () => {
        if (!window.confirm("This will add default services to your database. Continue?")) return;
        setLoading(true);
        try {
            const sampleServices = [
                {
                    title: { en: "Web Development" },
                    description: { en: "Custom websites and web applications built with modern technologies." },
                    price: { en: "Starting at $2,500" },
                    category: "Development",
                    icon: "FaCode",
                    color: "from-blue-500 to-cyan-500",
                    isPopular: true,
                    features: [
                        { en: "React & Next.js" },
                        { en: "Responsive Design" },
                        { en: "SEO Optimization" }
                    ],
                    process: [
                        { step: { en: "Discovery" }, duration: { en: "1 Week" }, description: { en: "We analyze your needs." } },
                        { step: { en: "Build" }, duration: { en: "3 Weeks" }, description: { en: "We develop your site." } }
                    ]
                },
                {
                    title: { en: "UI/UX Design" },
                    description: { en: "User-centric design that converts visitors into customers." },
                    price: { en: "Starting at $1,500" },
                    category: "Design",
                    icon: "FaPaintBrush",
                    color: "from-purple-500 to-pink-500",
                    isPopular: false,
                    features: [
                        { en: "Figma Prototypes" },
                        { en: "User Research" },
                        { en: "Brand System" }
                    ]
                },
                {
                    title: { en: "Digital Marketing" },
                    description: { en: "Data-driven strategies to grow your audience." },
                    price: { en: "Starting at $1,000/mo" },
                    category: "Marketing",
                    icon: "FaBullhorn",
                    color: "from-orange-500 to-red-500",
                    isPopular: false,
                    features: [
                        { en: "Social Media" },
                        { en: "PPC Campaigns" },
                        { en: "Content Strategy" }
                    ]
                }
            ];

            const batch = writeBatch(db);
            sampleServices.forEach((service, index) => {
                const docRef = doc(collection(db, 'services'));
                batch.set(docRef, { ...service, order: index + 1, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
            });
            await batch.commit();

            await fetchServices();
            showSuccess('Data Seeded', 'Default services have been added.');
        } catch (error) {
            console.error("Error seeding data:", error);
            showError('Seed Failed', 'Failed to seed data.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        try {
            await deleteDoc(doc(db, 'services', id));
            await deleteDoc(doc(db, 'services', id));
            // await logAction('delete', 'services', `Deleted service: ${id}`, { serviceId: id }); // Handled by wrapper
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
                await updateDoc(doc(db, 'services', id), data);
                // await logAction('update', 'services', `Updated service: ${data.title?.en || 'Untitled'}`, { serviceId: id });
                showSuccess('Service Updated', 'The service has been successfully updated.');
            } else {
                serviceData.createdAt = serverTimestamp();
                serviceData.order = services.length + 1;
                const docRef = await addDoc(collection(db, 'services'), serviceData);
                // await logAction('create', 'services', `Created service: ${serviceData.title?.en || 'Untitled'}`, { serviceId: docRef.id });
                showSuccess('Service Created', 'New service has been successfully created.');
            }
            await fetchServices();
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving service:", error);
            showError('Save Failed', 'Failed to save service.');
        } finally {
            setLoading(false);
        }
    };

    const openEdit = (service: any = {}) => {
        setCurrentService({
            serviceId: service.serviceId || '',
            color: service.color || 'from-blue-500 to-cyan-500',
            icon: service.icon || 'FaCode',
            title: ensureLocalizedFormat(service.title),
            description: ensureLocalizedFormat(service.description),
            price: ensureLocalizedFormat(service.price),
            features: (service.features || []).map((f: any) => ensureLocalizedFormat(f)),
            isPopular: service.isPopular || false,
            category: service.category || 'Design',
            process: (service.process || []).map((p: any) => ({
                step: ensureLocalizedFormat(p.step),
                description: ensureLocalizedFormat(p.description),
                duration: ensureLocalizedFormat(p.duration)
            })),
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
            arrayFields: ['features'],
            complexArrayFields: {
                process: ['step', 'description', 'duration']
            }
        }
    );

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

                                    <div className="grid grid-cols-2 gap-6">
                                        <LocalizedInput
                                            label="Title"
                                            value={currentService.title}
                                            onChange={(v) => updateField('title', v)}
                                            activeLanguage={activeLanguage}
                                            required
                                        />
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Category</label>
                                            <select
                                                value={currentService.category}
                                                onChange={(e) => updateField('category', e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="Design">Design</option>
                                                <option value="Development">Development</option>
                                                <option value="Marketing">Marketing</option>
                                                <option value="Strategy">Strategy</option>
                                            </select>
                                        </div>
                                    </div>

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

                                <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <List size={18} className="text-pink-500" />
                                        Process Steps
                                    </h3>

                                    {(currentService.process || []).map((step: any, index: number) => (
                                        <div key={index} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 relative group">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newProcess = [...(currentService.process || [])];
                                                    newProcess.splice(index, 1);
                                                    updateField('process', newProcess);
                                                }}
                                                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={16} />
                                            </button>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <LocalizedInput
                                                        label={`Step ${index + 1} Title`}
                                                        value={step.step}
                                                        onChange={(v) => {
                                                            const newProcess = [...(currentService.process || [])];
                                                            newProcess[index] = { ...step, step: v };
                                                            updateField('process', newProcess);
                                                        }}
                                                        activeLanguage={activeLanguage}
                                                        placeholder="Step Title"
                                                    />
                                                    <LocalizedInput
                                                        label="Duration"
                                                        value={step.duration}
                                                        onChange={(v) => {
                                                            const newProcess = [...(currentService.process || [])];
                                                            newProcess[index] = { ...step, duration: v };
                                                            updateField('process', newProcess);
                                                        }}
                                                        activeLanguage={activeLanguage}
                                                        placeholder="e.g. 2 Weeks"
                                                    />
                                                </div>
                                                <LocalizedInput
                                                    label="Description"
                                                    value={step.description}
                                                    onChange={(v) => {
                                                        const newProcess = [...(currentService.process || [])];
                                                        newProcess[index] = { ...step, description: v };
                                                        updateField('process', newProcess);
                                                    }}
                                                    activeLanguage={activeLanguage}
                                                    type="textarea"
                                                    rows={2}
                                                    placeholder="Step description..."
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newProcess = [...(currentService.process || []), { step: {}, duration: {}, description: {} }];
                                            updateField('process', newProcess);
                                        }}
                                        className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 hover:text-blue-600 hover:border-blue-500 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} /> Add Process Step
                                    </button>
                                </div>
                            </div>

                            {/* Sidebar Settings */}
                            <div className="space-y-6">
                                <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <DollarSign size={18} className="text-emerald-500" />
                                        Config & Styles
                                    </h3>

                                    <IconPicker
                                        value={currentService.icon}
                                        onChange={(icon) => updateField('icon', icon)}
                                    />

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
                                        <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">Theme Color</label>
                                        <div className="grid grid-cols-4 gap-2 mb-3">
                                            {[
                                                'from-blue-500 to-cyan-500',
                                                'from-purple-500 to-pink-500',
                                                'from-orange-500 to-red-500',
                                                'from-emerald-500 to-teal-500',
                                                'from-amber-400 to-orange-500',
                                                'from-violet-600 to-indigo-600',
                                                'from-pink-500 to-rose-500',
                                                'from-slate-700 to-slate-900',
                                            ].map((gradient) => (
                                                <button
                                                    key={gradient}
                                                    type="button"
                                                    onClick={() => updateField('color', gradient)}
                                                    className={`h-10 rounded-lg bg-gradient-to-br ${gradient} transition-all duration-200 ${currentService.color === gradient
                                                        ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 scale-105'
                                                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                                                        }`}
                                                    title={gradient}
                                                />
                                            ))}
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 pl-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                                value={currentService.color}
                                                onChange={(e) => updateField('color', e.target.value)}
                                                placeholder="Custom tailwind classes..."
                                            />
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 border border-slate-300 dark:border-slate-600" />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">Select a preset or enter custom Tailwind gradient classes.</p>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                        <div className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${currentService.isPopular ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                                            onClick={() => updateField('isPopular', !currentService.isPopular)}
                                        >
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${currentService.isPopular ? 'translate-x-4' : ''}`} />
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Mark as Popular</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <Reorder.Group axis="y" values={services} onReorder={handleReorder} className="flex flex-col gap-4">
                    {services.map((service) => {
                        const Icon = (FaIcons as any)[service.icon] || FaIcons.FaBriefcase;
                        return (
                            <SortableItem key={service.id} item={service}>
                                <div className="glass-card flex flex-col sm:flex-row h-full sm:h-32 overflow-hidden hover:scale-[1.01] transition-all duration-300 group pl-0">
                                    {/* Visual Color Stripe/Icon Area */}
                                    <div className={`w-full sm:w-24 h-32 sm:h-full bg-gradient-to-br ${service.color || 'from-blue-500 to-cyan-500'} shrink-0 flex items-center justify-center`}>
                                        <Icon className="text-white opacity-80" size={32} />
                                    </div>

                                    <div className="flex-1 p-5 flex flex-col justify-center min-w-0">
                                        <div className="flex justify-between items-start mb-2 gap-4">
                                            <div>
                                                <h3 className="font-bold text-xl text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {getLocalizedField(service.title, 'en')}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                                        {service.category}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-400">
                                                        {getLocalizedField(service.price, 'en')}
                                                    </span>
                                                </div>
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
                        );
                    })}

                    {services.length === 0 && (
                        <div className="col-span-full py-16 text-center glass-panel border-dashed border-2 border-slate-300 dark:border-slate-700">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                                <Briefcase size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Services Found</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                                Start offering value to your clients by creating your first service package.
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={handleSeedData}
                                    className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
                                >
                                    Seed Defaults
                                </button>
                                <button
                                    onClick={() => openEdit()}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 font-medium"
                                >
                                    Create Service
                                </button>
                            </div>
                        </div>
                    )}
                </Reorder.Group>
            )}
            <StatusModal />
        </AdminPageLayout>
    );
};

export default AdminServices;
