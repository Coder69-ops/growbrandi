import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getAuth } from 'firebase/auth';

export type AuditAction = 'create' | 'update' | 'delete' | 'publish' | 'archive' | 'login' | 'logout';
export type AuditModule = 'blog' | 'services' | 'team' | 'site_content' | 'settings' | 'auth' | 'projects' | 'testimonials' | 'faqs' | 'jobs' | 'contact' | 'users';

interface AuditLogEntry {
    action: AuditAction;
    module: AuditModule;
    description: string;
    performedBy: string; // UID or Email
    metadata?: Record<string, any>;
    timestamp: any;
}

export const logAction = async (
    action: AuditAction,
    module: AuditModule,
    description: string,
    metadata: Record<string, any> = {}
) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        const performedBy = user?.email || user?.uid || 'system';

        const entry: AuditLogEntry = {
            action,
            module,
            description,
            performedBy,
            metadata,
            timestamp: serverTimestamp()
        };

        await addDoc(collection(db, 'audit_logs'), entry);
    } catch (error) {
        console.error("Failed to log audit action:", error);
        // We don't want to break the app flow if logging fails, so we just log to console
    }
};
