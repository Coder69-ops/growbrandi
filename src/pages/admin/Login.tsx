import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '../../../components/ThemeToggle';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();

    // Check for "Logged out" message
    React.useEffect(() => {
        // Check session storage (robust way)
        const sessionMsg = sessionStorage.getItem('logoutMessage');
        if (sessionMsg) {
            setInfoMessage(sessionMsg);
            sessionStorage.removeItem('logoutMessage');
            // Clear history state to prevent message reappearing on refresh
            window.history.replaceState({}, document.title);
            return;
        }

        // Fallback to location state (if used elsewhere)
        if (location.state?.message) {
            setInfoMessage(location.state.message);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // Redirect if already logged in - check both currentUser AND ensure we didn't just log out
    React.useEffect(() => {
        // If we have a user AND we don't have a specific logout message, redirect to dashboard
        // We also check if we just processed a session logout message (infoMessage might not be set yet if effect order is diff, 
        // but session check happens in mount effect. To be safe, we can check session storage here too or just rely on the race)
        // Actually, if we just logged out, currentUser should be null, so this effect won't run/redirect.
        // It only runs if we ARE logged in. 
        if (currentUser && !location.state?.message && !sessionStorage.getItem('logoutMessage')) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [currentUser, navigate, location]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setInfoMessage('');
        setSuccess(false);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setLoading(false);
            setSuccess(true);
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 1000);
        } catch (err: any) {
            console.error(err);
            setError('Invalid credentials. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-luxury-black relative overflow-hidden font-sans transition-colors duration-300">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-purple-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[100px]" />
            </div>

            {/* Top Right Actions */}
            <div className="absolute top-6 right-6 z-20">
                <ThemeToggle />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md px-4 relative z-10"
            >
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <Link
                        to="/"
                        className="inline-flex items-center text-slate-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white transition-colors gap-2 text-sm font-medium group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Website
                    </Link>
                </motion.div>

                {/* Login Card */}
                <div className="bg-white/80 dark:bg-luxury-zinc/50 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden p-8 transition-colors duration-300">
                    <div className="mb-8 text-center">
                        <img src="/growbrandi-logo.png" alt="GrowBrandAI Logo" className="w-16 h-16 object-contain mb-2 mx-auto" />
                        <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-2">Admin Access</h2>
                        <p className="text-slate-500 dark:text-gray-400 text-sm">Enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-500 p-3 rounded-lg flex items-center gap-3 text-sm mb-4"
                                >
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                            {infoMessage && (
                                <motion.div
                                    key="info"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-blue-50 border border-blue-200 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-500 p-3 rounded-lg flex items-center gap-3 text-sm mb-4"
                                >
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {infoMessage}
                                </motion.div>
                            )}
                            {success && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-emerald-50 border border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-500 p-3 rounded-lg flex items-center gap-3 text-sm mb-4"
                                >
                                    <CheckCircle className="w-4 h-4 shrink-0" />
                                    <span>Login successful! Redirecting...</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-gray-300 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-purple-400 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        disabled={loading || success}
                                        className="w-full bg-slate-50 dark:bg-luxury-black/50 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-indigo-500 dark:focus:border-purple-500/50 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-purple-500/50 transition-all disabled:opacity-50"
                                        placeholder="admin@growbrandi.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-gray-300 ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-purple-400 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        disabled={loading || success}
                                        className="w-full bg-slate-50 dark:bg-luxury-black/50 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-indigo-500 dark:focus:border-purple-500/50 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-purple-500/50 transition-all disabled:opacity-50"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || success}
                            className={`w-full font-bold py-3.5 px-4 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg ${success
                                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-white dark:text-luxury-black dark:hover:bg-gray-100'
                                }`}
                        >
                            {success ? (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    <span>Success</span>
                                </>
                            ) : loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-slate-400 dark:text-gray-500 text-xs mt-8">
                    &copy; {new Date().getFullYear()} GrowBrandi. All rights reserved.
                </p>
            </motion.div >
        </div >
    );
};

export default AdminLogin;
