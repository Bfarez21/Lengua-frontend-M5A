import React from "react";
import { Routes, Route } from "react-router-dom"; // No necesitas BrowserRouter aquí
import RootLayout from "./app/layout"; // Asegúrate de que el path sea correcto
import Home from "./app/page"; // Asegúrate de que el path sea correcto


const App = () => {
    return (
        <Routes>
            <Route path="/" element={<RootLayout><Home /></RootLayout>} />
            {/* Define más rutas aquí */}

        </Routes>
    );
};

export default App;
