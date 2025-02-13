import React, { useEffect, useRef, useState } from "react";
import * as tmPose from "@teachablemachine/pose";
import { API_URL, API_URL_MODELS } from "../../config";
import { FaVolumeUp } from "react-icons/fa";

const CameraComponentPoses = () => {
  const [webcam, setWebcam] = useState(null);
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modelURL, setModelURL] = useState(null);
  const [metadataURL, setMetadataURL] = useState(null);
  const intervalRef = useRef(null);

  const speakPrediction = (predictionText) => {
    if (predictionText) {
      const utterance = new SpeechSynthesisUtterance(predictionText);
      speechSynthesis.speak(utterance);
    }
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

    fetch(`${API_URL}/modelo/`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const activeModel = data[1]; //indice del modelo a usar de la base
          const fullModelURL = `${API_URL_MODELS}${activeModel.model_url}`;
          const fullMetadataURL = `${API_URL_MODELS}${activeModel.metadata_url}`;

          setModelURL(fullModelURL);
          setMetadataURL(fullMetadataURL);
          loadModel(fullModelURL, fullMetadataURL);
        } else {
          console.error("No se encontraron modelos en la API.");
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error("Error al obtener el modelo:", error);
        setIsLoading(false);
      });

    return () => {
      if (webcam) {
        webcam.stop();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const loadModel = async (modelURL, metadataURL) => {
    console.log("Cargando modelo desde:", modelURL);
    console.log("Cargando metadata desde:", metadataURL);

    if (!modelURL || !metadataURL) return;
    try {
      const loadedModel = await tmPose.load(modelURL, metadataURL);
      console.log("Modelo cargado correctamente:", loadedModel);
      console.log("Resumen del modelo:", loadedModel.model.summary());
      setModel(loadedModel);

      const webcamInstance = new tmPose.Webcam(600, 600, true); // Aumentado el tamaño de la cámara
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
    try {
      webcam.update();
      const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
      if (pose) {
        const predictions = await model.predict(posenetOutput);
        setPredictions(predictions);
      }
    } catch (error) {
      console.error('Error en la detección:', error);
    }
  };

  const startDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(detectPose, 100);
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

  const topPrediction = predictions.reduce((prev, current) => {
    return prev.probability > current.probability ? prev : current;
  }, {});

  const VoiceButton = () => (
    <button
      onClick={() => speakPrediction(topPrediction.className)}
      className="fixed bottom-4 right-4 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors z-50"
      aria-label="Reproducir predicción"
    >
      <FaVolumeUp size={24} />
    </button>
  );

  return (
    <section className="relative z-10 bg-gray-100 dark:bg-gray-900 overflow-hidden pt-[120px] pb-[80px]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          Detección de Poses
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-lg text-gray-900 dark:text-white">
              Cargando cámara y modelo...
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 min-h-[600px]">

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


            <div className="w-full lg:w-1/3 space-y-4">
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Predicción Principal
                </h3>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {topPrediction.className ? (
                    <div className="flex items-center gap-2">
                      <span>{topPrediction.className}</span>
                      <span className="text-xl text-blue-600 dark:text-blue-400">
                        {(topPrediction.probability * 100).toFixed(2)}%
                      </span>
                    </div>
                  ) : (
                    "Esperando predicción..."
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
          </div>
        )}
      </div>

      {topPrediction.probability >= 0.9 && <VoiceButton />}
    </section>
  );
};

export default CameraComponentPoses;