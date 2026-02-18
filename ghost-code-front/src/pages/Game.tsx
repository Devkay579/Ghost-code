import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import MemoryScreen from '../components/game/MemoryScreen';
import DistractionEngine from '../components/game/DistractionEngine';
import RecallScreen from '../components/game/RecallScreen';
import ResultsScreen from '../components/game/ResultsScreen';

type Phase = 'memory' | 'distraction' | 'recall' | 'results';

const Game = () => {
  const navigate = useNavigate();
  const { currentCode, result, submitGame,  loading, error } = useGameStore();
  const [phase, setPhase] = useState<Phase>('memory');

  useEffect(() => {
    // If no currentCode, redirect to home
    if (!currentCode && !loading) {
      navigate('/');
    }
  }, [currentCode, loading, navigate]);

  const handleMemoryComplete = () => setPhase('distraction');
  const handleDistractionComplete = () => setPhase('recall');
  const handleRecallSubmit = async (code: string) => {
    await submitGame(code);
    setPhase('results');
  };
//   const handlePlayAgain = () => {
//     resetGame();
//     navigate('/');
//   };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!currentCode) return null;

  return (
    <div>
      {phase === 'memory' && <MemoryScreen code={currentCode} onComplete={handleMemoryComplete} />}
      {phase === 'distraction' && <DistractionEngine onComplete={handleDistractionComplete} />}
      {phase === 'recall' && <RecallScreen onSubmit={handleRecallSubmit} />}
      {phase === 'results' && result && (
        <ResultsScreen
          accuracy={result.accuracy}
          score={result.score}
          correctCode={result.correctCode}
        />
      )}
    </div>
  );
};

export default Game;