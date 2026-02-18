import type { GameSession } from '../../services/profile';

interface Props {
  sessions: GameSession[];
}

const SessionsTable = ({ sessions }: Props) => {
  if (sessions.length === 0) {
    return <p className="text-gray-400 text-center py-8">No games played yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-green-900">
          <tr>
            <th className="p-3">Date</th>
            <th className="p-3">Difficulty</th>
            <th className="p-3">Score</th>
            <th className="p-3">Accuracy</th>
            <th className="p-3">Time (s)</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id} className="border-t border-green-800 hover:bg-gray-800">
              <td className="p-3">{new Date(session.createdAt).toLocaleDateString()}</td>
              <td className="p-3 capitalize">{session.difficulty}</td>
              <td className="p-3">{session.score}</td>
              <td className="p-3">{session.accuracy.toFixed(1)}%</td>
              <td className="p-3">{session.timeTaken}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionsTable;