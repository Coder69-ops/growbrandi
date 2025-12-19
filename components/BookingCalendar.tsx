import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, startOfToday, isSameDay, parseISO, isBefore, setHours, setMinutes, addMinutes } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, User, Mail, Calendar as CalendarIcon, CheckCircle, Loader2 } from 'lucide-react';
import { db } from '../src/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

interface BookingCalendarProps {
    className?: string;
}

const TIME_SLOTS_START = 9; // 9 AM
const TIME_SLOTS_END = 17;   // 5 PM
const SLOT_DURATION = 30;    // Minutes

const BookingCalendar: React.FC<BookingCalendarProps> = ({ className }) => {
    const navigate = useNavigate();
    const today = startOfToday();
    const [selectedDate, setSelectedDate] = useState<Date>(today);
    const [viewDate, setViewDate] = useState<Date>(today); // For month navigation
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        notes: ''
    });

    const [step, setStep] = useState<'date' | 'details'>('date');

    // Generate next 14 days for the calendar strip (or month view logic)
    // For mobile responsiveness, we'll do a horizontal scrollable strip of dates for simplicity and great UX
    const daysStub = Array.from({ length: 14 }, (_, i) => addDays(today, i));

    // Fetch Bookings for the selected date
    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                // Find start and end of the selected day
                const startOfDay = new Date(selectedDate);
                startOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date(selectedDate);
                endOfDay.setHours(23, 59, 59, 999);

                // Use simple string comparison for this demo/speed or timestamps
                // Ideally, store as ISO strings or timestamps. Let's assume we store 'date' as ISO string in DB for the slot start

                const q = query(
                    collection(db, 'bookings'),
                    where('date', '>=', startOfDay.toISOString()),
                    where('date', '<=', endOfDay.toISOString())
                );

                const querySnapshot = await getDocs(q);
                const busy = querySnapshot.docs.map(doc => doc.data().date); // ISO strings of booked slots
                setBookedSlots(busy);
            } catch (error) {
                console.error("Error fetching slots:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [selectedDate]);

    // Generate Time Slots
    const generateSlots = () => {
        const slots = [];
        let current = setMinutes(setHours(selectedDate, TIME_SLOTS_START), 0);
        const end = setMinutes(setHours(selectedDate, TIME_SLOTS_END), 0);

        while (isBefore(current, end)) {
            slots.push(current.toISOString());
            current = addMinutes(current, SLOT_DURATION);
        }
        return slots;
    };

    const slots = generateSlots();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSlot || !formData.name || !formData.email) return;

        setSubmitting(true);
        try {
            // Save to Firestore
            await addDoc(collection(db, 'bookings'), {
                ...formData,
                date: selectedSlot, // ISO String acts as unique ID for the slot time
                createdAt: serverTimestamp(),
                status: 'scheduled',
                source: 'Custom Calendar'
            });

            // Redirect
            navigate(`/booking-success?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&date=${encodeURIComponent(selectedSlot)}`);

        } catch (error) {
            console.error("Booking failed:", error);
            alert("Something went wrong. Please try again.");
            setSubmitting(false);
        }
    };

    return (
        <div className={`w-full max-w-4xl mx-auto bg-white dark:bg-[#09090b] rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row ${className}`}>
            {/* Left Panel: Context & Summary */}
            <div className="w-full md:w-1/3 bg-slate-50 dark:bg-slate-800/50 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
                <div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                        <User size={24} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Growbrand Call</h3>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Discovery Session</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                            <Clock size={18} className="text-slate-400" />
                            <span className="font-medium">30 Minutes</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                            <CalendarIcon size={18} className="text-slate-400" />
                            <span className="font-medium">Google Meet</span>
                        </div>
                    </div>
                </div>

                {/* Selected Slot Summary (Mobile only mainly, or bottom of sidebar) */}
                {selectedSlot && (
                    <div className="mt-8 p-4 bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-blue-900/30 shadow-sm">
                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">Selected Time</div>
                        <div className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                            {format(parseISO(selectedSlot), 'EEE, MMM d')}
                        </div>
                        <div className="text-slate-900 dark:text-white font-medium">
                            {format(parseISO(selectedSlot), 'h:mm a')}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Panel: Calendar & Form */}
            <div className="w-full md:w-2/3 p-6 md:p-8 bg-white dark:bg-[#09090b] rounded-r-[1.5rem] relative min-h-[500px]">
                <AnimatePresence mode="wait">
                    {step === 'date' ? (
                        <motion.div
                            key="step-date"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="h-full flex flex-col"
                        >
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Select a Date & Time</h3>

                            {/* Date Strip (Horizontal Scroll) */}
                            <div className="mb-8">
                                <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar snap-x">
                                    {daysStub.map((day) => (
                                        <button
                                            key={day.toISOString()}
                                            onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
                                            className={`flex-shrink-0 snap-start w-16 h-20 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 ${isSameDay(day, selectedDate)
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500'
                                                }`}
                                        >
                                            <span className="text-xs font-medium opacity-80">{format(day, 'EEE')}</span>
                                            <span className="text-xl font-bold">{format(day, 'd')}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Slots Grid */}
                            <div className="flex-1 overflow-y-auto pr-2 max-h-[300px] custom-scrollbar">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {loading ? (
                                        <div className="col-span-full flex justify-center py-10 text-slate-400">
                                            <Loader2 className="animate-spin" />
                                        </div>
                                    ) : slots.map((slot) => {
                                        const isBooked = bookedSlots.includes(slot);
                                        const isPast = isBefore(parseISO(slot), new Date()); // Don't allow past times today
                                        const disabled = isBooked || isPast;

                                        return (
                                            <button
                                                key={slot}
                                                disabled={disabled}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`py-3 px-4 rounded-xl border font-semibold text-sm transition-all duration-200 ${selectedSlot === slot
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md ring-2 ring-blue-200 dark:ring-blue-900'
                                                    : disabled
                                                        ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed decoration-slice'
                                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:text-blue-600 hover:shadow-sm'
                                                    }`}
                                            >
                                                {format(parseISO(slot), 'h:mm a')}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-6 flex justify-end">
                                <button
                                    disabled={!selectedSlot}
                                    onClick={() => setStep('details')}
                                    className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                >
                                    Next <ChevronRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step-details"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="h-full flex flex-col"
                        >
                            <button
                                onClick={() => setStep('date')}
                                className="flex items-center text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors"
                            >
                                <ChevronLeft size={16} className="mr-1" /> Back to times
                            </button>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Enter Details</h3>

                            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="john@company.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Anything else? (Optional)</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all min-h-[100px] resize-none"
                                        placeholder="Tell us about your project..."
                                    />
                                </div>

                                <div className="flex-1"></div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="animate-spin" /> Scheduling...
                                        </>
                                    ) : (
                                        <>
                                            Confirm Booking <CheckCircle size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BookingCalendar;
