import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { playSound } from '../../../services/sound';

interface Props {
  onComplete: () => void;
}

const ReactionTime = ({ onComplete }: Props) => {
  const [phase, setPhase] = useState<'waiting' | 'ready' | 'tooSoon' | 'success'>('waiting');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);

  // Random delay before showing the target (1-3 seconds)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (phase === 'waiting') {
      const delay = Math.random() * 2000 + 1000; // 1000-3000ms
      timer = setTimeout(() => {
        setPhase('ready');
        setStartTime(Date.now());
        playSound('distraction'); // optional sound cue
      }, delay);
    }
    return () => clearTimeout(timer);
  }, [phase]);

  const handleClick = () => {
    if (phase === 'ready') {
      const rt = Date.now() - (startTime || 0);
      setReactionTime(rt);
      setPhase('success');
      playSound('success');
      // Complete after a short delay so player sees their time
      setTimeout(onComplete, 1500);
    } else if (phase === 'waiting') {
      setPhase('tooSoon');
      playSound('wrong');
      // Reset after a moment
      setTimeout(() => setPhase('waiting'), 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <h2 className="text-2xl mb-4">⚡ Reaction Time</h2>

      {phase === 'waiting' && (
        <div className="text-center">
          <p className="mb-4 text-gray-400">Wait for the target...</p>
          <div className="w-32 h-32 bg-gray-700 rounded-lg mx-auto animate-pulse" />
        </div>
      )}

      {phase === 'ready' && (
        <div className="text-center">
          <p className="mb-4 text-green-400">CLICK NOW!</p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClick}
            className="w-32 h-32 bg-green-600 rounded-lg shadow-lg shadow-green-500/50 text-2xl"
          >
            ⚡
          </motion.button>
        </div>
      )}

      {phase === 'tooSoon' && (
        <p className="text-red-400 text-xl">Too soon! Try again.</p>
      )}

      {phase === 'success' && reactionTime && (
        <div className="text-center">
          <p className="text-green-400 text-xl mb-2">Reaction time:</p>
          <p className="text-3xl font-mono">{reactionTime} ms</p>
        </div>
      )}
    </motion.div>
  );
};

export default ReactionTime;