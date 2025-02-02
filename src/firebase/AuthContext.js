// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Importamos signOut
import { auth } from "./firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("Usuario cerrado sesión");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión: ", error);
      });
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
