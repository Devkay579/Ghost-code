import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { playSound } from '../../../services/sound';

interface Props {
  onComplete: () => void;
}

const ReverseTyping = ({ onComplete }: Props) => {
  const [original, setOriginal] = useState('');
  const [reversed, setReversed] = useState('');
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState(false);

  // Generate a random string (4-6 characters)
  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = Math.floor(Math.random() * 3) + 4; // 4-6
    let word = '';
    for (let i = 0; i < length; i++) {
      word += chars[Math.floor(Math.random() * chars.length)];
    }
    setOriginal(word);
    setReversed(word.split('').reverse().join(''));
    setUserInput('');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.toUpperCase() === reversed) {
      playSound('success');
      onComplete();
    } else {
      playSound('wrong');
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <h2 className="text-2xl mb-4">🔄 Reverse Typing</h2>
      <p className="mb-2 text-gray-400">Type this backwards:</p>
      <p className="text-4xl font-mono mb-6 text-green-400">{original}</p>

      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className={`w-full bg-black border ${
            error ? 'border-red-500' : 'border-green-500'
          } text-green-500 p-3 text-xl text-center rounded mb-4`}
          placeholder="______"
          autoFocus
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 py-3 rounded transition transform hover:scale-105"
        >
          Submit
        </button>
      </form>
      {error && <p className="text-red-400 mt-2">Incorrect, try again!</p>}
    </motion.div>
  );
};

export default ReverseTyping;