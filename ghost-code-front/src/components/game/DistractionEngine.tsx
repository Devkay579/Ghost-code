import { useState, useMemo } from 'react';
import MathInterference from './MiniGames/MathInterference';
import PatternMatch from './MiniGames/PatternMatch';
import GlitchFlash from './MiniGames/GlitchFlash';
import ReactionTime from './MiniGames/ReactionTime';
import ReverseTyping from './MiniGames/ReverseTyping';

// Add new mini-games here and they automatically become part of the engine
const distractions = [
  { id: 'math', component: MathInterference },
  { id: 'pattern', component: PatternMatch },
  { id: 'glitch', component: GlitchFlash },
  { id: 'reaction', component: ReactionTime }, 
  { id: 'reverse', component: ReverseTyping },
];

interface Props {
  onComplete: () => void;
}

const DistractionEngine = ({ onComplete }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Generate a random sequence of all available games
  const sequence = useMemo(() => {
    return [...distractions].sort(() => Math.random() - 0.5);
  }, []);

  const handleMiniGameComplete = () => {
    if (currentIndex + 1 < sequence.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete(); // All mini-games done
    }
  };

  const CurrentComponent = sequence[currentIndex].component;

  return (
    <div className="min-h-[60vh]">
      <CurrentComponent onComplete={handleMiniGameComplete} />
    </div>
  );
};

export default DistractionEngine;