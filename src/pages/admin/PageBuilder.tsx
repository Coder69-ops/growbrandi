import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Save,
    Eye,
    Plus,
    ArrowLeft,
    Settings,
    Globe,
    Trash2,
    Copy,
    GripVertical,
    Wand2,
    Image as ImageIcon,
    Upload,
    Check,
    ChevronUp,
    ChevronDown
} from 'lucide-react';
import { useCustomPages } from '../../hooks/useCustomPages';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { CustomPage, PageBlock, BlockType } from '../../types/pageBuilder';
import { getBlocksByCategory, getBlockInfo } from '../../components/pageBuilder/blockRegistry';
import { AIBlockBuilder } from '../../components/pageBuilder/AIBlockBuilder';
import { AssetPickerModal } from '../../components/admin/assets/AssetPickerModal';

// Use built-in crypto for UUID generation
const generateUUID = () => {
    return crypto.randomUUID();
};

const PageBuilder: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { fetchPageById, createPage, updatePage } = useCustomPages();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
    const [currentLang, setCurrentLang] = useState<'en' | 'es' | 'fr' | 'de'>('en');
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [showBlockLibrary, setShowBlockLibrary] = useState(false);
    const [showAIBuilder, setShowAIBuilder] = useState(false);
    const [showAssetPicker, setShowAssetPicker] = useState(false);
    const [assetPickerTarget, setAssetPickerTarget] = useState<{ blockId: string; field: string } | null>(null);

    // Page data
    const [pageData, setPageData] = useState<Partial<CustomPage>>({
        slug: '',
        title: { en: 'New Page' },
        status: 'draft',
        seo: {
            title: { en: '' },
            description: { en: '' },
            keywords: [],
            noIndex: false
        },
        blocks: [],
        settings: {
            showHeader: true,
            showFooter: true,
            showBreadcrumbs: false
        }
    });

    // Load existing page
    useEffect(() => {
        const loadPage = async () => {
            if (id && id !== 'new') {
                try {
                    const page = await fetchPageById(id);
                    if (page) {
                        setPageData(page);
                    } else {
                        alert('Page not found');
                        navigate('/admin/pages');
                    }
                } catch (error) {
                    console.error('Error loading page:', error);
                    alert('Failed to load page');
                }
            }
            setLoading(false);
        };
        loadPage();
    }, [id, fetchPageById, navigate]);

    // Auto-save functionality
    useEffect(() => {
        if (id === 'new' || !pageData.slug) return;

        setAutoSaveStatus('unsaved');
        const timer = setTimeout(() => {
            handleAutoSave();
        }, 3000); // Auto-save after 3 seconds of inactivity

        return () => clearTimeout(timer);
    }, [pageData]); // eslint-disable-line react-hooks/exhaustive-deps

    // Auto-save function
    const handleAutoSave = useCallback(async () => {
        if (id === 'new' || !pageData.slug) return;

        try {
            setAutoSaveStatus('saving');
            await updatePage(id, pageData as any);
            setAutoSaveStatus('saved');
        } catch (error) {
            console.error('Auto-save failed:', error);
            setAutoSaveStatus('unsaved');
        }
    }, [id, pageData, updatePage]);

    // Save page
    const handleSave = async (publish: boolean = false) => {
        try {
            setSaving(true);

            // Validation
            if (!pageData.slug || pageData.slug.trim() === '') {
                alert('Please enter a page slug');
                return;
            }

            const dataToSave: any = {
                ...pageData,
                status: publish ? 'published' : 'draft'
            };

            if (id && id !== 'new') {
                await updatePage(id, dataToSave);
            } else {
                const newId = await createPage(dataToSave as any);
                navigate(`/admin/pages/edit/${newId}`, { replace: true });
            }

            alert(publish ? 'Page published successfully!' : 'Page saved as draft');
        } catch (error: any) {
            console.error('Error saving page:', error);
            alert(error.message || 'Failed to save page');
        } finally {
            setSaving(false);
        }
    };

    // Add block
    const addBlock = (type: BlockType) => {
        const blockInfo = getBlockInfo(type);
        const newBlock: PageBlock = {
            id: generateUUID(),
            type,
            order: pageData.blocks?.length || 0,
            enabled: true,
            settings: blockInfo.defaultSettings || {},
            content: blockInfo.defaultContent
        };

        setPageData(prev => ({
            ...prev,
            blocks: [...(prev.blocks || []), newBlock]
        }));
        setSelectedBlockId(newBlock.id);
        setShowBlockLibrary(false);
    };

    // Remove block
    const removeBlock = (blockId: string) => {
        setPageData(prev => ({
            ...prev,
            blocks: prev.blocks?.filter(b => b.id !== blockId) || []
        }));
        if (selectedBlockId === blockId) {
            setSelectedBlockId(null);
        }
    };

    // Duplicate block
    const duplicateBlock = (blockId: string) => {
        const block = pageData.blocks?.find(b => b.id === blockId);
        if (block) {
            const newBlock = { ...block, id: generateUUID(), order: pageData.blocks!.length };
            setPageData(prev => ({
                ...prev,
                blocks: [...(prev.blocks || []), newBlock]
            }));
        }
    };

    // Move block
    const moveBlock = (blockId: string, direction: 'up' | 'down') => {
        const blocks = [...(pageData.blocks || [])];
        const index = blocks.findIndex(b => b.id === blockId);
        if (index === -1) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= blocks.length) return;

        [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
        blocks.forEach((b, i) => b.order = i);

        setPageData(prev => ({ ...prev, blocks }));
    };

    // Update block content
    const updateBlockContent = (blockId: string, lang: string, field: string, value: any) => {
        setPageData(prev => ({
            ...prev,
            blocks: prev.blocks?.map(b => {
                if (b.id === blockId) {
                    return {
                        ...b,
                        content: {
                            ...b.content,
                            [lang]: {
                                ...(b.content[lang] || {}),
                                [field]: value
                            }
                        }
                    };
                }
                return b;
            }) || []
        }));
    };

    // Open asset picker for a specific block field
    const openAssetPicker = (blockId: string, field: string) => {
        setAssetPickerTarget({ blockId, field });
        setShowAssetPicker(true);
    };

    // Handle asset selection
    const handleAssetSelect = (url: string) => {
        if (assetPickerTarget) {
            updateBlockContent(
                assetPickerTarget.blockId,
                currentLang,
                assetPickerTarget.field,
                url
            );
            setAssetPickerTarget(null);
        }
    };

    // Handle AI-generated block
    const handleAIBlockCreated = (blockData: any) => {
        const newBlock: PageBlock = {
            id: generateUUID(),
            type: blockData.type as BlockType,
            order: pageData.blocks?.length || 0,
            enabled: true,
            settings: blockData.settings || {},
            content: blockData.content
        };

        setPageData(prev => ({
            ...prev,
            blocks: [...(prev.blocks || []), newBlock]
        }));
        setSelectedBlockId(newBlock.id);
    };

    const selectedBlock = pageData.blocks?.find(b => b.id === selectedBlockId);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const blockCategories = getBlocksByCategory();

    return (
        <AdminPageLayout
            title={id === 'new' ? 'Create New Page' : 'Edit Page'}
            description="Build your custom page with blocks"
        >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between mb-6 p-4 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg">
                <button
                    onClick={() => navigate('/admin/pages')}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Pages
                </button>

                <div className="flex items-center gap-3">
                    {/* Auto-save Status */}
                    {id !== 'new' && (
                        <div className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-slate-50 dark:bg-zinc-700">
                            {autoSaveStatus === 'saved' && (
                                <>
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span className="text-slate-600 dark:text-slate-400">Saved</span>
                                </>
                            )}
                            {autoSaveStatus === 'saving' && (
                                <>
                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    <span className="text-slate-600 dark:text-slate-400">Saving...</span>
                                </>
                            )}
                            {autoSaveStatus === 'unsaved' && (
                                <span className="text-amber-600 dark:text-amber-400">Unsaved changes</span>
                            )}
                        </div>
                    )}

                    {/* Language Selector */}
                    <select
                        value={currentLang}
                        onChange={(e) => setCurrentLang(e.target.value as any)}
                        className="px-3 py-2 bg-slate-50 dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 rounded-lg text-sm"
                    >
                        <option value="en">🇬🇧 English</option>
                        <option value="es">🇪🇸 Spanish</option>
                        <option value="fr">🇫🇷 French</option>
                        <option value="de">🇩🇪 German</option>
                    </select>

                    <button
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-600 rounded-lg transition"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Draft'}
                    </button>

                    <button
                        onClick={() => handleSave(true)}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg transition"
                    >
                        <Eye className="w-4 h-4" />
                        Publish
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Page Settings */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="p-6 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Page Settings
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Title ({currentLang.toUpperCase()})
                                </label>
                                <input
                                    type="text"
                                    value={pageData.title?.[currentLang] || ''}
                                    onChange={(e) => setPageData(prev => ({
                                        ...prev,
                                        title: { ...prev.title, [currentLang]: e.target.value }
                                    }))}
                                    className="w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    URL Slug
                                </label>
                                <input
                                    type="text"
                                    value={pageData.slug || ''}
                                    onChange={(e) => setPageData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                                    placeholder="my-custom-page"
                                    className="w-full px-3 py-2 font-mono text-sm bg-white dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    SEO Title ({currentLang.toUpperCase()})
                                </label>
                                <input
                                    type="text"
                                    value={pageData.seo?.title?.[currentLang] || ''}
                                    onChange={(e) => setPageData(prev => ({
                                        ...prev,
                                        seo: { ...prev.seo!, title: { ...prev.seo?.title, [currentLang]: e.target.value } }
                                    }))}
                                    className="w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    SEO Description ({currentLang.toUpperCase()})
                                </label>
                                <textarea
                                    value={pageData.seo?.description?.[currentLang] || ''}
                                    onChange={(e) => setPageData(prev => ({
                                        ...prev,
                                        seo: { ...prev.seo!, description: { ...prev.seo?.description, [currentLang]: e.target.value } }
                                    }))}
                                    rows={3}
                                    className="w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 rounded-lg"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="noIndex"
                                    checked={pageData.seo?.noIndex || false}
                                    onChange={(e) => setPageData(prev => ({
                                        ...prev,
                                        seo: { ...prev.seo!, noIndex: e.target.checked }
                                    }))}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="noIndex" className="text-sm text-slate-700 dark:text-slate-300">
                                    No Index (hide from search engines)
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Block Library */}
                    <div className="p-6 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Add Blocks</h3>
                            <button
                                onClick={() => setShowAIBuilder(true)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-medium rounded-lg hover:shadow-lg transition"
                            >
                                <Wand2 className="w-3.5 h-3.5" />
                                AI Generate
                            </button>
                        </div>

                        {Object.entries(blockCategories).map(([category, blocks]) => (
                            <div key={category} className="mb-4">
                                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">{category}</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {blocks.map(({ type, info }) => {
                                        const Icon = info.icon;
                                        return (
                                            <button
                                                key={type}
                                                onClick={() => addBlock(type)}
                                                className="flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-600 border border-slate-200 dark:border-zinc-600 rounded-lg transition text-center"
                                            >
                                                <Icon className="w-5 h-5 text-primary" />
                                                <span className="text-xs text-slate-700 dark:text-slate-300">{info.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Blocks List & Editor */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Blocks */}
                    <div className="p-6 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Page Blocks</h3>

                        {(!pageData.blocks || pageData.blocks.length === 0) ? (
                            <div className="text-center py-12 text-slate-500">
                                <p>No blocks yet. Add your first block from the library on the left.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {pageData.blocks.sort((a, b) => a.order - b.order).map((block, index) => {
                                    const blockInfo = getBlockInfo(block.type);
                                    const Icon = blockInfo.icon;
                                    const isSelected = selectedBlockId === block.id;

                                    return (
                                        <div
                                            key={block.id}
                                            className={`p-4 border-2 rounded-lg transition ${isSelected
                                                ? 'border-primary bg-primary/5'
                                                : 'border-slate-200 dark:border-zinc-600 hover:border-primary/50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />
                                                    <Icon className="w-5 h-5 text-primary" />
                                                    <span className="font-medium text-slate-900 dark:text-white">{blockInfo.label}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => moveBlock(block.id, 'up')}
                                                        disabled={index === 0}
                                                        className="p-1 text-slate-600 dark:text-slate-400 hover:text-primary disabled:opacity-30"
                                                    >
                                                        ↑
                                                    </button>
                                                    <button
                                                        onClick={() => moveBlock(block.id, 'down')}
                                                        disabled={index === pageData.blocks!.length - 1}
                                                        className="p-1 text-slate-600 dark:text-slate-400 hover:text-primary disabled:opacity-30"
                                                    >
                                                        ↓
                                                    </button>
                                                    <button
                                                        onClick={() => duplicateBlock(block.id)}
                                                        className="p-1 text-slate-600 dark:text-slate-400 hover:text-primary"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => removeBlock(block.id)}
                                                        className="p-1 text-red-600 dark:text-red-400 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Block Content Editor */}
                                            {isSelected && (
                                                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-600 space-y-3">
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                                        Edit {blockInfo.label} content for <strong>{currentLang.toUpperCase()}</strong>
                                                    </p>
                                                    {block.content[currentLang] && Object.keys(block.content[currentLang]).map(field => (
                                                        <div key={field}>
                                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 capitalize">
                                                                {field.replace(/([A-Z])/g, ' $1')}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={block.content[currentLang][field] || ''}
                                                                onChange={(e) => updateBlockContent(block.id, currentLang, field, e.target.value)}
                                                                className="w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 rounded-lg text-sm"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {!isSelected && (
                                                <button
                                                    onClick={() => setSelectedBlockId(block.id)}
                                                    className="text-sm text-primary hover:underline"
                                                >
                                                    Click to edit →
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Asset Picker Modal */}
            <AssetPickerModal
                isOpen={showAssetPicker}
                onClose={() => {
                    setShowAssetPicker(false);
                    setAssetPickerTarget(null);
                }}
                onSelect={handleAssetSelect}
            />


            {/* AI Block Builder Modal */}
            <AIBlockBuilder
                isOpen={showAIBuilder}
                onClose={() => setShowAIBuilder(false)}
                onBlockCreated={handleAIBlockCreated}
            />
        </AdminPageLayout>
    );
};

export default PageBuilder;
