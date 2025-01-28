import React, { useState, useEffect, useRef } from "react";

const IntermediateLevel = () => {
  const [currentGreeting, setCurrentGreeting] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [greetings, setGreetings] = useState([]);

  const buttonsRef = useRef([]);

  // Obtener los saludos desde la API
  const fetchGreetings = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/gifs/saludos");
      const data = await response.json();
      const mappedGreetings = data.map(item => ({
        greeting: item.nombre,
        image: item.archivo
      }));
      setGreetings(mappedGreetings);
    } catch (error) {
      console.error("Error al obtener los saludos:", error);
    }
  };

  const setRandomGreeting = () => {
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setCurrentGreeting(randomGreeting);
    setFeedback("");
    setAttempts(0);
  };

  const handleButtonClick = (option) => {
    if (gameOver) return;

    if (currentGreeting && option === currentGreeting.greeting) {
      setFeedback("¡Correcto! 🎉");
      setScore((prevScore) => prevScore + 1);
      setRandomGreeting(); // Cambiar automáticamente a otro saludo
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 2) {
        setFeedback("Juego Terminado ❌");
        setGameOver(true);
      } else {
        setFeedback("Incorrecto ❌");
      }
    }
  };

  const restartGame = () => {
    setScore(0);
    setGameOver(false);
    setRandomGreeting();
  };

  useEffect(() => {
    fetchGreetings();
  }, []);

  useEffect(() => {
    setRandomGreeting();
  }, [greetings]);

  useEffect(() => {
    buttonsRef.current.forEach((button, index) => {
      if (button) {
        button.addEventListener("click", () =>
          handleButtonClick(greetings[index].greeting)
        );
      }
    });

    return () => {
      buttonsRef.current.forEach((button, index) => {
        if (button) {
          button.removeEventListener("click", () =>
            handleButtonClick(greetings[index].greeting)
          );
        }
      });
    };
  }, [currentGreeting, attempts, gameOver]);

  return (
    <section className="relative z-10 bg-gradient-to-r from-indigo-500 to-blue-1000 overflow-hidden pt-[120px] pb-[80px] dark:bg-gray-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center text-white">
          <h1 className="mb-6 text-4xl font-extrabold sm:text-5xl md:text-6xl">
            Juego Nivel Medio - SALUDOS
          </h1>
          <p className="mb-10 text-lg leading-relaxed sm:text-xl md:text-2xl max-w-3xl mx-auto">
            A continuación tienes un saludo en pantalla, selecciona la opción correcta:
          </p>
        </div>

        {/* Desarrollo del juego */}
        {!gameOver && currentGreeting && (
          <div className="text-center">
            <img
              src={currentGreeting.image}
              alt={`Saludo de ${currentGreeting.greeting}`}
              className="mx-auto mb-6 max-w-[200px]"
            />
          </div>
        )}

        {!gameOver ? (
          <div className="grid grid-cols-2 gap-4 justify-center">
            {greetings.map((option, index) => (
              <button
                ref={(el) => (buttonsRef.current[index] = el)}
                key={option.greeting}
                className="py-2 px-4 bg-white text-indigo-700 font-bold rounded-lg shadow hover:bg-indigo-100 transition"
              >
                {option.greeting}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={restartGame}
              className="py-2 px-6 bg-indigo-700 text-white font-bold rounded-lg shadow hover:bg-indigo-800 transition"
            >
              Reiniciar Juego
            </button>
          </div>
        )}

        {feedback && (
          <div className="text-center mt-6 text-white text-lg font-semibold">
            {feedback}
          </div>
        )}

        <div className="text-center mt-4 text-white">Puntuación: {score}</div>
      </div>
    </section>
  );
};

export default IntermediateLevel;
