import { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
// Importamos MediaPipe Hands
import * as mpHands from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

const CameraComponent = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null); // Nuevo canvas para dibujar landmarks
  const [text, setText] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const tensorRef = useRef(null);
  const [activeModel, setActiveModel] = useState("alfabeto");
  const modelRef = useRef(null);
  const [labelEncoder, setLabelEncoder] = useState(null);
  const lastPredictionsRef = useRef([]);
  const captureIntervalRef = useRef(null);

  // Referencias para MediaPipe
  const handsRef = useRef(null);
  const cameraRef = useRef(null);
  const canvasCtxRef = useRef(null);
  const [handLandmarks, setHandLandmarks] = useState(null);

  // Configuración
  const CAPTURE_INTERVAL = 250;
  const CONFIDENCE_THRESHOLD = 0.8;
  const PREDICTIONS_TO_KEEP = 1;

  const MODELS = {
    numeros: {
      url: "https://teachablemachine.withgoogle.com/models/sSSU_GtaD/",
      name: "Números 0-10"
    },
    alfabeto: {
      url: "https://teachablemachine.withgoogle.com/models/R5oP8mE1n/",  // modelo pruebas A,B,C,D
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
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
    if (handsRef.current) {
      handsRef.current.close();
    }
  }, []);

  // Inicializar MediaPipe Hands
  const initializeHandTracking = useCallback(() => {
    if (!webcamRef.current || !canvasRef.current) return;

    // Configurar el canvas para dibujar
    canvasCtxRef.current = canvasRef.current.getContext('2d');

    // Inicializar el modelo de manos de MediaPipe
    handsRef.current = new mpHands.Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    // Configurar el modelo de manos
    handsRef.current.setOptions({
      maxNumHands: 1, // Solo detectar una mano
      modelComplexity: 1, // 0-2, mayor es más preciso pero más lento
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    // Configurar el callback para recibir resultados
    handsRef.current.onResults(onHandResults);

    // Inicializar la cámara de MediaPipe
    if (webcamRef.current.video) {
      cameraRef.current = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          if (webcamRef.current && webcamRef.current.video) {
            await handsRef.current.send({ image: webcamRef.current.video });
          }
        },
        width: 640,
        height: 480
      });

      cameraRef.current.start();
    }
  }, []);

  // Callback para procesar los resultados de la detección de manos
  const onHandResults = useCallback((results) => {
    if (!canvasCtxRef.current || !canvasRef.current) return;

    const { width, height } = canvasRef.current;

    // Limpiar el canvas
    canvasCtxRef.current.clearRect(0, 0, width, height);

    // Si no hay manos detectadas, no hacemos nada más
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      setHandLandmarks(null);
      return;
    }

    // Dibujar la mano detectada
    canvasCtxRef.current.save();
    canvasCtxRef.current.clearRect(0, 0, width, height);

    // IMPORTANTE: Aplicar transformación espejo para hacer coincidir con la webcam espejada
    canvasCtxRef.current.scale(-1, 1);
    canvasCtxRef.current.translate(-width, 0);

    // Fondo negro semitransparente
    canvasCtxRef.current.fillStyle = 'rgba(0, 0, 0, 0.1)';
    canvasCtxRef.current.fillRect(0, 0, width, height);

    // Dibujar las conexiones entre landmarks
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtxRef.current, landmarks, mpHands.HAND_CONNECTIONS,
        { color: '#00FF00', lineWidth: 3 });
      drawLandmarks(canvasCtxRef.current, landmarks,
        { color: '#FF0000', lineWidth: 1, radius: 3 });
    }

    canvasCtxRef.current.restore();

    // Guardar los landmarks para usarlos en la predicción
    // También invertimos las coordenadas X para que coincidan con la imagen espejada
    const mirroredLandmarks = JSON.parse(JSON.stringify(results.multiHandLandmarks[0]));
    mirroredLandmarks.forEach(landmark => {
      landmark.x = 1 - landmark.x; // Invertir la coordenada X
    });
    setHandLandmarks(results.multiHandLandmarks[0]);
  }, []);

  const stopCapturing = useCallback(() => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }

    setIsCapturing(false);
    console.log("Captura de frames detenida");
  }, []);

  const loadModel = useCallback(async (modelType) => {
    if (captureIntervalRef.current) {
      stopCapturing();
    }

    setIsModelReady(false);
    setIsModelLoading(true);
    setText("");
    setConfidence(0);
    lastPredictionsRef.current = [];

    try {
      if (modelRef.current) {
        modelRef.current.dispose();
        modelRef.current = null;
      }

      const modelUrl = MODELS[modelType].url + "model.json";
      const metadataUrl = MODELS[modelType].url + "metadata.json";

      console.log(`Cargando modelo ${MODELS[modelType].name}...`);

      const [loadedModel, metadataResponse] = await Promise.all([
        tf.loadLayersModel(modelUrl),
        fetch(metadataUrl)
      ]);

      const metadata = await metadataResponse.json();

      modelRef.current = loadedModel;
      setLabelEncoder(metadata.labels);
      setIsModelReady(true);

      console.log("Modelo cargado correctamente:", modelType);
    } catch (error) {
      console.error("Error al cargar el modelo:", error);
      cleanupResources();
    } finally {
      setIsModelLoading(false);
    }
  }, [cleanupResources, stopCapturing]);

  const changeModel = useCallback((newModelType) => {
    if (isModelLoading || newModelType === activeModel) return;

    setActiveModel(newModelType);
    loadModel(newModelType);
  }, [isModelLoading, activeModel, loadModel]);

  // Función modificada para preprocesar la imagen con landmarks
  const preprocessImage = useCallback((videoElement) => {
    return tf.tidy(() => {
      const frame = tf.browser.fromPixels(videoElement);
      const resized = tf.image.resizeBilinear(frame, [224, 224]); // Reducir tamaño mejora rendimiento
      const normalized = resized.toFloat().div(tf.scalar(255)); // Normalizar a [0,1] en vez de [-1,1]
      return normalized.expandDims(0);
    });
  }, []);


  // Función para renderizar solo los landmarks en un canvas separado
  const renderLandmarksToCanvas = useCallback((landmarks) => {
    if (!landmarks) return null;

    // Crear un canvas temporal
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 224;
    tempCanvas.height = 224;
    const ctx = tempCanvas.getContext('2d');

    // Fondo negro
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Dibujar landmarks en color blanco
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;

    // Dibujar puntos de referencia
    landmarks.forEach(landmark => {
      const x = landmark.x * tempCanvas.width;
      const y = landmark.y * tempCanvas.height;

      // Dibujar punto
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Dibujar conexiones (versión simplificada)
    const connections = mpHands.HAND_CONNECTIONS;
    ctx.beginPath();
    connections.forEach(([start, end]) => {
      const startPoint = landmarks[start];
      const endPoint = landmarks[end];

      const startX = startPoint.x * tempCanvas.width;
      const startY = startPoint.y * tempCanvas.height;
      const endX = endPoint.x * tempCanvas.width;
      const endY = endPoint.y * tempCanvas.height;

      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
    });
    ctx.stroke();

    return tempCanvas;
  }, []);

  // Función modificada para procesar frame usando landmarks
  const processFrame = useCallback(async () => {
    if (!modelRef.current || !labelEncoder || !webcamRef.current || isProcessing || !handLandmarks) return;

    setIsProcessing(true);

    try {
      // Renderizar solo los landmarks a un canvas
      const landmarksCanvas = renderLandmarksToCanvas(handLandmarks);
      if (!landmarksCanvas) {
        setIsProcessing(false);
        return;
      }

      // Preprocesar y predecir usando el canvas de landmarks
      const tensor = preprocessImage(landmarksCanvas);
      const predictions = await modelRef.current.predict(tensor);
      const predictionsArray = await predictions.data();

      tensor.dispose();
      predictions.dispose();

      // Encontrar la predicción con mayor confianza
      const maxProb = Math.max(...predictionsArray);
      if (maxProb > CONFIDENCE_THRESHOLD) {
        const maxIndex = predictionsArray.indexOf(maxProb);
        const predictedClass = labelEncoder[maxIndex];

        // Guardar esta predicción en el historial usando la ref
        const newPrediction = {
          class: predictedClass,
          confidence: maxProb
        };

        lastPredictionsRef.current = [...lastPredictionsRef.current, newPrediction];
        // Mantener solo las últimas N predicciones
        if (lastPredictionsRef.current.length > PREDICTIONS_TO_KEEP) {
          lastPredictionsRef.current = lastPredictionsRef.current.slice(-PREDICTIONS_TO_KEEP);
        }

        // Analizar estabilidad solo si tenemos suficientes muestras
        if (lastPredictionsRef.current.length >= PREDICTIONS_TO_KEEP - 1) {
          // Contar ocurrencias de cada clase
          const counts = {};
          lastPredictionsRef.current.forEach(pred => {
            counts[pred.class] = (counts[pred.class] || 0) + 1;
          });

          // Encontrar la clase más frecuente
          let maxCount = 0;
          let stableClass = "";
          let avgConfidence = 0;

          for (const [className, count] of Object.entries(counts)) {
            if (count > maxCount) {
              maxCount = count;
              stableClass = className;

              // Calcular confianza promedio para esta clase
              const relatedPredictions = lastPredictionsRef.current
                .filter(p => p.class === className);
              avgConfidence = relatedPredictions.reduce((sum, p) => sum + p.confidence, 0) / relatedPredictions.length;
            }
          }

          // Si la predicción es estable (aparece en la mayoría de frames)
          if (maxCount >= Math.ceil(PREDICTIONS_TO_KEEP / 2)) {
            if (stableClass !== text) {
              setText(stableClass);
              setConfidence(avgConfidence * 100);
              speakText(stableClass);
            } else {
              // Actualizar la confianza incluso si la clase no cambia
              setConfidence(avgConfidence * 100);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error en la detección:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [labelEncoder, preprocessImage, speakText, text, isProcessing, handLandmarks, renderLandmarksToCanvas]);

  // Iniciar captura de frames
  const startCapturing = useCallback(() => {
    if (isCapturing || !modelRef.current || !labelEncoder) return;

    setIsCapturing(true);
    lastPredictionsRef.current = [];

    captureIntervalRef.current = setInterval(() => {
      processFrame();
    }, CAPTURE_INTERVAL);

    console.log("Iniciando captura de frames...");
  }, [isCapturing, labelEncoder, processFrame]);

  // Efecto para cargar el modelo inicial y configurar MediaPipe
  useEffect(() => {
    loadModel(activeModel);

    // Una vez que se carga el componente, inicializamos MediaPipe
    initializeHandTracking();

    // Limpieza al desmontar el componente
    return () => {
      cleanupResources();
    };
  }, []); // Solo se ejecuta al montar

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

            <div className="mt-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                isCapturing ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {isCapturing ? 'Capturando...' : 'Cámara inactiva'}
              </span>
            </div>

            {!handLandmarks && isCapturing && (
              <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded-lg">
                No se detecta ninguna mano en el campo de visión
              </div>
            )}
          </div>
        </div>

        {/* Sección de la cámara (derecha, más espacio) */}
        <div className="flex-2 relative">
          <div className="relative">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="rounded-lg shadow-lg w-full"
              style={{
                minHeight: "480px",
                objectFit: "cover",
                backgroundColor: "black"
              }}
              audio={false}
              mirrored={true}
            />

            {/* Canvas superpuesto para dibujar landmarks */}
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
              width={640}
              height={480}
              style={{ pointerEvents: "none" }}
            />
          </div>

          {/* Indicador visual de captura */}
          {isCapturing && (
            <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-red-500 animate-pulse"
                 title="Capturando frames">
            </div>
          )}
        </div>
      </div>

      {/* Controles de captura - Solo mostrar cuando el modelo esté listo */}
      {isModelReady && !isModelLoading && (
        <div className="flex gap-4 w-full max-w-2xl mx-auto">
          {!isCapturing && (
            <button
              onClick={startCapturing}
              className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Iniciar Captura
            </button>
          )}
          {isCapturing && (
            <button
              onClick={stopCapturing}
              className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Detener Captura
            </button>
          )}
        </div>
      )}

      {isModelLoading && (
        <div className="text-2xl font-bold text-center p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto">
          Cargando modelo {MODELS[activeModel].name}...
        </div>
      )}
    </div>
  );
};

export default CameraComponent;