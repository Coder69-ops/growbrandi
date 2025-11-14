import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from './Router';

const NotFoundPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg mx-auto"
      >
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="text-8xl font-black text-gradient bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            404
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-slate-300 mb-8 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            onClick={() => navigate('home')}
            className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Home
          </motion.button>
          
          <motion.button
            onClick={() => window.history.back()}
            className="border border-slate-600 text-slate-300 px-8 py-3 rounded-lg font-semibold hover:border-emerald-400 hover:text-emerald-400 transition-all duration-300"
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
          className="mt-12 pt-8 border-t border-slate-700"
        >
          <p className="text-slate-400 text-sm mb-4">Popular pages:</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: 'Services', route: 'services' as const },
              { label: 'About Us', route: 'about' as const },
              { label: 'Case Studies', route: 'case-studies' as const },
              { label: 'Contact', route: 'contact' as const },
            ].map((link) => (
              <button
                key={link.route}
                onClick={() => navigate(link.route)}
                className="text-slate-400 hover:text-emerald-400 text-sm underline transition-colors"
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