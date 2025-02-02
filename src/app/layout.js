import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ScrollToTop from "../components/ScrollToTop";
import { Providers } from "./providers"; // Si estás usando un contexto global
import "../index.css"; // Asegúrate de que este archivo contenga los estilos necesarios

const RootLayout = ({ children }) => {
    return (
      <Providers>
          <Header /> {/* Header global */}
          <main className="bg-[#FCFCFC] dark:bg-black font-sans">{children}</main>
          <Footer />  {/* Footer global */}
          <ScrollToTop /> {/* Componente para manejar el scroll */}
      </Providers>
    );
};

export default RootLayout;
