import React from 'react';
import { Sparkles } from 'lucide-react';
import { LocalizedInput, LocalizedTextArea } from '../LocalizedFormFields';
import { ImageUpload } from '../ImageUpload';
import { SupportedLanguage } from '../../../utils/localization';

interface ToolsEditorProps {
    content: any;
    handleChange: (section: string, field: string, value: any, nestedField?: string) => void;
    activeLanguage: SupportedLanguage;
}

export const ToolsEditor: React.FC<ToolsEditorProps> = ({ content, handleChange, activeLanguage }) => {
    return (
        <div className="space-y-6">
            {/* Slogan Generator */}
            <div className="glass-panel p-6 space-y-6">
                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                    <Sparkles size={18} /> Slogan Generator
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <LocalizedInput label="Badge" value={content.tools?.slogan?.badge} onChange={(val) => handleChange('tools', 'slogan', val, 'badge')} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Title" value={content.tools?.slogan?.title} onChange={(val) => handleChange('tools', 'slogan', val, 'title')} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Highlight" value={content.tools?.slogan?.highlight} onChange={(val) => handleChange('tools', 'slogan', val, 'highlight')} activeLanguage={activeLanguage} />
                </div>
                <LocalizedTextArea label="Description" value={content.tools?.slogan?.description} onChange={(val) => handleChange('tools', 'slogan', val, 'description')} activeLanguage={activeLanguage} rows={2} />
                <div className="pt-2">
                    <ImageUpload
                        label="Background Image (Optional)"
                        value={content.tools?.slogan?.bg_image}
                        onChange={(val) => handleChange('tools', 'slogan', val, 'bg_image')}
                        folder="site_content/tools"
                    />
                </div>
            </div>

            {/* AI Use Cases */}
            <div className="glass-panel p-6 space-y-6">
                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                    <Sparkles size={18} /> AI Use Cases
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <LocalizedInput label="Badge" value={content.tools?.use_cases?.badge} onChange={(val) => handleChange('tools', 'use_cases', val, 'badge')} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Title" value={content.tools?.use_cases?.title} onChange={(val) => handleChange('tools', 'use_cases', val, 'title')} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Highlight" value={content.tools?.use_cases?.highlight} onChange={(val) => handleChange('tools', 'use_cases', val, 'highlight')} activeLanguage={activeLanguage} />
                </div>
                <LocalizedTextArea label="Description" value={content.tools?.use_cases?.description} onChange={(val) => handleChange('tools', 'use_cases', val, 'description')} activeLanguage={activeLanguage} rows={2} />
            </div>
        </div>
    );
};
