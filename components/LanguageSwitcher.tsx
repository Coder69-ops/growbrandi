import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const languages = [
    { code: 'en', name: 'English', flag: '/flags/us.svg' },
    { code: 'nl', name: 'Nederlands', flag: '/flags/nl.svg' },
    { code: 'de', name: 'Deutsch', flag: '/flags/de.svg' },
    { code: 'es', name: 'Español', flag: '/flags/es.svg' },
    { code: 'fr', name: 'Français', flag: '/flags/be.svg' }, // Using Belgium flag since specifically targeting Belgium for French
];



export function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const changeLanguage = (lng: string) => {
        const currentPath = location.pathname;
        const currentLang = i18n.language;

        // Strip existing language prefix if present (e.g. /es/about -> /about)
        let cleanPath = currentPath;
        if (currentLang !== 'en' && currentPath.startsWith(`/${currentLang}`)) {
            cleanPath = currentPath.replace(`/${currentLang}`, '');
        }

        // Handle root path normalize
        if (cleanPath === '') cleanPath = '/';

        // Construct new path
        let newPath;
        if (lng === 'en') {
            // Target is English -> use clean path (e.g. /about)
            newPath = cleanPath;
        } else {
            // Target is other -> add prefix (e.g. /es/about)
            newPath = `/${lng}${cleanPath === '/' ? '' : cleanPath}`;
        }

        navigate(newPath);
        setIsOpen(false);
    };

    const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full 
                          bg-slate-100 dark:bg-white/5 
                          hover:bg-slate-200 dark:hover:bg-white/10 
                          border border-slate-200 dark:border-white/10 
                          backdrop-blur-sm transition-all duration-200 group"
                aria-label="Select Language"
                aria-expanded={isOpen}
            >
                <div className="w-5 h-5 rounded-full overflow-hidden relative shadow-sm ring-1 ring-slate-200 dark:ring-white/10">
                    <img
                        src={currentLanguage.flag}
                        alt={currentLanguage.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden md:block group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                    {currentLanguage.code.toUpperCase()}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-56 py-2 
                                  bg-white dark:bg-[#1A1D24] 
                                  backdrop-blur-xl border border-slate-200 dark:border-white/10 
                                  rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/40 z-[100] overflow-hidden"
                    >
                        <div className="px-2 pb-2 mb-2 border-b border-slate-100 dark:border-white/5">
                            <span className="px-2 text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                                Select Language
                            </span>
                        </div>
                        <div className="px-2 space-y-0.5">
                            {languages.map((language) => {
                                const isActive = i18n.language === language.code;
                                return (
                                    <button
                                        key={language.code}
                                        onClick={() => changeLanguage(language.code)}
                                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center gap-3 transition-all duration-200
                                            ${isActive
                                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                            }
                                        `}
                                    >
                                        <div className={`w-5 h-5 rounded-full overflow-hidden relative shadow-sm flex-shrink-0 ring-1 ${isActive ? 'ring-blue-200 dark:ring-blue-500/30' : 'ring-slate-200 dark:ring-white/10'}`}>
                                            <img
                                                src={language.flag}
                                                alt={language.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="font-medium flex-1">{language.name}</span>
                                        {isActive && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 shadow-sm shadow-blue-500/50"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
