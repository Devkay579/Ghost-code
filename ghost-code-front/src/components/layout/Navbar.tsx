import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { token, user, logout } = useAuthStore();
    const isAuthenticated = !!token;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  // Motion variants
  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const linkHover = { scale: 1.1, color: '#34D399', transition: { duration: 0.2 } };

  return (
    <nav className="bg-black border-b border-green-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-500">GHOST CODE</Link>

        {/* Hamburger icon (mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-green-500 focus:outline-none"
        >
          <motion.svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={false}
            animate={isOpen ? 'open' : 'closed'}
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              variants={{
                closed: { d: 'M4 6h16M4 12h16M4 18h16' },
                open: { d: 'M6 18L18 6M6 6l12 12' },
              }}
            />
          </motion.svg>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-4">
          <motion.div whileHover={linkHover}><Link to="/">Home</Link></motion.div>
          {isAuthenticated ? (
            <>
              <motion.div whileHover={linkHover}><Link to="/play">Play</Link></motion.div>
              <motion.div whileHover={linkHover}><Link to="/leaderboard">Leaderboard</Link></motion.div>
              <motion.div whileHover={linkHover}><Link to="/profile">Profile</Link></motion.div>
              {user?.isAdmin && <motion.div whileHover={linkHover}><Link to="/admin">Admin</Link></motion.div>}
              <motion.button whileHover={{ scale: 1.05, color: '#EF4444' }} onClick={handleLogout}>Logout</motion.button>
            </>
          ) : (
            <>
              <motion.div whileHover={linkHover}><Link to="/login">Login</Link></motion.div>
              <motion.div whileHover={linkHover}><Link to="/register">Register</Link></motion.div>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden mt-4 flex flex-col space-y-2 bg-gray-900 p-4 rounded"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div whileHover={linkHover}><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></motion.div>
            {isAuthenticated ? (
              <>
                <motion.div whileHover={linkHover}><Link to="/play" onClick={() => setIsOpen(false)}>Play</Link></motion.div>
                <motion.div whileHover={linkHover}><Link to="/leaderboard" onClick={() => setIsOpen(false)}>Leaderboard</Link></motion.div>
                <motion.div whileHover={linkHover}><Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link></motion.div>
                {user?.isAdmin && <motion.div whileHover={linkHover}><Link to="/admin" onClick={() => setIsOpen(false)}>Admin</Link></motion.div>}
                <motion.button whileHover={{ scale: 1.05, color: '#EF4444' }} onClick={handleLogout} className="text-left">Logout</motion.button>
              </>
            ) : (
              <>
                <motion.div whileHover={linkHover}><Link to="/login" onClick={() => setIsOpen(false)}>Login</Link></motion.div>
                <motion.div whileHover={linkHover}><Link to="/register" onClick={() => setIsOpen(false)}>Register</Link></motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;