// ServicioUsuario.js
import { API_URL } from "../config";

const ServicioUsuario = {
  async obtenerEstadisticasUsuario(googleId) {
    try {
      // Obtener estadísticas generales
      const response = await fetch(`${API_URL}/usuarios/estadisticas/${googleId}/`);
      if (!response.ok) {
        throw new Error("Error al obtener las estadísticas del usuario.");
      }
      const datosGenerales = await response.json();

      // Obtener estadísticas específicas de cada nivel
      const [estatFacil, estatMedio, estatDificil] = await Promise.all([
        this.obtenerEstadisticasNivel(googleId, 1),  // Nivel Fácil
        this.obtenerEstadisticasNivel(googleId, 2),  // Nivel Medio
        this.obtenerEstadisticasNivel(googleId, 3)   // Nivel Difícil
      ]);

      // Combinar todas las estadísticas
      const estadisticasCompletas = {
        ...datosGenerales,
        niveles: [
          { nombre: "Facil", puntos: estatFacil.total_puntos || 0 },
          { nombre: "Medio", puntos: estatMedio.total_puntos || 0 },
          { nombre: "Dificil", puntos: estatDificil.total_puntos || 0 }
        ],
        total_puntos: (estatFacil.total_puntos || 0) +
          (estatMedio.total_puntos || 0) +
          (estatDificil.total_puntos || 0)
      };

      console.log("📊 Estadísticas completas procesadas:", estadisticasCompletas);
      return estadisticasCompletas;
    } catch (error) {
      console.error("❌ Error en ServicioUsuario.obtenerEstadisticasUsuario:", error);
      throw error;
    }
  },

  async obtenerEstadisticasNivel(googleId, nivel) {
    try {
      const response = await fetch(`${API_URL}/usuarios/estadisticas/${googleId}/nivel/${nivel}`);
      if (!response.ok) {
        console.warn(`⚠️ No se encontraron estadísticas para el nivel ${nivel}`);
        return { total_puntos: 0 };
      }
      return await response.json();
    } catch (error) {
      console.error(`❌ Error al obtener estadísticas del nivel ${nivel}:`, error);
      return { total_puntos: 0 };
    }
  },

  async obtenerGifsPorNivel(nivel) {
    try {
      const response = await fetch(`${API_URL}/gifs_por_nivel/${nivel}/`);
      if (!response.ok) throw new Error("Error al obtener GIFs del nivel.");
      return await response.json();
    } catch (error) {
      console.error("❌ Error en ServicioUsuario:", error);
      throw error;
    }
  }
};

export default ServicioUsuario;