import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { API_URL } from "../../config";

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [text, setText] = useState("");
  const [model, setModel] = useState(null);
  const [labelEncoder, setLabelEncoder] = useState(null);
  const [predictions, setPredictions] = useState([]);

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  const loadModel = async () => {
    try {
      console.log("Iniciando carga del modelo...");

      // 1. Solicitar datos del modelo desde la API
      const response = await fetch(`${API_URL}/modelo`);
      if (!response.ok) {
        throw new Error(`Error al obtener datos del modelo: ${response.statusText}`);
      }

      const modeloData = await response.json();
      if (!modeloData || modeloData.length === 0) {
        throw new Error("No se encontraron datos del modelo en la API");
      }

      // 2. Obtener URLs de los archivos necesarios
      const modeloInfo = modeloData[0];
      const { model_file, weights_file, metadata_file } = modeloInfo;

      console.log("URLs recibidas:", { model_file, weights_file, metadata_file });

      // 3. Verificar accesibilidad de los archivos
      const checkFileAccessibility = async (url, fileType) => {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`No se pudo acceder al archivo ${fileType}: ${res.statusText}`);
        }
        console.log(`Archivo ${fileType} accesible`);
        return res;
      };

      await checkFileAccessibility(model_file, "model_file");
      await checkFileAccessibility(weights_file, "weights_file");
      await checkFileAccessibility(metadata_file, "metadata_file");

      // 4. Extraer el prefijo de la ruta para los pesos
      const weightPathPrefix = weights_file.substring(0, weights_file.lastIndexOf("/") + 1);
      console.log("Prefijo para los pesos:", weightPathPrefix);

      // 5. Cargar el modelo usando TensorFlow.js
      const loadedModel = await tf.loadLayersModel(model_file, {
        weightPathPrefix, // Usar prefijo para evitar problemas con las rutas
      });

      console.log("Modelo cargado exitosamente:", loadedModel.summary());

      // 6. Cargar el archivo de metadata
      const metadataResponse = await fetch(metadata_file);
      if (!metadataResponse.ok) {
        throw new Error(`No se pudo acceder al archivo metadata: ${metadataResponse.statusText}`);
      }
      const metadata = await metadataResponse.json();

      if (!metadata || !metadata.labels) {
        throw new Error("El archivo de metadata no tiene el formato esperado");
      }
      console.log("Metadata cargada:", metadata);

      // 7. Guardar modelo y etiquetas en el estado
      setModel(loadedModel);
      setLabelEncoder(metadata.labels);
      console.log("Modelo y etiquetas cargados exitosamente");
    } catch (error) {
      console.error("Error detallado:", {
        message: error.message,
        stack: error.stack,
      });
    }
  };




  const activarCamara = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error al activar la cámara: ", error);
      alert("No se pudo activar la cámara.");
    }
  };

  const detectSignLanguage = async () => {
    if (!model || !labelEncoder || !videoRef.current || !canvasRef.current) return;

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Verificar que el video esté reproduciendo
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        return;
      }

      ctx.drawImage(video,
        video.videoWidth * 0.25,
        video.videoHeight * 0.2,
        video.videoWidth * 0.5,
        video.videoHeight * 0.6,
        0, 0, canvas.width, canvas.height
      );

      let frame = null;
      let processedFrame = null;
      let prediction = null;

      try {
        frame = tf.browser.fromPixels(canvas);
        processedFrame = frame
          .resizeBilinear([224, 224])
          .expandDims(0)
          .toFloat()
          .div(tf.scalar(255))
          .sub(tf.scalar(0.5))
          .div(tf.scalar(0.5));

        prediction = model.predict(processedFrame);
        const predictedClassIndex = prediction.argMax(1).dataSync()[0];
        const predictedClass = labelEncoder[predictedClassIndex];

        setPredictions(prev => {
          const newPredictions = [...prev, predictedClass];
          if (newPredictions.length > 5) newPredictions.shift();

          const mostFrequent = newPredictions.reduce((a, b) =>
            newPredictions.filter(v => v === a).length >= newPredictions.filter(v => v === b).length ? a : b
          );

          if (mostFrequent !== text) {
            setText(mostFrequent);
           // speakText(mostFrequent);
            console.log('Predicción:', mostFrequent);
          }

          return newPredictions;
        });
      } finally {
        // Limpiar recursos de TensorFlow
        if (frame) frame.dispose();
        if (processedFrame) processedFrame.dispose();
        if (prediction) prediction.dispose();
      }
    } catch (error) {
      console.error('Error en la detección:', error);
    }
  };

  // Efecto para cargar el modelo y activar la cámara
  useEffect(() => {
    loadModel();
    activarCamara();

    // Cleanup function
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []); // Solo se ejecuta al montar el componente

  // Efecto para la detección continua
  useEffect(() => {
    if (!model || !labelEncoder) return;

    const intervalId = setInterval(detectSignLanguage, 100);
    return () => clearInterval(intervalId);
  }, [model, labelEncoder, text]); // Dependencias actualizadas

  return (
    <div style={styles.container}>
      <div style={styles.cameraContainer}>
        <video ref={videoRef} autoPlay muted playsInline style={styles.video} />
        <canvas ref={canvasRef} style={styles.canvas} width="224" height="224" />
      </div>
      <div style={styles.textareaContainer}>
        <textarea
          value={text}
          placeholder="Mostrar aquí..."
          style={styles.textarea}
          readOnly
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    gap: '20px',
  },
  cameraContainer: {
    width: '80%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  canvas: {
    display: 'none',
  },
  textareaContainer: {
    width: '20%',
  },
  textarea: {
    width: '100%',
    height: '300px',
    padding: '10px',
    fontSize: '35px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
};

export default CameraComponent;