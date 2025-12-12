import { useEffect, useState } from 'react';
import { database } from '../../lib/firebase';
import { ref, onValue, onDisconnect, set, serverTimestamp } from 'firebase/database';
import { useAuth } from '../../context/AuthContext';

export interface UserStatus {
    state: 'online' | 'offline';
    last_changed: number;
}

export const usePresence = () => {
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) return;

        const connectedRef = ref(database, '.info/connected');
        const userStatusRef = ref(database, `/status/${currentUser.uid}`);

        const unsubscribe = onValue(connectedRef, (snapshot) => {
            if (snapshot.val() === true) {
                // We're connected (or reconnected)!

                // 1. Establish the "offline" state on disconnect
                onDisconnect(userStatusRef).set({
                    state: 'offline',
                    last_changed: serverTimestamp()
                }).then(() => {
                    // 2. Set the "online" state
                    set(userStatusRef, {
                        state: 'online',
                        last_changed: serverTimestamp()
                    });
                });
            }
        });

        return () => unsubscribe();
    }, [currentUser]);
};

export const useUserStatus = (userId: string | undefined) => {
    const [status, setStatus] = useState<UserStatus | null>(null);

    useEffect(() => {
        if (!userId) {
            setStatus(null);
            return;
        }

        const statusRef = ref(database, `/status/${userId}`);
        const unsubscribe = onValue(statusRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setStatus(data);
            } else {
                setStatus({ state: 'offline', last_changed: 0 });
            }
        });

        return () => unsubscribe();
    }, [userId]);

    return status;
};

export const formatLastActive = (timestamp: number) => {
    if (!timestamp) return 'Offline';

    const now = Date.now();
    const diff = now - timestamp;

    // Convert to seconds
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return 'Active just now';
    if (seconds < 3600) return `Active ${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `Active ${Math.floor(seconds / 3600)}h ago`;
    return `Active ${Math.floor(seconds / 86400)}d ago`;
};
