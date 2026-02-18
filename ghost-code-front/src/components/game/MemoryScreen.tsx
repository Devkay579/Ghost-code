import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { playSound } from '../../services/sound';

interface Props {
  code: string;
  onComplete: () => void;
}

const MemoryScreen = ({ code, onComplete }: Props) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [blur, setBlur] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Play countdown sound every second
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        playSound('countdown'); // repeat sound every tick

        if (prev <= 1) {
          if (timerRef.current !== null) clearInterval(timerRef.current);
          playSound('glitch'); // play glitch at the end
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current);
    };
  }, [onComplete]);

  // Blur when tab is hidden
  useEffect(() => {
    const handleVisibility = () => setBlur(document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <div className="text-center">
        <p className="text-gray-400 mb-4">Memorize this code</p>
        <p className="text-sm text-red-400 mb-2">{timeLeft}s</p>
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className={`text-6xl font-mono tracking-wider p-8 bg-black border-2 border-green-500 rounded ${
            blur ? 'blur-md' : ''
          }`}
        >
          {code}
        </motion.div>
        {blur && <p className="text-red-400 mt-4">Screen blurred to prevent copying</p>}
      </div>
    </motion.div>
  );
};

export default MemoryScreen;