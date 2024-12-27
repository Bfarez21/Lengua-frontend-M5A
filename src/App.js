import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./app/page"; // Asegúrate de que esta ruta sea correcta
import Contact from "./components/Contact";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import Video from "./components/Video";
import AboutSection from "./components/About/AboutSection";
const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} /> {/* Cambia esto para que la página de inicio sea la raíz */}
            <Route path="/about" element={<AboutSection />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/video" element={<Video />} />
        </Routes>
    );
};

export default App;