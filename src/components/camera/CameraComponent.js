import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs'; // TensorFlow.js

const CameraComponent = () => {
  const videoRef = useRef(null); // Referencia al video
  const canvasRef = useRef(null); // Referencia al canvas
  const [text, setText] = useState(""); // Estado para el texto del textarea
  const [model, setModel] = useState(null); // Guardar el modelo
  const [labelEncoder, setLabelEncoder] = useState(null); // Guardar el codificador de etiquetas

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

      // Dibujar el fotograma del video en el canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convertir el contenido del canvas en un tensor
      const frame = tf.browser.fromPixels(canvas);

      // Preprocesar el tensor
      const processedFrame = frame.resizeNearestNeighbor([224, 224]) // Redimensionar al tamaño esperado
        .expandDims(0) // Añadir dimensión de batch
        .toFloat()
        .div(tf.scalar(255)); // Normalizar

      // Realizar la predicción
      const prediction = model.predict(processedFrame);

      // Obtener la clase predicha y convertirla a texto
      const predictedClass = labelEncoder[prediction.argMax(1).dataSync()[0]];
      setText(predictedClass); // Mostrar la predicción en el textarea
      console.log("Predicción:", predictedClass);
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
          placeholder="Escribe aquí..."
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
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
};

export default CameraComponent;
