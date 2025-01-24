import React from "react";
import { Link } from "react-router-dom";

const PlayPage = () => {
  return (
    <>
      <section
        id="juegoPage"
        className="relative z-10 bg-gradient-to-r from-indigo-500 to-blue-1000 overflow-hidden pt-[120px] pb-[80px] dark:bg-gray-dark"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Encabezado */}
          <div className="text-center text-white">
            <h1 className="mb-6 text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Traductor de Lengua de Señas
            </h1>
            <p className="mb-10 text-lg leading-relaxed sm:text-xl md:text-2xl max-w-3xl mx-auto">
               Podrás aprender la lengua de señas desde lo más básico como el alfabeto, números y frases comunes utilizadas por personas con esta
               discapacidad.
            </p>
          </div>

          {/* Tarjetas de dificultad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Nivel Fácil */}
            <div className="bg-white text-center rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-indigo-500 mb-4">Fácil</h3>
              <p className="text-gray-600 mb-6">
                Aprende las bases como el alfabeto y los números. Ideal para principiantes.
              </p>

              <Link
                to="/jugar/NivelFacil"
               className="bg-indigo-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-600">

                Comenzar
              </Link>
            </div>

            {/* Nivel Medio */}
            <div className="bg-white text-center rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-blue-500 mb-4">Medio</h3>
              <p className="text-gray-600 mb-6">
                Explora frases comunes y estructuras básicas de comunicación.
              </p>
              <Link
                to="/jugar/NivelMedio"
                className="bg-indigo-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-600">

                Comenzar
              </Link>
            </div>

            {/* Nivel Difícil */}
            <div className="bg-white text-center rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-red-500 mb-4">Difícil</h3>
              <p className="text-gray-600 mb-6">
                Domina expresiones avanzadas y mejora tu fluidez en lengua de señas.
              </p>
              <Link
                to="/jugar/NivelDificil"
                className="bg-indigo-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-600">

                Comenzar
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PlayPage;
