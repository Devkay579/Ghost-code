import { create } from 'zustand';
import { gameService } from '../services/game';

interface GameState {
  gameId: string | null;
  currentCode: string | null;
  difficulty: string | null;
  startTime: number | null;
  timeTaken: number | null;
  result: { accuracy: number; score: number; correctCode: string } | null;
  loading: boolean;
  error: string | null;
  startNewGame: (difficulty: string) => Promise<void>;
  submitGame: (submittedCode: string) => Promise<void>;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameId: null,
  currentCode: null,
  difficulty: null,
  startTime: null,
  timeTaken: null,
  result: null,
  loading: false,
  error: null,
  startNewGame: async (difficulty) => {
    set({ loading: true, error: null });
    try {
      const data = await gameService.startGame(difficulty);
      set({
        gameId: data.gameId,
        currentCode: data.code,
        difficulty: data.difficulty,
        startTime: Date.now(),
        loading: false,
        result: null,
      });
    } catch (error) {
      set({ error: 'Failed to start game', loading: false });
    }
  },
  submitGame: async (submittedCode: string) => {
    const { gameId, startTime } = get();
    if (!gameId || !startTime) return;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    set({ loading: true });
    try {
      const result = await gameService.submitGame({ gameId, submittedCode, timeTaken });
      set({ result, timeTaken, loading: false });
    } catch (error) {
      set({ error: 'Failed to submit game', loading: false });
    }
  },
  resetGame: () => {
    set({ gameId: null, currentCode: null, difficulty: null, startTime: null, result: null });
  },
}));