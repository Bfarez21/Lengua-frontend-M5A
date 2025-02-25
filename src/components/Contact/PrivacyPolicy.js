import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <>
      <section
        id="privacypolicy"
        className="relative z-10 overflow-hidden bg-white pb-16 pt-[120px] dark:bg-gray-dark md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[10px] 2xl:pt-[210px]"
      >
        <div className="container">
          <div className="mx-auto max-w-[800px]">
            <h1 className="mb-5 text-center text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
              Política de Privacidad
            </h1>
            <p className="mb-12 text-center text-base !leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg md:text-xl">
              En HablaSeñas AI, nos tomamos muy en serio la privacidad y
              seguridad de nuestros usuarios. Esta Política de Privacidad describe cómo
              recopilamos, utilizamos, almacenamos y protegemos la información que
              proporcionas al utilizar nuestros servicios.
            </p>

            <div className="shadow-three mx-auto rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
              <div className="mb-8">
                <h2 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl">
                  1. Información que recopilamos
                </h2>
                <p className="text-base !leading-relaxed text-body-color dark:text-body-color-dark">
                  Recopilamos diferentes tipos de información para proporcionar y mejorar nuestros servicios. La información puede incluir:
                </p>
                <ul className="mt-4 list-disc pl-6 text-body-color dark:text-body-color-dark">
                  <li className="mb-2">Información personal como nombre, dirección de correo electrónico y número de teléfono.</li>
                  <li className="mb-2">Información de uso sobre cómo interactúas con nuestra plataforma.</li>
                  <li className="mb-2">Información del dispositivo como tipo de navegador, sistema operativo y dirección IP.</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl">
                  2. Cómo utilizamos tu información
                </h2>
                <p className="mb-4 text-base !leading-relaxed text-body-color dark:text-body-color-dark">
                  Utilizamos la información recopilada para:
                </p>
                <ul className="list-disc pl-6 text-body-color dark:text-body-color-dark">
                  <li className="mb-2">Proporcionar, mantener y mejorar nuestros servicios.</li>
                  <li className="mb-2">Enviar notificaciones, confirmaciones y actualizaciones relacionadas con tu cuenta.</li>
                  <li className="mb-2">Personalizar tu experiencia y ofrecer contenido relevante.</li>
                  <li className="mb-2">Analizar el uso para mejorar nuestros productos y servicios.</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl">
                  3. Cómo compartimos tu información
                </h2>
                <p className="text-base !leading-relaxed text-body-color dark:text-body-color-dark">
                  No vendemos ni alquilamos tu información personal a terceros. Podemos compartir información en las siguientes circunstancias:
                </p>
                <ul className="mt-4 list-disc pl-6 text-body-color dark:text-body-color-dark">
                  <li className="mb-2">Con proveedores de servicios que necesitan acceso para ayudarnos a proporcionar nuestros servicios.</li>
                  <li className="mb-2">Para cumplir con obligaciones legales, como responder a una orden judicial.</li>
                  <li className="mb-2">Para proteger los derechos, la propiedad o la seguridad de nuestra empresa, usuarios u otros.</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl">
                  4. Tus derechos y opciones
                </h2>
                <p className="mb-4 text-base !leading-relaxed text-body-color dark:text-body-color-dark">
                  Respetamos tus derechos sobre tu información personal. Puedes:
                </p>
                <ul className="list-disc pl-6 text-body-color dark:text-body-color-dark">
                  <li className="mb-2">Acceder, corregir o eliminar tu información personal.</li>
                  <li className="mb-2">Optar por no recibir comunicaciones de marketing.</li>
                  <li className="mb-2">Solicitar la limitación del procesamiento de tus datos.</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl">
                  5. Seguridad de datos
                </h2>
                <p className="text-base !leading-relaxed text-body-color dark:text-body-color-dark">
                  Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger tu información personal contra pérdida, uso indebido y acceso no autorizado.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl">
                  6. Cambios a esta política
                </h2>
                <p className="text-base !leading-relaxed text-body-color dark:text-body-color-dark">
                  Podemos actualizar esta política de privacidad periódicamente. Te notificaremos sobre cambios significativos mediante un aviso en nuestro sitio web o por correo electrónico.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl">
                  7. Contacto
                </h2>
                <p className="text-base !leading-relaxed text-body-color dark:text-body-color-dark">
                  Si tienes preguntas o inquietudes sobre nuestra política de privacidad o prácticas de datos, contáctanos en:
                </p>
                <div className="mt-4 rounded-sm bg-[#f8f8f8] p-4 dark:bg-[#2C303B]">
                  <p className="text-base font-medium text-body-color dark:text-body-color-dark">
                    Email: <a href="mailto:privacy@hablasenias.com" className="text-primary hover:underline">privacy@hablasenias.com</a>
                  </p>
                  <p className="text-base font-medium text-body-color dark:text-body-color-dark">
                    Dirección: Octavio Chacón Moscoso 1-98 y Primera Transversal (Parque industrial)
                  </p>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-base font-medium text-body-color dark:text-body-color-dark">
                  Última actualización: 24 de febrero de 2025
                </p>
                <div className="mt-6">
                  <Link to="/" className="text-primary hover:underline">
                    Volver a la página principal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute left-0 top-0 z-[-1]">
          <svg
            width="1440"
            height="969"
            viewBox="0 0 1440 969"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_privacy"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1440"
              height="969"
            >
              <rect width="1440" height="969" fill="#090E34" />
            </mask>
            <g mask="url(#mask0_privacy)">
              <path
                opacity="0.1"
                d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                fill="url(#paint0_linear_privacy)"
              />
              <path
                opacity="0.1"
                d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                fill="url(#paint1_linear_privacy)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_privacy"
                x1="1178.4"
                y1="151.853"
                x2="780.959"
                y2="453.581"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_privacy"
                x1="160.5"
                y1="220"
                x2="1099.45"
                y2="1192.04"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;