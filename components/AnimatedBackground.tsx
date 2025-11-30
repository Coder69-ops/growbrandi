import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
        backgroundColor: '#09090b' // zinc-950 / luxury-black
      }}
    >
      <style>
        {`
          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .gradient-orb {
            position: absolute;
            width: 60vmax;
            height: 60vmax;
            filter: blur(150px);
            animation: rotate 50s cubic-bezier(0.8, 0.2, 0.2, 0.8) alternate infinite;
          }
        `}
      </style>
      <div
        className="gradient-orb"
        style={{
          top: '-20%',
          left: '-20%',
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.2), transparent 70%)', // cyan
        }}
      />
      <div
        className="gradient-orb"
        style={{
          bottom: '-20%',
          right: '-20%',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.2), transparent 70%)', // teal
          animationDelay: '-25s',
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
