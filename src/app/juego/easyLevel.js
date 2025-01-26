import React, { useState, useEffect, useRef } from "react";

const EasyLevel = () => {
  const [currentSign, setCurrentSign] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const signs = [
    { sign: "A", image: "/images/gameEasyLevel/A_test.jpg" },
    { sign: "B", image: "/images/gameEasyLevel/B_test.jpg" },
    { sign: "1", image: "/images/gameEasyLevel/uno.jpg" },
    { sign: "2", image: "/images/gameEasyLevel/dos.jpg" },
  ];

  const buttonsRef = useRef([]);

  const setRandomSign = () => {
    const randomSign = signs[Math.floor(Math.random() * signs.length)];
    setCurrentSign(randomSign);
    setFeedback("");
    setAttempts(0);
  };

  const handleButtonClick = (option) => {
    if (gameOver) return;

    if (currentSign && option === currentSign.sign) {
      setFeedback("¡Correcto! 🎉");
      setScore((prevScore) => prevScore + 1);
      setRandomSign(); // Cambiar automáticamente a otra imagen
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
    setRandomSign();
  };

  useEffect(() => {
    buttonsRef.current.forEach((button, index) => {
      if (button) {
        button.addEventListener("click", () =>
          handleButtonClick(signs[index].sign)
        );
      }
    });

    return () => {
      buttonsRef.current.forEach((button, index) => {
        if (button) {
          button.removeEventListener("click", () =>
            handleButtonClick(signs[index].sign)
          );
        }
      });
    };
  }, [currentSign, attempts, gameOver]);

  useEffect(() => {
    setRandomSign();
  }, []);

  return (
    <section className="relative z-10 bg-gradient-to-r from-indigo-500 to-blue-1000 overflow-hidden pt-[120px] pb-[80px] dark:bg-gray-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h1 className="mb-6 text-4xl font-extrabold sm:text-5xl md:text-6xl">
            Adivina la Seña
          </h1>
          <p className="mb-10 text-lg leading-relaxed sm:text-xl md:text-2xl max-w-3xl mx-auto">
            A continuación tienes una seña en pantalla, selecciona la letra o
            número correspondiente de las siguientes opciones:
          </p>
        </div>

        {!gameOver && currentSign && (
          <div className="text-center">
            <img
              src={currentSign.image}
              alt={`Seña de ${currentSign.sign}`}
              className="mx-auto mb-6 max-w-[200px]"
            />
          </div>
        )}

        {!gameOver ? (
          <div className="grid grid-cols-2 gap-4 justify-center">
            {signs.map((option, index) => (
              <button
                ref={(el) => (buttonsRef.current[index] = el)}
                key={option.sign}
                className="py-2 px-4 bg-white text-indigo-700 font-bold rounded-lg shadow hover:bg-indigo-100 transition"
              >
                {option.sign}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={(e)=>restartGame}
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

export default EasyLevel;