import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, startOfToday, isSameDay, parseISO, isBefore, setHours, setMinutes, addMinutes } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, User, Mail, Calendar as CalendarIcon, CheckCircle, Loader2, Globe, MapPin, PenTool, Edit3, ArrowRight, Star, Zap, Video } from 'lucide-react';
import { db } from '../src/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

interface BookingCalendarProps {
    className?: string;
    onClaimDiscount?: () => void;
}

const TIME_SLOTS_START = 8;
const TIME_SLOTS_END = 20;
const SLOT_DURATION = 60;

const COMMON_TIMEZONES = [
    "UTC",
    "Pacific/Midway", "Pacific/Honolulu", "America/Anchorage", "America/Los_Angeles", "America/Vancouver", "America/Tijuana",
    "America/Denver", "America/Phoenix", "America/Chicago", "America/Mexico_City", "America/New_York", "America/Toronto",
    "America/Caracas", "America/Halifax", "America/Puerto_Rico", "America/Argentina/Buenos_Aires", "America/Sao_Paulo",
    "Atlantic/Azores", "Atlantic/Cape_Verde", "Europe/London", "Europe/Dublin", "Europe/Lisbon", "Africa/Casablanca",
    "Europe/Paris", "Europe/Berlin", "Europe/Rome", "Europe/Madrid", "Europe/Amsterdam", "Europe/Brussels", "Africa/Lagos",
    "Europe/Athens", "Europe/Bucharest", "Europe/Helsinki", "Europe/Istanbul", "Africa/Cairo", "Africa/Johannesburg", "Asia/Jerusalem",
    "Asia/Baghdad", "Asia/Riyadh", "Asia/Moscow", "Asia/Tehran", "Asia/Dubai", "Asia/Baku", "Asia/Kabul",
    "Asia/Karachi", "Asia/Tashkent", "Asia/Kolkata", "Asia/Kathmandu", "Asia/Dhaka", "Asia/Almaty",
    "Asia/Bangkok", "Asia/Jakarta", "Asia/Ho_Chi_Minh", "Asia/Singapore", "Asia/Shanghai", "Asia/Hong_Kong", "Asia/Taipei",
    "Asia/Tokyo", "Asia/Seoul", "Australia/Darwin", "Australia/Adelaide", "Australia/Sydney", "Australia/Melbourne", "Australia/Brisbane",
    "Pacific/Port_Moresby", "Pacific/Guam", "Pacific/Auckland", "Pacific/Fiji"
];

// Helper for sleek timezone display
const formatTimezoneOption = (timeZone: string) => {
    try {
        const date = new Date();
        const offset = date.toLocaleTimeString('en-US', { timeZone, timeZoneName: 'shortOffset' }).split(' ')[2];
        const city = timeZone.split('/')[1]?.replace(/_/g, ' ') || timeZone;
        return `${city} (${offset})`;
    } catch {
        return timeZone;
    }
};

