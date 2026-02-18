import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Crown, Medal, Trophy } from 'lucide-react';
import { gameService } from '../services/game';

interface Session {
  id: string;
  user: { username: string };
  score: number;
  accuracy: number;
  difficulty: string;
  createdAt: string;
}

const Leaderboard = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly'>('all');

  useEffect(() => {
    gameService.getLeaderboard()
      .then(setSessions)
      .finally(() => setLoading(false));
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-green-400">Loading leaderboard...</div>
      </div>
    );
  }

  const topThree = sessions.slice(0, 3);
  const rest = sessions.slice(3);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto px-4"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold glitch mb-2" data-text="LEADERBOARD">
          LEADERBOARD
        </h1>
        <p className="text-gray-400">Top memory hackers this week</p>
      </motion.div>

      {/* Filter tabs */}
      <motion.div variants={itemVariants} className="flex justify-center gap-2 mb-8 flex-wrap">
        {['all', 'daily', 'weekly'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-3 sm:px-4 py-2 rounded capitalize transition text-sm sm:text-base ${
              filter === f
                ? 'bg-green-600 text-black font-bold'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Podium for top 3 */}
      {topThree.length > 0 && (
  <motion.div variants={itemVariants} className="mb-12">
    <h2 className="text-2xl font-semibold text-center mb-6"><Trophy className="inline" size={24} /> Top Hackers</h2>
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
      {/* Second place */}
      {topThree[1] && (
        <motion.div
          variants={itemVariants}
          className="order-2 md:order-1 text-center w-full max-w-[140px]"
        >
          <div className="relative inline-block">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gray-800 rounded-t-full mx-auto mb-2 flex items-center justify-center border-2 border-gray-500">
              <span className="text-2xl sm:text-3xl font-bold">{topThree[1].user.username[0]}</span>
            </div>
            <Medal className="absolute -top-2 -right-2 text-gray-400" size={20} />
          </div>
          <p className="font-bold text-sm sm:text-base break-words">{topThree[1].user.username}</p>
          <p className="text-green-400 text-sm sm:text-base">{topThree[1].score} pts</p>
          <p className="text-xs text-gray-500">2nd</p>
        </motion.div>
      )}

      {/* First place */}
      {topThree[0] && (
        <motion.div
          variants={itemVariants}
          className="order-1 md:order-2 text-center w-full max-w-[160px] transform scale-110 z-10"
        >
          <div className="relative inline-block">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 bg-gradient-to-b from-yellow-500 to-yellow-700 rounded-t-full mx-auto mb-2 flex items-center justify-center border-4 border-yellow-300 shadow-lg shadow-yellow-500/50">
              <span className="text-3xl sm:text-4xl font-bold">{topThree[0].user.username[0]}</span>
            </div>
            <Crown className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-yellow-400" size={28} />
          </div>
          <p className="font-bold text-base sm:text-lg break-words">{topThree[0].user.username}</p>
          <p className="text-green-400 text-lg sm:text-xl">{topThree[0].score} pts</p>
          <p className="text-xs text-yellow-400">1st</p>
        </motion.div>
      )}

      {/* Third place */}
      {topThree[2] && (
        <motion.div
          variants={itemVariants}
          className="order-3 text-center w-full max-w-[120px]"
        >
          <div className="relative inline-block">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-gray-800 rounded-t-full mx-auto mb-2 flex items-center justify-center border-2 border-amber-700">
              <span className="text-xl sm:text-2xl font-bold">{topThree[2].user.username[0]}</span>
            </div>
            <Medal className="absolute -top-2 -right-2 text-amber-600" size={18} />
          </div>
          <p className="font-bold text-xs sm:text-sm break-words">{topThree[2].user.username}</p>
          <p className="text-green-400 text-xs sm:text-sm">{topThree[2].score} pts</p>
          <p className="text-xs text-amber-600">3rd</p>
        </motion.div>
      )}
    </div>
  </motion.div>
)}

      {/* Leaderboard table for remaining entries */}
      {rest.length > 0 && (
        <motion.div variants={itemVariants} className="bg-gray-900 rounded-lg border border-green-500 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead className="bg-green-900">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Player</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Accuracy</th>
                  <th className="p-3">Difficulty</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {rest.map((session, index) => (
                  <motion.tr
                    key={session.id}
                    variants={itemVariants}
                    className="border-t border-green-800 hover:bg-gray-800 transition"
                  >
                    <td className="p-3 font-mono">#{index + 4}</td>
                    <td className="p-3 font-medium truncate max-w-[150px]">{session.user.username}</td>
                    <td className="p-3 text-green-400">{session.score}</td>
                    <td className="p-3">{session.accuracy.toFixed(1)}%</td>
                    <td className="p-3 capitalize">
                      <span className={`px-2 py-1 rounded text-xs ${
                        session.difficulty === 'easy' ? 'bg-green-900 text-green-300' :
                        session.difficulty === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {session.difficulty}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* If no sessions */}
      {sessions.length === 0 && (
        <motion.div variants={itemVariants} className="text-center py-12 text-gray-500">
          No games played yet. Be the first!
        </motion.div>
      )}
    </motion.div>
  );
};

export default Leaderboard;