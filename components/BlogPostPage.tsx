import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../src/lib/firebase';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaClock, FaCalendar, FaUser } from 'react-icons/fa';
import { GlassCard } from './ui/GlassCard';
import { BackgroundEffects } from './ui/BackgroundEffects';
import PageLoader from './PageLoader';
import SEO from './SEO';
import { getLocalizedField, SupportedLanguage } from '../src/utils/localization';
import { useLocalizedPath } from '../src/hooks/useLocalizedPath';

const BlogPostPage: React.FC = () => {
    // We expect 'slug' from the route, but it might be 'id' in legacy routes or direct access
    const { slug } = useParams<{ slug: string }>();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { getLocalizedPath } = useLocalizedPath();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const lang = i18n.language as SupportedLanguage;

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return;
            try {
                let postData = null;
                let postId = null;

                // 1. Try to find by slug
                const q = query(collection(db, 'blog_posts'), where('slug', '==', slug), limit(1));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docSnap = querySnapshot.docs[0];
                    postData = docSnap.data();
                    postId = docSnap.id;
                } else {
                    // 2. Fallback: Try to find by ID (if slug is actually an ID)
                    const docRef = doc(db, 'blog_posts', slug);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        postData = docSnap.data();
                        postId = docSnap.id;
                    }
                }

                if (postData && postId) {
                    setPost({ id: postId, ...postData });
                } else {
                    console.warn("Blog post not found for slug/id:", slug);
                    navigate(getLocalizedPath('/blog'));
                }
            } catch (error) {
                console.error("Error fetching blog post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug, navigate, getLocalizedPath]);

    if (loading) return <PageLoader />;
    if (!post) return null;

    const title = getLocalizedField(post.title, lang);
    const content = getLocalizedField(post.content, lang);
    const excerpt = getLocalizedField(post.excerpt, lang);
    const image = post.image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop";

    // enhanced SEO
    const metaTitle = (getLocalizedField(post.seo?.metaTitle, lang) || title) as string;
    const metaDesc = (getLocalizedField(post.seo?.metaDescription, lang) || excerpt) as string;
    const keywordsRaw = getLocalizedField(post.seo?.keywords, lang);
    const keywords = typeof keywordsRaw === 'string' ? keywordsRaw.split(',').map(k => k.trim()) : [];

    return (
        <>
            <SEO
                title={metaTitle}
                description={metaDesc}
                keywords={keywords}
                ogImage={image}
            />
            <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] relative overflow-hidden transition-colors duration-300 pt-24 pb-20">
                <BackgroundEffects />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl">
                    <button
                        onClick={() => navigate(getLocalizedPath('/blog'))}
                        className="flex items-center gap-2 text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 group"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        {t('common.back', 'Back to Blog')}
                    </button>

                    <GlassCard className="p-0 overflow-hidden mb-12">
                        <div className="w-full h-64 md:h-96 relative">
                            <img
                                src={image}
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-4">
                                        {post.category}
                                    </span>
                                    <h1 className="text-3xl md:text-5xl font-black text-white font-heading leading-tight">
                                        {title}
                                    </h1>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 md:p-12">
                            <div className="flex flex-wrap gap-6 mb-8 text-sm text-slate-500 dark:text-zinc-400 border-b border-slate-200 dark:border-white/10 pb-8">
                                <span className="flex items-center gap-2">
                                    <FaCalendar className="text-blue-500" /> {post.date}
                                </span>
                                <span className="flex items-center gap-2">
                                    <FaClock className="text-blue-500" /> {post.readTime}
                                </span>
                                {post.author && (
                                    <span className="flex items-center gap-2">
                                        <FaUser className="text-blue-500" /> {post.author}
                                    </span>
                                )}
                            </div>

                            <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-zinc-300 whitespace-pre-wrap font-light">
                                {content}
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </>
    );
};

export default BlogPostPage;
