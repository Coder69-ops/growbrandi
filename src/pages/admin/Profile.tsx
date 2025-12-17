import React, { useState, useEffect } from 'react';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc, setDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { Save, User, Briefcase, FileText, Linkedin, Twitter, Globe, Github } from 'lucide-react';
import { getLocalizedField } from '../../utils/localization';

const Profile = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        bio: '',
        image: '',
        linkedin: '',
        twitter: '',
        github: '',
        website: ''
    });

    useEffect(() => {
        if (currentUser) {
            const user = currentUser as any;

            // Populate form with current user data (which comes enriched from AuthContext)
            setFormData({
                name: user.displayName || '',
                role: user.jobTitle || user.role || '', // jobTitle is what we mapped team role to
                bio: '', // Need to fetch bio specifically if not in auth context
                image: user.photoURL || '',
                linkedin: '',
                twitter: '',
                github: '',
                website: ''
            });

            // Fetch deeper details from team_member doc if we have the ID
            if (user.teamId) {
                const fetchTeamDoc = async () => {
                    try {
                        const docRef = doc(db, 'team_members', user.teamId);
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            const data = docSnap.data();
                            setFormData(prev => ({
                                ...prev,
                                bio: getLocalizedField(data.description, 'en') || '',
                                linkedin: data.social?.linkedin || '',
                                twitter: data.social?.twitter || '',
                                github: data.social?.github || '',
                                website: data.social?.website || ''
                            }));
                        }
                    } catch (err) {
                        console.error("Error fetching team details:", err);
                    }
                };
                fetchTeamDoc();
            }
        }
    }, [currentUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const user = currentUser as any;
            if (!user) throw new Error("Not authenticated");

            // Data to save
            const socialLinks = {
                linkedin: formData.linkedin,
                twitter: formData.twitter,
                github: formData.github,
                website: formData.website,
                email: user.email // Ensure email stays linked
            };

            const updateData = {
                name: formData.name,
                image: formData.image,
                role: { en: formData.role }, // Store as localized object
                description: { en: formData.bio },
                social: socialLinks,
                updatedAt: serverTimestamp()
            };

            if (user.teamId) {
                // Update existing team member
                const docRef = doc(db, 'team_members', user.teamId);
                await updateDoc(docRef, updateData as any);
                setSuccess('Profile updated successfully! Changes will reflect shortly.');
            } else {
                // Create NEW team member if one doesn't exist (rare edge case now)
                await addDoc(collection(db, 'team_members'), {
                    ...updateData,
                    createdAt: serverTimestamp(),
                    order: 99 // Put at end
                });
                setSuccess('Profile created successfully! Please refresh to link it.');
            }

            // Ideally, we should also update the 'users' collection for redundancy
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                displayName: formData.name,
                photoURL: formData.image,
                jobTitle: formData.role,
                updatedAt: serverTimestamp()
            }, { merge: true });

            // Force reload validation or just wait for AuthContext to sync on refresh
            // We can't easily force AuthContext refresh without a page reload or complex logic

        } catch (err: any) {
            console.error("Error saving profile:", err);
            setError(err.message || "Failed to save profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminPageLayout
            title="My Profile"
            description="Manage your personal information and public profile"
        >
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">

                    {/* Header / Image Section */}
                    <div className="glass-panel p-8 rounded-3xl flex flex-col md:flex-row gap-8 items-start">
                        <div className="shrink-0">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Profile Photo</label>
                            <ImageUpload
                                label="Profile Photo"
                                value={formData.image}
                                onChange={(url) => setFormData({ ...formData, image: url })}
                                className="w-32 h-32 rounded-full"
                            />
                        </div>
                        <div className="flex-1 space-y-4 w-full">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Display Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Role / Job Title
                                </label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="e.g. Head of Development"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="glass-panel p-8 rounded-3xl">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <FileText className="text-blue-500" size={24} />
                            About Me
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Bio / Short Description
                            </label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={4}
                                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                placeholder="Tell us a bit about yourself..."
                            />
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="glass-panel p-8 rounded-3xl">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Globe className="text-purple-500" size={24} />
                            Social Links
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">LinkedIn URL</label>
                                <div className="relative">
                                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="url"
                                        value={formData.linkedin}
                                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Twitter URL</label>
                                <div className="relative">
                                    <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="url"
                                        value={formData.twitter}
                                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="https://twitter.com/..."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GitHub URL</label>
                                <div className="relative">
                                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="url"
                                        value={formData.github}
                                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Personal Website</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                            {success}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Save size={20} />
                            {loading ? 'Saving Changes...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminPageLayout>
    );
};

export default Profile;
