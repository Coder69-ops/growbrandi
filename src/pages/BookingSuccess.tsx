import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Calendar, User, Mail, Video, Globe, FileText, Share2, Copy } from 'lucide-react';
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
        location: searchParams.get('location') || 'google_meet',
        notes: searchParams.get('notes') || '',
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
        <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] flex items-center justify-center px-4 pt-20 pb-12 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-3xl w-full relative z-10"
            >
                {/* Header Success Message */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/30"
                    >
                        <CheckCircle size={48} className="text-white drop-shadow-md" strokeWidth={3} />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Booking Confirmed!</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300">
                        Excellent! Your strategy session is locked in, <span className="font-bold text-blue-600 dark:text-blue-400">{bookingData.name.split(' ')[0]}</span>.
                    </p>
                </div>

                {/* Ticket Card */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
                    {/* Top Decorative Graphic */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 font-black text-8xl whitespace-nowrap select-none">Confirmed</div>
                    </div>

                    <div className="p-8 md:p-10">
                        <div className="grid md:grid-cols-2 gap-10">
                            {/* Left Column: Details */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Session Details</h3>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Date & Time</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                                                {bookingData.date ? new Date(bookingData.date).toLocaleString([], { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Date Pending'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl text-green-600 dark:text-green-400">
                                            {bookingData.location === 'whatsapp' ? <Globe size={24} /> : <Video size={24} />}
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Location</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                                                {bookingData.location === 'whatsapp' ? 'WhatsApp Call' : 'Google Meet'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-2xl text-purple-600 dark:text-purple-400">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Confirmation Sent To</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white break-all">
                                                {bookingData.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Next Steps & Info */}
                            <div className="relative">
                                <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-800 hidden md:block -ml-5" />

                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">What Happens Next?</h3>

                                <ul className="space-y-4">
                                    <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 font-bold text-xs">1</div>
                                        <span>Check your email for the calendar invitation and meeting link.</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 font-bold text-xs">2</div>
                                        <span>We'll review your details to prepare a tailored impact plan.</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 font-bold text-xs">3</div>
                                        <span>Join the call on time to maximize our strategy session.</span>
                                    </li>
                                </ul>

                                {bookingData.notes && (
                                    <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Your Notes</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{bookingData.notes}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="bg-slate-50 dark:bg-black/20 p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-sm text-slate-500 font-medium">Order ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                        <a
                            href="/"
                            className="inline-flex items-center justify-center px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-bold transition-all hover:-translate-y-1 hover:shadow-lg w-full sm:w-auto"
                        >
                            Return to Homepage <ArrowRight size={18} className="ml-2" />
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default BookingSuccess;
