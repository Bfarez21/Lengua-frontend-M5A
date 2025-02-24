import React from "react";
import BlurText from "../../components/Hero/BlurText";

const Somos = () => {
  return (
    <>
      <section
        id="somos"
        className="relative z-10 overflow-hidden bg-white pb-16 pt-[120px] dark:bg-gray-dark md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[10px] 2xl:pt-[210px]"
      >
        <div className="container flex items-center justify-between mx-auto px-4">
          <div className="mx-58 max-w-[800px] text-center">
            <BlurText
              text="¿Quiénes Somos?"
              delay={150}
              animateBy="words"
              direction="top"
              //onAnimationComplete={() => console.log('Animation completed!')}
              className=" text-[clamp(2rem,8vw,5rem)] text-9xl md:text-9xl lg:text-[5rem] text-center font-extrabold leading-tight text-dark dark:text-blue-500 mb-10"
            />
            <p
              className="mb-12 text-base !leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg md:text-xl">
              A través de algoritmos de aprendizaje profundo, hemos desarrollado un sistema que interpreta gestos
              capturados por una cámara y los convierte en texto y audio en tiempo real. Este avance no solo
              facilita la interacción diaria, sino que también impulsa la inclusión social, educativa y laboral
              de las personas con discapacidades auditivas, fomentando su independencia en diversos entornos.
            </p>
            <p
              className="mb-12 text-base !leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg md:text-xl">

              En HablaSeñas AI, creemos en la igualdad de oportunidades y en el poder de la tecnología
              para derribar límites. Trabajamos con pasión e innovación para crear soluciones que transformen
              vidas y promuevan una sociedad más equitativa.
            </p>
          </div>
            <div className="w-1/2 flex justify-center">
              <img
                src="/images/img-apl02.png"
                alt="logo"
                className="w-[260px] h-[500px] max-w-full"
              />
            </div>
        </div>
      </section>
    </>
  );
};

export default Somos;
