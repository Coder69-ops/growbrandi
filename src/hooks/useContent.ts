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
 * Hook to fetch data from Firestore.
 * Automatically handles localization of specified fields.
 */
export const useContent = <T extends Record<string, any>>(
    collectionName: string,
    options?: UseContentOptions
): { data: T[]; loading: boolean; error: Error | null } => {
    const [data, setData] = useState<T[]>([]); // Start with empty array
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
                                const val = docData[field];
                                // Only localise if it's an object AND NOT an array
                                // (Arrays are technically objects, but we don't want to localize [ 'feature1', 'feature2' ])
                                if (val && typeof val === 'object' && !Array.isArray(val)) {
                                    docData[`_raw_${field}`] = val; // Keep raw for editing
                                    docData[field] = getLocalizedField(val, i18n.language);
                                }
                            });
                        }
                        return {
                            id: doc.id,
                            ...docData
                        } as unknown as T;
                    }).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
                    setData(fetchedData);
                } else {
                    setData([]); // Ensure it's empty if snapshot is empty
                }
            } catch (err) {
                console.error(`Error fetching ${collectionName}:`, err);
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };


        fetchData();
        // Use JSON.stringify for deep comparison of the array to avoid infinite loops/refetching
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collectionName, i18n.language, JSON.stringify(options?.localizedFields)]);

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
