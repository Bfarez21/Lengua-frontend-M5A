// src/firebase/authService.js
import { auth } from "./firebase";
import firebase from "firebase/compat/app";

// Método para iniciar sesión con Google
const loginWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    console.log("Usuario:", user);
    return user; // Retorna el usuario para usarlo en otros lugares si es necesario
  } catch (error) {
    console.error("Error durante el login:", error.message);
    return null;
  }
};

// Método para cerrar sesión
const logout = async () => {
  try {
    await auth.signOut();
    console.log("User logged out");
  } catch (error) {
    console.error("Error during logout:", error.message);
  }
};


const obtenerDetalles = async => {
  const user = auth.currentUser; // Obtén el usuario actual autenticado
  if (user) {
    const userDetails = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };

    console.log("Detalles del usuario:", userDetails);
    return userDetails;
  } else {
    console.log("No hay usuario autenticado");
    return null;
  }
};
export { loginWithGoogle, logout, obtenerDetalles };