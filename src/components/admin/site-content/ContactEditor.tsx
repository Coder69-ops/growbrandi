import React from 'react';
import { Phone, Info } from 'lucide-react';
import { LocalizedInput, LocalizedTextArea } from '../LocalizedFormFields';
import { ImageUpload } from '../ImageUpload';
import { SupportedLanguage } from '../../../utils/localization';

interface ContactEditorProps {
    content: any;
    handleChange: (section: string, field: string, value: any, nestedField?: string) => void;
    activeLanguage: SupportedLanguage;
}

export const ContactEditor: React.FC<ContactEditorProps> = ({ content, handleChange, activeLanguage }) => {
    return (
        <div className="space-y-6">
            <div className="glass-panel p-6 space-y-6">
                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                    <Phone size={18} /> Hero Section
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <LocalizedInput label="Badge" value={content.contact?.hero?.badge} onChange={(val) => handleChange('contact', 'hero', val, 'badge')} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Title" value={content.contact?.hero?.title} onChange={(val) => handleChange('contact', 'hero', val, 'title')} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Highlight" value={content.contact?.hero?.highlight} onChange={(val) => handleChange('contact', 'hero', val, 'highlight')} activeLanguage={activeLanguage} />
                </div>
                <LocalizedTextArea label="Description" value={content.contact?.hero?.description} onChange={(val) => handleChange('contact', 'hero', val, 'description')} activeLanguage={activeLanguage} />
                <div className="pt-2">
                    <ImageUpload
                        label="Background Image (Optional)"
                        value={content.contact?.hero?.bg_image}
                        onChange={(val) => handleChange('contact', 'hero', val, 'bg_image')}
                        folder="site_content/contact"
                    />
                </div>
            </div>
            <div className="glass-panel p-6 space-y-6">
                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                    <Info size={18} /> Info Labels
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LocalizedInput label="Email Label" value={content.contact?.info_labels?.email} onChange={(val) => handleChange('contact', 'info_labels', val, 'email')} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Call Label" value={content.contact?.info_labels?.call} onChange={(val) => handleChange('contact', 'info_labels', val, 'call')} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Visit Label" value={content.contact?.info_labels?.visit} onChange={(val) => handleChange('contact', 'info_labels', val, 'visit')} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Response Time" value={content.contact?.info_labels?.response_time} onChange={(val) => handleChange('contact', 'info_labels', val, 'response_time')} activeLanguage={activeLanguage} />
                </div>
            </div>
        </div>
    );
};
