import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, startOfToday, isSameDay, parseISO, isBefore, setHours, setMinutes, addMinutes } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, User, Mail, Calendar as CalendarIcon, CheckCircle, Loader2, Globe, MapPin, MessageCircle, PenTool, Edit3 } from 'lucide-react';
import { db } from '../src/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa'; // Assuming react-icons is installed, if not fallback to Lucide

interface BookingCalendarProps {
    className?: string;
}

const TIME_SLOTS_START = 8; // Start a bit earlier for 1h slots
const TIME_SLOTS_END = 20;   // Extend to evening
const SLOT_DURATION = 60;    // 1 Hour

const COMMON_TIMEZONES = [
    "UTC",
    "Pacific/Midway",       // UTC-11:00
    "Pacific/Honolulu",     // UTC-10:00
    "America/Anchorage",    // UTC-09:00
    "America/Los_Angeles",  // UTC-08:00
    "America/Denver",       // UTC-07:00
    "America/Chicago",      // UTC-06:00
    "America/New_York",     // UTC-05:00
    "America/Halifax",      // UTC-04:00
    "America/St_Johns",     // UTC-03:30
    "America/Sao_Paulo",    // UTC-03:00
    "Atlantic/South_Georgia", // UTC-02:00
    "Atlantic/Azores",      // UTC-01:00
    "Europe/London",        // UTC+00:00
    "Europe/Paris",         // UTC+01:00
    "Europe/Helsinki",      // UTC+02:00
    "Europe/Moscow",        // UTC+03:00
    "Asia/Tehran",          // UTC+03:30
    "Asia/Dubai",           // UTC+04:00
    "Asia/Kabul",           // UTC+04:30
    "Asia/Karachi",         // UTC+05:00
    "Asia/Kolkata",         // UTC+05:30
    "Asia/Kathmandu",       // UTC+05:45
    "Asia/Dhaka",           // UTC+06:00
    "Asia/Bangkok",         // UTC+07:00
    "Asia/Singapore",       // UTC+08:00
    "Asia/Tokyo",           // UTC+09:00
    "Australia/Darwin",     // UTC+09:30
    "Australia/Sydney",     // UTC+10:00
    "Pacific/Noumea",       // UTC+11:00
    "Pacific/Auckland",     // UTC+12:00
    "Pacific/Apia",         // UTC+13:00
    "Pacific/Kiritimati"    // UTC+14:00
];

// Helper to format timezone with GMT offset
const formatTimezoneOption = (timeZone: string) => {
    try {
        const date = new Date();
        const offset = date.toLocaleTimeString('en-US', { timeZone, timeZoneName: 'longOffset' }).split(' ')[2]; // Extract GMT+X
        // Clean up GMT prefix if needed, usually returns GMT+5 or similar
        const cleanOffset = offset.replace('GMT', 'UTC');
        return `(${cleanOffset}) ${timeZone.replace('_', ' ')}`;
    } catch (e) {
        return timeZone.replace('_', ' ');
    }
};

