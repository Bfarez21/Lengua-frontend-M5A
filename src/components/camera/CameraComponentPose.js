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

  useEffect(() => {
    fetch(`${API_URL}/modelo/`)// Cambio aquí para obtener todos los modelos, no solo el activo
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const activeModel = data[0]; // Seleccionamos el primer modelo (ajusta según tus necesidades)
          const fullModelURL = `${API_URL_MODELS}${activeModel.model_url}`; // Concatenar la URL completa
          const fullMetadataURL = `${API_URL_MODELS}${activeModel.metadata_url}`; // Concatenar la URL completa

          setModelURL(fullModelURL);
          setMetadataURL(fullMetadataURL);
          loadModel(fullModelURL, fullMetadataURL);  // Cargar el modelo con los datos obtenidos
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
    };
  }, []);

  const loadModel = async (modelURL, metadataURL) => {
    if (!modelURL || !metadataURL) return;
    try {
      const loadedModel = await tmPose.load(modelURL, metadataURL);
      setModel(loadedModel);

      const webcamInstance = new tmPose.Webcam(400, 400, true);
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

  useEffect(() => {
    if (!model || !webcam || isLoading) return;
    const intervalId = setInterval(detectPose, 100);
    return () => clearInterval(intervalId);
  }, [model, webcam, isLoading]);

  const topPrediction = predictions.reduce((prev, current) => {
    return prev.probability > current.probability ? prev : current;
  }, {});

  const speakPrediction = () => {
    if (topPrediction.probability >= 0.9) {
      const utterance = new SpeechSynthesisUtterance(topPrediction.className);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <section
      id="posePage"
      className="relative z-10 bg-gradient-to-r from-indigo-500 to-blue-1000 overflow-hidden pt-[120px] pb-[80px] dark:bg-gray-900"
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Detección de Poses</h2>

        {isLoading ? (
          <div className="text-lg text-center">Cargando cámara y modelo...</div>
        ) : (
          <div className="flex flex-row items-start gap-8">
            <div className="text-4xl font-bold mb-4 text-center text-black-600">
              {topPrediction.className ? (
                <>
                  {`${topPrediction.className}: ${(topPrediction.probability * 100).toFixed(2)}%`}
                  {topPrediction.probability >= 0.9 && (
                    <button onClick={speakPrediction} className="ml-4 text-blue-500">
                      <FaVolumeUp size={32} />
                    </button>
                  )}
                </>
              ) : (
                "Esperando predicción..."
              )}
            </div>

            <div className="w-64 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2 text-black">Predicciones:</h3>
              {predictions.map((prediction, idx) => (
                <div key={idx} className="mb-2">
                  <div className="text-black font-medium">{prediction.className}</div>
                  <div className="text-black">{(prediction.probability * 100).toFixed(2)}%</div>
                </div>
              ))}
            </div>

            <div className="relative w-[400px] h-[400px]">
              <canvas
                id="webcam-canvas"
                className="rounded-lg border border-gray-300"
                width={400}
                height={400}
                ref={el => {
                  if (el && webcam) {
                    webcam.canvas = el;
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CameraComponentPoses;
