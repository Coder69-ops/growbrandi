import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { Plus, Edit2, Trash2, Save, ArrowLeft, FileText, Image, Tag, Calendar, User } from 'lucide-react';
import { LanguageTabs, LocalizedInput, LocalizedTextArea, LocalizedArrayInput } from '../../components/admin/LocalizedFormFields';
import { useAutoTranslate } from '../../hooks/useAutoTranslate';
import { Sparkles } from 'lucide-react';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { useStatusModal } from '../../hooks/useStatusModal';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { SupportedLanguage, ensureLocalizedFormat, getLocalizedField } from '../../utils/localization';
import { Reorder } from 'framer-motion';
import { SortableItem } from '../../components/admin/SortableItem';

const AdminBlog = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState<any>(null);
    const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('en');
    const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'blog_posts'));
            const postsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a: any, b: any) => (b.date || 0) - (a.date || 0)); // Sort by date desc
            setPosts(postsData);
        } catch (error) {
            console.error("Error fetching blog posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const { showSuccess, showError, StatusModal } = useStatusModal();

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await deleteDoc(doc(db, 'blog_posts', id));
            showSuccess('Post Deleted', 'The blog post has been permanently deleted.');
            setPosts(posts.filter(p => p.id !== id));
        } catch (error) {
            console.error("Error deleting post:", error);
            showError('Delete Failed', 'There was an error deleting the post. Please try again.');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Ensure slug is unique if possible (basic check)
            // Ideally we'd do a server-side check or a more robust one here, but for now we rely on user manually checking or simple collision in real-time

            const postData = {
                ...currentPost,
                updatedAt: serverTimestamp(),
            };

            if (currentPost.id) {
                const { id, ...data } = postData;
                await updateDoc(doc(db, 'blog_posts', id), data);
                showSuccess('Post Updated', 'The blog post has been successfully updated.');
            } else {
                postData.createdAt = serverTimestamp();
                await addDoc(collection(db, 'blog_posts'), postData);
                showSuccess('Post Created', 'New blog post has been successfully created.');
            }
            await fetchPosts();
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving post:", error);
            showError('Save Failed', 'There was an error saving the post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const openEdit = (post: any = {}) => {
        const defaultTitle = { en: '' };
        setCurrentPost({
            image: post.image || '',
            date: post.date || new Date().toISOString().split('T')[0],
            author: post.author || 'GrowBrandi Team',
            category: post.category || 'Insights',
            status: post.status || 'draft',
            slug: post.slug || '',
            tags: post.tags || [],
            title: ensureLocalizedFormat(post.title),
            excerpt: ensureLocalizedFormat(post.excerpt),
            content: ensureLocalizedFormat(post.content),
            readTime: post.readTime || '5 min read',
            seo: {
                metaTitle: ensureLocalizedFormat(post.seo?.metaTitle || post.title),
                metaDescription: ensureLocalizedFormat(post.seo?.metaDescription || post.excerpt),
                keywords: ensureLocalizedFormat(post.seo?.keywords || { en: '' }),
            },
            ...post,
        });
        setActiveLanguage('en');
        setActiveTab('content');
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setCurrentPost((prev: any) => {
            const newState = { ...prev, [field]: value };

            // Auto-generate slug if title changes and slug hasn't been manually set (or is empty) (only for main language 'en' usually, or handle localized slugs? simpler to keep one slug)
            if (field === 'title' && activeLanguage === 'en' && (!prev.slug || prev.slug === generateSlug(getLocalizedField(prev.title, 'en')))) {
                newState.slug = generateSlug(getLocalizedField(value, 'en'));
            }
            return newState;
        });
    };

    const updateSeoField = (field: string, value: any) => {
        setCurrentPost((prev: any) => ({
            ...prev,
            seo: {
                ...prev.seo,
                [field]: value
            }
        }));
    };

    const { isTranslating, handleAutoTranslate } = useAutoTranslate(
        currentPost,
        setCurrentPost,
        {
            fields: ['title', 'excerpt', 'content', 'seo.metaTitle', 'seo.metaDescription', 'seo.keywords'],
        }
    );

    return (
        <AdminPageLayout
            title="Blog Posts"
            description="Manage your blog content and insights"
            actions={
                !loading && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => openEdit()}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95"
                        >
                            <Plus size={20} />
                            Add Post
                        </button>
                    </div>
                )
            }
        >
            {loading && !isEditing ? (
                <AdminLoader message="Loading posts..." />
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
                            <div>
                                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                                    {currentPost.id ? 'Edit Post' : 'New Post'}
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded-md border ${currentPost.status === 'published' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                        {currentPost.status === 'published' ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleAutoTranslate}
                                disabled={isTranslating}
                                className="flex items-center gap-2 px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20 disabled:opacity-50 text-sm"
                            >
                                <Sparkles size={16} className={isTranslating ? "animate-spin" : ""} />
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

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main Editor Area */}
                        <div className="flex-1 space-y-6">
                            {/* Tabs */}
                            <div className="flex border-b border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={() => setActiveTab('content')}
                                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'content' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                >
                                    Content
                                </button>
                                <button
                                    onClick={() => setActiveTab('seo')}
                                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'seo' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                >
                                    SEO & Settings
                                </button>
                            </div>

                            <LanguageTabs activeLanguage={activeLanguage} onChange={setActiveLanguage} />

                            {activeTab === 'content' && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
                                        <LocalizedInput
                                            label="Post Title"
                                            value={currentPost.title}
                                            onChange={(v) => updateField('title', v)}
                                            activeLanguage={activeLanguage}
                                            required
                                        />

                                        {/* Permalink Display */}
                                        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 dark:bg-slate-800/50 px-3 py-2 rounded-lg -mt-4">
                                            <span className="font-semibold">Permalink:</span>
                                            <span className="truncate">https://growbrandi.com/blog/{currentPost.slug || '...'}</span>
                                        </div>

                                        <LocalizedTextArea
                                            label="Excerpt / Summary"
                                            value={currentPost.excerpt}
                                            onChange={(v) => updateField('excerpt', v)}
                                            activeLanguage={activeLanguage}
                                            rows={3}
                                            placeholder="A short summary for list views and social cards..."
                                        />

                                        <LocalizedTextArea
                                            label="Full Content (Markdown supported)"
                                            value={currentPost.content}
                                            onChange={(v) => updateField('content', v)}
                                            activeLanguage={activeLanguage}
                                            rows={20}
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'seo' && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
                                        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                                            <Sparkles size={18} className="text-purple-500" />
                                            Search Engine Optimization
                                        </h3>

                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mb-6">
                                            <div className="text-sm font-medium text-slate-500 mb-2">Search Preview</div>
                                            <div className="max-w-xl">
                                                <div className="text-blue-600 text-lg hover:underline cursor-pointer truncate">
                                                    {getLocalizedField(currentPost.seo.metaTitle, activeLanguage) || getLocalizedField(currentPost.title, activeLanguage) || 'Post Title'}
                                                </div>
                                                <div className="text-green-700 text-sm truncate">
                                                    https://growbrandi.com/blog/{currentPost.slug}
                                                </div>
                                                <div className="text-slate-600 dark:text-slate-400 text-sm mt-1 line-clamp-2">
                                                    {getLocalizedField(currentPost.seo.metaDescription, activeLanguage) || getLocalizedField(currentPost.excerpt, activeLanguage) || 'Post description will appear here...'}
                                                </div>
                                            </div>
                                        </div>

                                        <LocalizedInput
                                            label="Meta Title (Browser Title)"
                                            value={currentPost.seo.metaTitle}
                                            onChange={(v) => updateSeoField('metaTitle', v)}
                                            activeLanguage={activeLanguage}
                                            placeholder={getLocalizedField(currentPost.title, activeLanguage)}
                                        />

                                        <LocalizedTextArea
                                            label="Meta Description"
                                            value={currentPost.seo.metaDescription}
                                            onChange={(v) => updateSeoField('metaDescription', v)}
                                            activeLanguage={activeLanguage}
                                            rows={3}
                                            placeholder={getLocalizedField(currentPost.excerpt, activeLanguage)}
                                        />

                                        <LocalizedInput
                                            label="Keywords (Comma separated)"
                                            value={currentPost.seo.keywords}
                                            onChange={(v) => updateSeoField('keywords', v)}
                                            activeLanguage={activeLanguage}
                                            placeholder="AI, Growth, Marketing..."
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="w-full lg:w-80 space-y-6 shrink-0">
                            {/* Publish Status Card */}
                            <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-4">
                                <h3 className="font-semibold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-700">Publishing</h3>

                                <div className="flex items-center justify-between">
                                    <label className="text-sm text-slate-700 dark:text-slate-300 font-medium">Status</label>
                                    <select
                                        value={currentPost.status}
                                        onChange={(e) => updateField('status', e.target.value)}
                                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Slug (URL)</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={currentPost.slug}
                                            onChange={(e) => updateField('slug', e.target.value)}
                                            className="w-full pl-3 pr-8 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                        />
                                        <div className="absolute right-2 top-2.5 text-slate-400">
                                            <Edit2 size={14} />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Publish Date</label>
                                    <input
                                        type="date"
                                        value={currentPost.date}
                                        onChange={(e) => updateField('date', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Metadata Card */}
                            <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
                                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                                    <Tag size={18} className="text-emerald-500" />
                                    Categorization
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                                    <input
                                        type="text"
                                        value={currentPost.category}
                                        onChange={(e) => updateField('category', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. AI Trends"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Author</label>
                                    <input
                                        type="text"
                                        value={currentPost.author}
                                        onChange={(e) => updateField('author', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Read Time</label>
                                    <input
                                        type="text"
                                        value={currentPost.readTime}
                                        onChange={(e) => updateField('readTime', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. 5 min read"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tags</label>
                                    <input
                                        type="text"
                                        value={currentPost.tags?.join(', ')}
                                        onChange={(e) => updateField('tags', e.target.value.split(',').map((t: string) => t.trim()))}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        placeholder="AI, Tech, Future..."
                                    />
                                </div>
                            </div>

                            {/* Featured Image */}
                            <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
                                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                                    <Image size={18} className="text-violet-500" />
                                    Featured Image
                                </h3>

                                <ImageUpload
                                    label="Cover Image"
                                    value={currentPost.image}
                                    onChange={(url) => updateField('image', url)}
                                    folder={`blog/${currentPost.id || 'new'}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {posts.length === 0 ? (
                        <div className="py-16 text-center text-slate-500 dark:text-slate-400 glass-panel border-dashed border-2 border-slate-300 dark:border-slate-700">
                            <div className="w-20 h-20 mx-auto bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                                <FileText size={40} className="opacity-50" />
                            </div>
                            <p className="font-bold text-xl text-slate-900 dark:text-white">No posts found</p>
                            <p className="text-sm mt-2 mb-6 max-w-sm mx-auto">Create your first blog post to share insights.</p>
                            <button
                                onClick={() => openEdit()}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 font-medium"
                            >
                                Write Post
                            </button>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className="glass-card flex flex-col sm:flex-row h-full sm:h-32 overflow-hidden hover:scale-[1.01] transition-all duration-300 group">
                                <div className="w-full sm:w-48 h-32 sm:h-full bg-slate-100 dark:bg-slate-900 shrink-0 relative overflow-hidden">
                                    {post.image ? (
                                        <img
                                            src={post.image}
                                            alt={getLocalizedField(post.title, 'en')}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-800">
                                            <FileText size={32} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 p-5 flex flex-col justify-center min-w-0">
                                    <div className="flex justify-between items-start mb-2 gap-4">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${post.status === 'published' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                                                    }`}>
                                                    {post.status === 'published' ? 'Published' : 'Draft'}
                                                </span>
                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                    <Calendar size={10} />
                                                    {post.date}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-xl text-slate-900 dark:text-white truncate mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {getLocalizedField(post.title, 'en')}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <button
                                                    onClick={() => openEdit(post)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                                        {getLocalizedField(post.excerpt, 'en')}
                                    </p>
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

export default AdminBlog;
