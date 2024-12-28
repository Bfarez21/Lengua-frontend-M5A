import React from "react";
import { Routes, Route } from "react-router-dom";
import RootLayout from "./app/layout"; // Asegúrate de que el path sea correcto
import Home from "./app/page";


const App = () => {
    return (
        <Routes>
            <Route path="/" element={<RootLayout><Home /></RootLayout>} />
            {/* Define más rutas aquí */}

        </Routes>
    );
};

export default App;
