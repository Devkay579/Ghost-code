import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { playSound, preloadSounds } from './services/sound'; 
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token, fetchUser]);


  useEffect(() => {
    preloadSounds(); 
  }, []);

  // === Global click sound ===
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Only left-clicks
      if (e.button === 0) {
        playSound('click');
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <Game />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;