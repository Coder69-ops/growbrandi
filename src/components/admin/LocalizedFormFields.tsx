import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES, SupportedLanguage, LocalizedString } from '../../utils/localization';

interface LanguageTabsProps {
    activeLanguage: SupportedLanguage;
    onChange: (lang: SupportedLanguage) => void;
}

export const LanguageTabs: React.FC<LanguageTabsProps> = ({ activeLanguage, onChange }) => {
    return (
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
            {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                    key={lang}
                    type="button"
                    onClick={() => onChange(lang)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${activeLanguage === lang
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    {LANGUAGE_NAMES[lang]}
                </button>
            ))}
        </div>
    );
};

interface LocalizedInputProps {
    label: string;
    value: LocalizedString;
    onChange: (value: LocalizedString) => void;
    activeLanguage: SupportedLanguage;
    placeholder?: string;
    required?: boolean;
    type?: 'text' | 'textarea';
    rows?: number;
}

export const LocalizedInput: React.FC<LocalizedInputProps> = ({
    label,
    value,
    onChange,
    activeLanguage,
    placeholder,
    required = false,
    type = 'text',
    rows = 3,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange({
            ...(value || {}),
            [activeLanguage]: e.target.value,
        });
    };

    const currentValue = value?.[activeLanguage] || '';
    const inputId = `${label.toLowerCase().replace(/\s+/g, '-')}-${activeLanguage}`;

    const baseClassName = "w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent";

    return (
        <div className="space-y-1">
            <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
                <span className="ml-2 text-xs text-gray-400">({LANGUAGE_NAMES[activeLanguage]})</span>
            </label>
            {type === 'textarea' ? (
                <textarea
                    id={inputId}
                    className={baseClassName}
                    value={currentValue}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={required && activeLanguage === 'en'}
                    rows={rows}
                />
            ) : (
                <input
                    id={inputId}
                    type="text"
                    className={baseClassName}
                    value={currentValue}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={required && activeLanguage === 'en'}
                />
            )}
        </div>
    );
};

// Array field editor for localized arrays (like results, achievements)
interface LocalizedArrayInputProps {
    label: string;
    value: LocalizedString[];
    onChange: (value: LocalizedString[]) => void;
    activeLanguage: SupportedLanguage;
    placeholder?: string;
}

export const LocalizedArrayInput: React.FC<LocalizedArrayInputProps> = ({
    label,
    value,
    onChange,
    activeLanguage,
    placeholder,
}) => {
    const handleItemChange = (index: number, newValue: string) => {
        const updated = [...value];
        updated[index] = {
            ...updated[index],
            [activeLanguage]: newValue,
        };
        onChange(updated);
    };

    const addItem = () => {
        onChange([...value, { en: '' }]);
    };

    const removeItem = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
                <span className="ml-2 text-xs text-gray-400">({LANGUAGE_NAMES[activeLanguage]})</span>
            </label>
            {value.map((item, index) => (
                <div key={index} className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={item[activeLanguage] || ''}
                        onChange={(e) => handleItemChange(index, e.target.value)}
                        placeholder={placeholder}
                    />
                    <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="px-3 py-2 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500/20 transition-colors"
                    >
                        ✕
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={addItem}
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
            >
                + Add Item
            </button>
        </div>
    );
};
