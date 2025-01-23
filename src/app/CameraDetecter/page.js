import React, { useEffect, useState } from "react";
import CameraComponent from "../../components/camera/CameraComponent";

const CameraDetecter = () => {
  const [inView, setInView] = useState(false);

  // Usamos el IntersectionObserver para detectar el scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else {
          setInView(false);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById("camera-textarea-container");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <>
      <section
        id="PruebaPage"
        className="relative z-10 bg-gradient-to-r from-indigo-500 to-blue-1000 overflow-hidden pt-[120px] pb-[80px] dark:bg-gray-dark"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="mb-6 text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Traductor de Lengua de Señas
            </h1>
            <p className="mb-10 text-lg leading-relaxed sm:text-xl md:text-2xl max-w-3xl mx-auto">
              A través de algoritmos de aprendizaje profundo, hemos desarrollado un sistema que interpreta gestos
              capturados por una cámara y los convierte en texto y audio en tiempo real. Podrás aprender la lengua de
              señas, desde lo más básico como el alfabeto, números y frases comunes utilizadas por personas con esta
              discapacidad.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          id="camera-textarea-container"
          className={`transition-all duration-700 ease-in-out transform ${
            inView ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
          }`}
        >
          <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto p-6">
            <CameraComponent />
          </div>
        </div>
      </section>
    </>
  );
};

export default CameraDetecter;
