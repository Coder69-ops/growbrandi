import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { addDoc, updateDoc, deleteDoc } from '../../lib/firestore-audit';
// import { TEAM_MEMBERS } from '../../../constants'; // Removed
import { Plus, Edit2, Trash2, Save, X, Database, ArrowLeft, User, Linkedin, Twitter, Github, Mail, Trophy, Star } from 'lucide-react';
import { LanguageTabs, LocalizedInput, LocalizedArrayInput } from '../../components/admin/LocalizedFormFields';
import { useAutoTranslate } from '../../hooks/useAutoTranslate';
import { Sparkles } from 'lucide-react';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { SupportedLanguage, ensureLocalizedFormat, getLocalizedField } from '../../utils/localization';
import { Reorder } from 'framer-motion';
import { useStatusModal } from '../../hooks/useStatusModal';
import { SortableItem } from '../../components/admin/SortableItem';
// import { logAction } from '../../services/auditService'; // Removed
import { useOnlineUsers } from '../../hooks/usePresence';

const AdminTeam = () => {
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMember, setCurrentMember] = useState<any>(null);
    const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('en');
    const { onlineUsers } = useOnlineUsers();

    const fetchTeam = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'team_members'));
            const teamData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
            setTeam(teamData);
        } catch (error) {
            console.error("Error fetching team:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    const handleReorder = async (newOrder: any[]) => {
        setTeam(newOrder); // Optimistic update

        const batch = writeBatch(db);
        newOrder.forEach((member, index) => {
            const docRef = doc(db, 'team_members', member.id);
            batch.update(docRef, { order: index + 1 });
        });

        try {
            await batch.commit();
        } catch (error) {
            console.error("Error updating order:", error);
            fetchTeam(); // Revert on error
        }
    };

    const { showSuccess, showError, StatusModal } = useStatusModal();

    const handleSeedData = async () => {
        alert("Seeding from static constants is no longer supported.");
        // if (!window.confirm("This will add all team members from constants.ts to Firestore with multi-language structure. Continue?")) return;
        // setLoading(true);
        // try {
        //     let index = 1;
        //     for (const member of TEAM_MEMBERS) {
        //         const multiLangMember = {
        //             name: member.name,
        //             slug: member.slug,
        //             order: index++,
        //             image: member.image,
        //             social: member.social || {},
        //             role: { en: member.role },
        //             description: { en: member.description },
        //             bio: { en: member.bio || '' },
        //             achievements: (member.achievements || []).map((a: string) => ({ en: a })),
        //             specialties: (member.specialties || []).map((s: string) => ({ en: s })),
        //             createdAt: serverTimestamp(),
        //             updatedAt: serverTimestamp(),
        //         };
        //         await addDoc(collection(db, 'team_members'), multiLangMember);
        //     }
        //     await fetchTeam();
        //     showSuccess('Data Seeded', 'Team members seeded successfully!');
        // } catch (error) {
        //     console.error("Error seeding data:", error);
        //     showError('Seeding Failed', 'Failed to seed data. Please check the console for details.');
        // } finally {
        //     setLoading(false);
        // }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this member?")) return;
        try {
            await deleteDoc(doc(db, 'team_members', id));
            await deleteDoc(doc(db, 'team_members', id));
            // await logAction('delete', 'team', `Deleted team member: ${id}`, { memberId: id });
            showSuccess('Member Deleted', 'The team member has been successfully removed.');
            setTeam(team.filter(t => t.id !== id));
        } catch (error) {
            console.error("Error deleting member:", error);
            showError('Delete Failed', 'There was an error deleting the team member.');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const memberData = {
                ...currentMember,
                slug: currentMember.name.toLowerCase().replace(/\s+/g, '-'),
                updatedAt: serverTimestamp(),
            };

            if (currentMember.id) {
                const { id, ...data } = memberData;
                await updateDoc(doc(db, 'team_members', id), data);
                await updateDoc(doc(db, 'team_members', id), data);
                // await logAction('update', 'team', `Updated team member: ${data.name}`, { memberId: id });
            } else {
                memberData.createdAt = serverTimestamp();
                memberData.order = team.length + 1; // Add order
                const docRef = await addDoc(collection(db, 'team_members'), memberData);
                // await logAction('create', 'team', `Created team member: ${memberData.name}`, { memberId: docRef.id });
            }
            await fetchTeam();
            setIsEditing(false);
            showSuccess('Member Saved', 'Team member details have been successfully saved.');
        } catch (error) {
            console.error("Error saving member:", error);
            showError('Save Failed', 'There was an error saving the team member.');
        } finally {
            setLoading(false);
        }
    };

    const openEdit = (member: any = {}) => {
        setCurrentMember({
            name: member.name || '',
            image: member.image || '',
            social: member.social || { linkedin: '', twitter: '', github: '', email: '' },
            role: ensureLocalizedFormat(member.role),
            description: ensureLocalizedFormat(member.description),
            bio: ensureLocalizedFormat(member.bio),
            achievements: (member.achievements || []).map((a: any) => ensureLocalizedFormat(a)),
            specialties: (member.specialties || []).map((s: any) => ensureLocalizedFormat(s)),
            ...member,
        });
        setActiveLanguage('en');
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setCurrentMember({ ...currentMember, [field]: value });
    };

    const { isTranslating, handleAutoTranslate } = useAutoTranslate(
        currentMember,
        setCurrentMember,
        {
            fields: ['role', 'description', 'bio'],
            arrayFields: ['achievements', 'specialties']
        }
    );

    const updateSocial = (platform: string, value: string) => {
        setCurrentMember({
            ...currentMember,
            social: { ...currentMember.social, [platform]: value }
        });
    };

    return (
        <AdminPageLayout
            title="Team & Crew"
            description="Manage your team members"
            actions={
                !loading && (
                    <div className="flex gap-3">
                        {team.length === 0 && (
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
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
                        >
                            <Plus size={20} /> Add Member
                        </button>
                    </div>
                )
            }
        >
            {loading && !isEditing ? (
                <AdminLoader message="Loading team..." />
            ) : isEditing ? (
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
                                {currentMember.id ? 'Edit Member' : 'New Member'}
                            </h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleAutoTranslate}
                                disabled={isTranslating}
                                className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20 mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Auto-translate English text to all other languages"
                            >
                                <Sparkles size={18} className={isTranslating ? "animate-spin" : ""} />
                                {isTranslating ? 'Translating...' : 'Auto Translate'}
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                                disabled={loading}
                            >
                                <Save size={18} /> Save Member
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
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <User size={18} />
                                        Profile Details
                                    </h3>

                                    <LocalizedInput
                                        label="Title / Role"
                                        value={currentMember.role}
                                        onChange={(v) => updateField('role', v)}
                                        activeLanguage={activeLanguage}
                                        required
                                        placeholder="e.g., Senior Developer"
                                    />

                                    <LocalizedInput
                                        label="Short Description"
                                        value={currentMember.description}
                                        onChange={(v) => updateField('description', v)}
                                        activeLanguage={activeLanguage}
                                        type="textarea"
                                        rows={2}
                                    />

                                    <LocalizedInput
                                        label="Full Bio"
                                        value={currentMember.bio}
                                        onChange={(v) => updateField('bio', v)}
                                        activeLanguage={activeLanguage}
                                        type="textarea"
                                        rows={4}
                                    />
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Star size={18} />
                                        Skills & Achievements
                                    </h3>

                                    <LocalizedArrayInput
                                        label="Achievements"
                                        value={currentMember.achievements}
                                        onChange={(v) => updateField('achievements', v)}
                                        activeLanguage={activeLanguage}
                                        placeholder="Add achievement..."
                                    />

                                    <LocalizedArrayInput
                                        label="Specialties"
                                        value={currentMember.specialties}
                                        onChange={(v) => updateField('specialties', v)}
                                        activeLanguage={activeLanguage}
                                        placeholder="Add skill..."
                                    />
                                </div>
                            </div>

                            {/* Sidebar Settings */}
                            <div className="space-y-6">
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <User size={18} />
                                        Basic Info
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Full Name *</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            value={currentMember.name}
                                            onChange={(e) => updateField('name', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <ImageUpload
                                        label="Profile Photo"
                                        value={currentMember.image}
                                        onChange={(v) => updateField('image', v)}
                                        folder="team"
                                    />
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800/50 space-y-4">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Mail size={18} />
                                        Contact & Social
                                    </h3>

                                    <div className="relative">
                                        <Linkedin className="absolute left-3 top-3 text-slate-400" size={16} />
                                        <input
                                            type="url"
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                            value={currentMember.social?.linkedin || ''}
                                            onChange={(e) => updateSocial('linkedin', e.target.value)}
                                            placeholder="LinkedIn Profile URL"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Twitter className="absolute left-3 top-3 text-slate-400" size={16} />
                                        <input
                                            type="url"
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                            value={currentMember.social?.twitter || ''}
                                            onChange={(e) => updateSocial('twitter', e.target.value)}
                                            placeholder="Twitter Profile URL"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Github className="absolute left-3 top-3 text-slate-400" size={16} />
                                        <input
                                            type="url"
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                            value={currentMember.social?.github || ''}
                                            onChange={(e) => updateSocial('github', e.target.value)}
                                            placeholder="GitHub Profile URL"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                                        <input
                                            type="email"
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                            value={currentMember.social?.email || ''}
                                            onChange={(e) => updateSocial('email', e.target.value)}
                                            placeholder="Email Address"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <Reorder.Group axis="y" values={team} onReorder={handleReorder} className="flex flex-col gap-4">
                    {team.map((member) => (
                        <SortableItem key={member.id} item={member}>
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col sm:flex-row h-full sm:h-32 hover:border-blue-500/30 transition-all pl-8 group">

                                {/* Image Section */}
                                <div className="w-full sm:w-32 h-32 sm:h-full bg-slate-100 dark:bg-slate-900 shrink-0 relative">
                                    {member.image ? (
                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <User size={32} />
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
                                    <div className="flex justify-between items-start mb-1 gap-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">
                                                {member.name}
                                            </h3>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 truncate block">
                                                {getLocalizedField(member.role, 'en')}
                                            </span>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            <button
                                                onClick={() => openEdit(member)}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(member.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                                        {getLocalizedField(member.description, 'en')}
                                    </p>

                                    {/* Online Status Indicator */}
                                    <div className="flex items-center gap-2 mb-2">
                                        {onlineUsers.some(u => u.email === member.social?.email) ? (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                </span>
                                                Online
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-medium">
                                                <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                                                Offline
                                            </span>
                                        )}
                                    </div>

                                    {/* Social Icons Mini */}
                                    <div className="flex gap-3 mt-auto opacity-60">
                                        {member.social?.linkedin && <Linkedin size={14} className="text-slate-500" />}
                                        {member.social?.twitter && <Twitter size={14} className="text-slate-500" />}
                                        {member.social?.github && <Github size={14} className="text-slate-500" />}
                                        {member.social?.email && <Mail size={14} className="text-slate-500" />}
                                    </div>
                                </div>
                            </div>
                        </SortableItem>
                    ))}

                    {team.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <User size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="font-medium text-lg">No team members found</p>
                            <p className="text-sm mt-1">Add your first team member.</p>
                            <button
                                onClick={() => openEdit()}
                                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Add Member
                            </button>
                        </div>
                    )}
                </Reorder.Group>
            )}
            <StatusModal />
        </AdminPageLayout >
    );
};

export default AdminTeam;
