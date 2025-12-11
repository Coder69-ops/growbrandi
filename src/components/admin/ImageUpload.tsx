import React, { useState, useRef } from 'react';
import { storage } from '../../lib/storage'; // Switched to local R2 storage service
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { AssetPickerModal } from './assets/AssetPickerModal';

interface ImageUploadProps {
    label: string;
    value: string;
    onChange: (url: string) => void;
    folder?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    label,
    value,
    onChange,
    folder = 'uploads',
}) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setUploading(true);
        // Fake progress for R2 since SDK v3 doesn't easily expose progress on single PutObject
        // In a real app with large files, we'd use lib-storage Upload helper, but for images PutObject is essentially instant for small files.
        // We'll simulate a quick progress bar.
        setProgress(10);
        const progressInterval = setInterval(() => {
            setProgress(prev => Math.min(prev + 10, 90));
        }, 100);

        try {
            const downloadURL = await storage.uploadFile(file, folder);

            clearInterval(progressInterval);
            setProgress(100);

            onChange(downloadURL);
            setUploading(false);
        } catch (error) {
            clearInterval(progressInterval);
            console.error('Upload error:', error);
            alert('Failed to upload image to R2');
            setUploading(false);
        }
    };

    const handleRemove = () => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>

            <div className="flex gap-4 items-start">
                {value ? (
                    <div className="relative inline-block">
                        <img
                            src={value}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors ${uploading ? 'pointer-events-none' : ''}`}
                            title="Upload from Device"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                                    <span className="text-xs text-slate-500 mt-2">{Math.round(progress)}%</span>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-6 h-6 text-slate-400" />
                                    <span className="text-xs text-slate-500 mt-2 text-center px-2">Upload Device</span>
                                </>
                            )}
                        </div>

                        <div
                            onClick={() => setIsPickerOpen(true)}
                            className="w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors"
                            title="Select from Library"
                        >
                            <ImageIcon className="w-6 h-6 text-slate-400" />
                            <span className="text-xs text-slate-500 mt-2 text-center px-2">Select Library</span>
                        </div>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Fallback: Manual URL input */}
            {!value && (
                <div className="mt-2">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Or paste image URL..."
                        className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
            )}

            <AssetPickerModal
                isOpen={isPickerOpen}
                onClose={() => setIsPickerOpen(false)}
                onSelect={(url) => { onChange(url); setIsPickerOpen(false); }}
            />
        </div>
    );
};
