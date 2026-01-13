import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

interface GlobalDataState {
    settings: any | null;
    promotions: any[];
    services: any[];
    loading: {
        settings: boolean;
        promotions: boolean;
        services: boolean;
    };
}

const GlobalDataContext = createContext<GlobalDataState>({
    settings: null,
    promotions: [],
    services: [],
    loading: { settings: true, promotions: true, services: true }
});

export const GlobalDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<any>(null);
    const [promotions, setPromotions] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState({
        settings: true,
        promotions: true,
        services: true
    });

    useEffect(() => {
        // 1. Fetch Site Settings
        const settingsUnsub = onSnapshot(doc(db, 'site_settings', 'main'), (docSnap) => {
            if (docSnap.exists()) {
                setSettings(docSnap.data());
            }
            setLoading(prev => ({ ...prev, settings: false }));
        }, (err) => {
            console.error("GlobalProvider Settings Error:", err);
            setLoading(prev => ({ ...prev, settings: false }));
        });

        // 2. Fetch Active Promotions
        // We fetch ALL active promotions once and filter locally in components
        const promoQuery = query(collection(db, 'promotions'), where('isActive', '==', true));
        const promoUnsub = onSnapshot(promoQuery, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                positions: doc.data().positions || (doc.data().position ? [doc.data().position] : [])
            }));
            // Sort by createdAt descending
            data.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

            setPromotions(data);
            setLoading(prev => ({ ...prev, promotions: false }));
        }, (err) => {
            console.error("GlobalProvider Promotions Error:", err);
            setLoading(prev => ({ ...prev, promotions: false }));
        });

        // 3. Fetch Services
        const servicesQuery = query(collection(db, 'services'), orderBy('order', 'asc'));
        const servicesUnsub = onSnapshot(servicesQuery, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setServices(data);
            setLoading(prev => ({ ...prev, services: false }));
        }, (err) => {
            console.error("GlobalProvider Services Error:", err);
            setLoading(prev => ({ ...prev, services: false }));
        });

        return () => {
            settingsUnsub();
            promoUnsub();
            servicesUnsub();
        };
    }, []);

    const value = {
        settings,
        promotions,
        services,
        loading
    };

    return (
        <GlobalDataContext.Provider value={value}>
            {children}
        </GlobalDataContext.Provider>
    );
};

export const useGlobalData = () => useContext(GlobalDataContext);
