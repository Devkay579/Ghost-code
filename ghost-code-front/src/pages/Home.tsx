import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Target, Trophy, Clock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { profileService } from '../services/profile';
import type { UserStats, GameSession } from '../services/profile';
import StatsCard from '../components/profile/StatsCard';
import Spinner from '../components/ui/Spinner';

const Home = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRules, setShowRules] = useState(false); // new state for rules

  useEffect(() => {
    if (user) {
      const fetchDashboard = async () => {
        try {
          const [statsData, sessionsData] = await Promise.all([
            profileService.getStats(),
            profileService.getSessions(1, 5),
          ]);
          setStats(statsData);
          setRecentSessions(sessionsData.data);
        } catch (error) {
          console.error('Failed to load dashboard data', error);
        } finally {
          setLoading(false);
        }
      };
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    // Guest view – unchanged
    return (
      <div className="flex flex-col items-center justify-start min-h-[80vh] pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-center"
        >
          <p className="text-2xl text-green-400 font-bold">Welcome to Ghost Code</p>
          <p className="text-gray-400 mt-2">Test your memory under pressure</p>
        </motion.div>

        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl md:text-5xl font-bold mb-8 glitch"
          data-text="GHOST CODE"
        >
          GHOST CODE
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-gray-900 p-8 rounded-lg border border-green-500 shadow-lg shadow-green-500/20 text-center">
            <h2 className="text-2xl text-green-400 mb-4">Join the Challenge</h2>
            <p className="text-gray-300 mb-6">
              Create an account to track your scores, compete on the leaderboard, and train your memory against AI distractions.
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
          </div>
        </motion.div>

        {/* Rules toggle for guests */}
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
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold">
          Welcome back, <span className="text-green-400">{user.username}</span>
        </h1>
        <p className="text-gray-400 mt-2">Ready to test your memory?</p>
      </motion.div>

      {/* Quick stats */}
      {stats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatsCard
            title="Total Games"
            value={stats.totalGames}
            icon={<Gamepad2 className="w-6 h-6" />}
          />
          <StatsCard
            title="Avg Accuracy"
            value={`${stats.averageAccuracy.toFixed(1)}%`}
            icon={<Target className="w-6 h-6" />}
          />
          <StatsCard
            title="Highest Score"
            value={stats.highestScore}
            icon={<Trophy className="w-6 h-6" />}
          />
          <StatsCard
            title="Total Score"
            value={stats.totalScore}
            icon={<Clock className="w-6 h-6" />}
          />
        </motion.div>
      )}

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Play card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 p-6 rounded-lg border border-green-500 hover:border-green-400 transition cursor-pointer group"
          onClick={() => navigate('/play')}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-green-400">Start a Game</h2>
            <Gamepad2 className="w-8 h-8 text-green-400 group-hover:scale-110 transition" />
          </div>
          <p className="text-gray-400 mb-4">Choose difficulty and begin your breach.</p>
          <div className="flex items-center text-green-400 group-hover:translate-x-2 transition">
            <span className="mr-2">Play now</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </motion.div>

        {/* Leaderboard card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 p-6 rounded-lg border border-green-500 hover:border-green-400 transition cursor-pointer group"
          onClick={() => navigate('/leaderboard')}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-green-400">Leaderboard</h2>
            <Trophy className="w-8 h-8 text-green-400 group-hover:scale-110 transition" />
          </div>
          <p className="text-gray-400 mb-4">See how you rank against other players.</p>
          <div className="flex items-center text-green-400 group-hover:translate-x-2 transition">
            <span className="mr-2">View rankings</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </motion.div>
      </div>

      {/* Recent games */}
      {recentSessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 p-6 rounded-lg border border-green-500 mb-8"
        >
          <h2 className="text-xl font-bold text-green-400 mb-4">Recent Games</h2>
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-gray-800 rounded hover:bg-gray-750 transition"
              >
                <div>
                  <span className="capitalize text-gray-300">{session.difficulty}</span>
                  <span className="mx-2 text-gray-500">•</span>
                  <span className="text-green-400">{session.score} pts</span>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(session.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="mt-4 text-green-400 hover:text-green-300 text-sm flex items-center gap-1"
          >
            View all games <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Rules toggle for logged-in users */}
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