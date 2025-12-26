import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    deleteDoc,
    Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { setDoc } from '../lib/firestore-audit';
import { CustomPage, PageStatus } from '../types/pageBuilder';
import { useAuth } from '../context/AuthContext';

export const useCustomPages = () => {
    const [pages, setPages] = useState<CustomPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();

    // Fetch all pages
    const fetchPages = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const pagesRef = collection(db, 'custom_pages');
            const q = query(pagesRef, orderBy('updatedAt', 'desc'));
            const snapshot = await getDocs(q);

            const pagesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as CustomPage[];

            setPages(pagesData);
        } catch (err: any) {
            console.error('Error fetching pages:', err);
            setError(err.message || 'Failed to fetch pages');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch page by slug
    const fetchPageBySlug = useCallback(async (slug: string, statusFilter?: PageStatus): Promise<CustomPage | null> => {
        try {
            const pagesRef = collection(db, 'custom_pages');
            let q = query(pagesRef, where('slug', '==', slug));

            if (statusFilter) {
                q = query(q, where('status', '==', statusFilter));
            }

            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                return null;
            }

            const pageDoc = snapshot.docs[0];
            return {
                id: pageDoc.id,
                ...pageDoc.data()
            } as CustomPage;
        } catch (err: any) {
            console.error('Error fetching page by slug:', err);
            throw err;
        }
    }, []);

    // Fetch page by ID
    const fetchPageById = useCallback(async (id: string): Promise<CustomPage | null> => {
        try {
            const pageRef = doc(db, 'custom_pages', id);
            const pageDoc = await getDoc(pageRef);

            if (!pageDoc.exists()) {
                return null;
            }

            return {
                id: pageDoc.id,
                ...pageDoc.data()
            } as CustomPage;
        } catch (err: any) {
            console.error('Error fetching page by ID:', err);
            throw err;
        }
    }, []);

    // Create new page
    const createPage = useCallback(async (pageData: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastEditedBy'>): Promise<string> => {
        try {
            // Check auth more thoroughly
            if (!currentUser) {
                console.error('No user object available');
                throw new Error('User must be authenticated to create pages');
            }

            const userId = currentUser.uid;
            if (!userId) {
                console.error('User object exists but has no uid:', currentUser);
                throw new Error('User must be authenticated to create pages');
            }

            // Check if slug already exists
            const existingPage = await fetchPageBySlug(pageData.slug);
            if (existingPage) {
                throw new Error(`A page with slug "${pageData.slug}" already exists`);
            }

            const pagesRef = collection(db, 'custom_pages');
            const newPageRef = doc(pagesRef);

            const newPage: Omit<CustomPage, 'id'> = {
                ...pageData,
                createdAt: serverTimestamp() as Timestamp,
                updatedAt: serverTimestamp() as Timestamp,
                createdBy: userId,
                lastEditedBy: userId
            };

            await setDoc(newPageRef, newPage);

            // Refresh pages list
            await fetchPages();

            return newPageRef.id;
        } catch (err: any) {
            console.error('Error creating page:', err);
            throw err;
        }
    }, [currentUser, fetchPageBySlug, fetchPages]);

    // Update existing page
    const updatePage = useCallback(async (id: string, pageData: Partial<CustomPage>): Promise<void> => {
        try {
            if (!currentUser?.uid) {
                throw new Error('User must be authenticated to update pages');
            }

            // If slug is being changed, check for duplicates
            if (pageData.slug) {
                const existingPage = await fetchPageBySlug(pageData.slug);
                if (existingPage && existingPage.id !== id) {
                    throw new Error(`A page with slug "${pageData.slug}" already exists`);
                }
            }

            const pageRef = doc(db, 'custom_pages', id);

            const updates = {
                ...pageData,
                updatedAt: serverTimestamp(),
                lastEditedBy: currentUser.uid
            };

            await setDoc(pageRef, updates, { merge: true });

            // Refresh pages list
            await fetchPages();
        } catch (err: any) {
            console.error('Error updating page:', err);
            throw err;
        }
    }, [currentUser, fetchPageBySlug, fetchPages]);

    // Delete page
    const deletePage = useCallback(async (id: string): Promise<void> => {
        try {
            const pageRef = doc(db, 'custom_pages', id);
            await deleteDoc(pageRef);

            // Refresh pages list
            await fetchPages();
        } catch (err: any) {
            console.error('Error deleting page:', err);
            throw err;
        }
    }, [fetchPages]);

    // Duplicate page
    const duplicatePage = useCallback(async (id: string): Promise<string> => {
        try {
            const originalPage = await fetchPageById(id);

            if (!originalPage) {
                throw new Error('Page not found');
            }

            // Create new slug by appending "-copy"
            let newSlug = `${originalPage.slug}-copy`;
            let counter = 1;

            // Ensure unique slug
            while (await fetchPageBySlug(newSlug)) {
                counter++;
                newSlug = `${originalPage.slug}-copy-${counter}`;
            }

            const duplicatedPage: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastEditedBy'> = {
                ...originalPage,
                slug: newSlug,
                title: {
                    en: `${originalPage.title.en} (Copy)`,
                    es: originalPage.title.es ? `${originalPage.title.es} (Copia)` : undefined,
                    fr: originalPage.title.fr ? `${originalPage.title.fr} (Copie)` : undefined,
                    de: originalPage.title.de ? `${originalPage.title.de} (Kopie)` : undefined
                },
                status: 'draft' // Always duplicate as draft
            };

            return await createPage(duplicatedPage);
        } catch (err: any) {
            console.error('Error duplicating page:', err);
            throw err;
        }
    }, [fetchPageById, fetchPageBySlug, createPage]);

    // Publish/Unpublish page
    const togglePageStatus = useCallback(async (id: string): Promise<void> => {
        try {
            const page = await fetchPageById(id);

            if (!page) {
                throw new Error('Page not found');
            }

            const newStatus: PageStatus = page.status === 'published' ? 'draft' : 'published';

            await updatePage(id, { status: newStatus });
        } catch (err: any) {
            console.error('Error toggling page status:', err);
            throw err;
        }
    }, [fetchPageById, updatePage]);

    // Load pages on mount
    useEffect(() => {
        fetchPages();
    }, [fetchPages]);

    return {
        pages,
        loading,
        error,
        fetchPages,
        fetchPageBySlug,
        fetchPageById,
        createPage,
        updatePage,
        deletePage,
        duplicatePage,
        togglePageStatus
    };
};
