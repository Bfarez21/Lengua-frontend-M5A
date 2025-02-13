import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import CameraComponentPoses from "../../components/camera/CameraComponentPose";


const DifficultLevel = () => {
  const [greetings, setGreetings] = useState([]); // Lista de GIFs
  const [currentGif, setCurrentGif] = useState(null); // GIF actual

  useEffect(() => {
    const fetchGreetings = async () => {
      try {
        const response = await fetch(`${API_URL}/gifs/saludos`);
        const data = await response.json();
        const mappedGreetings = data.map(item => ({
          greeting: item.nombre,
          image: item.archivo
        }));
        setGreetings(mappedGreetings);

        // Establecer un GIF aleatorio inicialmente
        if (mappedGreetings.length > 0) {
          const randomIndex = Math.floor(Math.random() * mappedGreetings.length);
          setCurrentGif(mappedGreetings[randomIndex]);
        }
      } catch (error) {
        console.error("Error al obtener los saludos:", error);
      }
    };
    fetchGreetings();
  }, []);

  useEffect(() => {
    if (greetings.length === 0) return;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * greetings.length);
      setCurrentGif(greetings[randomIndex]); // Cambia el GIF cada 5 segundos
    }, 10000);

    return () => clearInterval(interval);
  }, [greetings]);

  return (
    <section
      id="NivelDificil"
      className="relative z-10 bg-gradient-to-r from-indigo-500 to-blue-1000 overflow-hidden pt-[120px] pb-[80px] dark:bg-gray-dark"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <h1 className="text-center mb-6 text-4xl font-extrabold">
          Juego Nivel Difícil
        </h1>
        <p className="text-center mb-6 text-lg">
          Observa la seña y reprodúcela frente a la cámara.
        </p>

        <div className="flex justify-center items-center space-x-8">
          {/* GIF Actual en la izquierda */}
          {currentGif && (
            <div className="text-center">
              <img src={currentGif.image} alt={currentGif.greeting} className="w-80 h-80 mx-auto rounded-lg" />
              <p className="mt-2 text-lg">{currentGif.greeting}</p>
            </div>
          )}

          {/* Cámara en la derecha */}
          <CameraComponentPoses />
        </div>
      </div>
    </section>
  );
};

export default DifficultLevel;
