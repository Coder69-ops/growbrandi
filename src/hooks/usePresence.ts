import { useEffect, useState } from 'react';
import { database } from '../lib/firebase';
import { ref, onValue, onDisconnect, set, serverTimestamp, push } from 'firebase/database';
import { User } from 'firebase/auth';

/**
 * Hook to manage the current user's presence system.
 * It handles setting the user as "online" in RTDB when connected,
 * and removes/updates status on disconnect.
 */
export const usePresence = (user: User | null) => {
    useEffect(() => {
        if (!user) return;

        // References in RTDB
        const connectedRef = ref(database, '.info/connected');
        const userStatusRef = ref(database, `/status/${user.uid}`);

        const unsubscribe = onValue(connectedRef, (snapshot) => {
            if (snapshot.val() === false) {
                return;
            }

            // When connected, set up disconnect logic first
            onDisconnect(userStatusRef).update({
                state: 'offline',
                last_changed: serverTimestamp(),
            }).then(() => {
                // Then set online status
                set(userStatusRef, {
                    state: 'online',
                    last_changed: serverTimestamp(),
                    email: user.email,
                    displayName: user.displayName || 'Unknown',
                    photoURL: user.photoURL || '',
                    uid: user.uid
                });
            });
        });

        return () => unsubscribe();
    }, [user]);
};

/**
 * Hook to fetch and subscribe to the list of online users.
 */
export const useOnlineUsers = () => {
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const usersRef = ref(database, '/status');

        const unsubscribe = onValue(usersRef, (snapshot) => {
            const users: any[] = [];
            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                if (userData.state === 'online') {
                    users.push({
                        uid: childSnapshot.key,
                        ...userData
                    });
                }
            });
            setOnlineUsers(users);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { onlineUsers, loading };
};
