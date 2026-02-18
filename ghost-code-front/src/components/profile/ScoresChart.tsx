import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { GameSession } from '../../services/profile';

interface Props {
  sessions: GameSession[];
}

const ScoresChart = ({ sessions }: Props) => {
  // Take last 10 sessions for chart
  const data = sessions.slice(0, 10).reverse().map((s, index) => ({
    name: `Game ${index + 1}`,
    score: s.score,
    accuracy: s.accuracy,
  }));

  if (sessions.length === 0) return null;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" stroke="#00ff00" />
          <YAxis stroke="#00ff00" />
          <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#00ff00' }} />
          <Line type="monotone" dataKey="score" stroke="#00ff00" name="Score" />
          <Line type="monotone" dataKey="accuracy" stroke="#ff00ff" name="Accuracy %" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoresChart;