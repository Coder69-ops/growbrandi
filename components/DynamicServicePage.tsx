import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../src/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import ServicePage from './ServicePage';
import PageLoader from './PageLoader';
import { getLocalizedField } from '../src/utils/localization';

const DynamicServicePage: React.FC = () => {
    const { serviceId } = useParams<{ serviceId: string }>();
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const [service, setService] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
            if (!serviceId) return;

            setLoading(true);
            try {
                // Try searching by serviceId field first
                const q = query(
                    collection(db, 'services'),
                    where('serviceId', '==', serviceId),
                    limit(1)
                );
                let snapshot = await getDocs(q);

                // Fallback to searching by document ID
                if (snapshot.empty) {
                    const q2 = query(
                        collection(db, 'services'),
                        where('__name__', '==', serviceId),
                        limit(1)
                    );
                    snapshot = await getDocs(q2);
                }

                if (!snapshot.empty) {
                    const data = snapshot.docs[0].data();
                    setService(data);
                } else {
                    // Redirect to services overview if not found
                    // navigate(`/${i18n.language}/services`);
                }
            } catch (error) {
                console.error("Error fetching dynamic service:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [serviceId, i18n.language]);

    if (loading) return <PageLoader />;

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
                    <button
                        onClick={() => navigate(`/${i18n.language}/services`)}
                        className="text-blue-600 hover:underline"
                    >
                        Return to Services
                    </button>
                </div>
            </div>
        );
    }

    return (
        <ServicePage
            title={getLocalizedField(service.title, i18n.language)}
            description={getLocalizedField(service.description, i18n.language)}
            features={(service.features || []).map((f: any) => getLocalizedField(f, i18n.language))}
            benefits={(service.benefits || []).map((b: any) => getLocalizedField(b, i18n.language)) || [
                "Tailored Solutions",
                "Expert Implementation",
                "Proven Results",
                "Dedicated Support"
            ]}
            technologies={(service.floatingLogos || []).map((l: string) => {
                // Extract "React" from "/logos/react.svg"
                const parts = l.split('/');
                const filename = parts[parts.length - 1];
                return filename.replace('.svg', '').replace('dotjs', '.js');
            }).filter(Boolean)}
            process={(service.process || []).map((p: any) => getLocalizedField(p.step, i18n.language))}
            pricing={service.pricing || {
                starter: { price: getLocalizedField(service.price, i18n.language), features: ["Core Features", "Standard Support"] },
                professional: { price: "Inquire", features: ["Advanced Features", "Priority Support"] },
                enterprise: { price: "Custom", features: ["Full Customization", "24/7 Support"] }
            }}
        />
    );
};

export default DynamicServicePage;
