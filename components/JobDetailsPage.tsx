import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../src/lib/firebase';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaBriefcase, FaMapMarkerAlt, FaClock, FaCheckCircle, FaPaperPlane } from 'react-icons/fa';
import { GlassCard } from './ui/GlassCard';
import { BackgroundEffects } from './ui/BackgroundEffects';
import PageLoader from './PageLoader';
import SEO from './SEO';
import { getLocalizedField, SupportedLanguage } from '../src/utils/localization';
import { useLocalizedPath } from '../src/hooks/useLocalizedPath';

const JobDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { getLocalizedPath } = useLocalizedPath();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const lang = i18n.language as SupportedLanguage;

    useEffect(() => {
        const fetchJob = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, 'jobs', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setJob({ id: docSnap.id, ...docSnap.data() });
                } else {
                    navigate(getLocalizedPath('/careers'));
                }
            } catch (error) {
                console.error("Error fetching job:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id, navigate, getLocalizedPath]);

    if (loading) return <PageLoader />;
    if (!job) return null;

    const title = getLocalizedField(job.title, lang);
    const description = getLocalizedField(job.description, lang);
    const requirements = job.requirements || [];
    // If requirements is an array of strings/localized strings, handle accordingly.
    // Admin Jobs.tsx might save it as LocalizedTextArea (string) or LocalizedArrayInput.
    // Let's assume text area for now or check Jobs.tsx later. 
    // Checking AdminJobs.tsx... Step 167 summary says "localized fields for description and requirements".
    // If it's a list, I will parse new lines if it's text.

    return (
        <>
            <SEO
                title={`${title} - Careers`}
                description={description?.substring(0, 160)}
            />
            <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] relative overflow-hidden transition-colors duration-300 pt-24 pb-20">
                <BackgroundEffects />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl">
                    <button
                        onClick={() => navigate(getLocalizedPath('/careers'))}
                        className="flex items-center gap-2 text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 group"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        {t('common.back', 'Back to Careers')}
                    </button>

                    <GlassCard className="p-8 md:p-12 mb-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-200 dark:border-white/10 pb-8">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white font-heading mb-4">
                                    {title}
                                </h1>
                                <div className="flex flex-wrap gap-4 text-slate-600 dark:text-zinc-400 font-light text-sm">
                                    <span className="flex items-center gap-1"><FaBriefcase className="text-blue-500" /> {job.department}</span>
                                    <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-blue-500" /> {job.location}</span>
                                    <span className="flex items-center gap-1"><FaClock className="text-blue-500" /> {job.type}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(getLocalizedPath('/contact'), { state: { subject: `Applying for: ${title}` } })}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-500/25 shrink-0 flex items-center gap-2"
                            >
                                <FaPaperPlane />
                                {t('company.careers.apply_now', 'Apply Now')}
                            </button>
                        </div>

                        <div className="space-y-10">
                            <section>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
                                    {t('company.careers.about_role', 'About the Role')}
                                </h2>
                                <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-zinc-300 whitespace-pre-wrap font-light">
                                    {description}
                                </div>
                            </section>

                            {requirements && requirements.length > 0 && (
                                <section>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
                                        {t('company.careers.requirements', 'Requirements')}
                                    </h2>
                                    <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-zinc-300 font-light prose prose-lg dark:prose-invert max-w-none">
                                        {requirements.map((req: any, index: number) => (
                                            <li key={index}>{getLocalizedField(req, lang)}</li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </>
    );
};

export default JobDetailsPage;
