import React, { useCallback, useEffect, useRef, useState } from "react";
import * as tmPose from "@teachablemachine/pose";
import Webcam from "react-webcam";

const MODELS = {
  palabras: {
    url: "https://teachablemachine.withgoogle.com/models/HBrqjTXzN/",
    name: "Palabras Básica"
  },
  alfabeto: {
    url: "https://teachablemachine.withgoogle.com/models/ccoYXWgaQ/",
    name: "Alfabeto A-Z"
  }
};
const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
  frameRate: 24,
  advanced: [
    {
      focusMode: "continuous"
    },
    {
      whiteBalanceMode: "continuous"
    },
    {
      exposureMode: "continuous"
    }
  ]
};
// Lista de palabras para adivinar (puedes modificar esta lista según las palabras que hayas entrenado)
const PALABRAS_JUEGO = [
  "No-Action","Adios","Bien","Cómo te sientes","Dormir","Gracias","Hola","Mamá","Papá"
];

const CameraComponentPoses = () => {
  const [webcam, setWebcam] = useState(null);
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState("palabras");
  const [currentDetection, setCurrentDetection] = useState("");
  const [confidence, setConfidence] = useState(0);
  const intervalRef = useRef(null);
  const lastPredictionTimeRef = useRef(Date.now());

  // Estados del juego
  const [gameActive, setGameActive] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameHistory, setGameHistory] = useState([]);
  const timerRef = useRef(null);

  const PREDICTION_INTERVAL = 1000;
  const CONFIDENCE_THRESHOLD = 0.85;


  // Iniciar el juego
  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
    setGameHistory([]);
    selectRandomWord();

    // Iniciar el temporizador
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Seleccionar una palabra aleatoria
  const selectRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * PALABRAS_JUEGO.length);
    setCurrentWord(PALABRAS_JUEGO[randomIndex]);
  };

  // Verificar si la detección coincide con la palabra actual
  useEffect(() => {
    if (gameActive && currentDetection.toLowerCase() === currentWord.toLowerCase() && confidence > CONFIDENCE_THRESHOLD * 100) {
      // Acierto

      setScore(prev => prev + Math.floor(confidence));
      setGameHistory(prev => [...prev, { word: currentWord, success: true }]);
      selectRandomWord();
    }
  }, [currentDetection, gameActive, currentWord, confidence]);

  const loadModel = async (modelType) => {
    setIsLoading(true);
    setCurrentDetection("");
    setConfidence(0);

    const modelUrl = MODELS[modelType].url + "model.json";
    const metadataUrl = MODELS[modelType].url + "metadata.json";

    console.log(`Cargando modelo ${MODELS[modelType].name}...`);

    try {
      const loadedModel = await tmPose.load(modelUrl, metadataUrl);
      console.log("Modelo cargado correctamente:", loadedModel);
      setModel(loadedModel);

      const webcamInstance = new tmPose.Webcam(600, 600, true);
      await webcamInstance.setup();
      await webcamInstance.play();
      setWebcam(webcamInstance);
      setIsLoading(false);
    } catch (error) {
      console.error("Error en la inicialización:", error);
      setIsLoading(false);
    }
  };

  const detectPose = async () => {
    if (!model || !webcam || !webcam.canvas) return;

    const now = Date.now();
    if (now - lastPredictionTimeRef.current < PREDICTION_INTERVAL) return;
    lastPredictionTimeRef.current = now;

    try {
      webcam.update();
      const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
      if (pose) {
        const predictions = await model.predict(posenetOutput);
        setPredictions(predictions);

        const topPrediction = predictions.reduce((prev, current) =>
          prev.probability > current.probability ? prev : current
        );

        if (topPrediction.probability > CONFIDENCE_THRESHOLD) {
          const newText = topPrediction.className;
          setCurrentDetection(newText);
          setConfidence(topPrediction.probability * 100);
        }
      }
    } catch (error) {
      console.error('Error en la detección:', error);
    }
  };

  const startDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(detectPose, PREDICTION_INTERVAL);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && webcam) {
        webcam.stop();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      } else if (!document.hidden && webcam) {
        webcam.play();
        startDetection();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    loadModel(selectedModel);

    return () => {
      if (webcam) {
        webcam.stop();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [selectedModel]);

  useEffect(() => {
    if (!model || !webcam || isLoading) return;
    startDetection();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [model, webcam, isLoading]);

  return (
    <section className="relative z-10 bg-gray-100 dark:bg-gray-900 overflow-hidden pt-[120px] pb-[80px]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">

          </h2>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
            disabled={gameActive}
          >
            {Object.entries(MODELS).map(([key, model]) => (
              <option key={key} value={key}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-lg text-gray-900 dark:text-white">
              Cargando cámara y modelo...
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 min-h-[600px]">
            <div className="w-full lg:w-1/3 space-y-4">
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <div className="text-center space-y-4">
                  {!gameActive ? (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        ¡Juego de Lengua de Señas!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Realiza las señas que se te indican para ganar puntos. ¡Tienes 30 segundos!
                      </p>
                      <button
                        onClick={startGame}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                      >
                        ¡Comenzar Juego!
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                          Puntos: {score}
                        </div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                          Tiempo: {timeLeft}s
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg text-gray-600 dark:text-gray-300">
                          Haz la seña para:
                        </h3>
                        <div className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {currentWord}
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Detección actual:
                        </h4>
                        <div className="text-2xl text-gray-800 dark:text-white">
                          {currentDetection || "Ninguna seña detectada"}
                        </div>

                        {currentDetection && (
                          <div className="mt-2">
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              Confianza: {confidence.toFixed(1)}%
                            </div>
                            <div className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-full mt-1">
                              <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                                style={{ width: `${confidence}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {gameActive && (
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    Historial de Señas
                  </h3>
                  <div className="max-h-[200px] overflow-y-auto space-y-2">
                    {gameHistory.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400">Aún no has completado ninguna seña.</p>
                    ) : (
                      gameHistory.map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex justify-between items-center p-2 rounded-lg ${
                            item.success
                              ? "bg-green-50 dark:bg-green-900/20"
                              : "bg-red-50 dark:bg-red-900/20"
                          }`}
                        >
                          <span className="text-gray-900 dark:text-white font-medium">
                            {item.word}
                          </span>
                          <span
                            className={`${
                              item.success
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {item.success ? "✓" : "✗"}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {!gameActive && score > 0 && (
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    ¡Juego Terminado!
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {score} puntos
                    </div>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      ¡Has completado {gameHistory.filter(item => item.success).length} señas correctamente!
                    </p>
                    <button
                      onClick={startGame}
                      className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Jugar de Nuevo
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full lg:w-2/3 lg:sticky lg:top-24">
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <div className="relative w-full max-w-[600px] mx-auto">
                  <Webcam
                    id="webcam-canvas"
                    className="rounded-lg w-full h-full"
                    width={600}
                    height={600}
                    videoConstraints={videoConstraints}
                    mirrored={true}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CameraComponentPoses;
