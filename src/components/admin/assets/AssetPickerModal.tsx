import React from 'react';
import { X } from 'lucide-react';
import { AssetExplorer } from './AssetExplorer';

interface AssetPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

export const AssetPickerModal = ({ isOpen, onClose, onSelect }: AssetPickerModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-5xl h-[80vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Select Asset</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>
                <div className="flex-1 overflow-hidden p-4 bg-slate-50/50 dark:bg-slate-900/50">
                    <AssetExplorer onSelect={(url) => { onSelect(url); onClose(); }} />
                </div>
            </div>
        </div>
    );
};
