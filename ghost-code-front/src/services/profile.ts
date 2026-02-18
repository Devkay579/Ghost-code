import api from './api';

export interface GameSession {
  id: string;
  difficulty: string;
  score: number;
  accuracy: number;
  timeTaken: number;
  createdAt: string;
}

export interface UserStats {
  totalGames: number;
  averageAccuracy: number;
  highestScore: number;
  totalScore: number;
  gamesByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface PaginatedSessions {
  data: GameSession[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const profileService = {
  async getStats(): Promise<UserStats> {
    const response = await api.get('/profile/stats');
    return response.data;
  },
  async getSessions(page: number = 1, limit: number = 10): Promise<PaginatedSessions> {
    const response = await api.get(`/profile/sessions?page=${page}&limit=${limit}`);
    return response.data;
  },
};