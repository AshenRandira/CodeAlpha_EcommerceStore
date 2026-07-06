import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AuthContext from './authContext.js';

const TOKEN_STORAGE_KEY = 'codealpha_auth_token';

async function readJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setAuthError('');
  }, []);

  const saveSession = useCallback((nextToken, nextUser) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
    setAuthError('');
  }, []);

  const authenticate = useCallback(
    async (endpoint, credentials) => {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed.');
      }

      if (!data.token || !data.user) {
        throw new Error('The authentication response was incomplete.');
      }

      saveSession(data.token, data.user);

      return data.user;
    },
    [saveSession],
  );

  const register = useCallback(
    (credentials) => authenticate('/api/auth/register', credentials),
    [authenticate],
  );

  const login = useCallback(
    (credentials) => authenticate('/api/auth/login', credentials),
    [authenticate],
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    async function restoreSession() {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (!storedToken) {
        if (isActive) {
          setIsLoading(false);
        }

        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
          signal: controller.signal,
        });

        const data = await readJsonResponse(response);

        if (!isActive) {
          return;
        }

        if (response.status === 401) {
          clearSession();
          return;
        }

        if (!response.ok) {
          setAuthError(
            data.message || 'Unable to restore your session right now.',
          );

          return;
        }

        if (!data.user) {
          clearSession();
          return;
        }

        setToken(storedToken);
        setUser(data.user);
        setAuthError('');
      } catch (error) {
        if (error.name === 'AbortError' || !isActive) {
          return;
        }

        setAuthError('Unable to verify your session right now.');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [clearSession]);

  const value = useMemo(
    () => ({
      token,
      user,
      isLoading,
      isAuthenticated: Boolean(token && user),
      authError,
      register,
      login,
      logout,
    }),
    [
      token,
      user,
      isLoading,
      authError,
      register,
      login,
      logout,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
