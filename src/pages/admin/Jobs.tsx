import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Edit2, Trash2, Save, ArrowLeft, Briefcase, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { LanguageTabs, LocalizedInput, LocalizedTextArea, LocalizedArrayInput } from '../../components/admin/LocalizedFormFields';
import { useAutoTranslate } from '../../hooks/useAutoTranslate';
import { Sparkles } from 'lucide-react';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { useStatusModal } from '../../hooks/useStatusModal';
import { SupportedLanguage, ensureLocalizedFormat, getLocalizedField } from '../../utils/localization';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Sales', 'Product', 'Operations'];

const AdminJobs = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentJob, setCurrentJob] = useState<any>(null);
    const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('en');

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'jobs'));
            const jobsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
            setJobs(jobsData);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const { showSuccess, showError, StatusModal } = useStatusModal();

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this job opening?")) return;
        try {
            await deleteDoc(doc(db, 'jobs', id));
            showSuccess('Job Deleted', 'The job opening has been permanently deleted.');
            setJobs(jobs.filter(j => j.id !== id));
        } catch (error) {
            console.error("Error deleting job:", error);
            showError('Delete Failed', 'There was an error deleting the job. Please try again.');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const jobData = {
                ...currentJob,
                updatedAt: serverTimestamp(),
            };

            if (currentJob.id) {
                const { id, ...data } = jobData;
                await updateDoc(doc(db, 'jobs', id), data);
                showSuccess('Job Updated', 'The job opening has been successfully updated.');
            } else {
                jobData.createdAt = serverTimestamp();
                await addDoc(collection(db, 'jobs'), jobData);
                showSuccess('Job Created', 'New job opening has been successfully created.');
            }
            await fetchJobs();
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving job:", error);
            showError('Save Failed', 'There was an error saving the job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const openEdit = (job: any = {}) => {
        setCurrentJob({
            department: job.department || DEPARTMENTS[0],
            type: job.type || JOB_TYPES[0],
            location: job.location || 'Remote',
            applyUrl: job.applyUrl || '',
            title: ensureLocalizedFormat(job.title),
            description: ensureLocalizedFormat(job.description),
            requirements: (job.requirements || []).map((r: any) => ensureLocalizedFormat(r)),
            ...job,
        });
        setActiveLanguage('en');
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setCurrentJob({ ...currentJob, [field]: value });
    };

    const { isTranslating, handleAutoTranslate } = useAutoTranslate(
        currentJob,
        setCurrentJob,
        {
            fields: ['title', 'description'],
            arrayFields: ['requirements']
        }
    );

    return (
        <AdminPageLayout
            title="Careers & Jobs"
            description="Manage open positions and opportunities"
            actions={
                !loading && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => openEdit()}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95"
                        >
                            <Plus size={20} />
                            Add Job
                        </button>
                    </div>
                )
            }
        >
            {loading && !isEditing ? (
                <AdminLoader message="Loading jobs..." />
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
                                {currentJob.id ? 'Edit Job' : 'New Job'}
                            </h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleAutoTranslate}
                                disabled={isTranslating}
                                className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Briefcase size={18} className="text-blue-500" />
                                        Job Details
                                    </h3>

                                    <LocalizedInput
                                        label="Job Title"
                                        value={currentJob.title}
                                        onChange={(v) => updateField('title', v)}
                                        activeLanguage={activeLanguage}
                                        required
                                    />

                                    <LocalizedTextArea
                                        label="Description"
                                        value={currentJob.description}
                                        onChange={(v) => updateField('description', v)}
                                        activeLanguage={activeLanguage}
                                        rows={4}
                                    />

                                    <LocalizedArrayInput
                                        label="Requirements (Bullet Points)"
                                        value={currentJob.requirements}
                                        onChange={(v) => updateField('requirements', v)}
                                        activeLanguage={activeLanguage}
                                    />
                                </div>
                            </div>

                            {/* Sidebar Options */}
                            <div className="space-y-6">
                                <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <CheckCircle2 size={18} className="text-emerald-500" />
                                        Configuration
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Department</label>
                                        <select
                                            value={currentJob.department}
                                            onChange={(e) => updateField('department', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            {DEPARTMENTS.map(dept => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Job Type</label>
                                        <select
                                            value={currentJob.type}
                                            onChange={(e) => updateField('type', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            {JOB_TYPES.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location</label>
                                        <input
                                            type="text"
                                            value={currentJob.location}
                                            onChange={(e) => updateField('location', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                            placeholder="Remote, NY, London..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Application URL (Optional)</label>
                                        <input
                                            type="text"
                                            value={currentJob.applyUrl}
                                            onChange={(e) => updateField('applyUrl', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {jobs.length === 0 ? (
                        <div className="py-16 text-center text-slate-500 dark:text-slate-400 glass-panel border-dashed border-2 border-slate-300 dark:border-slate-700">
                            <div className="w-20 h-20 mx-auto bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                                <Briefcase size={40} className="opacity-50" />
                            </div>
                            <p className="font-bold text-xl text-slate-900 dark:text-white">No jobs found</p>
                            <p className="text-sm mt-2 mb-6 max-w-sm mx-auto">Add a new job opening to start recruiting.</p>
                            <button
                                onClick={() => openEdit()}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 font-medium"
                            >
                                Create Job
                            </button>
                        </div>
                    ) : (
                        jobs.map((job) => (
                            <div key={job.id} className="glass-card p-6 hover:scale-[1.01] transition-all duration-300 group flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md">
                                            {job.department}
                                        </span>
                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                            <MapPin size={10} />
                                            {job.location}
                                        </span>
                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                            <Clock size={10} />
                                            {job.type}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                                        {getLocalizedField(job.title, 'en')}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 max-w-xl">
                                        {getLocalizedField(job.description, 'en')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button
                                        onClick={() => openEdit(job)}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(job.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
            <StatusModal />
        </AdminPageLayout>
    );
};

export default AdminJobs;
