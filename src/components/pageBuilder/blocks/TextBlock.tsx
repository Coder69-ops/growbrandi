import React from 'react';
import { BlockSettings } from '../../../types/pageBuilder';
import { getSectionClasses, getContainerClasses, getContentClasses, getBackgroundEffects } from '../blockUtils';

interface TextBlockProps {
    content: {
        content?: string;
    };
    settings?: BlockSettings & {
        fontSize?: 'sm' | 'base' | 'lg' | 'xl';
        lineHeight?: 'tight' | 'normal' | 'relaxed' | 'loose';
    };
}

export const TextBlock: React.FC<TextBlockProps> = ({ content, settings }) => {
    const fontSize = settings?.fontSize || 'base';
    const lineHeight = settings?.lineHeight || 'relaxed';

    const fontSizeMap = {
        sm: 'prose-sm',
        base: 'prose-base',
        lg: 'prose-lg',
        xl: 'prose-xl'
    };

    const lineHeightMap = {
        tight: 'prose-tight',
        normal: 'prose-normal',
        relaxed: 'prose-relaxed',
        loose: 'prose-loose'
    };

    return (
        <section className={getSectionClasses(settings)}>
            {/* Background Effects */}
            {getBackgroundEffects(settings)}

            <div className="relative z-10">
                <div className={getContainerClasses(settings)}>
                    <div className={getContentClasses(settings)}>
                        <div
                            className={`prose ${fontSizeMap[fontSize]} prose-slate dark:prose-invert max-w-none prose-headings:font-['Outfit'] prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:font-light prose-a:text-blue-600 dark:prose-a:text-blue-400`}
                            dangerouslySetInnerHTML={{ __html: content.content || '' }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
