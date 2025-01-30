import React, { useState } from "react";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import SectionTitle from "../Common/SectionTitle";

const Video = () => {
    const [isPlaying, setIsPlaying] = useState(true); // Inicializamos como true para autoplay

    return (
      <section className="relative z-10 py-16 md:py-20 lg:py-28">
          <div className="container">
              <SectionTitle
                title="Video tutorial"
                paragraph="Cómo usar nuestra aplicación."
                center
                mb="80px"
              />
              <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-4">
                      <div
                        className="mx-auto max-w-[770px] overflow-hidden rounded-md"
                        data-wow-delay=".15s"
                      >
                          <div className="relative aspect-[16/9] items-center justify-center">
                              <ReactPlayer
                                url="/images/video/demoSignSpeak AI.mp4"
                                playing={isPlaying}
                                controls={false} // mostrar barra de carga del video, controles
                                width="100%"
                                height="100%"
                                className="absolute top-0 left-0"
                                onPause={() => setIsPlaying(false)}
                                onPlay={() => setIsPlaying(true)}
                                muted={true} // Necesario para autoplay en la mayoría de navegadores
                                loop={true} // Agregamos la reproducción en loop
                                onEnded={() => setIsPlaying(true)} // Al terminar, vuelve a reproducir
                              />
                              <div className="absolute right-0 top-0 flex h-full w-full items-center justify-center">
                                  {!isPlaying && (
                                    <Link
                                      //to="#"
                                      onClick={() => setIsPlaying(true)}
                                      className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white bg-opacity-75 text-primary transition hover:bg-opacity-100"
                                    >
                                        <svg
                                          width="16"
                                          height="18"
                                          viewBox="0 0 16 18"
                                          className="fill-current"
                                        >
                                            <path d="M15.5 8.13397C16.1667 8.51888 16.1667 9.48112 15.5 9.86602L2 17.6603C1.33333 18.0452 0.499999 17.564 0.499999 16.7942L0.5 1.20577C0.5 0.43597 1.33333 -0.0451549 2 0.339745L15.5 8.13397Z" />
                                        </svg>
                                    </Link>
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 z-[-1] h-full w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/images/video/shape.svg")' }}
          ></div>
      </section>
    );
};

export default Video;