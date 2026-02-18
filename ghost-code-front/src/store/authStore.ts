import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, type User,  } from '../services/auth';

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await authService.login({ email, password });
          localStorage.setItem('token', res.access_token);
          set({ token: res.access_token });
          const user = await authService.getMe();
          set({ user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      register: async (username, email, password) => {
        set({ isLoading: true });
        try {
          const res = await authService.register({ username, email, password });
          localStorage.setItem('token', res.access_token);
          set({ token: res.access_token });
          const user = await authService.getMe();
          set({ user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null });
      },
      fetchUser: async () => {
        const { token } = get();
        if (!token) return;
        set({ isLoading: true });
        try {
          const user = await authService.getMe();
          set({ user, isLoading: false });
        } catch (error) {
          localStorage.removeItem('token');
          set({ token: null, user: null, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);