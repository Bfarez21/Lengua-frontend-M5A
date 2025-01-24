import React from "react";
import { Link } from "react-router-dom";

const EasyLevel = () => {

  return(
    <>
      <section
        id="NivelFacil"
        className="relative z-10 bg-gradient-to-r from-indigo-500 to-blue-1000 overflow-hidden pt-[120px] pb-[80px] dark:bg-gray-dark"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Encabezado */}
          <div className="text-center text-white">
            <h1 className="mb-6 text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Adivina la Seña
            </h1>
            <p className="mb-10 text-lg leading-relaxed sm:text-xl md:text-2xl max-w-3xl mx-auto">
              A continuación tienes una seña en pantalla, selecciona la letra o número correspondiente
              de las siguientes opciones:
            </p>
          </div>

          {/* Desarrollo */}
        </div>
      </section>
    </>
  );

};
export default EasyLevel;