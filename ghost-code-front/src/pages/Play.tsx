import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

const Play = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const navigate = useNavigate();
  const startNewGame = useGameStore((s) => s.startNewGame);

  const handleStart = async () => {
    await startNewGame(difficulty);
    navigate('/game');
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[80vh] pt-8">
      <motion.h1
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-5xl font-bold mb-8 glitch"
        data-text="START BREACH"
      >
        START BREACH
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-xs md:max-w-md bg-gray-900 p-6 md:p-8 rounded-lg border border-green-500 shadow-lg shadow-green-500/20"
      >
        <label className="block mb-4">
          <span className="text-green-400">Select Difficulty</span>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            className="block w-full mt-2 bg-black border border-green-500 text-green-500 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="easy">Easy (6 chars)</option>
            <option value="medium">Medium (9 chars)</option>
            <option value="hard">Hard (12 chars)</option>
          </select>
        </label>

        <button
          onClick={handleStart}
          className="w-full bg-green-600 hover:bg-green-700 text-black font-bold py-3 px-6 rounded transition transform hover:scale-105 active:scale-95"
        >
          Start Breach
        </button>
      </motion.div>
    </div>
  );
};

export default Play;