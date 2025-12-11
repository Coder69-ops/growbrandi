import React from 'react';
import { Info, Users, Sparkles } from 'lucide-react';
import { LocalizedInput, LocalizedTextArea } from '../LocalizedFormFields';
import { ImageUpload } from '../ImageUpload';
import { SupportedLanguage } from '../../../utils/localization';

interface AboutEditorProps {
    content: any;
    handleChange: (section: string, field: string, value: any, nestedField?: string, deepNested?: string) => void;
    activeLanguage: SupportedLanguage;
}

export const AboutEditor: React.FC<AboutEditorProps> = ({ content, handleChange, activeLanguage }) => {
    return (
        <div className="space-y-6">
            <div className="glass-panel p-6 space-y-6">
                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                    <Info size={18} /> Hero Section
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <LocalizedInput label="Badge" value={content.about?.hero?.badge} onChange={(val) => handleChange('about', 'hero', val, 'badge')} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Title" value={content.about?.hero?.title} onChange={(val) => handleChange('about', 'hero', val, 'title')} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Highlight" value={content.about?.hero?.highlight} onChange={(val) => handleChange('about', 'hero', val, 'highlight')} activeLanguage={activeLanguage} />
                </div>
                <LocalizedTextArea label="Description" value={content.about?.hero?.description} onChange={(val) => handleChange('about', 'hero', val, 'description')} activeLanguage={activeLanguage} />
                <div className="pt-2">
                    <ImageUpload
                        label="Background Image (Optional)"
                        value={content.about?.hero?.bg_image}
                        onChange={(val) => handleChange('about', 'hero', val, 'bg_image')}
                        folder="site_content/about"
                    />
                </div>
            </div>

            <div className="glass-panel p-6 space-y-6">
                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                    <Users size={18} /> Our Story
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LocalizedInput label="Title" value={content.about?.story?.title} onChange={(val) => handleChange('about', 'story', val, 'title')} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Highlight" value={content.about?.story?.title_highlight} onChange={(val) => handleChange('about', 'story', val, 'title_highlight')} activeLanguage={activeLanguage} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LocalizedTextArea label="Paragraph 1" value={content.about?.story?.p1} onChange={(val) => handleChange('about', 'story', val, 'p1')} activeLanguage={activeLanguage} rows={4} />
                    <LocalizedTextArea label="Paragraph 2" value={content.about?.story?.p2} onChange={(val) => handleChange('about', 'story', val, 'p2')} activeLanguage={activeLanguage} rows={4} />
                </div>
            </div>

            <div className="glass-panel p-6 space-y-6">
                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                    <Sparkles size={18} /> Company Values
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {['innovation', 'client', 'quality'].map(key => (
                        <div key={key} className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                            <h4 className="font-bold capitalize mb-4 text-slate-700 dark:text-slate-300">{key}</h4>
                            <div className="space-y-4">
                                <LocalizedInput label="Title" value={content.about?.values?.[key]?.title} onChange={(val) => handleChange('about', 'values', val, key, 'title')} activeLanguage={activeLanguage} />
                                <LocalizedTextArea label="Description" value={content.about?.values?.[key]?.desc} onChange={(val) => handleChange('about', 'values', val, key, 'desc')} activeLanguage={activeLanguage} rows={3} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
