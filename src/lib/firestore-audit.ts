import {
    doc,
    collection,
    setDoc as firestoreSetDoc,
    addDoc as firestoreAddDoc,
    updateDoc as firestoreUpdateDoc,
    deleteDoc as firestoreDeleteDoc,
    DocumentReference,
    CollectionReference,
    SetOptions,
    UpdateData,
    WithFieldValue
} from 'firebase/firestore';
import { logAction, AuditAction, AuditModule } from '../services/auditService';

/**
 * Helper to infer the module name from a collection path.
 * Adjust this mapping as your database schema evolves.
 */
const getModuleFromPath = (path: string): AuditModule | 'unknown' => {
    const segments = path.split('/');
    const rootCollection = segments[0];

    switch (rootCollection) {
        case 'site_settings':
        case 'settings':
            return 'settings';
        case 'projects':
            return 'projects';
        case 'services':
            return 'services';
        case 'team':
        case 'team_members':
            return 'team';
        case 'testimonials':
            return 'testimonials';
        case 'faqs':
            return 'faqs';
        case 'jobs':
            return 'jobs';
        case 'blog_posts':
        case 'posts':
            return 'blog';
        case 'site_content':
        case 'content':
            return 'site_content';
        case 'users':
            return 'users';
        case 'contacts':
        case 'messages':
            return 'contact';
        default:
            console.warn(`[Audit] Unknown collection: ${rootCollection}, defaulting to unknown`);
            return 'unknown';
    }
};

/**
 * Wraps setDoc with audit logging.
 * Infers 'create' or 'update' based on merge options, but defaults to 'update' for setDoc on existing IDs.
 */
export const setDoc = async <T>(
    reference: DocumentReference<T>,
    data: WithFieldValue<T>,
    options?: SetOptions
) => {
    try {
        await firestoreSetDoc(reference, data, options);

        // Log the action (fire and forget)
        const module = getModuleFromPath(reference.path);
        if (module !== 'unknown') {
            // setDoc is often used for both create and update. 
            // Without checking existence first (which is expensive), we'll generically call it an update 
            // unless it's obviously a new ID pattern, but 'update' is usually safe for setDoc.
            logAction('update', module as AuditModule, `Updated document in ${module}`, {
                path: reference.path,
                id: reference.id
            });
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Wraps addDoc with audit logging.
 * Always an 'create' action.
 */
export const addDoc = async <T>(
    reference: CollectionReference<T>,
    data: WithFieldValue<T>
) => {
    try {
        const docRef = await firestoreAddDoc(reference, data);

        const module = getModuleFromPath(reference.path);
        if (module !== 'unknown') {
            logAction('create', module as AuditModule, `Created new item in ${module}`, {
                path: docRef.path,
                id: docRef.id
            });
        }

        return docRef;
    } catch (error) {
        throw error;
    }
};

/**
 * Wraps updateDoc with audit logging.
 * Always an 'update' action.
 */
export const updateDoc = async <T>(
    reference: DocumentReference<T>,
    data: UpdateData<T>
) => {
    try {
        await firestoreUpdateDoc(reference, data as any);

        const module = getModuleFromPath(reference.path);
        if (module !== 'unknown') {
            logAction('update', module as AuditModule, `Updated item in ${module}`, {
                path: reference.path,
                id: reference.id,
                fields: Object.keys(data as object) // Log which fields changed
            });
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Wraps deleteDoc with audit logging.
 * Always a 'delete' action.
 */
export const deleteDoc = async <T>(
    reference: DocumentReference<T>
) => {
    try {
        await firestoreDeleteDoc(reference);

        const module = getModuleFromPath(reference.path);
        if (module !== 'unknown') {
            logAction('delete', module as AuditModule, `Deleted item from ${module}`, {
                path: reference.path,
                id: reference.id
            });
        }
    } catch (error) {
        throw error;
    }
};
