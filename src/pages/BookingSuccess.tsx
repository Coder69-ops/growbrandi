import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Calendar, User, Mail } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, setDoc, increment, addDoc, collection, serverTimestamp } from 'firebase/firestore';

const BookingSuccess = () => {
    const [searchParams] = useSearchParams();
    const [processed, setProcessed] = useState(false);

    // Support generic params + Calendly specific params
    const bookingData = {
        name: searchParams.get('name') || searchParams.get('invitee_full_name') || 'Guest',
        email: searchParams.get('email') || searchParams.get('invitee_email') || '',
        date: searchParams.get('date') || searchParams.get('event_start_time') || '',
        source: 'Free Growth Call'
    };

    useEffect(() => {
        const trackBooking = async () => {
            if (processed) return;

            // simple session check to prevent double counting on refresh (basic)
            const sessionKey = `booking_tracked_${new Date().toDateString()}`;
            if (sessionStorage.getItem(sessionKey)) return;

            try {
                // 1. Increment Analytics
                const analyticsRef = doc(db, 'analytics', 'free-growth-call');
                await setDoc(analyticsRef, {
                    bookings: increment(1),
                    lastUpdated: new Date()
                }, { merge: true });

                // 2. Save Booking Details ONLY for external integrations (e.g. Calendly)
                // Internal bookings are already saved in BookingCalendar.tsx
                const isExternalBooking = searchParams.get('invitee_email') !== null;

                if (isExternalBooking && bookingData.email) {
                    await addDoc(collection(db, 'bookings'), {
                        ...bookingData,
                        createdAt: serverTimestamp(),
                        status: 'scheduled',
                        source: 'Calendly/External'
                    });
                }

                sessionStorage.setItem(sessionKey, 'true');
                setProcessed(true);
            } catch (err) {
                console.error("Error tracking booking:", err);
            }
        };

        trackBooking();
    }, [processed, bookingData.email]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] flex items-center justify-center px-4 pt-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full bg-white dark:bg-slate-800 rounded-[2rem] p-8 md:p-12 shadow-2xl text-center border border-slate-100 dark:border-slate-700 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-green-500" />

                <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <CheckCircle size={48} className="text-green-500 dark:text-green-400" strokeWidth={2.5} />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Booking Confirmed!</h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                    Thanks <span className="font-semibold text-slate-900 dark:text-white">{bookingData.name}</span>! We've received your schedule. A calendar invitation has been sent to your email.
                </p>

                {bookingData.email && (
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 mb-8 text-left border border-slate-100 dark:border-slate-700">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Booking Details</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                <User size={18} className="text-blue-500" />
                                <span>{bookingData.name}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                <Mail size={18} className="text-blue-500" />
                                <span>{bookingData.email}</span>
                            </div>
                            {bookingData.date && (
                                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                    <Calendar size={18} className="text-blue-500" />
                                    <span>{new Date(bookingData.date).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <a
                    href="/"
                    className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-bold transition-all hover:scale-105 hover:shadow-lg"
                >
                    Return to Home <ArrowRight size={18} className="ml-2" />
                </a>
            </motion.div>
        </div>
    );
};

export default BookingSuccess;
