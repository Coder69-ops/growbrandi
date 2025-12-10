import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Helper to check if environment variables are set
const isConfigured =
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID;

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Helper to log if config is missing (for developer sanity)
if (!isConfigured) {
    console.warn("Firebase config is missing - various features may not work.");
}

/**
 * Creates a secondary Firebase app instance to create a new user 
 * without logging out the current admin user.
 */
export const createTeamMemberAuth = async (email: string, password: string) => {
    // 1. Initialize a secondary app key to avoid conflict
    const secondaryAppName = `secondaryApp-${Date.now()}`;
    const secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
    const secondaryAuth = getAuth(secondaryApp);

    try {
        const { createUserWithEmailAndPassword, signOut } = await import("firebase/auth");
        // 2. Create the user on this secondary instance
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);

        // 3. Document ID and basic info to return
        const newUser = userCredential.user;

        // 4. Immediately sign out from this secondary instance to be safe
        await signOut(secondaryAuth);

        return newUser;
    } catch (error) {
        throw error;
    } finally {
        // 5. Clean up the secondary app
        // We import deleteApp dynamically to avoid issues if it's not needed elsewhere
        const { deleteApp } = await import("firebase/app");
        await deleteApp(secondaryApp);
    }
};
