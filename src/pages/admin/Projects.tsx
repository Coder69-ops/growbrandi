import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { PROJECTS } from '../../../constants';
import { Plus, Edit2, Trash2, Save, X, ChevronDown, CheckCircle2, TrendingUp, Settings, Image, FolderKanban, ArrowLeft, FileText } from 'lucide-react';
import { LanguageTabs, LocalizedInput, LocalizedArrayInput } from '../../components/admin/LocalizedFormFields';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { SupportedLanguage, createEmptyLocalizedString, ensureLocalizedFormat, getLocalizedField } from '../../utils/localization';

const CATEGORIES = [
    { id: 'web_shopify_dev', label: 'Web & Shopify Dev' },
    { id: 'ecommerce_management', label: 'E-commerce Management' },
    { id: 'social_media_management', label: 'Social Media Management' },
    { id: 'performance_marketing', label: 'Performance Marketing' },
    { id: 'creative_studio', label: 'Creative Studio' },
    { id: 'ui_ux_design_full', label: 'UI/UX Design' },
];

const AdminProjects = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState<any>(null);
    const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('en');

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'projects'));
            const projectsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjects(projectsData);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);



    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            await deleteDoc(doc(db, 'projects', id));
            setProjects(projects.filter(p => p.id !== id));
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const projectData = {
                ...currentProject,
                updatedAt: serverTimestamp(),
            };

            if (currentProject.id) {
                const { id, ...data } = projectData;
                await updateDoc(doc(db, 'projects', id), data);
            } else {
                projectData.createdAt = serverTimestamp();
                await addDoc(collection(db, 'projects'), projectData);
            }
            setIsEditing(false);
            fetchProjects();
        } catch (error) {
            console.error("Error saving project:", error);
            alert("Failed to save project.");
        } finally {
            setLoading(false);
        }
    };

    const openEdit = (project: any = {}) => {
        setCurrentProject({
            imageUrl: project.imageUrl || '',
            beforeImage: project.beforeImage || '',
            afterImage: project.afterImage || '',
            rating: project.rating || 5,
            category: project.category || CATEGORIES[0].id,
            technologies: project.technologies || [],
            title: ensureLocalizedFormat(project.title),
            description: ensureLocalizedFormat(project.description),
            client: ensureLocalizedFormat(project.client),
            completionTime: ensureLocalizedFormat(project.completionTime),
            growthMetrics: ensureLocalizedFormat(project.growthMetrics),
            results: (project.results || []).map((r: any) => ensureLocalizedFormat(r)),
            ...project,
        });
        setActiveLanguage('en');
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setCurrentProject({ ...currentProject, [field]: value });
    };

    if (loading && !isEditing) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading projects...</div>;

    return (
        <AdminPageLayout
            title="Projects"
            description="Manage your portfolio showcase items"
            actions={
                <div className="flex gap-3">

                    <button
                        onClick={() => openEdit()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
                    >
                        <Plus size={20} />
                        Add Project
                    </button>
                </div>
            }
        >
            {isEditing ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={20} className="text-slate-500" />
                            </button>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {currentProject.id ? 'Edit Project' : 'New Project'}
                            </h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                            >
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </div>

                    <div className="mb-8">
                        <LanguageTabs activeLanguage={activeLanguage} onChange={setActiveLanguage} />
                    </div>

                    <form onSubmit={handleSave} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Info */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <FileText size={18} />
                                        Basic Information
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <LocalizedInput
                                            label="Project Title"
                                            value={currentProject.title}
                                            onChange={(v) => updateField('title', v)}
                                            activeLanguage={activeLanguage}
                                            required
                                        />
                                        <LocalizedInput
                                            label="Client Name"
                                            value={currentProject.client}
                                            onChange={(v) => updateField('client', v)}
                                            activeLanguage={activeLanguage}
                                        />
                                    </div>

                                    <LocalizedInput
                                        label="Description"
                                        value={currentProject.description}
                                        onChange={(v) => updateField('description', v)}
                                        activeLanguage={activeLanguage}
                                        type="textarea"
                                        rows={4}
                                    />
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <TrendingUp size={18} />
                                        Performance & Results
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <LocalizedInput
                                            label="Completion Time"
                                            value={currentProject.completionTime}
                                            onChange={(v) => updateField('completionTime', v)}
                                            activeLanguage={activeLanguage}
                                            placeholder="e.g. 4 weeks"
                                        />
                                        <LocalizedInput
                                            label="Growth Metrics"
                                            value={currentProject.growthMetrics}
                                            onChange={(v) => updateField('growthMetrics', v)}
                                            activeLanguage={activeLanguage}
                                            placeholder="e.g. +150% Traffic"
                                        />
                                    </div>

                                    <LocalizedArrayInput
                                        label="Key Results (Bullet Points)"
                                        value={currentProject.results}
                                        onChange={(v) => updateField('results', v)}
                                        activeLanguage={activeLanguage}
                                    />
                                </div>
                            </div>

                            {/* Sidebar Options */}
                            <div className="space-y-6">
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Settings size={18} />
                                        Project Settings
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                                        <select
                                            value={currentProject.category}
                                            onChange={(e) => updateField('category', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            {CATEGORIES.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rating</label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="range"
                                                min="1"
                                                max="5"
                                                step="0.1"
                                                value={currentProject.rating}
                                                onChange={(e) => updateField('rating', parseFloat(e.target.value))}
                                                className="flex-1"
                                            />
                                            <span className="font-bold text-lg text-slate-900 dark:text-white">{currentProject.rating}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Technologies (Comma separated)</label>
                                        <input
                                            type="text"
                                            value={currentProject.technologies.join(', ')}
                                            onChange={(e) => updateField('technologies', e.target.value.split(',').map(t => t.trim()))}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="React, Node.js, Firebase..."
                                        />
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Image size={18} />
                                        Media
                                    </h3>

                                    <ImageUpload
                                        label="Main Image"
                                        value={currentProject.imageUrl}
                                        onChange={(url) => updateField('imageUrl', url)}
                                        folder={`projects/${currentProject.id || 'new'}`}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <ImageUpload
                                            label="Before (Optional)"
                                            value={currentProject.beforeImage}
                                            onChange={(url) => updateField('beforeImage', url)}
                                            folder={`projects/${currentProject.id || 'new'}/before`}
                                        />
                                        <ImageUpload
                                            label="After (Optional)"
                                            value={currentProject.afterImage}
                                            onChange={(url) => updateField('afterImage', url)}
                                            folder={`projects/${currentProject.id || 'new'}/after`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md hover:border-blue-500/30 transition-all group">
                            <div className="relative h-48 bg-slate-100 dark:bg-slate-900">
                                {project.imageUrl ? (
                                    <img src={project.imageUrl} alt={getLocalizedField(project.title, 'en')} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <FolderKanban size={48} />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEdit(project)}
                                        className="p-2 bg-white/90 backdrop-blur-sm text-blue-600 rounded-lg hover:bg-white shadow-sm"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="p-2 bg-white/90 backdrop-blur-sm text-red-600 rounded-lg hover:bg-white shadow-sm"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                            {CATEGORIES.find(c => c.id === project.category)?.label || project.category}
                                        </span>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-1 line-clamp-1">
                                            {getLocalizedField(project.title, 'en')}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-bold bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md">
                                        ★ {project.rating}
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                                    {getLocalizedField(project.description, 'en')}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies?.slice(0, 3).map((tech: string) => (
                                        <span key={tech} className="text-xs px-2 py-1 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                                            {tech}
                                        </span>
                                    ))}
                                    {project.technologies?.length > 3 && (
                                        <span className="text-xs px-2 py-1 rounded text-slate-400">+{project.technologies.length - 3}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {projects.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <FolderKanban size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="font-medium text-lg">No projects found</p>
                            <p className="text-sm mt-1">Get started by adding your first project.</p>
                            <button
                                onClick={() => openEdit()}
                                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create Project
                            </button>
                        </div>
                    )}
                </div>
            )}
        </AdminPageLayout>
    );
};



export default AdminProjects;
