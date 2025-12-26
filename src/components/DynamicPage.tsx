import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCustomPages } from '../hooks/useCustomPages';
import { useLocalizedPath } from '../hooks/useLocalizedPath';
import { PageBlockRenderer } from './pageBuilder/PageBlockRenderer';
import PageLoader from '../../components/PageLoader';
import NotFoundPage from '../../components/NotFoundPage';
import SEO from '../../components/SEO';

export const DynamicPage: React.FC = () => {
    const { customSlug } = useParams<{ customSlug: string }>();
    const { fetchPageBySlug } = useCustomPages();
    const { currentLang } = useLocalizedPath();
    const [page, setPage] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const loadPage = async () => {
            if (!customSlug) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Only fetch published pages for public viewing
                const pageData = await fetchPageBySlug(customSlug, 'published');

                if (pageData) {
                    setPage(pageData);
                    setNotFound(false);
                } else {
                    setNotFound(true);
                }
            } catch (error) {
                console.error('Error loading custom page:', error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        loadPage();
    }, [customSlug, fetchPageBySlug]);

    if (loading) {
        return <PageLoader />;
    }

    if (notFound || !page) {
        return <NotFoundPage />;
    }

    // Get language-specific content
    const pageTitle = page.title[currentLang] || page.title.en;
    const seoTitle = page.seo?.title?.[currentLang] || page.seo?.title?.en || pageTitle;
    const seoDescription = page.seo?.description?.[currentLang] || page.seo?.description?.en || '';

    return (
        <>
            {/* SEO */}
            <SEO
                title={seoTitle}
                description={seoDescription}
                keywords={page.seo?.keywords || []}
                ogImage={page.seo?.ogImage}
                noIndex={page.seo?.noIndex}
                canonicalUrl={`https://growbrandi.com/${currentLang}/${page.slug}`}
            />

            {/* Render page blocks */}
            <div className="w-full">
                {page.blocks
                    ?.sort((a: any, b: any) => a.order - b.order)
                    .map((block: any) => (
                        <PageBlockRenderer
                            key={block.id}
                            block={block}
                            language={currentLang}
                        />
                    ))}

                {/* Empty state */}
                {(!page.blocks || page.blocks.length === 0) && (
                    <div className="min-h-[60vh] flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                {pageTitle}
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                This page doesn't have any content yet.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom CSS if provided */}
            {page.settings?.customCSS && (
                <style dangerouslySetInnerHTML={{ __html: page.settings.customCSS }} />
            )}
        </>
    );
};

export default DynamicPage;
