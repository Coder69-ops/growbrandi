import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, startOfToday, isSameDay, parseISO, isBefore, setHours, setMinutes, addMinutes } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, User, Mail, Calendar as CalendarIcon, CheckCircle, Loader2, Globe, MapPin } from 'lucide-react';
import { db } from '../src/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

interface BookingCalendarProps {
    className?: string;
}

const TIME_SLOTS_START = 9; // 9 AM
const TIME_SLOTS_END = 17;   // 5 PM
const SLOT_DURATION = 30;    // Minutes

const COMMON_TIMEZONES = [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Sao_Paulo",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Europe/Moscow",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Asia/Singapore",
    "Asia/Tokyo",
    "Australia/Sydney",
    "Pacific/Auckland"
];

const BookingCalendar: React.FC<BookingCalendarProps> = ({ className }) => {
    const navigate = useNavigate();
    const today = startOfToday();
    const [selectedDate, setSelectedDate] = useState<Date>(today);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);

    // Timezone State
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        notes: ''
    });

    const [step, setStep] = useState<'date' | 'details'>('date');

    const daysStub = Array.from({ length: 14 }, (_, i) => addDays(today, i));

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const startOfDay = new Date(selectedDate);
                startOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date(selectedDate);
                endOfDay.setHours(23, 59, 59, 999);

                const q = query(
                    collection(db, 'bookings'),
                    where('date', '>=', startOfDay.toISOString()),
                    where('date', '<=', endOfDay.toISOString())
                );

                const querySnapshot = await getDocs(q);
                const busy = querySnapshot.docs.map(doc => doc.data().date);
                setBookedSlots(busy);
            } catch (error) {
                console.error("Error fetching slots:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [selectedDate]);

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
            await addDoc(collection(db, 'bookings'), {
                ...formData,
                date: selectedSlot,
                timezone: timezone, // Sacing Selected Timezone
                createdAt: serverTimestamp(),
                status: 'scheduled',
                source: 'Custom Calendar'
            });

            navigate(`/booking-success?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&date=${encodeURIComponent(selectedSlot)}`);

        } catch (error) {
            console.error("Booking failed:", error);
            alert("Something went wrong. Please try again.");
            setSubmitting(false);
        }
    };

    return (
        <div className={`w-full max-w-5xl mx-auto bg-white dark:bg-[#09090b] rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col lg:flex-row ${className}`}>
            {/* Left Panel: Brand & Summary */}
            <div className="w-full lg:w-1/3 bg-slate-50/50 dark:bg-slate-900/30 p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 backdrop-blur-sm">
                <div>
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                        <CalendarIcon size={28} />
                    </div>

                    <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                        GrowBrand Call
                    </h3>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
                        Discovery<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Strategy Session</span>
                    </h2>

                    <div className="space-y-5">
                        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                <Clock size={20} />
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 font-medium uppercase">Duration</div>
                                <span className="font-bold">30 Minutes</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 font-medium uppercase">Location</div>
                                <span className="font-bold">Google Meet</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Selected Slot Preview */}
                <div className="mt-10 lg:mt-0">
                    <AnimatePresence mode="wait">
                        {selectedSlot ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="p-5 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl shadow-lg text-white relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Clock size={80} />
                                </div>
                                <div className="relative z-10">
                                    <div className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Selected Time</div>
                                    <div className="text-2xl font-bold mb-1">
                                        {format(parseISO(selectedSlot), 'EEE, MMM d')}
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-50 font-medium text-lg">
                                        {format(parseISO(selectedSlot), 'h:mm a')}
                                        <span className="text-xs opacity-70 bg-white/20 px-2 py-0.5 rounded-full">
                                            {timezone.split('/')[1] || timezone}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-center"
                            >
                                <Clock size={32} className="mb-2 opacity-50" />
                                <span className="text-sm font-medium">Select a date & time<br />to continue</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right Panel: Calendar Grid */}
            <div className="w-full lg:w-2/3 p-6 lg:p-10 bg-white dark:bg-[#09090b] relative min-h-[600px] flex flex-col">
                {step === 'date' ? (
                    <motion.div
                        key="step-date"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 flex flex-col"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Select Date & Time</h3>

                            {/* Timezone Selector */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                                    <Globe size={16} />
                                </div>
                                <select
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    className="pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 appearance-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all min-w-[200px]"
                                >
                                    <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>Local Time ({Intl.DateTimeFormat().resolvedOptions().timeZone})</option>
                                    {COMMON_TIMEZONES.filter(tz => tz !== Intl.DateTimeFormat().resolvedOptions().timeZone).map(tz => (
                                        <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                                    <ChevronRight size={14} className="rotate-90" />
                                </div>
                            </div>
                        </div>

                        {/* Date Strip */}
                        <div className="mb-8">
                            <div className="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6 custom-scrollbar snap-x">
                                {daysStub.map((day) => {
                                    const isSelected = isSameDay(day, selectedDate);
                                    return (
                                        <button
                                            key={day.toISOString()}
                                            onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
                                            className={`flex-shrink-0 snap-start w-[4.5rem] h-24 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 group relative overflow-hidden ${isSelected
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/30 ring-2 ring-blue-200 dark:ring-blue-900 ring-offset-2 dark:ring-offset-[#09090b]'
                                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                                                }`}
                                        >
                                            <span className={`text-xs font-semibold uppercase mb-1 tracking-wide ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                                                {format(day, 'EEE')}
                                            </span>
                                            <span className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                                {format(day, 'd')}
                                            </span>
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="activeIndicator"
                                                    className="absolute bottom-1.5 w-1.5 h-1.5 bg-white rounded-full"
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time Slots */}
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[200px]">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {loading ? (
                                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
                                        <Loader2 className="animate-spin text-blue-500" size={32} />
                                        <span className="text-sm font-medium">Checking availability...</span>
                                    </div>
                                ) : slots.map((slot) => {
                                    const isBooked = bookedSlots.includes(slot);
                                    const isPast = isBefore(parseISO(slot), new Date());
                                    const disabled = isBooked || isPast;
                                    const isSelected = selectedSlot === slot;

                                    return (
                                        <button
                                            key={slot}
                                            disabled={disabled}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`py-4 px-4 rounded-xl border font-semibold text-sm transition-all duration-200 relative overflow-hidden group ${isSelected
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-200 dark:ring-blue-900'
                                                : disabled
                                                    ? 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed decoration-slice opacity-60'
                                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:text-blue-600 hover:shadow-md hover:-translate-y-0.5'
                                                }`}
                                        >
                                            <div className="relative z-10 flex items-center justify-center gap-2">
                                                {format(parseISO(slot), 'h:mm a')}
                                                {isSelected && <CheckCircle size={14} className="text-white" />}
                                            </div>
                                            {!disabled && !isSelected && (
                                                <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6 flex justify-end">
                            <button
                                disabled={!selectedSlot}
                                onClick={() => setStep('details')}
                                className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none transition-all flex items-center gap-3 text-lg"
                            >
                                Next Step <ChevronRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="step-details"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 flex flex-col"
                    >
                        <button
                            onClick={() => setStep('date')}
                            className="group flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-8 transition-colors self-start px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900"
                        >
                            <ChevronLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                            Choose a different time
                        </button>

                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Almost Done!</h3>
                            <p className="text-slate-500 dark:text-slate-400">Enter your details to confirm your strategy session.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Work Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        placeholder="john@company.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Project Details (Optional)</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all min-h-[120px] resize-none font-medium"
                                    placeholder="What are your growth goals?"
                                />
                            </div>

                            <div className="flex-1"></div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-3 transition-all text-lg"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="animate-spin" /> Scheduling...
                                    </>
                                ) : (
                                    <>
                                        Confirm Strategy Session <CheckCircle size={22} />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-slate-400 font-medium">
                                No credit card required. Free 30-min strategy call.
                            </p>
                        </form>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default BookingCalendar;
