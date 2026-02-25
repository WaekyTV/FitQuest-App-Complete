import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Configure Axios Interceptor immediately
axios.defaults.withCredentials = true; // Ensure cookies are sent with all requests
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('session_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(Date.now());
  const processedCode = useRef(null);

  const addLog = (msg) => {
    // Disabled for performance - debug logging causes global re-renders
    // console.log(msg);
  };

  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, {
        withCredentials: true
      });
      setUser(response.data);
      setError(null);
    } catch (err) {
      setUser(null);
      if (err.response?.status !== 401) {
        setError('Authentication check failed');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      // 1. Check for Google Auth Code (Callback)
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      addLog(`Init. URL: ${window.location.href}`);
      addLog(`Code found? ${code ? 'YES' : 'NO'}`);

      // LOOP PROTECTION: Check strictly if we are reloading too fast
      const lastAttempt = sessionStorage.getItem('auth_attempt');
      const now = Date.now();
      if (lastAttempt && (now - parseInt(lastAttempt) < 1000) && !code) {
        console.error("Auth loop detected (no code), stopping.");
        return;
      }
      sessionStorage.setItem('auth_attempt', now.toString());

      if (code && !user) {
        // Prevent double processing of same code
        if (processedCode.current === code) {
          addLog("Code already processing/processed, skipping.");
          return;
        }
        processedCode.current = code;

        try {
          // Exchange code for session
          addLog("Sending code to backend...");
          // Retrieve the redirect URI used to initiate login
          const redirectUri = sessionStorage.getItem('google_redirect_uri') || "http://100.97.192.62.nip.io:3000";

          const res = await axios.post(`${API}/auth/google/callback`, {
            code,
            redirect_uri: redirectUri
          });

          // SAVE TOKEN TO LOCAL STORAGE
          if (res.data.session_token) {
            addLog(`Got session_token: ${res.data.session_token.substring(0, 10)}...`);
            localStorage.setItem('session_token', res.data.session_token);

            // Artificial Delay for UX (2 seconds) as requested
            addLog("Connexion en cours (Wait 2s)...");
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Clean URL BEFORE fetching user (to remove ?code=)
            window.history.replaceState({}, document.title, window.location.pathname);

            // Fetch User via State Update (No Reload!)
            await checkAuth();

          } else {
            addLog("ERROR: No session_token in response");
          }
        } catch (err) {
          console.error("Auth callback failed", err);
          addLog(`Callback failed: ${err.message}`);
          setError("Authentication failed.");
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        return;
      }

      // 2. Regular check - only if not already logged in
      if (!user) {
        addLog("Checking existing auth...");
        await checkAuth();
      }
    };
    initAuth();
  }, [checkAuth]); // Removed 'user' to prevent loop

  const login = () => {
    // DIRECT GOOGLE AUTH
    const clientId = "158036171715-agr13rgmehc083e75vm0qdb409a89u9q.apps.googleusercontent.com";
    // Detect redirect URI based on current usage (nip.io or localhost)
    let redirectUri = "http://100.97.192.62.nip.io:3000";
    if (window.location.hostname === "localhost") {
      redirectUri = "http://localhost:3000";
    }

    const scope = "openid email profile";
    const responseType = "code";

    // Construct Google OAuth URL
    // STORE REDIRECT URI to use in callback
    sessionStorage.setItem('google_redirect_uri', redirectUri);
    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;

    window.location.href = googleUrl;
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('session_token');
      setUser(null);
    }
  };

  const updateUser = async (updates) => {
    try {
      const response = await axios.put(`${API}/users/me`, updates, {
        withCredentials: true
      });
      setUser(response.data);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const processSession = async (sessionId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/auth/session?session_id=${sessionId}`, {
        withCredentials: true
      });
      setUser(response.data);
      setError(null);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError('Failed to process session');
      setLoading(false);
      throw err;
    }
  };

  const refreshUser = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, {
        withCredentials: true
      });
      setUser(response.data);
    } catch (err) {
      console.error('Refresh user error:', err);
    }
  }, []);

  const devLogin = async () => {
    try {
      const response = await axios.get(`${API}/auth/login/dev`, { withCredentials: true });
      setUser(response.data.user);
      window.location.reload();
    } catch (err) {
      console.error("Dev login failed", err);
    }
  };

  // Auto-sync logic (like Netflix) when switching back to the app
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        // Silent check to refresh data without showing loading states
        axios.get(`${API}/auth/me`, { withCredentials: true })
          .then(res => {
            setUser(res.data);
            setLastSync(Date.now()); // Trigger global refresh
          })
          .catch(() => { });
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange); // Also on focus
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [user]);

  const authValue = useMemo(() => ({
    user,
    loading,
    error,
    lastSync,
    login,
    logout,
    updateUser,
    processSession,
    checkAuth,
    refreshUser,
    devLogin,
    isAuthenticated: !!user,
    debugLogs: [],
    addLog
  }), [user, loading, error, checkAuth, refreshUser]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};
