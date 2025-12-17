import React, { useState, useMemo } from 'react';
import { useToast } from '../../../context/ToastContext';
import { useAssets, Asset, Folder } from '../../../hooks/useAssets';
import {
    Folder as FolderIcon, File, Grid, List as ListIcon,
    Upload, Plus, Search, Home, ChevronRight, Trash2,
    Download, Image as ImageIcon, CheckCircle2, Loader2
} from 'lucide-react';
import { format } from 'date-fns';

interface AssetExplorerProps {
    onSelect?: (url: string) => void;
}

type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'size-desc';
type AssetTypeFilter = 'all' | 'image' | 'document';

export const AssetExplorer = ({ onSelect }: AssetExplorerProps) => {
    const { showConfirm, showToast } = useToast();
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isDragging, setIsDragging] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('date-desc');
    const [filterType, setFilterType] = useState<AssetTypeFilter>('all');
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

    const { assets, folders, loading, uploading, createFolder, uploadAsset, deleteAsset, deleteFolder } = useAssets(currentFolderId);

    // Breadcrumbs management
    const [breadcrumbs, setBreadcrumbs] = useState<{ id: string | null, name: string }[]>([{ id: null, name: 'Library' }]);

    const handleNavigate = (folderId: string | null, folderName: string) => {
        setCurrentFolderId(folderId);
        setSearchQuery(''); // Clear search on navigation
        if (folderId === null) {
            setBreadcrumbs([{ id: null, name: 'Library' }]);
        } else {
            setBreadcrumbs(prev => {
                const existingIndex = prev.findIndex(b => b.id === folderId);
                if (existingIndex >= 0) return prev.slice(0, existingIndex + 1);
                return [...prev, { id: folderId, name: folderName }];
            });
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!isDragging) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        // Only disable if we are leaving the main container, not entering a child
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files) as File[];
            for (const file of files) {
                await uploadAsset(file);
            }
        }
    };

    const handleUploadClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.onchange = async (e: any) => {
            if (e.target.files) {
                const files = Array.from(e.target.files) as File[];
                for (const file of files) {
                    await uploadAsset(file);
                }
            }
        };
        input.click();
    };

    const handleCreateFolder = () => {
        const name = prompt("Folder Name:");
        if (name) createFolder(name);
    };

    const handleDeleteAsset = (asset: Asset) => {
        showConfirm(`Delete "${asset.name}"? This cannot be undone.`, async () => {
            try {
                await deleteAsset(asset);
                if (selectedAsset?.id === asset.id) setSelectedAsset(null);
                showToast('Asset deleted successfully', 'success');
            } catch (error) {
                showToast('Failed to delete asset', 'error');
            }
        });
    };

    const handleDeleteFolder = (folder: Folder) => {
        showConfirm(`Delete folder "${folder.name}"?`, async () => {
            try {
                await deleteFolder(folder.id);
                showToast('Folder deleted successfully', 'success');
            } catch (error) {
                showToast('Failed to delete folder', 'error');
            }
        });
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    // Filter and Sort Logic
    const filteredItems = useMemo(() => {
        let filteredAssets = [...assets];
        let filteredFolders = [...folders];

        // 1. Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredAssets = filteredAssets.filter(a => a.name.toLowerCase().includes(query));
            filteredFolders = filteredFolders.filter(f => f.name.toLowerCase().includes(query));
        }

        // 2. Type Filter
        if (filterType === 'image') {
            filteredAssets = filteredAssets.filter(a => a.type.startsWith('image/'));
        } else if (filterType === 'document') {
            filteredAssets = filteredAssets.filter(a => !a.type.startsWith('image/'));
        }

        // 3. Sorting
        const getMillis = (item: any) => {
            if (!item?.createdAt) return 0;
            if (typeof item.createdAt.toMillis === 'function') return item.createdAt.toMillis();
            if (item.createdAt instanceof Date) return item.createdAt.getTime();
            return new Date(item.createdAt).getTime() || 0;
        };

        const sortFn = (a: any, b: any) => {
            switch (sortBy) {
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'name-desc': return b.name.localeCompare(a.name);
                case 'size-desc': return (b.size || 0) - (a.size || 0);
                case 'date-asc':
                    return getMillis(a) - getMillis(b);
                case 'date-desc':
                default:
                    return getMillis(b) - getMillis(a);
            }
        };

        filteredAssets.sort(sortFn);
        filteredFolders.sort((a, b) => a.name.localeCompare(b.name)); // Always sort folders by name for now

        return { assets: filteredAssets, folders: filteredFolders };
    }, [assets, folders, searchQuery, sortBy, filterType]);

    const getDate = (timestamp: any) => {
        if (!timestamp) return new Date();
        if (typeof timestamp.toDate === 'function') return timestamp.toDate();
        if (timestamp instanceof Date) return timestamp;
        return new Date(timestamp);
    };

    if (loading) return <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400"><Loader2 className="animate-spin mr-2" size={20} /> Loading assets...</div>;

    return (
        <div
            className={`h-full flex flex-col md:flex-row bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden ${isDragging ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Sidebar Filter */}
            <div className="hidden md:flex flex-col w-56 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4 gap-2">
                <button
                    onClick={() => setFilterType('all')}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'all' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                    <Grid size={18} /> All Assets
                </button>
                <button
                    onClick={() => setFilterType('image')}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'image' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                    <ImageIcon size={18} /> Images
                </button>
                <button
                    onClick={() => setFilterType('document')}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'document' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                    <File size={18} /> Documents
                </button>

                <div className="my-4 border-t border-slate-200 dark:border-slate-800" />

                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Storage</div>
                <div className="bg-slate-200 dark:bg-slate-800 rounded-full h-2 mx-3 mb-1 overflow-hidden">
                    <div className="bg-blue-500 h-full w-[45%]" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 px-3">
                    <span>Used</span>
                    <span>Unlimited</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Visual Header / Toolbar */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-4">
                    {/* Top Bar: Breadcrumbs + Actions */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mask-gradient-r">
                            {breadcrumbs.map((crumb, index) => (
                                <div key={crumb.id || 'root'} className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                    {index > 0 && <ChevronRight size={14} className="mx-1 text-slate-400" />}
                                    <button
                                        onClick={() => handleNavigate(crumb.id, crumb.name)}
                                        className={`hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors ${index === breadcrumbs.length - 1 ? 'text-slate-900 dark:text-white font-bold' : ''}`}
                                    >
                                        {index === 0 && <Home size={16} />}
                                        {crumb.name}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button onClick={handleCreateFolder} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="New Folder">
                                <Plus size={20} />
                            </button>
                            <button onClick={handleUploadClick} disabled={uploading} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                <span className="hidden sm:inline">{uploading ? 'Start...' : 'Upload'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Bottom Bar: Search + Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search files..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>
                                    <Grid size={16} />
                                </button>
                                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>
                                    <ListIcon size={16} />
                                </button>
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="date-desc">Newest First</option>
                                <option value="date-asc">Oldest First</option>
                                <option value="name-asc">Name (A-Z)</option>
                                <option value="name-desc">Name (Z-A)</option>
                                <option value="size-desc">Size (Largest)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* File Grid/List Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50 dark:bg-black/20">
                    {uploading && (
                        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-3 text-blue-700 dark:text-blue-300 animate-in fade-in slide-in-from-top-4">
                            <Loader2 size={20} className="animate-spin" />
                            <span className="font-medium">Uploading files secure storage...</span>
                        </div>
                    )}

                    {filteredItems.folders.length === 0 && filteredItems.assets.length === 0 && !loading && !uploading && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                                <Upload size={48} className="text-slate-300 dark:text-slate-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No assets found</h3>
                            <p className="max-w-xs text-center text-slate-500 mb-6">
                                {searchQuery ? 'Try adjusting your search terms.' : 'Upload your first image or document to get started.'}
                            </p>
                            {!searchQuery && (
                                <button onClick={handleUploadClick} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                                    Browse Files
                                </button>
                            )}
                        </div>
                    )}

                    {viewMode === 'grid' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filteredItems.folders.map(folder => (
                                <div
                                    key={folder.id}
                                    onDoubleClick={() => handleNavigate(folder.id, folder.name)}
                                    className="group aspect-[4/3] bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center relative p-4"
                                >
                                    <FolderIcon size={40} className="text-blue-400 mb-3 fill-blue-50 dark:fill-blue-900/20" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate w-full text-center">{folder.name}</span>
                                    <span className="text-[10px] text-slate-400 mt-0.5">Folder</span>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder); }}
                                        className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}

                            {filteredItems.assets.map(asset => (
                                <div
                                    key={asset.id}
                                    onClick={() => setSelectedAsset(asset)}
                                    onDoubleClick={() => onSelect ? onSelect(asset.url) : window.open(asset.url, '_blank')}
                                    className={`group aspect-square bg-white dark:bg-slate-800 rounded-xl border hover:shadow-lg transition-all cursor-pointer relative overflow-hidden ${selectedAsset?.id === asset.id ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-700'}`}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center p-2 bg-checkerboard dark:bg-checkerboard-dark bg-[length:20px_20px]">
                                        {asset.type.startsWith('image/') ? (
                                            <img src={asset.url} alt={asset.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <File size={32} className="text-slate-400" />
                                        )}
                                    </div>

                                    {/* Overlay Gradient on Hover / Selected */}
                                    <div className={`absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-transform flex items-center justify-between ${selectedAsset?.id === asset.id ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}`}>
                                        <div className="overflow-hidden min-w-0 pr-2">
                                            <p className="text-xs font-bold text-white truncate" title={asset.name}>{asset.name}</p>
                                            <p className="text-[10px] text-slate-300 flex items-center gap-1">
                                                <span>{formatSize(asset.size)}</span>
                                            </p>
                                        </div>
                                        {selectedAsset?.id === asset.id ? (
                                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                                                <CheckCircle2 size={12} />
                                            </div>
                                        ) : null}
                                    </div>

                                    {/* Delete Button (Top Right) */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteAsset(asset); }}
                                        className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-slate-900/90 text-slate-500 hover:text-red-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm transform scale-90 hover:scale-100"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {viewMode === 'list' && (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="px-4 py-3 pl-6">Name</th>
                                        <th className="px-4 py-3">Size</th>
                                        <th className="px-4 py-3 hidden sm:table-cell">Type</th>
                                        <th className="px-4 py-3 hidden md:table-cell">Date</th>
                                        <th className="px-4 py-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {filteredItems.folders.map(folder => (
                                        <tr
                                            key={folder.id}
                                            onClick={() => handleNavigate(folder.id, folder.name)}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer group transition-colors"
                                        >
                                            <td className="px-4 py-3 pl-6 flex items-center gap-3">
                                                <FolderIcon size={18} className="text-blue-400 fill-blue-50 dark:fill-blue-900/20" />
                                                <span className="font-medium text-slate-900 dark:text-white">{folder.name}</span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">--</td>
                                            <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">Folder</td>
                                            <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{format(getDate(folder.createdAt), 'MMM d, yyyy')}</td>
                                            <td className="px-4 py-3">
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder); }} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredItems.assets.map(asset => (
                                        <tr
                                            key={asset.id}
                                            onClick={() => setSelectedAsset(asset)}
                                            onDoubleClick={() => onSelect ? onSelect(asset.url) : window.open(asset.url, '_blank')}
                                            className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 group transition-colors cursor-pointer ${selectedAsset?.id === asset.id ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                        >
                                            <td className="px-4 py-3 pl-6 flex items-center gap-3">
                                                {asset.type.startsWith('image/') ? (
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                                                        <img src={asset.url} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                                        <File size={16} className="text-slate-400" />
                                                    </div>
                                                )}
                                                <span className={`font-medium truncate max-w-[150px] sm:max-w-xs ${selectedAsset?.id === asset.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                    {asset.name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 text-xs">{formatSize(asset.size)}</td>
                                            <td className="px-4 py-3 text-slate-500 text-xs truncate max-w-[100px] hidden sm:table-cell">{asset.type}</td>
                                            <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">{format(getDate(asset.createdAt), 'MMM d, yyyy')}</td>
                                            <td className="px-4 py-3">
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteAsset(asset); }} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Inspector / Footer Panel (Visible when asset selected) */}
                {selectedAsset && (
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 animation-slide-up">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                                {selectedAsset.type.startsWith('image/') ? (
                                    <img src={selectedAsset.url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <File size={20} className="text-slate-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{selectedAsset.name}</span>
                                <span className="text-xs text-slate-500">{formatSize(selectedAsset.size)} • {selectedAsset.type.split('/')[1]?.toUpperCase()}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <a
                                href={selectedAsset.url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                title="Open in new tab"
                            >
                                <Download size={18} />
                            </a>
                            <button
                                onClick={() => setSelectedAsset(null)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg mr-2"
                            >
                                Cancel
                            </button>
                            {onSelect && (
                                <button
                                    onClick={() => onSelect(selectedAsset.url)}
                                    className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-500/25 transition-all"
                                >
                                    Select Image
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {isDragging && (
                <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl pointer-events-none">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl text-center transform scale-110 transition-transform border border-blue-500/20">
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <Upload size={32} className="text-blue-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Drop files to upload</h3>
                        <p className="text-slate-500 mt-2">Release to add them to this folder</p>
                    </div>
                </div>
            )}
        </div>
    );
};
