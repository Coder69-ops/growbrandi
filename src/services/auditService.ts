import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'logout';
export type AuditModule = 'auth' | 'team' | 'projects' | 'services' | 'blog' | 'settings' | 'site_content' | 'contact' | 'jobs' | 'users' | 'testimonials' | 'faqs';

export interface AuditLogEntry {
    action: AuditAction;
    module: AuditModule;
    description: string;
    performedBy: string; // email or user ID
    metadata?: any;
    timestamp?: any;
}

/**
 * Logs an action to the audit_logs collection in Firestore.
 */
export const logAction = async (
    action: AuditLogEntry['action'],
    module: AuditLogEntry['module'],
    description: string,
    metadata?: any
) => {
    try {
        const { auth } = await import('../lib/firebase');
        const user = auth.currentUser;
        const performedBy = user ? (user.email || user.uid) : 'system';

        await addDoc(collection(db, 'audit_logs'), {
            action,
            module,
            description,
            performedBy,
            metadata: metadata || {},
            timestamp: serverTimestamp()
        });
    } catch (error) {
        // Silent fail for logs to not disrupt main flow, but warn dev
        console.warn("Failed to create audit log:", error);
    }
};
