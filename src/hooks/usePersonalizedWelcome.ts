import { useState, useEffect } from 'react';

interface PersonalizedData {
  isFirstTime: boolean | null;
  showWelcomeModal: boolean;
  userPreference: 'first_time' | 'returning' | null;
}

export const usePersonalizedWelcome = () => {
  const [personalizedData, setPersonalizedData] = useState<PersonalizedData>({
    isFirstTime: null,
    showWelcomeModal: false,
    userPreference: null,
  });

  useEffect(() => {
    const savedPreference = localStorage.getItem('user_welcome_preference');
    const hasVisited = localStorage.getItem('has_visited_kerigma');

    if (!hasVisited && !savedPreference) {
      // First time visitor - show modal after 2 seconds
      const timer = setTimeout(() => {
        setPersonalizedData(prev => ({
          ...prev,
          showWelcomeModal: true,
          isFirstTime: true,
        }));
      }, 2000);

      return () => clearTimeout(timer);
    } else if (savedPreference) {
      setPersonalizedData(prev => ({
        ...prev,
        userPreference: savedPreference as 'first_time' | 'returning',
        isFirstTime: savedPreference === 'first_time',
      }));
    }

    // Mark as visited
    localStorage.setItem('has_visited_kerigma', 'true');
  }, []);

  const handleWelcomeResponse = (isFirstTime: boolean) => {
    const preference = isFirstTime ? 'first_time' : 'returning';
    localStorage.setItem('user_welcome_preference', preference);
    
    setPersonalizedData(prev => ({
      ...prev,
      isFirstTime,
      showWelcomeModal: false,
      userPreference: preference,
    }));
  };

  const closeWelcomeModal = () => {
    setPersonalizedData(prev => ({
      ...prev,
      showWelcomeModal: false,
    }));
  };

  return {
    ...personalizedData,
    handleWelcomeResponse,
    closeWelcomeModal,
  };
};