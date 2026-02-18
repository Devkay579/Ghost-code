import { useState } from 'react';
import { playSound } from '../../services/sound';

interface Props {
  onSubmit: (code: string) => void;
}

const RecallScreen = ({ onSubmit }: Props) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('success');
    onSubmit(code);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl mb-4">Enter the vault code</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="w-full bg-black border border-green-500 text-green-500 p-4 text-2xl text-center rounded mb-4"
          placeholder="______"
          autoFocus
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-black font-bold py-3 px-6 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RecallScreen;