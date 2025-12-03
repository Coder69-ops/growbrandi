import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const helpfulLinks = [
    { label: 'Home', route: '/' },
    { label: 'Services', route: '/services' },
    { label: 'Contact', route: '/contact' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 bg-slate-50 dark:bg-luxury-black transition-colors duration-300">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-slate-50 to-slate-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 opacity-80" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,black,rgba(0,0,0,0))] dark:[mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg mx-auto relative z-10"
      >
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="text-8xl font-black text-gradient bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            404
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-slate-600 dark:text-zinc-300 mb-8 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <motion.button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-cyan-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-blue-500/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Home
          </motion.button>

          <motion.button
            onClick={() => window.history.back()}
            className="border border-slate-300 dark:border-zinc-600 text-slate-700 dark:text-zinc-300 px-8 py-3 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-300 bg-white/50 dark:bg-transparent"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back
          </motion.button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pt-8 border-t border-slate-200 dark:border-white/10"
        >
          <p className="text-slate-500 dark:text-zinc-400 mb-4 text-sm">Helpful Links</p>
          <div className="flex justify-center gap-6">
            {helpfulLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => navigate(link.route)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;