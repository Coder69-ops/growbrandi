import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { storage } from '../lib/storage'; // Your R2 storage wrapper
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    orderBy
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export interface Asset {
    id: string;
    url: string;
    name: string;
    type: string; // 'image/png', etc.
    size: number; // in bytes
    folderId: string | null; // null = root
    createdAt: any;
    uploadedBy: string;
}

export interface Folder {
    id: string;
    name: string;
    parentId: string | null; // null = root
    createdAt: any;
    createdBy: string;
}

export const useAssets = (currentFolderId: string | null = null) => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) return;

        setLoading(true);

        // Fetch Folders in current directory
        const qFolders = query(
            collection(db, 'folders'),
            where('parentId', '==', currentFolderId),
            orderBy('name', 'asc')
        );

        // Fetch Assets in current directory
        const qAssets = query(
            collection(db, 'assets'),
            where('folderId', '==', currentFolderId),
            orderBy('createdAt', 'desc')
        );

        const unsubFolders = onSnapshot(qFolders, (snap) => {
            const fetchedFolders = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Folder[];
            setFolders(fetchedFolders);
        });

        const unsubAssets = onSnapshot(qAssets, (snap) => {
            const fetchedAssets = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Asset[];
            setAssets(fetchedAssets);
            setLoading(false);
        });

        return () => {
            unsubFolders();
            unsubAssets();
        };
    }, [currentFolderId, currentUser]);

    const createFolder = async (name: string) => {
        if (!currentUser) return;
        try {
            await addDoc(collection(db, 'folders'), {
                name,
                parentId: currentFolderId,
                createdAt: serverTimestamp(),
                createdBy: currentUser.uid
            });
        } catch (error) {
            console.error("Error creating folder:", error);
            throw error;
        }
    };

    const uploadAsset = async (file: File) => {
        if (!currentUser) return;
        setUploading(true);
        try {
            // 1. Upload to R2
            // We use a flat structure in R2 to avoid deep nesting issues, 
            // relying on Firestore for the hierarchy.
            // Folder path in R2 is just for basic organization, e.g. "uploads/{year}/{month}"
            const url = await storage.uploadFile(file, 'library');

            // 2. Create Metadata in Firestore
            await addDoc(collection(db, 'assets'), {
                url,
                name: file.name,
                type: file.type,
                size: file.size,
                folderId: currentFolderId,
                createdAt: serverTimestamp(),
                uploadedBy: currentUser.uid
            });

            setUploading(false);
        } catch (error) {
            console.error("Error uploading asset:", error);
            setUploading(false);
            throw error;
        }
    };

    const deleteAsset = async (asset: Asset) => {
        try {
            // 1. Delete from R2
            await storage.deleteFile(asset.url);

            // 2. Delete from Firestore
            await deleteDoc(doc(db, 'assets', asset.id));
        } catch (error) {
            console.error("Error deleting asset:", error);
            throw error;
        }
    };

    const deleteFolder = async (folderId: string) => {
        // NOTE: This purely deletes the folder doc. 
        // In a real app, you'd want to recursively delete contents or prevent if not empty.
        // For now, we assume simple delete.
        try {
            await deleteDoc(doc(db, 'folders', folderId));
        } catch (error) {
            console.error("Error deleting folder:", error);
            throw error;
        }
    };

    return {
        assets,
        folders,
        loading,
        uploading,
        createFolder,
        uploadAsset,
        deleteAsset,
        deleteFolder
    };
};
