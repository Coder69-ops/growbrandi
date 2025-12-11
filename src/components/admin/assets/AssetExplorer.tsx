import React, { useState } from 'react';
import { useAssets, Asset, Folder } from '../../../hooks/useAssets';
import { Folder as FolderIcon, File, Grid, List as ListIcon, Upload, Plus, Search, Home, ChevronRight, Trash2, Download } from 'lucide-react';
import { format } from 'date-fns';
import { AdminLoader } from '../AdminLoader';

interface AssetExplorerProps {
    onSelect?: (url: string) => void;
}

export const AssetExplorer = ({ onSelect }: AssetExplorerProps) => {
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isDragging, setIsDragging] = useState(false);
    const { assets, folders, loading, uploading, createFolder, uploadAsset, deleteAsset, deleteFolder } = useAssets(currentFolderId);

    // Breadcrumbs mock - in real app would need to fetch parent chain
    const [breadcrumbs, setBreadcrumbs] = useState<{ id: string | null, name: string }[]>([{ id: null, name: 'Home' }]);

    const handleNavigate = (folderId: string | null, folderName: string) => {
        setCurrentFolderId(folderId);
        if (folderId === null) {
            setBreadcrumbs([{ id: null, name: 'Home' }]);
        } else {
            // Simple append for now - ideal is full path resolution
            setBreadcrumbs(prev => {
                const existingIndex = prev.findIndex(b => b.id === folderId);
                if (existingIndex >= 0) return prev.slice(0, existingIndex + 1);
                return [...prev, { id: folderId, name: folderName }];
            });
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
                const files = Array.from(e.target.files) as File[]; // Cast to File[]
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

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    if (loading) return <AdminLoader message="Loading assets..." />;

    return (
        <div
            className={`h-full flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative ${isDragging ? 'ring-2 ring-blue-500 ring-inset bg-blue-50 dark:bg-blue-900/20' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
        >
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {breadcrumbs.map((crumb, index) => (
                        <div key={crumb.id || 'root'} className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                            {index > 0 && <ChevronRight size={14} className="mx-1 text-slate-400" />}
                            <button
                                onClick={() => handleNavigate(crumb.id, crumb.name)}
                                className={`hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 ${index === breadcrumbs.length - 1 ? 'text-slate-900 dark:text-white font-bold' : ''}`}
                            >
                                {index === 0 && <Home size={14} />}
                                {crumb.name}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${viewMode === 'grid' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-500'}`}>
                        <Grid size={18} />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${viewMode === 'list' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-500'}`}>
                        <ListIcon size={18} />
                    </button>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
                    <button onClick={handleCreateFolder} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                        <Plus size={16} /> New Folder
                    </button>
                    <button onClick={handleUploadClick} disabled={uploading} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all disabled:opacity-50">
                        {uploading ? <AdminLoader message="" /> : <Upload size={16} />}
                        Upload
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
                {uploading && (
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-3 text-blue-700 dark:text-blue-300">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                        <span className="font-medium">Uploading files...</span>
                    </div>
                )}

                {assets.length === 0 && folders.length === 0 && !loading && (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                        <Upload size={48} className="mb-4 opacity-50" />
                        <p className="text-lg font-medium">Drop files here to upload</p>
                        <p className="text-sm">or create a new folder</p>
                    </div>
                )}

                {/* Grid View */}
                {viewMode === 'grid' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {folders.map(folder => (
                            <div
                                key={folder.id}
                                onDoubleClick={() => handleNavigate(folder.id, folder.name)} // Double click navigation
                                className="group p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all cursor-pointer flex flex-col items-center text-center relative"
                            >
                                <FolderIcon size={48} className="text-blue-400 mb-3 fill-current opacity-80" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate w-full">{folder.name}</span>
                                <span className="text-xs text-slate-400 mt-1">Folder</span>

                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteFolder(folder.id); }}
                                    className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-900 rounded-full shadow-sm"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}

                        {assets.map(asset => (
                            <div
                                key={asset.id}
                                className="group aspect-square bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute inset-0 flex items-center justify-center p-4">
                                    {asset.type.startsWith('image/') ? (
                                        <img src={asset.url} alt={asset.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <File size={48} className="text-slate-400" />
                                    )}
                                </div>

                                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform flex items-center justify-between">
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-bold text-white truncate">{asset.name}</p>
                                        <p className="text-[10px] text-slate-300">{formatSize(asset.size)}</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteAsset(asset); }}
                                        className="text-white/70 hover:text-red-400 p-1"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Size</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {folders.map(folder => (
                                    <tr
                                        key={folder.id}
                                        onClick={() => handleNavigate(folder.id, folder.name)}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer group"
                                    >
                                        <td className="px-4 py-3 flex items-center gap-3">
                                            <FolderIcon size={18} className="text-blue-400 fill-current" />
                                            <span className="font-medium text-slate-900 dark:text-white">{folder.name}</span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500">--</td>
                                        <td className="px-4 py-3 text-slate-500">Folder</td>
                                        <td className="px-4 py-3 text-slate-500">{format(folder.createdAt?.toDate ? folder.createdAt.toDate() : new Date(), 'MMM d, yyyy')}</td>
                                        <td className="px-4 py-3">
                                            <button onClick={(e) => { e.stopPropagation(); deleteFolder(folder.id); }} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {assets.map(asset => (
                                    <tr key={asset.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                                        <td className="px-4 py-3 flex items-center gap-3">
                                            {asset.type.startsWith('image/') ? (
                                                <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                                    <img src={asset.url} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <File size={18} className="text-slate-400" />
                                            )}
                                            <button
                                                onClick={() => onSelect ? onSelect(asset.url) : window.open(asset.url, '_blank')}
                                                className="font-medium text-slate-900 dark:text-white hover:text-blue-600 truncate max-w-[200px] block text-left"
                                            >
                                                {asset.name}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500">{formatSize(asset.size)}</td>
                                        <td className="px-4 py-3 text-slate-500 truncate max-w-[100px]">{asset.type}</td>
                                        <td className="px-4 py-3 text-slate-500">{format(asset.createdAt?.toDate ? asset.createdAt.toDate() : new Date(), 'MMM d, yyyy')}</td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => deleteAsset(asset)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100">
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

            {isDragging && (
                <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl pointer-events-none">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl text-center transform scale-110 transition-transform">
                        <Upload size={64} className="mx-auto text-blue-500 mb-4 animate-bounce" />
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Drop files to upload</h3>
                    </div>
                </div>
            )}
        </div>
    );
};
