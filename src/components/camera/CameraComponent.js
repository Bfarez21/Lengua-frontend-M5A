import { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";

const CameraComponent = () => {
  const webcamRef = useRef(null);
  const [text, setText] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const lastPredictionTimeRef = useRef(Date.now());
  const tensorRef = useRef(null);
  const [activeModel, setActiveModel] = useState("alfabeto");
  const modelRef = useRef(null);
  const [labelEncoder, setLabelEncoder] = useState(null);

  const PREDICTION_INTERVAL = 500;
  const CONFIDENCE_THRESHOLD = 0.9;

  const MODELS = {
    numeros: {
      url: "https://teachablemachine.withgoogle.com/models/sSSU_GtaD/",
      name: "Números 0-10"
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

  const speakText = useCallback((text) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    window.speechSynthesis.speak(utterance);
  }, []);

  const cleanupResources = useCallback(() => {
    if (tensorRef.current) {
      tensorRef.current.dispose();
      tensorRef.current = null;
    }
    if (modelRef.current) {
      modelRef.current.dispose();
      modelRef.current = null;
    }
  }, []);

  const loadModel = useCallback(async (modelType) => {
    if (isModelLoading) return;

    setIsModelLoading(true);
    setText("");
    setConfidence(0);

    try {
      // Limpiar el modelo anterior si existe
      if (modelRef.current) {
        modelRef.current.dispose();
        modelRef.current = null;
      }

      const modelUrl = MODELS[modelType].url + "model.json";
      const metadataUrl = MODELS[modelType].url + "metadata.json";

      console.log(`Cargando modelo ${MODELS[modelType].name}...`);

      // Cargar modelo y metadata en paralelo
      const [loadedModel, metadataResponse] = await Promise.all([
        tf.loadLayersModel(modelUrl),
        fetch(metadataUrl)
      ]);

      const metadata = await metadataResponse.json();

      modelRef.current = loadedModel;
      setLabelEncoder(metadata.labels);

      console.log("Modelo cargado correctamente:", modelType);
    } catch (error) {
      console.error("Error al cargar el modelo:", error);
      cleanupResources();
    } finally {
      setIsModelLoading(false);
    }
  }, [cleanupResources]);

  const changeModel = useCallback(async (newModelType) => {
    if (isModelLoading || newModelType === activeModel) return;

    setActiveModel(newModelType);
    await loadModel(newModelType);
  }, [isModelLoading, activeModel, loadModel]);

  const preprocessImage = useCallback((image) => {
    return tf.tidy(() => {
      const frame = tf.browser.fromPixels(image);
      const resized = tf.image.resizeBilinear(frame, [224, 224]);
      const normalized = resized.toFloat().div(tf.scalar(127.5)).sub(tf.scalar(1));
      return normalized.expandDims(0);
    });
  }, []);

  const detectSignLanguage = useCallback(async () => {
    if (!modelRef.current || !labelEncoder || !webcamRef.current || isProcessing) return;

    const now = Date.now();
    if (now - lastPredictionTimeRef.current < PREDICTION_INTERVAL) return;

    setIsProcessing(true);
    lastPredictionTimeRef.current = now;

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      const img = new Image();
      img.src = imageSrc;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Recortar la región de interés (ROI)
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 224; // Tamaño esperado por el modelo
      canvas.height = 224;
      ctx.drawImage(img, 0, 0, 224, 224);

      // Preprocesar la imagen
      const tensor = preprocessImage(canvas);
      const predictions = await modelRef.current.predict(tensor);
      const predictionsArray = await predictions.data();

      tensor.dispose();
      predictions.dispose();

      // Filtrar predicciones con baja confianza
      const maxProb = Math.max(...predictionsArray);
      if (maxProb > CONFIDENCE_THRESHOLD) {
        const maxIndex = predictionsArray.indexOf(maxProb);
        const predictedClass = labelEncoder[maxIndex];
        if (predictedClass !== text) {
          setText(predictedClass);
          setConfidence(maxProb * 100);
          speakText(predictedClass);
        }
      }
    } catch (error) {
      console.error("Error en la detección:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [labelEncoder, text, preprocessImage, speakText, isProcessing]);

  // Efecto para cargar el modelo inicial
  useEffect(() => {
    loadModel(activeModel);

    // Limpieza al desmontar el componente
    return () => {
      cleanupResources();
    };
  }, [activeModel, loadModel, cleanupResources]);

  // Efecto para la detección continua
  useEffect(() => {
    let intervalId;

    if (modelRef.current && labelEncoder && !isModelLoading) {
      intervalId = setInterval(detectSignLanguage, PREDICTION_INTERVAL);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [detectSignLanguage, isModelLoading, labelEncoder]);

  return (
    <div className="flex flex-col items-center gap-6 p-4 bg-gray-100 w-full h-full overflow-y-auto">
      <div className="flex gap-4 w-full max-w-2xl mx-auto">
        <button
          onClick={() => changeModel('alfabeto')}
          disabled={isModelLoading}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
            activeModel === 'alfabeto'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-blue-50'
          } ${isModelLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Alfabeto A-Z
        </button>
        <button
          onClick={() => changeModel('numeros')}
          disabled={isModelLoading}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
            activeModel === 'numeros'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-blue-50'
          } ${isModelLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Números 0-10
        </button>
      </div>

      {/* Contenedor principal para cámara y predicciones */}
      <div className="flex flex-row gap-6 w-full max-w-5xl mx-auto">
        {/* Sección de predicciones (izquierda, menos espacio) */}
        <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold text-gray-800">
              {text || `Esperando señas de ${MODELS[activeModel].name}...`}
            </div>

            {text && (
              <div className="flex items-center justify-center gap-4">
                <div className="text-xl text-gray-600">
                  Confianza: {confidence.toFixed(1)}%
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sección de la cámara (derecha, más espacio) */}
        <div className="flex-2 relative">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded-lg shadow-lg w-full"
            style={{
              minHeight: "480px", // Aumentar el alto de la cámara
              objectFit: "cover",
              backgroundColor: "black"
            }}
            audio={false}
            mirrored={true}
          />
        </div>
      </div>

      {isModelLoading && (
        <div className="text-2xl font-bold text-center p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto">
          Cargando modelo {MODELS[activeModel].name}...
        </div>
      )}
    </div>
  );
};

export default CameraComponent;