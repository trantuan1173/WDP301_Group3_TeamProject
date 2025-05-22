import React, { useEffect } from 'react';

const LoadingSpinner = ({ size = 200, text = "LOADING" }) => {
  const barCount = 12;

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fade-out-spinner {
        0% { opacity: 1 }
        100% { opacity: 0 }
      }
      .spinner-bar {
        position: absolute;
        animation: fade-out-spinner 1s linear infinite;
        background: #0099e5;
        border-radius: 5px / 6px;
        transform-origin: center ${size / 2.2}px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [size]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div
        className="relative"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {Array.from({ length: barCount }).map((_, i) => {
          const rotation = (360 / barCount) * i;
          const delay = -((1 - i / barCount)).toFixed(3);

          return (
            <div
              key={i}
              className="spinner-bar"
              style={{
                width: size * 0.05,
                height: size * 0.1,
                left: size / 2 - (size * 0.05) / 2,
                top: size / 2 - size * 0.2,
                transform: `rotate(${rotation}deg)`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <h2
          className="text-2xl font-light text-cyan-500"
          style={{ letterSpacing: '0.3em' }}
        >
          {text}
        </h2>
        <div className="flex justify-center mt-2 space-x-1">
          {[0, 0.2, 0.4].map((delay, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;