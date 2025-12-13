import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { addDoc, updateDoc, deleteDoc } from '../../lib/firestore-audit';
// import { PROJECTS } from '../../../constants'; // Removed
import { Plus, Edit2, Trash2, Save, X, ChevronDown, CheckCircle2, TrendingUp, Settings, Image, FolderKanban, ArrowLeft, FileText } from 'lucide-react';
import { LanguageTabs, LocalizedInput, LocalizedArrayInput, LocalizedTextArea } from '../../components/admin/LocalizedFormFields';
import { useAutoTranslate } from '../../hooks/useAutoTranslate';
import { Sparkles } from 'lucide-react';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { useStatusModal } from '../../hooks/useStatusModal';
import { useToast } from '../../context/ToastContext';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { SupportedLanguage, createEmptyLocalizedString, ensureLocalizedFormat, getLocalizedField } from '../../utils/localization';
import { Reorder } from 'framer-motion';
import { SortableItem } from '../../components/admin/SortableItem';
// import { logAction } from '../../services/auditService'; // Removed

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
            })).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
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

    const { showSuccess, showError, StatusModal } = useStatusModal();
    const { showConfirm } = useToast();

    const handleDelete = async (id: string) => {
        showConfirm("Are you sure you want to delete this project?", async () => {
            try {
                await deleteDoc(doc(db, 'projects', id));
                await deleteDoc(doc(db, 'projects', id));
                // await logAction('delete', 'projects', `Deleted project: ${id}`, { projectId: id });
                showSuccess('Project Deleted', 'The project has been permanently deleted.');
                setProjects(projects.filter(p => p.id !== id));
            } catch (error) {
                console.error("Error deleting project:", error);
                showError('Delete Failed', 'There was an error deleting the project. Please try again.');
            }
        });
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
                await updateDoc(doc(db, 'projects', id), data);
                // await logAction('update', 'projects', `Updated project: ${data.title?.en || 'Untitled'}`, { projectId: id });
                showSuccess('Project Updated', 'The project has been successfully updated.');
            } else {
                projectData.createdAt = serverTimestamp();
                // Add order for new project (last)
                projectData.order = projects.length + 1;
                const docRef = await addDoc(collection(db, 'projects'), projectData);
                // await logAction('create', 'projects', `Created project: ${projectData.title?.en || 'Untitled'}`, { projectId: docRef.id });
                showSuccess('Project Created', 'New project has been successfully created.');
            }
            await fetchProjects();
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving project:", error);
            showError('Save Failed', 'There was an error saving the project. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = async (newOrder: any[]) => {
        setProjects(newOrder); // Optimistic update

        const batch = writeBatch(db);
        newOrder.forEach((project, index) => {
            const docRef = doc(db, 'projects', project.id);
            batch.update(docRef, { order: index + 1 });
        });

        try {
            await batch.commit();
        } catch (error) {
            console.error("Error updating order:", error);
            fetchProjects(); // Revert on error
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
            challenge: ensureLocalizedFormat(project.challenge),
            solution: ensureLocalizedFormat(project.solution),
            results: (project.results || []).map((r: any) => ensureLocalizedFormat(r)),
            ...project,
        });
        setActiveLanguage('en');
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setCurrentProject({ ...currentProject, [field]: value });
    };

    const { isTranslating, handleAutoTranslate } = useAutoTranslate(
        currentProject,
        setCurrentProject,
        {
            fields: ['title', 'description', 'client', 'completionTime', 'growthMetrics', 'challenge', 'solution'],
            arrayFields: ['results']
        }
    );

    return (
        <AdminPageLayout
            title="Projects"
            description="Showcase your best work"
            actions={
                !loading && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => openEdit()}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95"
                        >
                            <Plus size={20} />
                            Add Project
                        </button>
                    </div>
                )
            }
        >
            {loading && !isEditing ? (
                <AdminLoader message="Loading projects..." />
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
                                {currentProject.id ? 'Edit Project' : 'New Project'}
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
                                <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <FileText size={18} className="text-blue-500" />
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

                                    <LocalizedTextArea
                                        label="Description"
                                        value={currentProject.description}
                                        onChange={(v) => updateField('description', v)}
                                        activeLanguage={activeLanguage}
                                        type="textarea"
                                        rows={4}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <LocalizedTextArea
                                            label="The Challenge (Case Study)"
                                            value={currentProject.challenge}
                                            onChange={(v) => updateField('challenge', v)}
                                            activeLanguage={activeLanguage}
                                            rows={4}
                                            placeholder="What problem were we solving?"
                                        />
                                        <LocalizedTextArea
                                            label="The Solution (Case Study)"
                                            value={currentProject.solution}
                                            onChange={(v) => updateField('solution', v)}
                                            activeLanguage={activeLanguage}
                                            rows={4}
                                            placeholder="How did we solve it?"
                                        />
                                    </div>
                                </div>

                                <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <TrendingUp size={18} className="text-emerald-500" />
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
                                <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Settings size={18} className="text-slate-500" />
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
                                                className="flex-1 accent-blue-600"
                                            />
                                            <span className="font-bold text-lg text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">{currentProject.rating}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Technologies</label>
                                        <input
                                            type="text"
                                            value={currentProject.technologies.join(', ')}
                                            onChange={(e) => updateField('technologies', e.target.value.split(',').map(t => t.trim()))}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="React, Node.js, Firebase..."
                                        />
                                    </div>
                                </div>

                                <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Image size={18} className="text-violet-500" />
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
                                            label="Before"
                                            value={currentProject.beforeImage}
                                            onChange={(url) => updateField('beforeImage', url)}
                                            folder={`projects/${currentProject.id || 'new'}/before`}
                                        />
                                        <ImageUpload
                                            label="After"
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
                <Reorder.Group axis="y" values={projects} onReorder={handleReorder} className="flex flex-col gap-4">
                    {projects.map((project) => (
                        <SortableItem key={project.id} item={project}>
                            <div className="glass-card flex flex-col sm:flex-row h-full sm:h-36 overflow-hidden hover:scale-[1.01] transition-all duration-300 group">
                                {/* Drag Handle Area Visual Cue - The handle is in SortableItem, we just make space */}

                                <div className="w-full sm:w-56 h-36 sm:h-full bg-slate-100 dark:bg-slate-900 shrink-0 relative overflow-hidden">
                                    {project.imageUrl ? (
                                        <img
                                            src={project.imageUrl}
                                            alt={getLocalizedField(project.title, 'en')}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-800">
                                            <FolderKanban size={32} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                <div className="flex-1 p-5 flex flex-col justify-center min-w-0">
                                    <div className="flex justify-between items-start mb-2 gap-4">
                                        <div className="min-w-0">
                                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                                                {CATEGORIES.find(c => c.id === project.category)?.label || project.category}
                                            </span>
                                            <h3 className="font-bold text-xl text-slate-900 dark:text-white truncate mt-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {getLocalizedField(project.title, 'en')}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="flex items-center gap-1 text-sm font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-lg border border-amber-100 dark:border-amber-900/30">
                                                <Sparkles size={12} className="fill-current" />
                                                {project.rating}
                                            </div>
                                            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <button
                                                    onClick={() => openEdit(project)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(project.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mb-3">
                                        {getLocalizedField(project.description, 'en')}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {project.technologies?.slice(0, 4).map((tech: string) => (
                                            <span key={tech} className="text-[10px] font-medium px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                                                {tech}
                                            </span>
                                        ))}
                                        {project.technologies?.length > 4 && (
                                            <span className="text-[10px] font-medium px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800/50 text-slate-500">
                                                +{project.technologies.length - 4}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </SortableItem>
                    ))}


                    {projects.length === 0 && (
                        <div className="col-span-full py-16 text-center text-slate-500 dark:text-slate-400 glass-panel border-dashed border-2 border-slate-300 dark:border-slate-700">
                            <div className="w-20 h-20 mx-auto bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                                <FolderKanban size={40} className="opacity-50" />
                            </div>
                            <p className="font-bold text-xl text-slate-900 dark:text-white">No projects found</p>
                            <p className="text-sm mt-2 mb-6 max-w-sm mx-auto">Get started by adding your first project to showcase your work.</p>
                            <button
                                onClick={() => openEdit()}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 font-medium"
                            >
                                Create Project
                            </button>
                        </div>
                    )}
                </Reorder.Group>
            )}
            <StatusModal />
        </AdminPageLayout >
    );
};

export default AdminProjects;
