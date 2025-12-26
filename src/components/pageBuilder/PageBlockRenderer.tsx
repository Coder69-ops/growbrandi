import React from 'react';
import { PageBlock } from '../../types/pageBuilder';
import { getBlockInfo } from './blockRegistry';
import { useLocalizedPath } from '../../hooks/useLocalizedPath';

interface PageBlockRendererProps {
    block: PageBlock;
    language?: string;
}

export const PageBlockRenderer: React.FC<PageBlockRendererProps> = ({ block, language = 'en' }) => {
    const { currentLang } = useLocalizedPath();
    const lang = language || currentLang;

    if (!block.enabled) {
        return null;
    }

    try {
        const blockInfo = getBlockInfo(block.type);
        const BlockComponent = blockInfo.component;

        // Get language-specific content
        const content = block.content[lang] || block.content.en;

        if (!BlockComponent) {
            console.warn(`Block component for type "${block.type}" not found`);
            return null;
        }

        return (
            <BlockComponent
                content={content}
                settings={block.settings}
                blockId={block.id}
            />
        );
    } catch (error) {
        console.error(`Error rendering block ${block.id}:`, error);
        return null;
    }
};
