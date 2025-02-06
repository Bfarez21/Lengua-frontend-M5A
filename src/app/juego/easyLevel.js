import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import Swal from "sweetalert2"; // Importamos SweetAlert2

const EasyLevel = () => {
  const [currentSign, setCurrentSign] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [signs, setSigns] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0); // Contador de respuestas correctas
  const navigate = useNavigate();

  useEffect(() => {
    fetchSigns();
  }, []);

  useEffect(() => {
    if (signs.length > 0) setRandomSign();
  }, [signs]);

  const fetchSigns = async () => {
    try {
      const response = await fetch(`${API_URL}/gifs/letras`);
      const data = await response.json();
      const mappedSigns = data.map((item) => ({ sign: item.nombre, image: item.archivo }));
      setSigns(mappedSigns);
    } catch (error) {
      console.error("Error al obtener las señales:", error);
    }
  };

  useEffect(() => {
    if (signs.length > 0) {
      setRandomSign();
      Swal.fire({
        title: "¡Bienvenido!",
        text: "¡Tienes 2 intentos! Si fallas 2 veces, el juego finalizará.",
        icon: "info",
        confirmButtonText: "¡Entendido!"
      });
    }
  }, [signs]); // Este efecto se ejecuta solo cuando 'signs' cambia

  const setRandomSign = () => {
    if (signs.length === 0) return;
    const randomSign = signs[Math.floor(Math.random() * signs.length)];
    setCurrentSign(randomSign);
    setFeedback("");
    setAttempts(0);
  };

  const handleButtonClick = (option) => {
    if (gameOver) return;

    if (currentSign && option === currentSign.sign) {
      setFeedback("✅ Correcto!");
      setScore((prevScore) => prevScore + 1);
      setCorrectAnswers(prev => prev + 1); // Incrementar respuestas correctas
      if (correctAnswers + 1 >= Math.floor(signs.length / 2)) { // Si alcanzó el límite de respuestas correctas
        setGameOver(true);
        Swal.fire({
          title: "Juego Terminado",
          text: `¡Has acertado ${Math.floor(signs.length / 2)} respuestas! El juego ha terminado.`,
          icon: "success",
          confirmButtonText: "Reiniciar Juego",
          showCancelButton: true,
          cancelButtonText: "Volver a Niveles",
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            restartGame(); // Reinicia el juego después de cerrar la alerta
          } else if (result.isDismissed) {
            // Si el usuario hace clic en "Volver a Niveles", redirige a la página de niveles
            navigate("/jugar");
          }
        });
        return;
      }
      setTimeout(setRandomSign, 1000);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 2) {
        setFeedback("Juego Terminado ❌");
        setGameOver(true);

        Swal.fire({
          title: "Juego Terminado",
          text: "¡Has fallado dos veces! El juego ha terminado.",
          icon: "error",
          confirmButtonText: "Reiniciar Juego",
          showCancelButton: true,
          cancelButtonText: "Volver a Niveles",
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            restartGame(); // Reinicia el juego después de cerrar la alerta
          } else if (result.isDismissed) {
            // Si el usuario hace clic en "Volver a Niveles", redirige a la página de niveles
            navigate("/jugar");
          }
        });
      } else {
        setFeedback("Incorrecto ❌");
      }
    }
  };

  const restartGame = () => {
    setScore(0);
    setCorrectAnswers(0); // Resetear respuestas correctas
    setGameOver(false);
    setRandomSign();
  };

  return (
    <section
      className="relative z-10 bg-gradient-to-r from-indigo-500 to-blue-1000 overflow-hidden pt-[120px] pb-[80px] dark:bg-gray-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center text-white">
          <h1 className="mb-6 text-4xl font-extrabold sm:text-5xl md:text-6xl">
            Adivina la Seña - Alfabeto
          </h1>
          <p className="mb-10 text-lg leading-relaxed sm:text-xl md:text-2xl max-w-3xl mx-auto">
            A continuación tienes una seña en pantalla, selecciona la respuesta
            correspondiente de las siguientes opciones:
          </p>
        </div>

        {!gameOver && currentSign && (
          <div className="flex justify-center mb-6">
            <img
              src={currentSign.image}
              alt={`Seña de ${currentSign.sign}`}
              className="w-72 h-72 rounded-lg shadow-lg border-4 border-white animate-fade-in"
            />
          </div>
        )}

        {!gameOver ? (
          <div className="grid grid-cols-2 gap-4">
            {signs.slice(0, Math.min(4, signs.length)).map((option) => (
              <button
                key={option.sign}
                onClick={() => handleButtonClick(option.sign)}
                className="px-6 py-3 bg-white text-indigo-700 font-bold rounded-lg shadow-md hover:bg-indigo-100 transition duration-300"
              >
                {option.sign}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center mt-6">
            <p className="text-xl font-semibold mb-4">Juego terminado</p>
            <button
              onClick={restartGame}
              className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition"
            >
              Reiniciar Juego
            </button>
          </div>
        )}

        {feedback && <p className="mt-4 text-lg font-semibold animate-fade-in">{feedback}</p>}
        <p className="mt-4 text-lg">Puntuación: {score}</p>

        <div className="mt-6 flex justify-center space-x-4">
          <Link
            to="/jugar" className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600">Volver a
            Niveles
          </Link>
          <button
            onClick={restartGame}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600">Reiniciar
          </button>
        </div>
      </div>
    </section>
  );
};

export default EasyLevel;
