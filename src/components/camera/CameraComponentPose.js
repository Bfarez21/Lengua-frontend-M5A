import React, { useCallback, useEffect, useRef, useState } from "react";
import * as tmPose from "@teachablemachine/pose";

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

const CameraComponentPoses = () => {
  const [webcam, setWebcam] = useState(null);
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState("palabras");
  const [text, setText] = useState("");
  const [confidence, setConfidence] = useState(0);
  const intervalRef = useRef(null);
  const lastPredictionTimeRef = useRef(Date.now());
  const lastSpokenTextRef = useRef("");

  const PREDICTION_INTERVAL = 500;
  const CONFIDENCE_THRESHOLD = 0.9;

  const speakText = useCallback((text) => {
    if (!text || text === lastSpokenTextRef.current) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    window.speechSynthesis.speak(utterance);
    lastSpokenTextRef.current = text;
  }, []);

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
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [selectedModel]);

  const loadModel = async (modelType) => {
    setIsLoading(true);
    setText("");
    setConfidence(0);
    lastSpokenTextRef.current = "";

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
          setText(newText);
          setConfidence(topPrediction.probability * 100);
          speakText(newText);
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
            Detección de Poses
          </h2>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
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
                  <div className="text-3xl font-bold text-gray-800 dark:text-white">
                    {text || `Esperando señas de ${MODELS[selectedModel].name}...`}
                  </div>

                  {text && (
                    <div className="flex flex-col gap-2">
                      <div className="text-xl text-gray-600 dark:text-gray-300">
                        Confianza: {confidence.toFixed(1)}%
                      </div>
                      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${confidence}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Todas las Predicciones
                </h3>
                <div className="space-y-2">
                  {predictions.map((prediction, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700"
                    >
                      <span className="text-gray-900 dark:text-white font-medium">
                        {prediction.className}
                      </span>
                      <span className="text-blue-600 dark:text-blue-400">
                        {(prediction.probability * 100).toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-2/3 lg:sticky lg:top-24">
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <div className="relative w-full max-w-[600px] mx-auto">
                  <canvas
                    id="webcam-canvas"
                    className="rounded-lg w-full h-full"
                    width={600}
                    height={600}
                    ref={el => {
                      if (el && webcam) {
                        webcam.canvas = el;
                      }
                    }}
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
