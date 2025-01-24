import { useEffect, useRef, useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs'; // TensorFlow.js


const CameraComponent = () => {
  const videoRef = useRef(null); // Referencia al video
  const canvasRef = useRef(null); // Referencia al canvas
  const [text, setText] = useState(""); // Estado para el texto del textarea
  const [model, setModel] = useState(null); // Guardar el modelo
  const [labelEncoder, setLabelEncoder] = useState(null); // Guardar el codificador de etiquetas
  const [predictions, setPredictions] = useState([]);

  // texto a audio
  const speakText=(text)=>{
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES'; // español
    window.speechSynthesis.speak(utterance);
  }

  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await tf.loadLayersModel('/model.json'); // Cargar el modelo
        const labelEncoder = await fetch('/metadata.json') // Cargar las etiquetas desde JSON
          .then(res => res.json());

        // accedo a las etiquetas
        const labels = labelEncoder.labels;

        setModel(model); // Guardar el modelo
        setLabelEncoder(labels); // Guardar las etiquetas

        console.log("Modelo y etiquetas cargados correctamente");
      } catch (error) {
        console.error("Error al cargar el modelo o etiquetas:", error);
      }
    };

    const activarCamara = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream; // Asignar el stream al elemento de video
        }
      } catch (error) {
        console.error("Error al activar la cámara: ", error);
        alert("No se pudo activar la cámara.");
      }
    };

    loadModel(); // Cargar el modelo al iniciar
    activarCamara(); // Activar la cámara al iniciar

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const detectSignLanguage = async () => {
    if (model && labelEncoder) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(video,
        video.videoWidth * 0.25,
        video.videoHeight * 0.2,
        video.videoWidth * 0.5,
        video.videoHeight * 0.6,
        0, 0, canvas.width, canvas.height
      );

      const frame = tf.browser.fromPixels(canvas);

      const processedFrame = frame
        .resizeBilinear([224, 224])
        .expandDims(0)
        .toFloat()
        .div(tf.scalar(255))
        .sub(tf.scalar(0.5))
        .div(tf.scalar(0.5));

      const prediction = model.predict(processedFrame);
      const predictedClassIndex = prediction.argMax(1).dataSync()[0];
      const predictedClass = labelEncoder[predictedClassIndex];

      // Suavizado de predicciones
      setPredictions(prev => {
        const newPredictions = [...prev, predictedClass];
        if (newPredictions.length > 5) newPredictions.shift();

        const mostFrequent = newPredictions.reduce((a, b) =>
          newPredictions.filter(v => v === a).length >= newPredictions.filter(v => v === b).length ? a : b
        );

        // Solo reproducir audio si la predicción más frecuente es diferente al texto actual
        if (mostFrequent !== text) {
          const utterance = new SpeechSynthesisUtterance(mostFrequent);
          utterance.lang = 'es-ES'; //audio español
          //window.speechSynthesis.speak(utterance);  //reproduce el audio
        }

        setText(mostFrequent);
        console.log(mostFrequent);
        return newPredictions;
      });

      // Limpiar recursos
      frame.dispose();
      processedFrame.dispose();
      prediction.dispose();
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      detectSignLanguage(); // Detectar lengua de señas cada cierto tiempo
    }, 100); // Detecta cada 100 ms

    return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonte
  }, [model, labelEncoder]);

  return (
    <div style={styles.container}>
      {/* Componente de la cámara */}
      <div style={styles.cameraContainer}>
        <video ref={videoRef} autoPlay muted style={styles.video} />
        <canvas ref={canvasRef} style={styles.canvas} width="224" height="224" />
      </div>

      {/* Componente del textarea */}
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

// Estilos en línea
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
    display: 'none', // Mantener el canvas oculto
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