import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ScrollToTop from "../components/ScrollToTop";
import { Providers } from "./providers"; // Si estás usando un contexto global
import "../index.css"; // Asegúrate de que este archivo contenga los estilos necesarios

const RootLayout = ({ children }) => {
    return (
        <html suppressHydrationWarning lang="en">
        <head>
            {/* Agrega más metadatos aquí si es necesario */}
        </head>
        <body className="bg-[#FCFCFC] dark:bg-black font-sans">
        <Providers>
            <Header /> {/* Header global */}
            <main>{children}</main> {/* El contenido específico de cada página */}
            <Footer />  {/* Footer global */}
            <ScrollToTop /> {/* Componente para manejar el scroll */}
        </Providers>
        </body>
        </html>
    );
};

export default RootLayout;
