import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { LocalizedInput, LocalizedTextArea } from '../LocalizedFormFields';
import { SupportedLanguage } from '../../../utils/localization';

interface SectionHeadersEditorProps {
    content: any;
    handleChange: (section: string, field: string, value: any, nestedField?: string) => void;
    activeLanguage: SupportedLanguage;
}

const SECTIONS = [
    { id: 'services', label: 'Services' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'team', label: 'Team' },
    { id: 'projects', label: 'Projects' },
    { id: 'faq', label: 'FAQ' }
];

export const SectionHeadersEditor: React.FC<SectionHeadersEditorProps> = ({ content, handleChange, activeLanguage }) => {
    const [activeSection, setActiveSection] = useState('services');

    return (
        <div className="space-y-6">
            {/* Sub-navigation for Section Headers */}
            <div className="flex flex-wrap gap-2 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
                {SECTIONS.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeSection === section.id
                                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                    >
                        {section.label}
                    </button>
                ))}
            </div>

            <div className="glass-panel p-6 space-y-4">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white capitalize flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                    <Info size={18} className="text-blue-500" />
                    {activeSection} Section Header
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <LocalizedInput
                        label="Badge"
                        value={content.section_headers?.[activeSection]?.badge}
                        onChange={(val) => handleChange('section_headers', activeSection, val, 'badge')}
                        activeLanguage={activeLanguage}
                    />
                    <LocalizedInput
                        label="Title"
                        value={content.section_headers?.[activeSection]?.title}
                        onChange={(val) => handleChange('section_headers', activeSection, val, 'title')}
                        activeLanguage={activeLanguage}
                    />
                    <LocalizedInput
                        label="Highlight"
                        value={content.section_headers?.[activeSection]?.highlight}
                        onChange={(val) => handleChange('section_headers', activeSection, val, 'highlight')}
                        activeLanguage={activeLanguage}
                    />
                </div>
                <LocalizedTextArea
                    label="Description"
                    value={content.section_headers?.[activeSection]?.description}
                    onChange={(val) => handleChange('section_headers', activeSection, val, 'description')}
                    activeLanguage={activeLanguage}
                    rows={2}
                />
            </div>
        </div>
    );
};
