import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Edit,
    Copy,
    Trash2,
    ExternalLink,
    Eye,
    EyeOff,
    FileText
} from 'lucide-react';
import { useCustomPages } from '../../hooks/useCustomPages';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { CustomPage } from '../../types/pageBuilder';

const PageList: React.FC = () => {
    const navigate = useNavigate();
    const { pages, loading, deletePage, duplicatePage, togglePageStatus } = useCustomPages();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const filteredPages = pages.filter(page => {
        const matchesSearch = page.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
            page.slug.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = async (id: string) => {
        if (deleteConfirm === id) {
            try {
                await deletePage(id);
                setDeleteConfirm(null);
            } catch (error) {
                console.error('Error deleting page:', error);
                alert('Failed to delete page');
            }
        } else {
            setDeleteConfirm(id);
            setTimeout(() => setDeleteConfirm(null), 3000);
        }
    };

    const handleDuplicate = async (id: string) => {
        try {
            const newId = await duplicatePage(id);
            navigate(`/admin/pages/edit/${newId}`);
        } catch (error) {
            console.error('Error duplicating page:', error);
            alert('Failed to duplicate page');
        }
    };

    const handleToggleStatus = async (id: string) => {
        try {
            await togglePageStatus(id);
        } catch (error) {
            console.error('Error toggling status:', error);
            alert('Failed to update page status');
        }
    };

    return (
        <AdminPageLayout
            title="Page Builder"
            description="Create and manage custom pages"
        >
            {/* Create Page Button - Top Right */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => navigate('/admin/pages/new')}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create Page</span>
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search pages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white"
                    />
                </div>

                {/* Status Filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-4 py-2 bg-white dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary min-w-[150px]"
                >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{pages.length}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Total Pages</div>
                </div>
                <div className="p-4 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{pages.filter(p => p.status === 'published').length}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Published</div>
                </div>
                <div className="p-4 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg">
                    <div className="text-2xl font-bold text-amber-500">{pages.filter(p => p.status === 'draft').length}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Drafts</div>
                </div>
            </div>

            {/* Pages Table */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : filteredPages.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg">
                    <FileText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        {searchTerm || statusFilter !== 'all' ? 'No pages found' : 'No pages yet'}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        {searchTerm || statusFilter !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Create your first custom page to get started'}
                    </p>
                    {!searchTerm && statusFilter === 'all' && (
                        <button
                            onClick={() => navigate('/admin/pages/new')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg transition"
                        >
                            <Plus className="w-5 h-5" />
                            Create Your First Page
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-zinc-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Slug
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Blocks
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Last Modified
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-zinc-700">
                                {filteredPages.map((page) => (
                                    <tr key={page.id} className="hover:bg-slate-50 dark:hover:bg-zinc-700 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900 dark:text-white">
                                                {page.title.en}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-zinc-700 px-2 py-1 rounded">
                                                /{page.slug}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${page.status === 'published'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                                }`}>
                                                {page.status === 'published' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                {page.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                            {page.blocks?.length || 0}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                            {page.updatedAt?.toDate ? new Date(page.updatedAt.toDate()).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/pages/edit/${page.id}`)}
                                                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-zinc-600 rounded transition"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(page.id)}
                                                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-zinc-600 rounded transition"
                                                    title={page.status === 'published' ? 'Unpublish' : 'Publish'}
                                                >
                                                    {page.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDuplicate(page.id)}
                                                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-zinc-600 rounded transition"
                                                    title="Duplicate"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                                {page.status === 'published' && (
                                                    <a
                                                        href={`/en/${page.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-zinc-600 rounded transition"
                                                        title="View Live"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(page.id)}
                                                    className={`p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition ${deleteConfirm === page.id
                                                        ? 'text-red-600 dark:text-red-400'
                                                        : 'text-slate-600 dark:text-slate-400 hover:text-red-600'
                                                        }`}
                                                    title={deleteConfirm === page.id ? 'Click again to confirm' : 'Delete'}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdminPageLayout>
    );
};

export default PageList;
