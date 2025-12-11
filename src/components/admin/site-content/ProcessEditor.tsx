import React, { useState } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';
import { LocalizedInput, LocalizedTextArea } from '../LocalizedFormFields';
import { ImageUpload } from '../ImageUpload';
import { SupportedLanguage } from '../../../utils/localization';

interface ProcessEditorProps {
    content: any;
    handleChange: (section: string, field: string, value: any, nestedField?: string) => void;
    handleArrayChange: (section: string, arrayName: string, index: number, field: string, value: any) => void;
    handleArrayDetailChange: (section: string, arrayName: string, stepIndex: number, detailIndex: number, value: any) => void;
    activeLanguage: SupportedLanguage;
}

export const ProcessEditor: React.FC<ProcessEditorProps> = ({ content, handleChange, handleArrayChange, handleArrayDetailChange, activeLanguage }) => {
    const [expandedStep, setExpandedStep] = useState<number | null>(0);

    return (
        <div className="space-y-6">
            <div className="glass-panel p-6 space-y-6">
                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                    <List size={18} /> Hero Section
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <LocalizedInput label="Badge" value={content.process?.hero?.badge} onChange={(val) => handleChange('process', 'hero', val, 'badge')} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Title" value={content.process?.hero?.title} onChange={(val) => handleChange('process', 'hero', val, 'title')} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Highlight" value={content.process?.hero?.highlight} onChange={(val) => handleChange('process', 'hero', val, 'highlight')} activeLanguage={activeLanguage} />
                </div>
                <LocalizedTextArea label="Description" value={content.process?.hero?.description} onChange={(val) => handleChange('process', 'hero', val, 'description')} activeLanguage={activeLanguage} />
                <div className="pt-2">
                    <ImageUpload
                        label="Background Image (Optional)"
                        value={content.process?.hero?.bg_image}
                        onChange={(val) => handleChange('process', 'hero', val, 'bg_image')}
                        folder="site_content/process"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-lg ml-2 text-slate-900 dark:text-white">Process Steps</h3>
                {content.process?.steps?.map((step: any, index: number) => (
                    <div key={index} className="glass-panel overflow-hidden">
                        <button
                            onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                            className="w-full p-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-sm font-bold text-blue-600 shadow-sm border border-slate-200 dark:border-slate-700">
                                    {index + 1}
                                </span>
                                <span className="font-medium text-slate-700 dark:text-slate-200">
                                    {step.title?.en || `Step ${index + 1}`}
                                </span>
                            </div>
                            {expandedStep === index ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                        </button>

                        {expandedStep === index && (
                            <div className="p-6 space-y-6 border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-2 duration-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <LocalizedInput label="Title" value={step.title} onChange={(val) => handleArrayChange('process', 'steps', index, 'title', val)} activeLanguage={activeLanguage} />
                                    <LocalizedTextArea label="Description" value={step.description} onChange={(val) => handleArrayChange('process', 'steps', index, 'description', val)} activeLanguage={activeLanguage} rows={3} />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-3 block text-slate-700 dark:text-slate-300">Details List</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {step.details?.map((detail: any, dIndex: number) => (
                                            <LocalizedInput
                                                key={dIndex}
                                                label={`Detail ${dIndex + 1}`}
                                                value={detail}
                                                onChange={(val) => handleArrayDetailChange('process', 'steps', index, dIndex, val)}
                                                activeLanguage={activeLanguage}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