const BookingCalendar: React.FC<BookingCalendarProps> = ({ className, onClaimDiscount }) => {
    const navigate = useNavigate();
    const today = startOfToday();
    const [selectedDate, setSelectedDate] = useState<Date>(today);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    // UI State
    const [view, setView] = useState<'calendar' | 'form'>('calendar');
    const [isCustomTime, setIsCustomTime] = useState(false);
    const [customTimeValue, setCustomTimeValue] = useState('');
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

    const [formData, setFormData] = useState({ name: '', email: '', notes: '' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Drag to scroll for Date Picker
    const datePickerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!datePickerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - datePickerRef.current.offsetLeft);
        setScrollLeft(datePickerRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !datePickerRef.current) return;
        e.preventDefault();
        const x = e.pageX - datePickerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fast
        datePickerRef.current.scrollLeft = scrollLeft - walk;
    };

    // New Features State
    const [meetingType, setMeetingType] = useState<'google_meet' | 'whatsapp'>('google_meet');
    const [sliderIndex, setSliderIndex] = useState(0);

    const miniSliderItems = [
        { text: "50% OFF New Clients", icon: <Zap size={14} className="text-amber-500 fill-amber-500" />, sub: "Limited Offer" },
        { text: "Trusted by 500+ Teams", icon: <Star size={14} className="text-blue-500 fill-blue-500" />, sub: "Verified" },
        { text: "Expert Strategy", icon: <CheckCircle size={14} className="text-green-500" />, sub: "Guaranteed" }
    ];

    useEffect(() => {
        const timer = setInterval(() => setSliderIndex(i => (i + 1) % miniSliderItems.length), 4000);
        return () => clearInterval(timer);
    }, []);

    // Generate next 30 days
    const daysStub = Array.from({ length: 30 }, (_, i) => addDays(today, i));

    // Fetch Bookings
    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const startOfDay = new Date(selectedDate);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(selectedDate);
                endOfDay.setHours(23, 59, 59, 999);
                const q = query(collection(db, 'bookings'), where('date', '>=', startOfDay.toISOString()), where('date', '<=', endOfDay.toISOString()));
                const querySnapshot = await getDocs(q);
                setBookedSlots(querySnapshot.docs.map(doc => doc.data().date));
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchBookings();
    }, [selectedDate]);

    // Generate Slots
    const slots = [];
    let current = setMinutes(setHours(selectedDate, TIME_SLOTS_START), 0);
    const end = setMinutes(setHours(selectedDate, TIME_SLOTS_END), 0);
    while (isBefore(current, end)) { slots.push(current.toISOString()); current = addMinutes(current, SLOT_DURATION); }

    const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value; setCustomTimeValue(val);
        if (val) {
            const [h, m] = val.split(':').map(Number);
            const date = new Date(selectedDate); date.setHours(h, m, 0, 0);
            setSelectedSlot(date.toISOString());
        } else setSelectedSlot(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !selectedSlot) {
            setErrors({ submit: "Please fill in all required fields." }); return;
        }
        setSubmitting(true);
        try {
            await addDoc(collection(db, 'bookings'), {
                ...formData, date: selectedSlot, timezone, location: meetingType,
                createdAt: serverTimestamp(), status: 'scheduled', source: 'Web Calendar'
            });
            setBookingSuccess(true);
            setTimeout(() => {
                const params = new URLSearchParams({
                    name: formData.name,
                    email: formData.email,
                    date: selectedSlot || '',
                    location: meetingType,
                    notes: formData.notes
                });
                navigate(`/booking-success?${params.toString()}`);
            }, 2000);
        } catch { setSubmitting(false); setErrors({ submit: "Booking failed. Try again." }); }
    };

    if (bookingSuccess) {
        return (
            <div className={`w-full min-h-[500px] flex items-center justify-center bg-white dark:bg-[#09090b] rounded-[2rem] p-8 ${className}`}>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                        <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
                        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Confirmed!</h3>
                    <p className="text-slate-500 mt-2">Redirecting you...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`w-full relative bg-gradient-to-br from-white/90 via-slate-50/90 to-blue-50/20 dark:from-slate-900/90 dark:via-[#0B1120]/90 dark:to-slate-900/90 backdrop-blur-xl rounded-[2rem] overflow-hidden flex flex-col shadow-2xl shadow-blue-500/5 dark:shadow-none border border-white/50 dark:border-white/10 ring-1 ring-slate-200/50 dark:ring-white/5 ${className}`}>
            {/* Ambient Background Noise & Glow */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-overlay pointer-events-none z-0" />
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none z-0" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none z-0" />

            {/* Header Section */}
            <div className="bg-white/50 dark:bg-white/[0.02] p-6 lg:p-8 backdrop-blur-md border-b border-slate-100 dark:border-white/5 relative overflow-hidden z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Strategy Call</span>
                            <div className="flex items-center text-amber-400">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
                            Discovery Session
                        </h2>

                        {/* Platform Toggle Row */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="flex items-center gap-1.5 bg-white dark:bg-white/5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm text-xs font-bold text-slate-600 dark:text-slate-400">
                                <Clock size={14} className="text-blue-500" /> 30 Min
                            </span>

                            <div className="flex items-center gap-1 p-1 bg-slate-200/50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-white/5">
                                <button
                                    onClick={() => setMeetingType('google_meet')}
                                    className={`px-3 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all ${meetingType === 'google_meet' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400 scale-105' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                                >
                                    <Video size={12} /> Google Meet
                                </button>
                                <button
                                    onClick={() => setMeetingType('whatsapp')}
                                    className={`px-3 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all ${meetingType === 'whatsapp' ? 'bg-white dark:bg-slate-700 shadow-sm text-green-600 dark:text-green-400 scale-105' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                                >
                                    <Globe size={12} /> WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mini Slider - Right Side */}
                    <div className="w-full md:w-auto self-stretch md:self-center flex items-center gap-3">
                        <div className="relative flex-1 md:flex-none md:w-56 lg:w-64 h-14 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={sliderIndex}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0 flex items-center gap-3 px-4"
                                >
                                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/10 flex items-center justify-center shrink-0 border border-slate-100 dark:border-white/5">
                                        {miniSliderItems[sliderIndex].icon}
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                            {miniSliderItems[sliderIndex].text}
                                        </div>
                                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                            {miniSliderItems[sliderIndex].sub}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={onClaimDiscount}
                            className="flex h-14 px-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex-col items-center justify-center leading-tight whitespace-nowrap border border-white/20"
                        >
                            <span className="flex items-center gap-1">Claim Offer <ArrowRight size={12} /></span>
                            <span className="text-[9px] opacity-90 font-medium">Limited Availability</span>
                        </button>
                    </div>

                    {view === 'form' && (
                        <button onClick={() => setView('calendar')} className="absolute top-0 right-0 p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors md:relative">
                            <ChevronLeft size={20} className="text-slate-600 dark:text-slate-400" />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-6 lg:p-8 flex-1 relative min-h-[400px]">
                <AnimatePresence mode="wait">
                    {view === 'calendar' ? (
                        <motion.div
                            key="calendar"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            {/* Date Selector */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Select Date</label>
                                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{format(selectedDate, 'MMMM yyyy')}</span>
                                </div>
                                <div
                                    ref={datePickerRef}
                                    onMouseDown={handleMouseDown}
                                    onMouseLeave={handleMouseLeave}
                                    onMouseUp={handleMouseUp}
                                    onMouseMove={handleMouseMove}
                                    className={`flex gap-3 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide select-none transition-all ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                                >
                                    {daysStub.map((day) => {
                                        const isSelected = isSameDay(day, selectedDate);
                                        const isToday = isSameDay(day, today);
                                        return (
                                            <button
                                                key={day.toISOString()}
                                                onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
                                                className={`flex-shrink-0 snap-start w-14 h-[4.5rem] rounded-xl flex flex-col items-center justify-center border transition-all duration-200 relative group overflow-hidden ${isSelected
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20'
                                                    : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                <span className="text-[10px] font-bold uppercase mb-0.5">{format(day, 'EEE')}</span>
                                                <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{format(day, 'd')}</span>
                                                {isToday && !isSelected && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Time Slots */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Available Slots</label>

                                    {/* Compact Timezone Selector */}
                                    <div className="relative group text-right">
                                        <select
                                            value={timezone}
                                            onChange={(e) => setTimezone(e.target.value)}
                                            className="appearance-none bg-transparent text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-blue-500 cursor-pointer outline-none text-right pr-4"
                                        >
                                            <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>Local Time</option>
                                            {COMMON_TIMEZONES.map(tz => <option key={tz} value={tz}>{formatTimezoneOption(tz)}</option>)}
                                        </select>
                                        <Globe size={10} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                                    </div>
                                </div>

                                {!isCustomTime ? (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[240px] overflow-y-auto custom-scrollbar pr-1">
                                        {loading ? (
                                            <div className="col-span-full py-12 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>
                                        ) : slots.length > 0 ? (
                                            slots.map((slot) => {
                                                const isActive = selectedSlot === slot;
                                                const disabled = bookedSlots.includes(slot) || isBefore(parseISO(slot), new Date());
                                                return (
                                                    <button
                                                        key={slot}
                                                        disabled={disabled}
                                                        onClick={() => setSelectedSlot(slot)}
                                                        className={`py-2.5 px-1 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${isActive
                                                            ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                                            : disabled
                                                                ? 'bg-slate-50 dark:bg-white/5 border-transparent text-slate-300 dark:text-slate-700 opacity-50 cursor-not-allowed'
                                                                : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600'
                                                            }`}
                                                    >
                                                        {format(parseISO(slot), 'h:mm a')}
                                                    </button>
                                                )
                                            })
                                        ) : (
                                            <div className="col-span-full py-8 text-center text-sm text-slate-400">No slots available.</div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-6 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl bg-slate-50/50 dark:bg-white/5 text-center">
                                        <input
                                            type="time"
                                            value={customTimeValue}
                                            onChange={handleCustomTimeChange}
                                            className="bg-transparent text-3xl font-mono font-bold text-slate-900 dark:text-white outline-none text-center w-full"
                                        />
                                        <p className="text-xs text-slate-400 mt-2">Subject to confirmation</p>
                                    </div>
                                )}

                                <button
                                    onClick={() => { setIsCustomTime(!isCustomTime); setSelectedSlot(null); setCustomTimeValue(''); }}
                                    className="w-full py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition-colors flex items-center justify-center gap-1"
                                >
                                    {isCustomTime ? "Show Available Slots" : <>Or request a specific time <Edit3 size={12} /></>}
                                </button>
                            </div>

                            {/* Sticky Bottom Action */}
                            <div className="pt-4 mt-auto">
                                <button
                                    disabled={!selectedSlot}
                                    onClick={() => setView('form')}
                                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-base shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 transition-all flex items-center justify-center gap-2"
                                >
                                    Continue <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex flex-col h-full"
                        >
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-500/10 mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                                    <CalendarIcon size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-0.5">Selected Time</div>
                                    <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                        {selectedSlot && format(parseISO(selectedSlot), 'EEEE, MMMM d • h:mm a')}
                                    </div>
                                </div>
                                <button onClick={() => setView('calendar')} className="text-xs font-semibold text-slate-500 hover:text-blue-600 underline">Change</button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                        <input
                                            autoFocus
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium text-slate-900 dark:text-white"
                                            placeholder="Your name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium text-slate-900 dark:text-white"
                                            placeholder="you@company.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Notes (Optional)</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium text-slate-900 dark:text-white resize-none h-24"
                                        placeholder="Any specific topics?"
                                    />
                                </div>

                                {errors.submit && <div className="text-red-500 text-xs font-bold text-center">{errors.submit}</div>}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="mt-auto w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:translate-y-0 transition-all flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loader2 className="animate-spin" /> : <>Confirm Booking <CheckCircle size={18} /></>}
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
