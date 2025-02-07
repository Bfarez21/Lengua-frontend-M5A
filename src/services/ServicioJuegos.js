import { API_URL } from "../config";

const ServicioJuegos = {
  async guardarProgreso({ FK_id_usuario, FK_id_juego, FK_id_nivel, resultado }) {
    try {
      const response = await fetch(`${API_URL}/juego/guardar-progreso/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ FK_id_usuario, FK_id_juego, FK_id_nivel, resultado }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el progreso del juego.");
      }
      return await response.json();
    } catch (error) {
      console.error("Error en ServicioJuegos:", error);
      throw error;
    }
  },
};

export default ServicioJuegos;
