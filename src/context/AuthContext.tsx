import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Fetch user profile from Firestore
                try {
                    // Dynamic import to avoid circular dependency issues if any
                    const { doc, getDoc } = await import('firebase/firestore');
                    const { db } = await import('../lib/firebase');

                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        let jobTitle = null;

                        // If linked to a team member, fetch their public profile for the job title
                        if (userData.teamMemberId) {
                            try {
                                const teamMemberDoc = await getDoc(doc(db, 'team_members', userData.teamMemberId));
                                if (teamMemberDoc.exists()) {
                                    // Get English role or first available
                                    const roleData = teamMemberDoc.data().role;
                                    jobTitle = typeof roleData === 'string' ? roleData : (roleData?.en || Object.values(roleData || {})[0]);

                                    // Map team member image to photoURL
                                    if (teamMemberDoc.data().image) {
                                        (userData as any).photoURL = teamMemberDoc.data().image;
                                    }
                                }
                            } catch (err) {
                                console.error("Error fetching linked team member:", err);
                            }
                        }

                        // enhanced user object
                        setCurrentUser({ ...user, ...userData, jobTitle } as any);
                    } else {
                        // Fallback if no firestore doc (e.g. legacy or direct auth)
                        // We still allow login, but they might have no permissions
                        setCurrentUser(user);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    setCurrentUser(user);
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
