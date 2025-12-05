import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

// Cache to prevent re-fetching on every mount (optional but good for performance)
const cache: { [key: string]: any[] } = {};

export const useFirestoreContent = (collectionName: string) => {
    const [data, setData] = useState<any[]>(cache[collectionName] || []);
    const [loading, setLoading] = useState(!cache[collectionName]);
    const [error, setError] = useState<string | null>(null);
    const { i18n } = useTranslation();

    useEffect(() => {
        if (cache[collectionName]) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, collectionName));
                const items = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                cache[collectionName] = items;
                setData(items);
            } catch (err) {
                console.error(`Error fetching ${collectionName}:`, err);
                setError('Failed to load content');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // We might want to add a listener here for real-time updates if needed,
        // but for now getDocs is fine and cheaper.
    }, [collectionName]);

    // Helper to get localized string
    const getLocalized = (item: any, field: string) => {
        if (!item) return '';
        // If field points to an object { en: "...", de: "..." }
        const fieldData = item[field];
        if (typeof fieldData === 'object' && fieldData !== null) {
            return fieldData[i18n.language] || fieldData['en'] || '';
        }
        return fieldData; // Fallback if it's just a string
    };

    // Helper for arrays of localized strings (e.g. features list)
    const getLocalizedList = (item: any, field: string) => {
        if (!item || !Array.isArray(item[field])) return [];
        return item[field].map((entry: any) => {
            if (typeof entry === 'object' && entry !== null) {
                return entry[i18n.language] || entry['en'] || '';
            }
            return entry;
        });
    };

    return { data, loading, error, getLocalized, getLocalizedList };
};
