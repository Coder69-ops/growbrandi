import { useState, useCallback, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UsePreviewDataOptions {
    collection: string;
    documentId: string;
    debounceMs?: number;
}

export const usePreviewData = ({ collection, documentId, debounceMs = 300 }: UsePreviewDataOptions) => {
    const [savedData, setSavedData] = useState<any>(null);
    const [previewData, setPreviewData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, collection, documentId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setSavedData(data);
                    setPreviewData(data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [collection, documentId]);

    // Update preview data (debounced)
    const updatePreview = useCallback((path: string, value: any) => {
        setPreviewData((prev: any) => {
            const keys = path.split('.');
            const newData = { ...prev };
            let current = newData;

            // Navigate to the nested property
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }

            // Set the value
            current[keys[keys.length - 1]] = value;

            setHasChanges(true);
            return newData;
        });
    }, []);

    // Batch update preview data
    const updatePreviewBatch = useCallback((updates: Record<string, any>) => {
        setPreviewData((prev: any) => {
            const newData = { ...prev };

            Object.entries(updates).forEach(([path, value]) => {
                const keys = path.split('.');
                let current = newData;

                for (let i = 0; i < keys.length - 1; i++) {
                    if (!current[keys[i]]) {
                        current[keys[i]] = {};
                    }
                    current = current[keys[i]];
                }

                current[keys[keys.length - 1]] = value;
            });

            setHasChanges(true);
            return newData;
        });
    }, []);

    // Save changes to Firestore
    const saveChanges = useCallback(async () => {
        if (!previewData) return;

        setSaving(true);
        try {
            const docRef = doc(db, collection, documentId);
            await setDoc(docRef, {
                ...previewData,
                updatedAt: new Date()
            }, { merge: true });

            setSavedData(previewData);
            setHasChanges(false);
        } catch (error) {
            console.error('Error saving data:', error);
            throw error;
        } finally {
            setSaving(false);
        }
    }, [collection, documentId, previewData]);

    // Reset to saved state
    const resetPreview = useCallback(() => {
        setPreviewData(savedData);
        setHasChanges(false);
    }, [savedData]);

    return {
        previewData,
        savedData,
        loading,
        saving,
        hasChanges,
        updatePreview,
        updatePreviewBatch,
        saveChanges,
        resetPreview
    };
};
