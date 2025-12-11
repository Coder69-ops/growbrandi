import React from 'react';
import { Briefcase } from 'lucide-react';
import { LocalizedInput, LocalizedTextArea } from '../LocalizedFormFields';
import { ImageUpload } from '../ImageUpload';
import { SupportedLanguage } from '../../../utils/localization';

interface CareersEditorProps {
    content: any;
    handleChange: (section: string, field: string, value: any, nestedField?: string) => void;
    activeLanguage: SupportedLanguage;
}

export const CareersEditor: React.FC<CareersEditorProps> = ({ content, handleChange, activeLanguage }) => {
    return (
        <div className="space-y-6">
            <div className="glass-panel p-6 space-y-6">
                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                    <Briefcase size={18} /> Hero Section
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <LocalizedInput label="Badge" value={content.careers?.hero?.badge} onChange={(val) => handleChange('careers', 'hero', val, 'badge')} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Title" value={content.careers?.hero?.title} onChange={(val) => handleChange('careers', 'hero', val, 'title')} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Highlight" value={content.careers?.hero?.highlight} onChange={(val) => handleChange('careers', 'hero', val, 'highlight')} activeLanguage={activeLanguage} />
                </div>
                <LocalizedTextArea label="Description" value={content.careers?.hero?.description} onChange={(val) => handleChange('careers', 'hero', val, 'description')} activeLanguage={activeLanguage} />
                <div className="pt-2">
                    <ImageUpload
                        label="Background Image (Optional)"
                        value={content.careers?.hero?.bg_image}
                        onChange={(val) => handleChange('careers', 'hero', val, 'bg_image')}
                        folder="site_content/careers"
                    />
                </div>
            </div>
            <div className="glass-panel p-6 space-y-6">
                <h3 className="font-semibold text-lg text-blue-600">Open Positions Header</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LocalizedInput label="Title" value={content.careers?.open_positions?.title} onChange={(val) => handleChange('careers', 'open_positions', val, 'title')} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Highlight" value={content.careers?.open_positions?.highlight} onChange={(val) => handleChange('careers', 'open_positions', val, 'highlight')} activeLanguage={activeLanguage} />
                </div>
            </div>
        </div>
    );
};
