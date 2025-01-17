import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageCarousel = () => {
  const images = [
    "/images/ImgApli01.png",
    "/images/ImgApli02.png",
    "/images/ImgApli03.png",
    "/images/ImgApli04.png"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Función para precargar imágenes
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const goToPrevious = () => {
    setIsLoading(true);
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    console.log('Anterior:', { currentIndex, newIndex })
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    setIsLoading(true);
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    console.log('Siguiente:', { currentIndex, newIndex });
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setIsLoading(true);
    console.log('Ir a slide:', { currentIndex, newIndex: slideIndex });
    setCurrentIndex(slideIndex);
  };

  // Manejador para cuando la imagen termina de cargar
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative w-full max-w-[800px] h-[400px] mx-auto mb-12">
      {/* Botón Anterior */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10"
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </button>

      {/* Imagen Actual */}
      <div className="w-full h-full rounded-2xl overflow-hidden">
        <img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-contain transition-opacity duration-500"
          onLoad={handleImageLoad}
        />
      </div>

      {/* Botón Siguiente */}
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10"
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? 'bg-white scale-110'
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;