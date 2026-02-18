import api from './api';

export interface StartGameDto {
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SubmitGameDto {
  gameId: string;
  submittedCode: string;
  timeTaken: number;
}

export const gameService = {
  async startGame(difficulty: string) {
    const response = await api.post('/game/start', { difficulty });
    return response.data; // { gameId, code, difficulty }
  },
  async submitGame(data: SubmitGameDto) {
    const response = await api.post('/game/submit', data);
    return response.data; // { accuracy, score, correctCode }
  },
  async getLeaderboard() {
    const response = await api.get('/game/leaderboard');
    return response.data;
  },
};