import { useEffect, useState } from 'react';
import { motion,  } from 'framer-motion'; // Import Variants
import type { Variants } from 'framer-motion';
import { Gamepad2, Target, Trophy, BarChart3, User, Mail, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { profileService } from '../services/profile';
import type { UserStats, GameSession } from '../services/profile';
import StatsCard from '../components/profile/StatsCard';
import SessionsTable from '../components/profile/SessionsTable';
import ScoresChart from '../components/profile/ScoresChart';
import Spinner from '../components/ui/Spinner';

const Profile = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [statsData, sessionsData] = await Promise.all([
          profileService.getStats(),
          profileService.getSessions(1, 10),
        ]);
        setStats(statsData);
        setSessions(sessionsData.data);
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  // Animation variants with correct typing
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-red-500"
      >
        {error}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto"
    >
      <motion.h1 variants={itemVariants} className="text-3xl mb-6">
        Player Profile
      </motion.h1>

      {/* User info card */}
      <motion.div
        variants={itemVariants}
        className="bg-gray-900 p-6 rounded-lg border border-green-500 mb-8"
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-2xl font-bold">
            {user?.username[0].toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-green-400" />
              <h2 className="text-2xl">{user?.username}</h2>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <p className="text-gray-400">{user?.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <p className="text-sm text-green-400">{user?.isAdmin ? 'Admin' : 'Player'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      {stats && (
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
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
            icon={<BarChart3 className="w-6 h-6" />}
          />
        </motion.div>
      )}

      {/* Difficulty breakdown */}
      {stats && (
        <motion.div
          variants={itemVariants}
          className="bg-gray-900 p-6 rounded-lg border border-green-500 mb-8"
        >
          <h3 className="text-xl mb-4">Games by Difficulty</h3>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="h-2 bg-gray-700 rounded">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.gamesByDifficulty.easy / stats.totalGames) * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-2 bg-green-500 rounded"
                />
              </div>
              <p className="text-sm mt-1">Easy: {stats.gamesByDifficulty.easy}</p>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-gray-700 rounded">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.gamesByDifficulty.medium / stats.totalGames) * 100}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="h-2 bg-yellow-500 rounded"
                />
              </div>
              <p className="text-sm mt-1">Medium: {stats.gamesByDifficulty.medium}</p>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-gray-700 rounded">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.gamesByDifficulty.hard / stats.totalGames) * 100}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-2 bg-red-500 rounded"
                />
              </div>
              <p className="text-sm mt-1">Hard: {stats.gamesByDifficulty.hard}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Chart */}
      {sessions.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="bg-gray-900 p-6 rounded-lg border border-green-500 mb-8"
        >
          <h3 className="text-xl mb-4">Recent Performance</h3>
          <ScoresChart sessions={sessions} />
        </motion.div>
      )}

      {/* Game history */}
      <motion.div
        variants={itemVariants}
        className="bg-gray-900 p-6 rounded-lg border border-green-500"
      >
        <h3 className="text-xl mb-4">Game History</h3>
        <SessionsTable sessions={sessions} />
      </motion.div>
    </motion.div>
  );
};

export default Profile;