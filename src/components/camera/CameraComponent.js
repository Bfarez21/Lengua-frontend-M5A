import { useEffect, useRef, useState } from 'react';

const CameraComponent = () => {
  const videoRef = useRef(null); // Referencia al video
  const [text, setText] = useState(""); // Estado para el texto del textarea

  useEffect(() => {
    const activarCamara = async () => {
      try {
        // Solicitar acceso a la cámara
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Asignar el stream al srcObject del video
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error al activar la cámara: ", error);
        alert("No se pudo activar la cámara.");
      }
    };

    // Activar la cámara cuando el componente se monte
    activarCamara();

    // Limpiar el stream cuando el componente se desmonte
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const handleChange = (e) => {
    setText(e.target.value); // Actualizar el estado del texto cuando se escribe en el textarea
  };

  return (
    <div style={styles.container}>
      {/* Componente de la cámara */}
      <div style={styles.cameraContainer}>
        <video
          ref={videoRef}
          autoPlay
          muted
          style={styles.video}
        />
      </div>

      {/* Componente del textarea */}
      <div style={styles.textareaContainer}>
        <textarea
          value={text}
          onChange={handleChange}
          placeholder="Escribe aquí..."
          style={styles.textarea}
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
    gap: '20px',  // Añadido para dar espacio entre cámara y textarea
  },
  cameraContainer: {
    width: '70%',  // Ajustado para ocupar más espacio
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f3f3f3',
    borderRadius: '8px',
    border: '1px solid #ccc',
    height: '500px',  // Aumentado para hacer la cámara más grande
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  textareaContainer: {
    width: '30%',  // Ajustado para que el textarea ocupe el 30% del espacio
  },
  textarea: {
    width: '100%',
    height: '500px',  // Aumentado para que el textarea tenga el mismo tamaño que la cámara
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
};

export default CameraComponent;
