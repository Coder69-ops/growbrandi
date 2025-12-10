import React, { useState, useEffect } from 'react';
import { db, auth, createTeamMemberAuth } from '../../lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { useStatusModal } from '../../hooks/useStatusModal';
import { Plus, Trash2, Save, X, User, Shield, Check, Mail, Lock, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Defined permissions that can be assigned
const AVAILABLE_PERMISSIONS = [
    { id: 'manage_content', label: 'Manage Content (Projects, Services, etc.)' },
    { id: 'manage_team_profiles', label: 'Manage Public Team Profiles' },
    { id: 'manage_users', label: 'Manage Admin Users' }, // Vital: self-referential
    { id: 'manage_settings', label: 'Manage Settings' },
    { id: 'view_messages', label: 'View Messages' },
];

const AdminTeamManagement = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [publicTeam, setPublicTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        id: '', // Empty for new
        email: '',
        password: '', // Only used for new users
        displayName: '',
        role: 'editor', // 'admin' or 'editor'
        permissions: [] as string[],
        teamMemberId: '', // ID from team_members collection if linked
    });

    const { showSuccess, showError, StatusModal } = useStatusModal();

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Users
            const usersSnap = await getDocs(collection(db, 'users'));
            const usersData = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersData);

            // Fetch Public Team
            const teamSnap = await getDocs(collection(db, 'team_members'));
            const teamData = teamSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort by order if available
            teamData.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
            setPublicTeam(teamData);

        } catch (error) {
            console.error("Error fetching data:", error);
            showError("Error", "Failed to load data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setFormData({
            id: '',
            email: '',
            password: '',
            displayName: '',
            role: 'editor',
            permissions: ['manage_content'],
            teamMemberId: '',
        });
        setIsEditing(false);
    };

    const handleEdit = (user: any) => {
        setFormData({
            id: user.id,
            email: user.email,
            password: '', // Don't show existing password
            displayName: user.displayName || '',
            role: user.role || 'editor',
            permissions: user.permissions || [],
            teamMemberId: user.teamMemberId || '',
        });
        setIsEditing(true);
    };

    const handleLinkMember = (member: any) => {
        // Pre-fill form for a public team member
        setFormData({
            id: '',
            email: '', // Let them enter it
            password: '',
            displayName: member.name || '',
            role: 'editor',
            permissions: ['manage_content'],
            teamMemberId: member.id,
        });
        setIsEditing(true);
    };

    const togglePermission = (permId: string) => {
        setFormData(prev => {
            const current = prev.permissions || [];
            if (current.includes(permId)) {
                return { ...prev, permissions: current.filter(p => p !== permId) };
            } else {
                return { ...prev, permissions: [...current, permId] };
            }
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.email.endsWith('@growbrandi.com')) {
            showError("Invalid Email", "Email must belong to @growbrandi.com domain.");
            return;
        }

        setLoading(true);

        try {
            const dataToSave = {
                displayName: formData.displayName,
                role: formData.role,
                permissions: formData.permissions,
                teamMemberId: formData.teamMemberId || null, // Link to public profile
                updatedAt: serverTimestamp(),
            };

            if (formData.id) {
                // UPDATE existing user (Firestore only)
                const userRef = doc(db, 'users', formData.id);
                await updateDoc(userRef, dataToSave);
                showSuccess("Updated", "User permissions updated successfully.");
            } else {
                // CREATE new user
                if (formData.password.length < 6) {
                    showError("Weak Password", "Password must be at least 6 characters.");
                    setLoading(false);
                    return;
                }

                // 1. Create in Firebase Auth (Secondary App)
                const newUser = await createTeamMemberAuth(formData.email, formData.password);

                // 2. Create in Firestore
                await setDoc(doc(db, 'users', newUser.uid), {
                    email: formData.email,
                    ...dataToSave,
                    createdAt: serverTimestamp(),
                });

                showSuccess("Created", "New team member account created successfully.");
            }

            await fetchData();
            resetForm();

        } catch (error: any) {
            console.error("Save error:", error);
            if (error.code === 'auth/email-already-in-use') {
                showError("Error", "This email is already registered.");
            } else {
                showError("Error", "Failed to save user. " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!window.confirm("Are you sure? This only removes their access in Firestore. You may need to disable them in Firebase Console manually as well.")) return;

        try {
            await deleteDoc(doc(db, 'users', userId));
            setUsers(prev => prev.filter(u => u.id !== userId));
            showSuccess("Deleted", "User removed from management list.");
        } catch (error) {
            console.error("Delete error:", error);
            showError("Error", "Failed to remove user.");
        }
    };

    const handlePasswordReset = async (email: string) => {
        if (!window.confirm(`Send password reset email to ${email}?`)) return;
        try {
            await sendPasswordResetEmail(auth, email);
            showSuccess("Sent", "Password reset email sent.");
        } catch (error) {
            console.error("Reset error:", error);
            showError("Error", "Failed to send reset email.");
        }
    };

    // Derived Logic: Split users into "Linked" and "Standalone"
    // Actually, distinct lists:
    // 1. Public Team Members (showing if they have a linked user or not)
    // 2. Standalone Users (admins not linked to any public profile)

    // Helper: Find user for a member
    const getUserForMember = (memberId: string) => users.find(u => u.teamMemberId === memberId);

    // Standalone users are those where teamMemberId is null/undefined OR doesn't match any existing member (orphaned)
    const standaloneUsers = users.filter(u => !u.teamMemberId || !publicTeam.find(m => m.id === u.teamMemberId));


    return (
        <AdminPageLayout
            title="Team & Permissions"
            description="Manage admin access for your team members"
            actions={
                !isEditing && (
                    <button
                        onClick={resetForm}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        <Plus size={18} /> Add Hidden Admin
                    </button>
                )
            }
        >
            <StatusModal />

            {loading && !users.length ? (
                <AdminLoader message="Loading team..." />
            ) : isEditing ? (
                <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {formData.teamMemberId ? <User className="text-blue-600" /> : <Shield className="text-slate-500" />}
                            {formData.id ? 'Edit User Access' : formData.teamMemberId ? 'Enable Admin Access' : 'New Hidden Admin'}
                        </h2>
                        <button onClick={resetForm} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                            <X size={20} className="text-slate-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Summary of linking */}
                        {formData.teamMemberId && (
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-xl flex items-center gap-3 text-sm">
                                <User size={18} />
                                <span>Creating admin login for public profile: <strong>{formData.displayName}</strong></span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            required
                                            disabled={!!formData.id} // Cannot change email of existing user easily
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                                            placeholder="name@growbrandi.com"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Must be an @growbrandi.com address</p>
                                </div>

                                {!formData.id && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Temporary Password</label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-3 text-slate-400" size={18} />
                                            <input
                                                type="password"
                                                required={!formData.id}
                                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Display Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                            placeholder="John Doe"
                                            value={formData.displayName}
                                            onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Shield size={18} /> Access Permissions
                                </h3>

                                <div className="space-y-3">
                                    {AVAILABLE_PERMISSIONS.map((perm) => (
                                        <label key={perm.id} className="flex items-center gap-3 p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.permissions.includes(perm.id)
                                                    ? 'bg-blue-600 border-blue-600 text-white'
                                                    : 'border-slate-300 dark:border-slate-600'
                                                }`}>
                                                {formData.permissions.includes(perm.id) && <Check size={14} />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={formData.permissions.includes(perm.id)}
                                                onChange={() => togglePermission(perm.id)}
                                            />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">{perm.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-70"
                            >
                                {loading ? 'Saving...' : 'Save User Settings'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">

                    {/* Public Team Members Section */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <User size={20} className="text-blue-500" />
                            Public Team Members
                            <span className="ml-2 text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                {publicTeam.length} members
                            </span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {publicTeam.map(member => {
                                const linkedUser = getUserForMember(member.id);
                                return (
                                    <div key={member.id} className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border p-6 flex flex-col group relative overflow-hidden transition-all hover:shadow-md ${linkedUser
                                            ? 'border-blue-200 dark:border-blue-900/30 ring-1 ring-blue-50 dark:ring-blue-900/10'
                                            : 'border-slate-200 dark:border-slate-700'
                                        }`}>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0">
                                                {member.image ? (
                                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-full h-full p-2.5 text-slate-400" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white">{member.name}</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                                                    {typeof member.role === 'object' ? member.role.en : member.role}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                            {linkedUser ? (
                                                <div>
                                                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mb-3 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                                                        <Check size={14} />
                                                        <span className="truncate flex-1">{linkedUser.email}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(linkedUser)}
                                                            className="flex-1 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 transition-colors"
                                                        >
                                                            Manage Access
                                                        </button>
                                                        <button
                                                            onClick={() => handlePasswordReset(linkedUser.email)}
                                                            className="p-2 text-slate-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                                                            title="Reset Password"
                                                        >
                                                            <Lock size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-3 px-2">
                                                        <Shield size={14} />
                                                        <span>No admin access</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleLinkMember(member)}
                                                        className="w-full py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                                    >
                                                        Enable Admin Access
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>


                    {/* Standalone Admins Section */}
                    {standaloneUsers.length > 0 && (
                        <section>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Shield size={20} className="text-slate-500" />
                                Hidden Admins
                                <span className="ml-2 text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                    {standaloneUsers.length} users
                                </span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {standaloneUsers.map((user) => (
                                    <div key={user.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col group relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-purple-500" />

                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-lg">
                                                    {user.displayName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 dark:text-white">{user.displayName || 'Unnamed User'}</h3>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">Admin Only</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handlePasswordReset(user.email)}
                                                    className="p-1.5 text-slate-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded transition-colors"
                                                >
                                                    <Lock size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                >
                                                    <Shield size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg break-all mb-3">
                                                <Mail size={14} className="shrink-0" />
                                                {user.email}
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {user.permissions?.slice(0, 2).map((perm: string) => (
                                                    <span key={perm} className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                        {AVAILABLE_PERMISSIONS.find(p => p.id === perm)?.label || perm}
                                                    </span>
                                                ))}
                                                {(user.permissions?.length || 0) > 2 && (
                                                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500">
                                                        +{user.permissions.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </AdminPageLayout>
    );
};

export default AdminTeamManagement;
