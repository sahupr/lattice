import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import ProfileService from '../services/ProfileService';
import { useAuth } from './AuthProvider';

const context = createContext({
  isLoading: true, failedToLoad: null,
  skills: [], profiles: [],
  getSkills() {}, getProfiles() {}
});

export function ProfileListProvider({ children }) {
  const { token } = useAuth();

  const [ isLoading, setLoading ] = useState(true);
  const [ failedToLoad, setFailedToLoad ] = useState(null);
  const [ skills, setSkills ] = useState([]);

  const [ profiles, setProfiles ] = useState([]);

  const getSkills = useCallback(async () => {
    const skills = await ProfileService.getSkills({ token });
    setSkills(skills);
  }, [ token ]);
  
  const getProfiles = useCallback(async () => {
    try {
      setLoading(true);
      setFailedToLoad(null);

      const profiles = await ProfileService.getProfiles({ token });

      setProfiles(profiles);
    } catch (err) {
      setFailedToLoad(err);
    } finally {
      setLoading(false);
    }
  }, [ token ]);

  useEffect(() => {
    token && getSkills();
  }, [ token, getSkills ]);

  useEffect(() => {
    token && getProfiles();
  }, [ token, getProfiles ]);

  const contextValue = {
    isLoading, failedToLoad,
    skills, profiles,
    getSkills, getProfiles
  };

  return <context.Provider value={contextValue}>{children}</context.Provider>;
};

export const useProfileList = () => useContext(context);