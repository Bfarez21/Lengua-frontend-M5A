import React from "react";

const Somos = () => {
  return (
    <>
      <section
        id="somos"
        className="relative z-10 overflow-hidden bg-white pb-16 pt-[120px] dark:bg-gray-dark md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[10px] 2xl:pt-[210px]"
      >
        <div className="container">
              <div className="mx-auto max-w-[800px] text-center">
                <h1
                  className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                  ¿Quiénes Somos?
                </h1>
                <p
                  className="mb-12 text-base !leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg md:text-xl">
                  A través de algoritmos de aprendizaje profundo, hemos desarrollado un sistema que interpreta gestos
                  capturados por una cámara y los convierte en texto y audio en tiempo real. Este avance no solo
                  facilita la interacción diaria, sino que también impulsa la inclusión social, educativa y laboral
                  de las personas con discapacidades auditivas, fomentando su independencia en diversos entornos.
                </p>
                <p
                  className="mb-12 text-base !leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg md:text-xl">

                  En SignSpeak AI, creemos en la igualdad de oportunidades y en el poder de la tecnología
                  para derribar límites. Trabajamos con pasión e innovación para crear soluciones que transformen
                  vidas y promuevan una sociedad más equitativa.
                </p>
              </div>
        </div>
      </section>
    </>
  );
};

export default Somos;
