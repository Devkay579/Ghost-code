import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';

const Home = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [showRules, setShowRules] = useState(false);
  const navigate = useNavigate();
  const startNewGame = useGameStore((s) => s.startNewGame);
  const { user } = useAuthStore();
  const isLoggedIn = !!user;

  const handleStart = async () => {
    await startNewGame(difficulty);
    navigate('/game');
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[80vh] pt-8">
      {/* Welcome message based on auth status */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 text-center"
      >
        {isLoggedIn ? (
          <>
            <p className="text-gray-400">Welcome back,</p>
            <p className="text-2xl text-green-400 font-bold">{user.username}</p>
          </>
        ) : (
          <>
            <p className="text-2xl text-green-400 font-bold">Welcome to Ghost Code</p>
            <p className="text-gray-400 mt-2">Test your memory under pressure</p>
          </>
        )}
      </motion.div>

      {/* Main title */}
      <motion.h1
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl md:text-5xl font-bold mb-8 glitch"
        data-text="GHOST CODE"
      >
        GHOST CODE
      </motion.h1>

      {/* Conditional content: logged-in vs guest */}
      <AnimatePresence mode="wait">
        {isLoggedIn ? (
          <motion.div
            key="logged-in"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-xs md:max-w-md"
          >
            <div className="bg-gray-900 p-6 md:p-8 rounded-lg border border-green-500 shadow-lg shadow-green-500/20">
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
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="guest"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="bg-gray-900 p-8 rounded-lg border border-green-500 shadow-lg shadow-green-500/20 text-center">
              <h2 className="text-2xl text-green-400 mb-4">Join the Challenge</h2>
              <p className="text-gray-300 mb-6">
                Create an account to track your scores, compete on the leaderboard, and train your memory against distractions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-green-600 hover:bg-green-700 text-black font-bold py-3 px-6 rounded transition transform hover:scale-105"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded transition transform hover:scale-105"
                >
                  Log In
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Already have an account? <span className="text-green-400 cursor-pointer hover:underline" onClick={() => navigate('/login')}>Log in</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle rules button (common for both) */}
      <button
        onClick={() => setShowRules(!showRules)}
        className="mt-6 text-gray-400 hover:text-green-400 text-sm flex items-center justify-center gap-2"
      >
        <span>{showRules ? 'Hide' : 'Show'} Game Rules</span>
        <motion.svg
          animate={{ rotate: showRules ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* Collapsible rules section */}
      <AnimatePresence>
        {showRules && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mt-6 overflow-hidden"
          >
            <div className="bg-gray-900 border border-green-500 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-green-400 mb-4">How to Play Ghost Code</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-2">
                  <span className="text-green-500">1.</span>
                  <span><strong>Memorize</strong> – A random code will appear for 5 seconds. Focus!</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500">2.</span>
                  <span><strong>Distraction</strong> – You'll face 2–5 quick mini‑games.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500">3.</span>
                  <span><strong>Recall</strong> – Enter the original code exactly as you saw it.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500">4.</span>
                  <span><strong>Score</strong> – Accuracy, time, and difficulty determine your rank.</span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-gray-500 border-t border-gray-700 pt-4">
                Difficulty affects code length: Easy = 6 chars, Medium = 9, Hard = 12.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;