// Supported languages in the application
export const SUPPORTED_LANGUAGES = ['en', 'de', 'es', 'fr', 'nl'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
    en: 'English',
    de: 'Deutsch',
    es: 'Español',
    fr: 'Français',
    nl: 'Nederlands',
};

// Type for multi-language fields
export type LocalizedString = {
    [key in SupportedLanguage]?: string;
};

/**
 * Get the localized value from a field, with fallback to English.
 * Handles both legacy string fields and new localized object fields.
 */
export const getLocalizedField = (
    field: string | LocalizedString | undefined,
    lang: string
): string => {
    if (!field) return '';

    // Legacy compatibility: if it's a plain string, return it directly
    if (typeof field === 'string') return field;

    // Return the requested language, fallback to English, then to first available
    return field[lang as SupportedLanguage]
        || field['en']
        || Object.values(field).find(v => v)
        || '';
};

/**
 * Create an empty localized string object
 */
export const createEmptyLocalizedString = (): LocalizedString => {
    return SUPPORTED_LANGUAGES.reduce((acc, lang) => {
        acc[lang] = '';
        return acc;
    }, {} as LocalizedString);
};

/**
 * Ensure a field is in the localized format.
 * Converts legacy strings to localized objects.
 */
export const ensureLocalizedFormat = (
    field: string | LocalizedString | undefined
): LocalizedString => {
    if (!field) return createEmptyLocalizedString();

    if (typeof field === 'string') {
        // Convert legacy string to localized format (put in 'en')
        return { ...createEmptyLocalizedString(), en: field };
    }

    return { ...createEmptyLocalizedString(), ...field };
};
