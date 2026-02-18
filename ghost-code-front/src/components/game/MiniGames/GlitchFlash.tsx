import { useState, useEffect } from 'react';

interface Props {
  onComplete: () => void;
  duration?: number; // total duration in ms
  flashCount?: number;
}

const GlitchFlash = ({ onComplete, duration = 3000, flashCount = 5 }: Props) => {
  const [currentGlitch, setCurrentGlitch] = useState('');

  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    const glitches = Array.from({ length: flashCount }, () =>
      Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    );

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < flashCount) {
        setCurrentGlitch(glitches[idx]);
        idx += 1;
      } else {
        clearInterval(interval);
        onComplete();
      }
    }, duration / flashCount);

    return () => clearInterval(interval);
  }, [flashCount, duration, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl mb-4 text-red-400">⚠️ GLITCH INTERFERENCE ⚠️</h2>
      <div className="font-mono text-4xl tracking-widest animate-pulse text-red-500">
        {currentGlitch}
      </div>
      <p className="mt-8 text-gray-500">System instability...</p>
    </div>
  );
};

export default GlitchFlash;