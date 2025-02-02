import React, { createContext, useContext, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import RootLayout from "./app/layout";
import Home from "./app/page";
import Somos from "./app/about/page";
import ContactPage from "./app/contact/page";
import Testimonials from "./components/Testimonials";
import CameraDetecter from "./app/CameraDetecter/page";
import PlayPage from "./app/juego/playPage";
import EasyLevel from "./app/juego/easyLevel";
import IntermediateLevel from "./app/juego/intermediateLevel";
import DifficultLevel from "./app/juego/difficultLevel";
import SigninPage from "./app/signin/page";
import CategoriesSigns from "./app/CategoriesSigns/CategoriesSigns";
import CategoryDetailSigns from "./app/CategoriesSigns/CategoryDetailSigns";
import CameraComponentPoses from "./components/camera/CameraComponentPose";
import { AuthProvider } from "./firebase/AuthContext";

// Crear el contexto del tema
export const ThemeContext = createContext({
  theme: "dark",
  setTheme: () => null
});

// Proveedor personalizado del tema
const CustomThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // Primero intentamos obtener el tema guardado
    const savedTheme = localStorage.getItem("theme");

    // Si no hay tema guardado, establecemos 'dark' como predeterminado
    if (!savedTheme) {
      localStorage.setItem("theme", "dark");
      document.documentElement.className = "dark";
    } else {
      // Si hay un tema guardado, lo utilizamos
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    }
  }, []);

  const handleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.className = newTheme;
  };

  // Aseguramos que el tema dark se aplique inmediatamente al montar el componente
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const App = () => {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootLayout><Home /></RootLayout>} />
          <Route path="/somos" element={<RootLayout><Somos /></RootLayout>} />
          <Route path="/contact" element={<RootLayout><ContactPage /></RootLayout>} />
          <Route path="/comentarios" element={<RootLayout><Testimonials /></RootLayout>} />
          <Route path="/signin" element={<RootLayout><SigninPage /></RootLayout>} />
          <Route path="/camaraDetecter" element={<RootLayout><CameraDetecter /></RootLayout>} />
          <Route path="/camaraDetecter/poses" element={<RootLayout><CameraComponentPoses /></RootLayout>} />
          <Route path="/jugar" element={<RootLayout>< PlayPage /></RootLayout>} />
          <Route path="/categoria" element={<RootLayout>< CategoriesSigns /></RootLayout>} />
          <Route path="/categoria/details/:id" element={<RootLayout><CategoryDetailSigns /></RootLayout>} />
          <Route path="/jugar/NivelFacil" element={<RootLayout>< EasyLevel /></RootLayout>} />
          <Route path="/jugar/NivelMedio" element={<RootLayout>< IntermediateLevel /></RootLayout>} />
          <Route path="/jugar/NivelDificil" element={<RootLayout>< DifficultLevel /></RootLayout>} />
          {/* Define más rutas aquí */}
        </Routes>
      </AuthProvider>
    </CustomThemeProvider>
  );
};

export default App;