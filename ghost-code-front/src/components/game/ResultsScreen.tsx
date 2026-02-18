import { useNavigate } from 'react-router-dom';

interface Props {
  accuracy: number;
  score: number;
  correctCode: string;
}

const ResultsScreen = ({ accuracy, score, correctCode }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-gray-900 p-8 rounded-lg border border-green-500 text-center">
        <h2 className="text-3xl mb-4">Breach Results</h2>
        <div className="space-y-2 mb-6">
          <p>Accuracy: <span className="text-green-400">{accuracy.toFixed(1)}%</span></p>
          <p>Score: <span className="text-green-400">{score}</span></p>
          <p>Correct Code: <span className="font-mono">{correctCode}</span></p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded"
          >
            Home
          </button>
          <button
            onClick={() => navigate('/leaderboard')}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded"
          >
            Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;