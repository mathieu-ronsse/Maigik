import React from 'react';
import { Sparkles, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import AuthModal from './AuthModal';
import TokenDisplay from './TokenDisplay';

export default function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const { profile } = useProfile(user?.id);
  const navigate = useNavigate();

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error in handleSignOut:', error);
    }
  };

  return (
    <>
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8 bg-gray-900/50 backdrop-blur-sm fixed top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
              MAIGIK
            </span>
          </Link>
          
          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <Link 
                  to="/pricing" 
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <TokenDisplay profile={profile} />
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  <User className="w-5 h-5 text-gray-300" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}