const BookingCalendar: React.FC<BookingCalendarProps> = ({ className }) => {
    const navigate = useNavigate();
    const today = startOfToday();
    const [selectedDate, setSelectedDate] = useState<Date>(today);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [bookingSuccess, setBookingSuccess] = useState(false); // New Success State

    // Feature: Location Toggle
    const [meetingType] = useState<'google_meet'>('google_meet');

    // Feature: Custom Time
    const [isCustomTime, setIsCustomTime] = useState(false);
    const [customTimeValue, setCustomTimeValue] = useState('');

    // Timezone State
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        notes: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [step, setStep] = useState<'date' | 'details'>('date');

    const daysStub = Array.from({ length: 90 }, (_, i) => addDays(today, i));

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

    // Handle Custom Time Input
    const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value; // HH:mm
        setCustomTimeValue(val);
        if (val) {
            const [hours, minutes] = val.split(':').map(Number);
            const date = new Date(selectedDate);
            date.setHours(hours, minutes, 0, 0);
            setSelectedSlot(date.toISOString());
        } else {
            setSelectedSlot(null);
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name.trim()) newErrors.name = "Full name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        if (!selectedSlot) return;

        setSubmitting(true);
        try {
            await addDoc(collection(db, 'bookings'), {
                ...formData,
                date: selectedSlot,
                timezone: timezone,
                location: meetingType,
                createdAt: serverTimestamp(),
                status: 'scheduled',
                source: 'Custom Calendar'
            });

            setBookingSuccess(true); // Show success animation

            // Delay navigation slightly for animation
            setTimeout(() => {
                navigate(`/booking-success?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&date=${encodeURIComponent(selectedSlot)}&location=${meetingType}`);
            }, 2000);

        } catch (error) {
            console.error("Booking failed:", error);
            setErrors({ submit: "Something went wrong. Please try again." });
            setSubmitting(false);
        }
    };

    if (bookingSuccess) {
        return (
            <div className={`w-full max-w-5xl mx-auto min-h-[600px] bg-white dark:bg-[#09090b] rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center p-10 ${className}`}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                        <CheckCircle size={48} className="text-green-600 dark:text-green-400" />
                        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Booking Confirmed!</h3>
                    <p className="text-slate-500 dark:text-slate-400">Redirecting you to the success page...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`w-full max-w-5xl mx-auto bg-white dark:bg-[#09090b] rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col lg:flex-row ${className}`}>
            {/* Left Panel: Brand & Summary */}
            <div className="w-full lg:w-1/3 bg-slate-50/50 dark:bg-slate-900/30 p-6 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 backdrop-blur-sm">
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

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                <Clock size={20} />
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 font-medium uppercase">Duration</div>
                                <span className="font-bold">30 Minutes</span>
                            </div>
                        </div>

                        {/* Location Selector */}
                        <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-3">
                            <div className="text-xs text-slate-400 font-medium uppercase mb-1">Select Location</div>
                            <div className="grid grid-cols-1">
                                <button
                                    disabled
                                    className="flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-semibold transition-all border bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-sm cursor-default"
                                >
                                    <MapPin size={16} /> Google Meet
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Selected Slot Preview */}
                <div className="mt-8 lg:mt-0">
                    <AnimatePresence mode="wait">
                        {selectedSlot ? (
                            <motion.div
                                key="selected"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className={`p-5 rounded-2xl shadow-lg text-white relative overflow-hidden group bg-gradient-to-br from-blue-600 to-violet-600`}
                            >
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Clock size={80} />
                                </div>
                                <div className="relative z-10">
                                    <div className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">Selected Time</div>
                                    <div className="text-2xl font-bold mb-1">
                                        {format(parseISO(selectedSlot), 'EEE, MMM d')}
                                    </div>
                                    <div className="flex items-center gap-2 text-white font-medium text-lg">
                                        {format(parseISO(selectedSlot), 'h:mm a')}
                                        <span className="text-xs opacity-80 bg-white/20 px-2 py-0.5 rounded-full border border-white/10">
                                            {timezone.split('/')[1]?.replace('_', ' ') || timezone}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-white/90 bg-black/10 w-fit px-2 py-1 rounded-md">
                                        <MapPin size={12} />
                                        Google Meet
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-5 border-2 border-dashed border-slate-200 dark:border-slate-700/50 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-center bg-slate-50/30 dark:bg-slate-800/20"
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                                    <Clock size={20} className="opacity-50" />
                                </div>
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
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Select Date & Time</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                        {format(selectedDate, 'MMMM yyyy')}
                                    </p>
                                    {isSameDay(selectedDate, today) && (
                                        <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full uppercase tracking-wider">Today</span>
                                    )}
                                </div>
                            </div>

                            {/* Timezone Selector */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                                    <Globe size={16} />
                                </div>
                                <select
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    className="pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 appearance-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all min-w-[200px]"
                                >
                                    <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                                        {formatTimezoneOption(Intl.DateTimeFormat().resolvedOptions().timeZone)} (Local)
                                    </option>
                                    {COMMON_TIMEZONES.filter(tz => tz !== Intl.DateTimeFormat().resolvedOptions().timeZone).map(tz => (
                                        <option key={tz} value={tz}>{formatTimezoneOption(tz)}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                                    <ChevronRight size={14} className="rotate-90" />
                                </div>
                            </div>
                        </div>

                        {/* Date Strip */}
                        <div className="mb-6">
                            <div className="flex gap-2 overflow-x-auto pb-4 -mx-6 px-6 snap-x scrollbar-hide">
                                {daysStub.map((day) => {
                                    const isSelected = isSameDay(day, selectedDate);
                                    const isToday = isSameDay(day, today);
                                    return (
                                        <button
                                            key={day.toISOString()}
                                            onClick={() => { setSelectedDate(day); setSelectedSlot(null); setIsCustomTime(false); setCustomTimeValue(''); }}
                                            className={`flex-shrink-0 snap-start w-16 h-20 rounded-2xl flex flex-col items-center justify-center border transition-all duration-200 group relative overflow-hidden ${isSelected
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg ring-2 ring-blue-200 dark:ring-blue-900 ring-offset-2 dark:ring-offset-[#09090b]'
                                                : isToday
                                                    ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            <span className={`text-[10px] font-bold uppercase mb-0.5 tracking-wider ${isSelected ? 'text-blue-100' : 'text-slate-400 opacity-80'}`}>
                                                {format(day, 'EEE')}
                                            </span>
                                            <span className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                                {format(day, 'd')}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time Slots Area */}
                        <div className="flex-1 overflow-y-auto pr-2 min-h-[400px] custom-scrollbar">
                            {/* Standard Slots Grid (Compact) */}
                            {!isCustomTime ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {loading ? (
                                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
                                            <Loader2 className="animate-spin text-blue-500" size={32} />
                                            <span className="text-sm font-medium animate-pulse">Checking availability...</span>
                                        </div>
                                    ) : slots.length > 0 ? (
                                        slots.map((slot) => {
                                            const isBooked = bookedSlots.includes(slot);
                                            const isPast = isBefore(parseISO(slot), new Date());
                                            const disabled = isBooked || isPast;
                                            const isSelected = selectedSlot === slot;

                                            return (
                                                <button
                                                    key={slot}
                                                    disabled={disabled}
                                                    onClick={() => setSelectedSlot(slot)}
                                                    className={`py-3 px-2 rounded-xl border font-semibold text-sm transition-all duration-200 relative overflow-hidden ${isSelected
                                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105'
                                                        : disabled
                                                            ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                                                            : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:text-blue-600 hover:shadow-md hover:-translate-y-0.5'
                                                        }`}
                                                >
                                                    {format(parseISO(slot), 'h:mm a')}
                                                    {isSelected && <motion.div layoutId="outline" className="absolute inset-0 border-2 border-white/20 rounded-xl" />}
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-full text-center py-12 text-slate-400">
                                            No slots available for this day.
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-6 block">Pick a Specific Time</label>
                                    <div className="relative group">
                                        <input
                                            type="time"
                                            value={customTimeValue}
                                            onChange={handleCustomTimeChange}
                                            className="px-8 py-5 text-3xl font-mono font-bold rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-black text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none shadow-lg transition-all"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-6 max-w-xs text-center font-medium">
                                        Note: Custom times are subject to manual confirmation by our team.
                                    </p>
                                </div>
                            )}

                            {/* Custom Time Toggle */}
                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={() => { setIsCustomTime(!isCustomTime); setSelectedSlot(null); setCustomTimeValue(''); }}
                                    className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 px-5 py-2.5 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                                >
                                    {isCustomTime ? (
                                        <>Back to Available Slots</>
                                    ) : (
                                        <>Time not listed? <Edit3 size={14} /> Request Custom Time</>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-6 flex justify-end">
                            <button
                                disabled={!selectedSlot}
                                onClick={() => setStep('details')}
                                className="px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none transition-all flex items-center gap-2 text-base group"
                            >
                                Next Step <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="step-details"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
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
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Final Step</h3>
                            <p className="text-slate-500 dark:text-slate-400">Enter your details to confirm your strategy session.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Full Name *</label>
                                <div className="relative group">
                                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.name ? 'text-red-400' : 'text-slate-400 group-focus-within:text-blue-500'}`} size={20} />
                                    <input
                                        autoFocus
                                        type="text"
                                        value={formData.name}
                                        onChange={e => {
                                            setFormData({ ...formData, name: e.target.value });
                                            if (errors.name) setErrors({ ...errors, name: '' });
                                        }}
                                        className={`w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border rounded-xl focus:ring-4 outline-none transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400 ${errors.name ? 'border-red-300 focus:ring-red-100 dark:border-red-900' : 'border-slate-200 dark:border-slate-800 focus:ring-blue-500/10 focus:border-blue-500'}`}
                                        placeholder="John Doe"
                                    />
                                    {errors.name && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-red-500">{errors.name}</span>}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Work Email *</label>
                                <div className="relative group">
                                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-400' : 'text-slate-400 group-focus-within:text-blue-500'}`} size={20} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => {
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                            if (errors.email) setErrors({...errors, email: ''});
                                        }
                                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border rounded-xl focus:ring-4 outline-none transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400 ${errors.email ? 'border-red-300 focus:ring-red-100 dark:border-red-900' : 'border-slate-200 dark:border-slate-800 focus:ring-blue-500/10 focus:border-blue-500'}`}
                                    placeholder="john@company.com"
                                    />
                                </div>
                                {errors.email && <span className="text-xs font-bold text-red-500 ml-1">{errors.email}</span>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Project Details (Optional)</label>
                                <div className="relative">
                                    <PenTool className="absolute left-4 top-4 text-slate-400" size={20} />
                                    <textarea
                                        value={formData.notes}
                                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all min-h-[120px] resize-none font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
                                        placeholder="Briefly describe your goals..."
                                    />
                                </div>
                            </div>

                            <div className="flex-1"></div>

                            {errors.submit && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold text-center rounded-lg">{errors.submit}</div>}

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
