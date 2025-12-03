import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-slate-50 dark:bg-luxury-black pointer-events-none transition-colors duration-300">
      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-slate-50 dark:from-zinc-800/20 dark:via-luxury-black dark:to-luxury-black" />

      {/* Animated Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 dark:bg-white/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 dark:bg-zinc-800/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>
    </div>
  );
};

export default AnimatedBackground;
