
import React, { createContext, useState } from 'react';

// Create a shared context
export const AppContext = createContext();

// Provider that stores shared data
export const AppProvider = ({ children }) => {
  const [username, setUsername] = useState('Joycel');
  const [isSaving, setIsSaving] = useState(false);

  // Update username with a 1-second loading state
  const updateUsername = (newName) => {
    setIsSaving(true);

    setTimeout(() => {
      setUsername(newName);
      setIsSaving(false);
    }, 1000);
  };

  return (
    <AppContext.Provider
      value={{ username, updateUsername, isSaving }}
    >
      {children}
    </AppContext.Provider>
  );
};
