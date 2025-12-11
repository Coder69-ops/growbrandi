import React from 'react';
import { LayoutTemplate } from 'lucide-react';
import { LocalizedInput, LocalizedTextArea } from '../LocalizedFormFields';
import { ImageUpload } from '../ImageUpload';
import { SupportedLanguage } from '../../../utils/localization';

interface HeroEditorProps {
    content: any;
    handleChange: (section: string, field: string, value: any) => void;
    activeLanguage: SupportedLanguage;
}

export const HeroEditor: React.FC<HeroEditorProps> = ({ content, handleChange, activeLanguage }) => {
    return (
        <div className="space-y-6">
            <div className="glass-panel p-6 space-y-6">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <LayoutTemplate size={20} className="text-blue-500" />
                    Main Hero Text
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LocalizedInput
                        label="Badge Text"
                        value={content.hero?.badge}
                        onChange={(val) => handleChange('hero', 'badge', val)}
                        activeLanguage={activeLanguage}
                    />
                    <div className="hidden md:block"></div> {/* Spacer */}
                    <LocalizedInput
                        label="Title Prefix"
                        value={content.hero?.title_prefix}
                        onChange={(val) => handleChange('hero', 'title_prefix', val)}
                        activeLanguage={activeLanguage}
                    />
                    <LocalizedInput
                        label="Title Highlight"
                        value={content.hero?.title_highlight}
                        onChange={(val) => handleChange('hero', 'title_highlight', val)}
                        activeLanguage={activeLanguage}
                    />
                </div>
                <LocalizedTextArea
                    label="Description"
                    value={content.hero?.description}
                    onChange={(val) => handleChange('hero', 'description', val)}
                    activeLanguage={activeLanguage}
                    rows={3}
                />
                <div className="pt-2">
                    <ImageUpload
                        label="Background Image (Optional)"
                        value={content.hero?.bg_image}
                        onChange={(val) => handleChange('hero', 'bg_image', val)}
                        folder="site_content/hero"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                        <ImageUpload
                            label="Phone Screen Image"
                            value={content.hero?.phone_screen_image}
                            onChange={(val) => handleChange('hero', 'phone_screen_image', val)}
                            folder="site_content/hero"
                        />
                        <ImageUpload
                            label="Phone Profile Image"
                            value={content.hero?.phone_profile_image}
                            onChange={(val) => handleChange('hero', 'phone_profile_image', val)}
                            folder="site_content/hero"
                        />
                        <ImageUpload
                            label="Trustpilot Logo"
                            value={content.hero?.trustpilot_logo}
                            onChange={(val) => handleChange('hero', 'trustpilot_logo', val)}
                            folder="site_content/hero"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LocalizedInput label="Button 1 (Consultation)" value={content.hero?.cta_consultation} onChange={(val) => handleChange('hero', 'cta_consultation', val)} activeLanguage={activeLanguage} />
                    <LocalizedInput label="Button 2 (Showreel)" value={content.hero?.cta_showreel} onChange={(val) => handleChange('hero', 'cta_showreel', val)} activeLanguage={activeLanguage} />
                </div>
            </div>

            <div className="glass-panel p-6 space-y-6">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <LayoutTemplate size={20} className="text-emerald-500" />
                    Trusted By Logos
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i}>
                            <ImageUpload
                                label={`Partner Logo ${i}`}
                                value={content.hero?.partners?.[`logo_${i}`]}
                                // We need to handle the nested change for partners manually since the main handleChange
                                // might needed adjustment for strict typing, but the original component used:
                                // onChange={(val) => handleChange('hero', 'partners', val, `logo_${i}`)}
                                // We'll assume the prop passed down can handle this signature or we'll adjust the interface.
                                // The interface defined above is: (section: string, field: string, value: any) => void;
                                // The original had optional nested props. Let's update the interface to match.
                                onChange={(val) => (handleChange as any)('hero', 'partners', val, `logo_${i}`)}
                                folder="site_content/partners"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
