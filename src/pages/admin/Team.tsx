import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { TEAM_MEMBERS } from '../../../constants';
import { Plus, Edit2, Trash2, Save, X, Database, ArrowLeft, User, Linkedin, Twitter, Github, Mail, Trophy, Star } from 'lucide-react';
import { LanguageTabs, LocalizedInput, LocalizedArrayInput } from '../../components/admin/LocalizedFormFields';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { SupportedLanguage, ensureLocalizedFormat, getLocalizedField } from '../../utils/localization';

const AdminTeam = () => {
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMember, setCurrentMember] = useState<any>(null);
    const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('en');

    const fetchTeam = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'team_members'));
            const teamData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
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

    const handleSeedData = async () => {
        if (!window.confirm("This will add all team members from constants.ts to Firestore with multi-language structure. Continue?")) return;
        setLoading(true);
        try {
            for (const member of TEAM_MEMBERS) {
                const multiLangMember = {
                    name: member.name,
                    slug: member.slug,
                    image: member.image,
                    social: member.social || {},
                    role: { en: member.role },
                    description: { en: member.description },
                    bio: { en: member.bio || '' },
                    achievements: (member.achievements || []).map((a: string) => ({ en: a })),
                    specialties: (member.specialties || []).map((s: string) => ({ en: s })),
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                };
                await addDoc(collection(db, 'team_members'), multiLangMember);
            }
            await fetchTeam();
            alert("Data seeded successfully!");
        } catch (error) {
            console.error("Error seeding data:", error);
            alert("Failed to seed data.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this member?")) return;
        try {
            await deleteDoc(doc(db, 'team_members', id));
            setTeam(team.filter(t => t.id !== id));
        } catch (error) {
            console.error("Error deleting member:", error);
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
            } else {
                memberData.createdAt = serverTimestamp();
                await addDoc(collection(db, 'team_members'), memberData);
            }
            setIsEditing(false);
            fetchTeam();
        } catch (error) {
            console.error("Error saving member:", error);
            alert("Failed to save member.");
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

    const updateSocial = (platform: string, value: string) => {
        setCurrentMember({
            ...currentMember,
            social: { ...currentMember.social, [platform]: value }
        });
    };

    if (loading && !isEditing) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading team...</div>;

    return (
        <AdminPageLayout
            title="Team Members"
            description="Manage your team profiles and roles"
            actions={
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
                                {currentMember.id ? 'Edit Member' : 'New Member'}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {team.map((member) => (
                        <div key={member.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col items-center hover:shadow-md transition-all group">
                            <div className="relative w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600">
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEdit(member)}
                                        className="p-1.5 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded text-white"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member.id)}
                                        className="p-1.5 bg-white/20 hover:bg-red-500/80 backdrop-blur-md rounded text-white"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="px-6 pb-6 flex flex-col items-center -mt-12 w-full">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-white dark:bg-slate-800 p-1 mb-3 shadow-md relative z-10">
                                    {member.image ? (
                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400">
                                            <User size={32} />
                                        </div>
                                    )}
                                </div>

                                <h3 className="font-bold text-lg text-slate-900 dark:text-white text-center">
                                    {member.name}
                                </h3>
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-3 text-center">
                                    {getLocalizedField(member.role, 'en')}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 text-center line-clamp-2 mb-4">
                                    {getLocalizedField(member.description, 'en')}
                                </p>

                                <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-center gap-4">
                                    {member.social?.linkedin && <Linkedin size={16} className="text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />}
                                    {member.social?.twitter && <Twitter size={16} className="text-slate-400 hover:text-blue-400 cursor-pointer transition-colors" />}
                                    {member.social?.github && <Github size={16} className="text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors" />}
                                    {member.social?.email && <Mail size={16} className="text-slate-400 hover:text-red-500 cursor-pointer transition-colors" />}
                                </div>
                            </div>
                        </div>
                    ))}

                    {team.length === 0 && (
                        <div className="col-span-full py-16 text-center">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                                <User size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Team Members</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                                Add your team members to showcase the talent behind your brand.
                            </p>
                            <button
                                onClick={() => openEdit()}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 font-medium"
                            >
                                Add Team Member
                            </button>
                        </div>
                    )}
                </div>
            )}
        </AdminPageLayout>
    );
};

export default AdminTeam;
