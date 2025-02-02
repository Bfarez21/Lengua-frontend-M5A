import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";


const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // Si el usuario no está autenticado, redirige a la página de inicio de sesión
  if (!user) {
    return <Navigate to="/signin" />;
  }

  return children; // Si está autenticado, muestra el contenido de la ruta
};

export default ProtectedRoute;
