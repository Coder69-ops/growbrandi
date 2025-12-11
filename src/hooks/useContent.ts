import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getLocalizedField } from '../utils/localization';
import { useTranslation } from 'react-i18next';

export interface UseContentOptions {
    /** Field that contains the localized content */
    localizedFields?: string[];
}

/**
 * Hook to fetch data from Firestore.
 * Automatically handles localization of specified fields.
 */
export const useContent = <T extends Record<string, any>>(
    collectionName: string,
    options?: UseContentOptions
): { data: T[]; loading: boolean; error: Error | null } => {
    const [rawData, setRawData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { i18n } = useTranslation();

    // Fetch raw data once
    useEffect(() => {
        setLoading(true);
        const unsubscribe = onSnapshot(
            collection(db, collectionName),
            (snapshot) => {
                const docs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Basic sort by order if present
                docs.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
                setRawData(docs);
                setLoading(false);
            },
            (err) => {
                console.error(`Error fetching ${collectionName}:`, err);
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [collectionName]);

    // Localize data efficiently without refetching
    const data = React.useMemo(() => {
        return rawData.map(item => {
            const localizedItem = { ...item };

            if (options?.localizedFields) {
                options.localizedFields.forEach(field => {
                    const val = localizedItem[field];
                    // Only localise if it's an object AND NOT an array
                    if (val && typeof val === 'object' && !Array.isArray(val)) {
                        localizedItem[`_raw_${field}`] = val; // Keep raw for editing
                        localizedItem[field] = getLocalizedField(val, i18n.language);
                    }
                });
            }
            return localizedItem as T;
        });
    }, [rawData, i18n.language, JSON.stringify(options?.localizedFields)]);

    return { data, loading, error };
};

/**
 * Simplified hook that returns localized content
 */
export const useLocalizedContent = <T extends Record<string, any>>(
    collectionName: string,
    localizedFields: string[] = []
): { data: T[]; loading: boolean } => {
    const { data, loading } = useContent<T>(collectionName, { localizedFields });
    return { data, loading };
};
