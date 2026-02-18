import { useEffect, useState } from 'react';
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

  useEffect(() => {
    gameService.getLeaderboard()
      .then(setSessions)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl mb-6">Leaderboard</h1>
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-green-900">
            <tr>
              <th className="p-3">Player</th>
              <th className="p-3">Score</th>
              <th className="p-3">Accuracy</th>
              <th className="p-3">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className="border-t border-green-800">
                <td className="p-3">{s.user.username}</td>
                <td className="p-3">{s.score}</td>
                <td className="p-3">{s.accuracy.toFixed(1)}%</td>
                <td className="p-3 capitalize">{s.difficulty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;