import { useState, useEffect } from 'react';

interface Props {
  onComplete: () => void;
}

const PatternMatch = ({ onComplete }: Props) => {
  const [pattern, setPattern] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [phase, setPhase] = useState<'showing' | 'input'>('showing');
  const [currentShowIndex, setCurrentShowIndex] = useState(0);
  const [flashIndex, setFlashIndex] = useState(-1);
  const [error, setError] = useState<number | null>(null); // flash wrong button

  // Generate pattern once on mount
  useEffect(() => {
    const length = Math.floor(Math.random() * 3) + 4; // 4-6 steps
    const newPattern = Array.from({ length }, () => Math.floor(Math.random() * 4)); // 0-3
    setPattern(newPattern);
  }, []);

  // Show pattern step by step
  useEffect(() => {
    if (phase !== 'showing' || pattern.length === 0) return;

    if (currentShowIndex < pattern.length) {
      const timer = setTimeout(() => {
        setFlashIndex(pattern[currentShowIndex]);
        setTimeout(() => setFlashIndex(-1), 400); // flash for 400ms
        setCurrentShowIndex((prev) => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      // Finished showing pattern
      setPhase('input');
    }
  }, [currentShowIndex, pattern, phase]);

  // Handle user clicking a button
  const handleButtonClick = (btnIndex: number) => {
    if (phase !== 'input') return;

    const newInput = [...playerInput, btnIndex];
    setPlayerInput(newInput);

    const stepIndex = newInput.length - 1; // check current step

    if (btnIndex !== pattern[stepIndex]) {
      // Flash wrong button
      setError(btnIndex);
      setTimeout(() => setError(null), 500);

      // Reset input for retry
      setPlayerInput([]);
      return;
    }

    // Correct input — flash the clicked button
    setFlashIndex(btnIndex);
    setTimeout(() => setFlashIndex(-1), 200);

    // If user completed pattern correctly
    if (newInput.length === pattern.length) {
      setTimeout(() => onComplete(), 300);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl mb-4">Pattern Recognition</h2>

      {phase === 'showing' ? (
        <div className="mb-8">
          <p className="mb-4">Watch the pattern...</p>
          <div className="flex gap-4">
            {[0, 1, 2, 3].map((btnIdx) => (
              <div
                key={btnIdx}
                className={`w-16 h-16 rounded border border-green-500 transition-colors duration-300
                  ${
                    flashIndex === btnIdx
                      ? 'bg-green-500'
                      : 'bg-gray-700'
                  }`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-4">Repeat the pattern</p>
          <div className="flex gap-4">
            {[0, 1, 2, 3].map((btnIdx) => (
              <button
                key={btnIdx}
                onClick={() => handleButtonClick(btnIdx)}
                disabled={phase !== 'input'}
                className={`w-16 h-16 rounded border border-green-500 transition-colors duration-200
                  ${
                    flashIndex === btnIdx
                      ? 'bg-green-500'
                      : error === btnIdx
                      ? 'bg-red-500'
                      : 'bg-gray-700'
                  }`}
              >
                {btnIdx + 1}
              </button>
            ))}
          </div>
          {error !== null && <p className="text-red-500 mt-2">Wrong! Try again.</p>}
        </div>
      )}
    </div>
  );
};

export default PatternMatch;