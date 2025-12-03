import React from 'react';

export const BackgroundEffects: React.FC = () => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay brightness-100 contrast-150" />

            {/* Cinematic Shadows/Lighting */}
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-green-500/5 dark:bg-green-500/10 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute top-[40%] left-[40%] w-[500px] h-[500px] bg-cyan-500/5 dark:bg-cyan-500/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
        </div>
    );
};
