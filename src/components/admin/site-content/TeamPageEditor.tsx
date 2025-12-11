import React from 'react';
import { Users, Box } from 'lucide-react';
import { LocalizedInput, LocalizedTextArea } from '../LocalizedFormFields';
import { ImageUpload } from '../ImageUpload';
import { SupportedLanguage } from '../../../utils/localization';

interface TeamPageEditorProps {
    content: any;
    handleChange: (section: string, field: string, value: any, nestedField?: string) => void;
    activeLanguage: SupportedLanguage;
}

export const TeamPageEditor: React.FC<TeamPageEditorProps> = ({ content, handleChange, activeLanguage }) => {
    return (
        <div className="space-y-6">
            <div className="glass-panel p-6 space-y-6">
                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                    <Users size={18} /> Hero Section
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <LocalizedInput label="Badge" value={content.team_page?.hero?.badge} onChange={(val) => handleChange('team_page', 'hero', val, 'badge')} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Title" value={content.team_page?.hero?.title} onChange={(val) => handleChange('team_page', 'hero', val, 'title')} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Highlight" value={content.team_page?.hero?.highlight} onChange={(val) => handleChange('team_page', 'hero', val, 'highlight')} activeLanguage={activeLanguage} />
                </div>
                <LocalizedTextArea label="Description" value={content.team_page?.hero?.description} onChange={(val) => handleChange('team_page', 'hero', val, 'description')} activeLanguage={activeLanguage} />
                <div className="pt-2">
                    <ImageUpload
                        label="Background Image (Optional)"
                        value={content.team_page?.hero?.bg_image}
                        onChange={(val) => handleChange('team_page', 'hero', val, 'bg_image')}
                        folder="site_content/team"
                    />
                </div>
            </div>
            <div className="glass-panel p-6 space-y-6">
                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                    <Box size={18} /> CTA Section
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LocalizedInput label="Title" value={content.team_page?.cta?.title} onChange={(val) => handleChange('team_page', 'cta', val, 'title')} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Highlight" value={content.team_page?.cta?.highlight} onChange={(val) => handleChange('team_page', 'cta', val, 'highlight')} activeLanguage={activeLanguage} />
                </div>
                <LocalizedTextArea label="Description" value={content.team_page?.cta?.description} onChange={(val) => handleChange('team_page', 'cta', val, 'description')} activeLanguage={activeLanguage} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LocalizedInput label="Button 1" value={content.team_page?.cta?.start_project} onChange={(val) => handleChange('team_page', 'cta', val, 'start_project')} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Button 2" value={content.team_page?.cta?.learn_more} onChange={(val) => handleChange('team_page', 'cta', val, 'learn_more')} activeLanguage={activeLanguage} />
                </div>
            </div>
        </div>
    );
};
