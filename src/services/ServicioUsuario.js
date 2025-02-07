import { API_URL } from "../config";

const ServicioUsuario = {
  async obtenerEstadisticasUsuario(googleId) {
    try {
      const response = await fetch(`${API_URL}/usuarios/estadisticas/${googleId}/`);
      if (!response.ok) {
        throw new Error("Error al obtener las estadísticas del usuario.");
      }
      return await response.json();
    } catch (error) {
      console.error("❌ Error en ServicioUsuario:", error);
      throw error;
    }
  },
};

export default ServicioUsuario;
