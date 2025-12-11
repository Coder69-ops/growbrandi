import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../src/lib/firebase';
import { useTranslation } from 'react-i18next';
import PageLoader from './PageLoader';
import SEO from './SEO';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
    FaCalendar, FaClock, FaUser, FaFacebook, FaTwitter, FaLinkedin, FaLink,
    FaArrowLeft, FaCheckCircle, FaRocket, FaQuoteLeft
} from 'react-icons/fa';
import { useSiteContentData } from '../src/hooks/useSiteContent';
import { GlassCard } from './ui/GlassCard';
import { BackgroundEffects } from './ui/BackgroundEffects';
import { SupportedLanguage, getLocalizedField } from '../src/utils/localization';
import { useLocalizedPath } from '../src/hooks/useLocalizedPath';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Custom Link Component for Markdown
const MarkdownLink = ({ href, children, ...props }: any) => {
    const { getLocalizedPath } = useLocalizedPath();
    const isInternal = href && (href.startsWith('/') || href.startsWith(window.location.origin));
    const finalHref = isInternal ? getLocalizedPath(href) : href;

    return (
        <a
            href={finalHref}
            {...props}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline decoration-blue-300/30 underline-offset-2 transition-colors"
        >
            {children}
        </a>
    );
};

const BlogPostPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { getLocalizedPath } = useLocalizedPath();
    const { content: siteContent, getText } = useSiteContentData();
    const blogSettings = siteContent?.blog_settings || {};

    const [post, setPost] = useState<any>(null);
    const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const lang = i18n.language as SupportedLanguage;

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

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

                    // Fetch related posts
                    if (postData.category) {
                        const relatedQ = query(
                            collection(db, 'blog_posts'),
                            where('category', '==', postData.category),
                            where('status', '==', 'published'),
                            limit(4)
                        );

                        try {
                            const relatedSnap = await getDocs(relatedQ);
                            const related = relatedSnap.docs
                                .map(d => ({ id: d.id, ...d.data() }))
                                .filter((p: any) => p.id !== postId)
                                .slice(0, 3);
                            setRelatedPosts(related);
                        } catch (err) {
                            console.warn("Error fetching related posts:", err);
                        }
                    }

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

                {/* Reading Progress Bar */}
                <motion.div
                    className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-[100] origin-left"
                    style={{ scaleX }}
                />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
                    <button
                        onClick={() => navigate(getLocalizedPath('/blog'))}
                        className="flex items-center gap-2 text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 group"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        {t('common.back', 'Back to Blog')}
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Main Content Column */}
                        <div className="lg:col-span-8">
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
                                                <FaUser className="text-blue-500" /> {typeof post.author === 'object' ? post.author.name : post.author}
                                            </span>
                                        )}
                                    </div>

                                    <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-zinc-300 whitespace-pre-wrap font-light">
                                        {/* Render first half */}
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{ a: MarkdownLink }}
                                        >
                                            {content ? content.split('\n\n').slice(0, 3).join('\n\n') : ''}
                                        </ReactMarkdown>
                                    </div>

                                    {/* Inline CTA */}
                                    {blogSettings.inline_cta?.enabled && (
                                        <div className="my-12 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex flex-col md:flex-row items-center gap-6">
                                            <div className="p-4 bg-blue-100 dark:bg-blue-600/20 rounded-xl shrink-0">
                                                <FaRocket className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="flex-grow text-center md:text-left">
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                                    {getText('blog_settings.inline_cta.title', lang) || "Need help implementing this?"}
                                                </h3>
                                                <p className="text-slate-600 dark:text-blue-200 text-sm">
                                                    {getText('blog_settings.inline_cta.body', lang) || "Our team of experts can guide you through every step."}
                                                </p>
                                            </div>
                                            <a
                                                href={getText('blog_settings.inline_cta.button_url', lang) || blogSettings.inline_cta?.button_url || "/services"}
                                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors whitespace-nowrap shadow-lg shadow-blue-500/30"
                                            >
                                                {getText('blog_settings.inline_cta.button_text', lang) || "Get Expert Help"}
                                            </a>
                                        </div>
                                    )}

                                    <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-zinc-300 whitespace-pre-wrap font-light mt-8">
                                        {/* Render rest of content */}
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{ a: MarkdownLink }}
                                        >
                                            {content ? content.split('\n\n').slice(3).join('\n\n') : ''}
                                        </ReactMarkdown>
                                    </div>

                                    {/* Social Share */}
                                    <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10">
                                        <p className="font-bold text-slate-900 dark:text-white mb-4 text-center uppercase tracking-wider text-sm">Share this article</p>
                                        <div className="flex justify-center gap-4">
                                            <button className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"><FaFacebook /></button>
                                            <button className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"><FaTwitter /></button>
                                            <button className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"><FaLinkedin /></button>
                                            <button className="p-3 bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white rounded-full hover:bg-slate-300 transition-colors"><FaLink /></button>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>

                        {/* Sidebar Column */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* Author Bio */}
                            <GlassCard className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden border-2 border-slate-100 dark:border-slate-700">
                                        <img
                                            src={typeof post.author === 'object' && post.author.image
                                                ? post.author.image
                                                : `https://ui-avatars.com/api/?name=${encodeURIComponent((typeof post.author === 'string' ? post.author : post.author?.name) || 'Author')}&background=random&color=fff`}
                                            alt="Author"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                                            {typeof post.author === 'object' ? post.author.name : (post.author || "Guest Author")}
                                        </h4>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                                            {typeof post.author === 'object' ? (post.author.role ? getLocalizedField(post.author.role, lang) : 'Team Member') : 'Content Specialist'}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed italic border-l-2 border-slate-200 dark:border-slate-700 pl-4 py-1">
                                    {t("blog.author_bio", "Sharing insights on technology, growth, and digital transformation.")}
                                </p>
                            </GlassCard>

                            {/* Sticky CTA Widget */}
                            {blogSettings.sidebar_cta?.enabled && (
                                <div className="sticky top-24">
                                    <GlassCard className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-blue-900/20 dark:to-purple-900/20 border-none text-white relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                                        <h3 className="text-xl font-bold mb-4 font-heading relative z-10">
                                            {getText('blog_settings.sidebar_cta.title', lang) || "Ready to scale your business?"}
                                        </h3>
                                        <p className="text-slate-300 mb-8 text-sm leading-relaxed relative z-10">
                                            {getText('blog_settings.sidebar_cta.body', lang) || "Book a free strategy call with our experts and let's discuss your growth."}
                                        </p>
                                        <a
                                            href={getText('blog_settings.sidebar_cta.button_url', lang) || blogSettings.sidebar_cta?.button_url || "/contact"}
                                            className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 relative z-10"
                                        >
                                            {getText('blog_settings.sidebar_cta.button_text', lang) || "Book Strategy Call"}
                                        </a>

                                        <div className="mt-6 pt-6 border-t border-white/10 relative z-10">
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <FaCheckCircle className="text-green-400" /> <span>Free 30-min consultation</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                                                <FaCheckCircle className="text-green-400" /> <span>No obligation required</span>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Articles Section */}
                    {relatedPosts.length > 0 && (
                        <div className="mt-24 border-t border-slate-200 dark:border-white/10 pt-16">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center font-heading">
                                {t('company.blog.related_articles', 'Related Articles')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {relatedPosts.map((rPost) => (
                                    <GlassCard key={rPost.id} className="p-0 overflow-hidden flex flex-col group h-full" hoverEffect={true}>
                                        <div
                                            onClick={() => navigate(getLocalizedPath(`/blog/${rPost.slug || rPost.id}`))}
                                            className="h-48 overflow-hidden relative block cursor-pointer"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                            <img
                                                src={rPost.image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop"}
                                                alt={rPost.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute bottom-4 left-4 z-20">
                                                <span className="px-3 py-1 bg-blue-600/80 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                                                    {rPost.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6 flex-grow flex flex-col">
                                            <div onClick={() => navigate(getLocalizedPath(`/blog/${rPost.slug || rPost.id}`))} className="cursor-pointer">
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-heading group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                                    {getLocalizedField(rPost.title, lang)}
                                                </h3>
                                            </div>
                                            <span className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1 mt-auto pt-4">
                                                <FaClock className="w-3 h-3" /> {rPost.readTime || '5 min read'}
                                            </span>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default BlogPostPage;
