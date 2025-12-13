import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    loading: true,
});

export const useAuth = () => useContext(AuthContext);

import { usePresence } from '../hooks/usePresence';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Enable realtime presence tracking
    usePresence(currentUser);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Fetch user profile from Firestore
                try {
                    // Imports moved to top

                    const userDocRef = doc(db, 'users', user.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    let enhancedUser: any = {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        emailVerified: user.emailVerified,
                        ...user
                    };

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        const jobTitle = userData?.jobTitle || null;
                        enhancedUser = { ...enhancedUser, ...userData, jobTitle };
                    }

                    // Attempt to fetch from team_members for richer profile (role, image)
                    // We fetch all members to ensure robust case-insensitive matching, matching Dashboard logic
                    if (user.email) {

                        // Fetch all members (optimization: could limit fields, but list is small)
                        const teamSnap = await getDocs(collection(db, 'team_members'));

                        const normalize = (str: string) => str?.toLowerCase().trim() || '';
                        const userEmail = normalize(user.email);
                        const userName = normalize(user.displayName || '');

                        const matchedMember = teamSnap.docs.find(doc => {
                            const data = doc.data();
                            const teamEmail = normalize(data.social?.email);
                            const teamName = normalize(data.name);

                            const emailMatch = teamEmail === userEmail;
                            const nameMatch = userName && teamName && teamName.includes(userName);

                            return emailMatch || nameMatch;
                        });

                        if (matchedMember) {
                            const teamData = matchedMember.data();

                            // Helper to safely get English role
                            const roleEn = typeof teamData.role === 'object' ? teamData.role?.en : teamData.role;

                            enhancedUser = {
                                ...enhancedUser,
                                displayName: teamData.name || enhancedUser.displayName,
                                photoURL: teamData.image || enhancedUser.photoURL,
                                role: roleEn || enhancedUser.role || 'Admin',
                                jobTitle: roleEn || enhancedUser.jobTitle || 'Admin',
                                teamId: matchedMember.id
                            };
                        } else {
                            // No matching team member found for", user.email
                        }
                    }

                    setCurrentUser(enhancedUser as any);
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
