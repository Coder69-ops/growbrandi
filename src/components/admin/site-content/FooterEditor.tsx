import React from 'react';
import { Layout } from 'lucide-react';
import { LocalizedInput, LocalizedTextArea } from '../LocalizedFormFields';
import { SupportedLanguage } from '../../../utils/localization';

interface FooterEditorProps {
    content: any;
    handleChange: (section: string, field: string, value: any) => void;
    activeLanguage: SupportedLanguage;
}

export const FooterEditor: React.FC<FooterEditorProps> = ({ content, handleChange, activeLanguage }) => {
    return (
        <div className="glass-panel p-6 space-y-6">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Layout size={20} className="text-slate-500" />
                Footer Content
            </h3>
            <LocalizedTextArea label="Tagline" value={content.footer?.tagline_desc} onChange={(val) => handleChange('footer', 'tagline_desc', val)} activeLanguage={activeLanguage} rows={2} />
            <LocalizedInput label="Copyright Text" value={content.footer?.copyright} onChange={(val) => handleChange('footer', 'copyright', val)} activeLanguage={activeLanguage} />
        </div>
    );
};
