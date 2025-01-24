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

// Crear el contexto del tema
export const ThemeContext = createContext({
    theme: 'dark',
    setTheme: () => null
});

// Proveedor personalizado del tema
const CustomThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');

    // useEffect(() => {
    //     // Cargar el tema inicial desde localStorage
    //     const savedTheme = localStorage.getItem('theme') || 'dark';
    //     setTheme(savedTheme);
    //     document.documentElement.className = savedTheme;
    // }, []);

    const handleTheme = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.className = newTheme;
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: handleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

const App = () => {
    return (
        <CustomThemeProvider>
            <Routes>
                <Route path="/" element={<RootLayout><Home /></RootLayout>} />
                <Route path="/somos" element={<RootLayout><Somos /></RootLayout>} />
                <Route path="/contact" element={<RootLayout><ContactPage /></RootLayout>} />
                <Route path="/comentarios" element={<RootLayout><Testimonials /></RootLayout>} />
                <Route path="/camaraDetecter" element={<RootLayout><CameraDetecter /></RootLayout>} />
                <Route path="/jugar" element={<RootLayout>< PlayPage /></RootLayout>} />
                <Route path="/jugar/NivelFacil" element={<RootLayout>< EasyLevel /></RootLayout>} />
                <Route path="/jugar/NivelMedio" element={<RootLayout>< IntermediateLevel /></RootLayout>} />
                <Route path="/jugar/NivelDificil" element={<RootLayout>< DifficultLevel /></RootLayout>} />
                {/* Define más rutas aquí */}
            </Routes>
        </CustomThemeProvider>
    );
};

export default App;