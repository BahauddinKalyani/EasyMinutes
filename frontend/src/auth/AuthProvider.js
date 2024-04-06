import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('jwtToken') || '');

  const login = (jwtToken) => {
    setToken(jwtToken);
    localStorage.setItem('jwtToken', jwtToken);
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('jwtToken');
  };

  const isAuthenticated = () => {
    return !!token;
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;