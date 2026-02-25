import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthCallback = () => {
  const location = useLocation();
  const { processSession } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const hash = location.hash;
    const sessionIdMatch = hash.match(/session_id=([^&]+)/);
    
    if (sessionIdMatch) {
      const sessionId = sessionIdMatch[1];
      
      processSession(sessionId)
        .then((user) => {
          // Clear the hash and redirect using window.location to ensure clean state
          // This prevents the hash from persisting and causing re-processing
          window.history.replaceState(null, '', '/dashboard');
          window.location.href = '/dashboard';
        })
        .catch((err) => {
          console.error('Auth callback error:', err);
          window.location.href = '/login';
        });
    } else {
      window.location.href = '/login';
    }
  }, [location.hash, processSession]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-center">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-[#A1A1AA]">Connexion en cours...</p>
      </div>
    </div>
  );
};
