import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const STORAGE_KEY = 'cs-learner-session';

const defaultValue = {
  session: null,
  login: () => {},
  logout: () => {},
  hasFeature: () => false,
};

const LearnerSessionContext = createContext(defaultValue);

const parseStoredSession = (raw) => {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to parse learner session from storage.', error);
    return null;
  }
};

export const LearnerSessionProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const stored = window.localStorage?.getItem(STORAGE_KEY);
    return parseStoredSession(stored);
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    if (!session) {
      window.localStorage?.removeItem(STORAGE_KEY);
      return undefined;
    }

    window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(session));
    return undefined;
  }, [session]);

  const login = useCallback((payload) => {
    setSession({
      ...payload,
      lastLoginAt: new Date().toISOString(),
    });
  }, []);

  const logout = useCallback(() => {
    setSession(null);
  }, []);

  const hasFeature = useCallback((featureFlag) => Boolean(session?.permissions?.[featureFlag]), [session]);

  const value = useMemo(() => ({
    session,
    login,
    logout,
    hasFeature,
  }), [session, login, logout, hasFeature]);

  return (
    <LearnerSessionContext.Provider value={value}>
      {children}
    </LearnerSessionContext.Provider>
  );
};

LearnerSessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useLearnerSession = () => useContext(LearnerSessionContext);

export default useLearnerSession;
