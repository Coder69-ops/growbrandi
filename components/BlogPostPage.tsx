import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../src/lib/firebase';
import { useTranslation } from 'react-i18next';
import PageLoader from './PageLoader';
import SEO from './SEO';
import { BlogPostSkeleton } from './skeletons/BlogSkeletons';
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
import { FaPaperPlane, FaListUl } from 'react-icons/fa'; // Added imports
import { createArticleSchema } from '../src/utils/schemas';
import { useSiteSettings } from '../src/hooks/useSiteSettings';

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

// --- Helper for ID Generation ---
const generateId = (text: string) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
};

// --- Custom Components ---
const CustomComponents = {
    a: MarkdownLink,
    h2: ({ children, ...props }: any) => {
        const id = generateId(String(children));
        return (
            <h2 id={id} className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6 scroll-mt-24 relative group font-heading" {...props}>
                <a href={`#${id}`} className="absolute -left-6 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-500 transition-opacity p-1">#</a>
                {children}
            </h2>
        );
    },
    h3: ({ children, ...props }: any) => {
        const id = generateId(String(children));
        return (
            <h3 id={id} className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4 scroll-mt-24 font-heading" {...props}>
                {children}
            </h3>
        );
    },
    blockquote: ({ children, ...props }: any) => (
        <blockquote className="border-l-4 border-blue-500 pl-6 italic text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 py-4 px-4 rounded-r-lg my-8 shadow-sm" {...props}>
            {children}
        </blockquote>
    ),
    ul: ({ children, ...props }: any) => (
        <ul className="list-disc list-outside ml-6 space-y-2 my-6 text-slate-700 dark:text-slate-300" {...props}>
            {children}
        </ul>
    ),
    ol: ({ children, ...props }: any) => (
        <ol className="list-decimal list-outside ml-6 space-y-2 my-6 text-slate-700 dark:text-slate-300" {...props}>
            {children}
        </ol>
    ),
    img: ({ src, alt, ...props }: any) => (
        <figure className="my-10">
            <img
                src={src}
                alt={alt}
                className="w-full rounded-2xl shadow-lg border border-slate-200 dark:border-white/10"
                {...props}
            />
            {alt && <figcaption className="text-center text-sm text-slate-500 mt-3 italic">{alt}</figcaption>}
        </figure>
    ),
    hr: () => <hr className="my-12 border-slate-200 dark:border-white/10" />
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

    // Extract Headings for TOC (Moved before conditional returns)
    const headings = React.useMemo(() => {
        if (!post?.content) return [];
        // Helper to get content without full render overhead
        const rawContent = getLocalizedField(post.content, lang);
        if (!rawContent || typeof rawContent !== 'string') return [];

        const lines = rawContent.split('\n');
        const matches: any[] = [];
        lines.forEach((line: string) => {
            const match = line.match(/^(#{2,3})\s+(.*)$/);
            if (match) {
                matches.push({
                    level: match[1].length,
                    text: match[2],
                    id: generateId(match[2])
                });
            }
        });
        return matches;
    }, [post, lang]);

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

    if (loading) return <BlogPostSkeleton />;
    if (!post) return null;

    const title = getLocalizedField(post.title, lang);
    const content = getLocalizedField(post.content, lang);
    const excerpt = getLocalizedField(post.excerpt, lang);
    const image = post.image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop";

    const { settings } = useSiteSettings();

    // enhanced SEO
    const metaTitle = (getLocalizedField(post.seo?.metaTitle, lang) || title) as string;
    const metaDesc = (getLocalizedField(post.seo?.metaDescription, lang) || excerpt) as string;
    const keywordsRaw = getLocalizedField(post.seo?.keywords, lang);
    const keywords = typeof keywordsRaw === 'string' ? keywordsRaw.split(',').map(k => k.trim()) : [];

    // Generate Article Schema
    const articleSchema = createArticleSchema({
        headline: metaTitle,
        description: metaDesc,
        image: image,
        datePublished: post.date, // Assuming post.date is valid ISO string or simple date string
        author: {
            name: typeof post.author === 'object' ? post.author.name : (post.author || "GrowBrandi Team"),
            url: typeof post.author === 'object' && post.author.role ? undefined : undefined // Could link to team page if we had slug
        },
        publisher: {
            name: "GrowBrandi",
            logoUrl: settings?.branding?.logoLight || "https://growbrandi.com/growbrandi-logo.png"
        },
        url: window.location.href
    });

    return (
        <>
            <SEO
                title={metaTitle}
                description={metaDesc}
                keywords={keywords}
                ogImage={image}
                schema={articleSchema}
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
                        <span className="group-hover:-translate-x-1 transition-transform"><FaArrowLeft /></span>
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
                                            <span className="text-blue-500"><FaCalendar /></span> {post.date}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <span className="text-blue-500"><FaClock /></span> {post.readTime}
                                        </span>
                                        {post.author && (
                                            <span className="flex items-center gap-2">
                                                <span className="text-blue-500"><FaUser /></span> {typeof post.author === 'object' ? post.author.name : post.author}
                                            </span>
                                        )}
                                    </div>

                                    <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-zinc-300 font-light">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={CustomComponents as any}
                                        >
                                            {content || ''}
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
                                    {typeof post.author === 'object' && post.author.bio
                                        ? getLocalizedField(post.author.bio, lang)
                                        : t("blog.author_bio", "Sharing insights on technology, growth, and digital transformation.")}
                                </p>
                            </GlassCard>

                            {/* Table of Contents Widget */}
                            {headings.length > 0 && (
                                <GlassCard className="p-6 sticky top-24">
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <FaListUl className="text-blue-500" />
                                        Table of Contents
                                    </h4>
                                    <nav className="flex flex-col space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                        {headings.map((heading: any, index: number) => (
                                            <a
                                                key={index}
                                                href={`#${heading.id}`}
                                                className={`text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-400 block truncate ${heading.level === 3 ? 'pl-4 text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-300 font-medium'
                                                    }`}
                                            >
                                                {heading.text}
                                            </a>
                                        ))}
                                    </nav>
                                </GlassCard>
                            )}

                            {/* Newsletter / Lead Magnet Widget */}
                            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                                <h3 className="text-xl font-bold mb-2 relative z-10">Get Growth Insights</h3>
                                <p className="text-blue-100 text-sm mb-4 relative z-10">
                                    Join 5,000+ founders receiving our weekly deep dives on AI & Branding.
                                </p>
                                <form onSubmit={(e) => e.preventDefault()} className="space-y-3 relative z-10">
                                    <input
                                        type="email"
                                        placeholder="Your email address"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/20 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                                    />
                                    <button className="w-full bg-white text-indigo-700 font-bold py-2.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 shadow-lg">
                                        <FaPaperPlane size={14} />
                                        Subscribe Free
                                    </button>
                                </form>
                                <p className="text-[10px] text-blue-200 mt-3 text-center opacity-80">
                                    No spam. Unsubscribe anytime.
                                </p>
                            </div>

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
                                                <span className="text-green-400"><FaCheckCircle /></span> <span>Free 30-min consultation</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                                                <span className="text-green-400"><FaCheckCircle /></span> <span>No obligation required</span>
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
                                                <span className="w-3 h-3"><FaClock /></span> {rPost.readTime || '5 min read'}
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
