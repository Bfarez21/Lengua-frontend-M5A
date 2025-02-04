import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../firebase/AuthContext";
 // Importar el contexto de autenticación

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Obtener el usuario del contexto

  const handleLoginRedirect = (event) => {
    if (!user) {
      // Si el usuario no está autenticado, evitar la acción predeterminada del enlace
      event.preventDefault();
      // Redirigir al login
      navigate("/signin");
    }
  };

  const handleActivateCamera = (event) => {
    if (!user) {
      // Si el usuario no está autenticado, evitar la acción predeterminada del enlace
      event.preventDefault();
      // Redirigir al login
      navigate("/signin");
    } else {
      // Si está autenticado, navegar a la cámara
      navigate("/camaraDetecter");
      console.log("Cámara activada");
      alert("Cámara activada");
    }
  };

  return (
    <>
      <section
        id="home"
        className="relative z-10 overflow-hidden bg-white pb-16 pt-[120px] dark:bg-gray-dark md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]"
      >
        <div className="container">
          <div className="flex flex-col-reverse md:flex-row items-center justify-center md:justify-between">
            {/* Sección de texto */}
            <div className="w-full md:w-1/2 px-4 text-center md:text-center">
              <div className="max-w-[800px]">
                <h1
                  className="text-5xl md:text-6xl lg:text-7xl text-center font-extrabold leading-tight text-dark dark:text-blue-500 uppercase mb-10">
                  <span className="block">SignSpeak IA</span>
                </h1>
                <p
                  className="mb-12 text-base leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg md:text-xl">
                  En SignSpeak AI, nos dedicamos a romper barreras de comunicación para construir un mundo más
                  inclusivo. Nuestro principal propósito es conectar a personas sordas con personas oyentes que no
                  conocen el lenguaje de señas, utilizando tecnología avanzada basada en inteligencia artificial.
                </p>
                <div className="flex flex-wrap justify-center md:justify-center space-x-3 items-center">
                  <Link
                    to="/categoria"
                    className="rounded-2xl bg-black px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
                    onClick={handleLoginRedirect}
                  >
                    Categorias Señas
                  </Link>
                  <Link
                    href="https://nextjstemplates.com/templates/saas-starter-startup"
                    className="rounded-2xl bg-black px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
                  >
                    🔥 Descargar App
                  </Link>
                  <Link
                    to="/jugar"
                    className="rounded-2xl bg-black px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
                    onClick={handleLoginRedirect}
                  >
                    🔥 Jugar ahora
                  </Link>
                  <Link
                    to="/camaraDetecter"
                    className="rounded-2xl bg-green-500 px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-green-600"
                    onClick={handleActivateCamera}
                  >
                    📸 Activar Cámara
                  </Link>
                </div>
              </div>
            </div>

            {/* Sección de imagen */}
            <div className="w-full md:w-1/2 px-4 flex justify-center">
              <div className="max-w-[400px] md:max-w-[800px]">
                <img
                  src="/images/logo/img-apl001.png"
                  alt="logo"
                  className="w-full"
                  width={140}
                  height={30}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
