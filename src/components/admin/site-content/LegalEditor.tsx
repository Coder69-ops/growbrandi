import React, { useState } from 'react';
import { Shield, FileText, Cookie, Plus, Trash2 } from 'lucide-react';
import { LocalizedInput, LocalizedTextArea } from '../LocalizedFormFields';
import { SupportedLanguage } from '../../../utils/localization';

interface LegalEditorProps {
    content: any;
    handleChange: (section: string, field: string, value: any, nestedField?: string, deepNested?: string) => void;
    // We'll use a specific handler for legal arrays if needed, or generic handleChange for the object structure
    // Since we are adding 'sections' array support, we might need helpers similar to ProcessEditor, 
    // but SiteContent's handleArrayChange is generic enough?
    // Actually AdminSiteContent has handleArrayChange but it takes specific args.
    // Let's use the patterns from AdminSiteContent.
    activeLanguage: SupportedLanguage;
}

export const LegalEditor: React.FC<LegalEditorProps> = ({ content, handleChange, activeLanguage }) => {
    const [subTab, setSubTab] = useState<'privacy' | 'terms' | 'cookies'>('privacy');

    // Helper to get safe access to the sections array
    const getSections = (page: string) => {
        return content.legal?.[page]?.sections || [];
    };

    // Helper to update a section item
    const updateSection = (page: string, index: number, field: 'title' | 'content', value: any) => {
        const sections = [...getSections(page)];
        if (!sections[index]) sections[index] = {};
        sections[index] = { ...sections[index], [field]: value };

        // Use handleChange to update the entire array
        // section='legal', field=page, nestedField='sections'
        // Using the 'deepNested' param of handleChange for this might be tricky if it expects a string.
        // Let's explicitly construct the new data structure and call handleChange.

        // Actually, looking at AdminSiteContent.handleChange signature:
        // (section, field, newValue, nestedField, deepNestedField)
        // To update content.legal.privacy.sections:
        // handleChange('legal', page, sections, 'sections')
        handleChange('legal', page, sections, 'sections');
    };

    const addSection = (page: string) => {
        const sections = [...getSections(page)];
        sections.push({ title: { en: 'New Section' }, content: { en: 'Content goes here...' } });
        handleChange('legal', page, sections, 'sections');
    };

    const removeSection = (page: string, index: number) => {
        const sections = [...getSections(page)];
        sections.splice(index, 1);
        handleChange('legal', page, sections, 'sections');
    };

    return (
        <div className="space-y-6">
            {/* Sub-tabs for Legal Pages */}
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
                <button
                    onClick={() => setSubTab('privacy')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'privacy' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}
                >
                    <Shield size={16} /> Privacy Policy
                </button>
                <button
                    onClick={() => setSubTab('terms')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'terms' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}
                >
                    <FileText size={16} /> Terms of Service
                </button>
                <button
                    onClick={() => setSubTab('cookies')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'cookies' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}
                >
                    <Cookie size={16} /> Cookie Policy
                </button>
            </div>

            <div className="glass-panel p-6 space-y-6">
                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2 capitalize">
                    {subTab === 'privacy' && <Shield size={18} />}
                    {subTab === 'terms' && <FileText size={18} />}
                    {subTab === 'cookies' && <Cookie size={18} />}
                    {subTab.replace('_', ' ')} Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LocalizedInput
                        label="Page Title"
                        value={content.legal?.[subTab]?.title}
                        onChange={(val) => handleChange('legal', subTab, val, 'title')}
                        activeLanguage={activeLanguage}
                        placeholder={subTab === 'privacy' ? 'Privacy Policy' : subTab === 'terms' ? 'Terms of Service' : 'Cookie Policy'}
                    />
                    <LocalizedInput
                        label="Last Updated Text"
                        value={content.legal?.[subTab]?.last_updated}
                        onChange={(val) => handleChange('legal', subTab, val, 'last_updated')}
                        activeLanguage={activeLanguage}
                        placeholder="Last Updated: January 1, 2024"
                    />
                </div>
            </div>

            <div className="glass-panel p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        Content Sections
                    </h3>
                    <button
                        onClick={() => addSection(subTab)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm font-medium"
                    >
                        <Plus size={16} /> Add Section
                    </button>
                </div>

                <div className="space-y-4">
                    {getSections(subTab).map((section: any, index: number) => (
                        <div key={index} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 relative group">
                            <button
                                type="button"
                                onClick={() => removeSection(subTab, index)}
                                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove Section"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="space-y-4 pr-8">
                                <LocalizedInput
                                    label={`Section ${index + 1} Title`}
                                    value={section.title}
                                    onChange={(val) => updateSection(subTab, index, 'title', val)}
                                    activeLanguage={activeLanguage}
                                />
                                <LocalizedTextArea
                                    label="Content"
                                    value={section.content}
                                    onChange={(val) => updateSection(subTab, index, 'content', val)}
                                    activeLanguage={activeLanguage}
                                    rows={5}
                                />
                            </div>
                        </div>
                    ))}

                    {getSections(subTab).length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            No sections added yet. Add a section to start writing content.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
