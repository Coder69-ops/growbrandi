import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getLocalizedField } from '../utils/localization';
import { useTranslation } from 'react-i18next';

export interface UseContentOptions {
    /** Field that contains the localized content */
    localizedFields?: string[];
}

/**
 * Hook to fetch data from Firestore with fallback to local data.
 * Automatically handles localization of specified fields.
 */
export const useContent = <T extends Record<string, any>>(
    collectionName: string,
    fallbackData: T[],
    options?: UseContentOptions
): { data: T[]; loading: boolean; error: Error | null } => {
    const [data, setData] = useState<T[]>(fallbackData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { i18n } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, collectionName));
                if (!querySnapshot.empty) {
                    const fetchedData = querySnapshot.docs.map(doc => {
                        const docData = doc.data();
                        // Process localized fields if specified
                        if (options?.localizedFields) {
                            options.localizedFields.forEach(field => {
                                if (docData[field] && typeof docData[field] === 'object') {
                                    docData[`_raw_${field}`] = docData[field]; // Keep raw for editing
                                    docData[field] = getLocalizedField(docData[field], i18n.language);
                                }
                            });
                        }
                        return {
                            id: doc.id,
                            ...docData
                        } as unknown as T;
                    });
                    setData(fetchedData);
                }
            } catch (err) {
                console.error(`Error fetching ${collectionName}:`, err);
                setError(err as Error);
                // Keep fallback data on error
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [collectionName, i18n.language, options?.localizedFields]);

    return { data, loading, error };
};

/**
 * Simplified hook that returns localized content
 */
export const useLocalizedContent = <T extends Record<string, any>>(
    collectionName: string,
    fallbackData: T[],
    localizedFields: string[] = []
): { data: T[]; loading: boolean } => {
    const { data, loading } = useContent(collectionName, fallbackData, { localizedFields });
    return { data, loading };
};
