import { useState } from 'react';
import { playSound } from '../../../services/sound';

interface Props {
  onComplete: () => void;
}

const MathInterference = ({ onComplete }: Props) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const [num1] = useState(Math.floor(Math.random() * 10));
  const [num2] = useState(Math.floor(Math.random() * 10));
  const correct = num1 + num2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() === '') return;

    if (parseInt(answer) === correct) {
      playSound('success'); 
      onComplete();
    } else {
      playSound('wrong');   
      setError('Wrong! Try again.');
      setAnswer('');
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl mb-4">Math Interference</h2>
      <p className="mb-2">Solve to continue:</p>
      <p className="text-4xl mb-4">{num1} + {num2} = ?</p>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="bg-black border border-green-500 text-green-500 p-2 rounded mr-2"
          autoFocus
        />
        <button type="submit" className="bg-green-600 px-4 py-2 rounded">Submit</button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default MathInterference;