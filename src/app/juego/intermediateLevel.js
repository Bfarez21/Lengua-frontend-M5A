import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../config";
import ServicioJuegos from "../../services/ServicioJuegos";

const IntermediateLevel = () => {
  const [senaActual, setSenaActual] = useState(null);
  const [retroalimentacion, setRetroalimentacion] = useState("");
  const [puntaje, setPuntaje] = useState(0);
  const [intentos, setIntentos] = useState(0);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [senas, setSenas] = useState([]);
  const [opciones, setOpciones] = useState([]);
  const [respuestasCorrectas, setRespuestasCorrectas] = useState(0);
  const [categoriaActual, setCategoriaActual] = useState("Colores");
  const [puntajeFinal, setPuntajeFinal] = useState(0);

  useEffect(() => {
    obtenerSenas(categoriaActual);
  }, [categoriaActual]);

  useEffect(() => {
    if (senas.length > 0) {
      seleccionarSenaAleatoria();
    }
  }, [senas]);

  const obtenerSenas = async (categoria) => {
    try {
      const respuesta = await fetch(
        `${API_URL}/gifs/por_categoria?nombre=${categoria}`,
      );
      if (!respuesta.ok) {
        throw new Error(`Error en la solicitud: ${respuesta.status}`);
      }
      const datosRespuesta = await respuesta.json();
      if (!datosRespuesta.success || !Array.isArray(datosRespuesta.data)) {
        throw new Error("Respuesta inesperada del servidor");
      }
      const senasMapeadas = datosRespuesta.data.map((item) => ({
        id: item.id,
        sena: item.nombre || "Sin nombre",
        imagen: item.archivo.startsWith("http")
          ? item.archivo
          : `${API_URL}${item.archivo}`,
      }));
      setSenas(senasMapeadas);
    } catch (error) {
      console.error("❌ Error al obtener las señales:", error);
    }
  };

  const seleccionarSenaAleatoria = () => {
    if (senas.length === 0) return;

    const senaAleatoria = senas[Math.floor(Math.random() * senas.length)];
    setSenaActual(senaAleatoria);

    const opcionesDisponibles = senas.filter(
      (s) => s.sena !== senaAleatoria.sena,
    );
    const totalOpciones = Math.min(4, Math.max(2, senas.length));
    const opcionesAdicionales = [];

    for (
      let i = 0;
      i < totalOpciones - 1 && opcionesDisponibles.length > 0;
      i++
    ) {
      const indiceAleatorio = Math.floor(
        Math.random() * opcionesDisponibles.length,
      );
      opcionesAdicionales.push(opcionesDisponibles[indiceAleatorio]);
      opcionesDisponibles.splice(indiceAleatorio, 1);
    }

    const nuevasOpciones = [...opcionesAdicionales, senaAleatoria].sort(
      () => Math.random() - 0.5,
    );

    setOpciones(nuevasOpciones);
    setRetroalimentacion("");
    setIntentos(0);
  };

  const guardarProgresoJuego = async (puntajeActualizado) => {
    try {
      const idUsuario = localStorage.getItem("userId");
      if (!idUsuario) {
        //console.error("❌ No hay userId en localStorage");
        return;
      }
      const datosJuego = {
        FK_id_usuario: idUsuario,
        FK_id_juego: 1,
        FK_id_nivel: 2,
        resultado: puntajeActualizado,
      };
      //console.log("📤 Enviando datos a la API:", datosJuego);
      const respuesta = await ServicioJuegos.guardarProgreso(datosJuego);
      //console.log("✅ Respuesta de la API:", respuesta);
    } catch (error) {
      console.error("❌ Error al guardar progreso:", error);
    }
  };

  const manejarFinalizacionCategoria = async () => {
    if (categoriaActual === "Colores") {
      setCategoriaActual("Familia");
      setRespuestasCorrectas(0);
      setJuegoTerminado(false);
    } else {
      setJuegoTerminado(true);
      setPuntajeFinal(puntaje);
    }
  };

  const manejarSeleccionOpcion = async (opcion) => {
    if (juegoTerminado) return;

    if (senaActual && opcion === senaActual.sena) {
      const nuevoPuntaje = puntaje + 1;
      setPuntaje(nuevoPuntaje);
      setRetroalimentacion("✅ ¡Correcto!");
      //console.log("📊 Puntaje actualizado:", nuevoPuntaje);
      await guardarProgresoJuego(nuevoPuntaje);

      const nuevasRespuestasCorrectas = respuestasCorrectas + 1;
      setRespuestasCorrectas(nuevasRespuestasCorrectas);

      if (nuevasRespuestasCorrectas >= Math.floor(senas.length / 2)) {
        await manejarFinalizacionCategoria();
      } else {
        setTimeout(seleccionarSenaAleatoria, 1000);
      }
    } else {
      const nuevosIntentos = intentos + 1;
      setIntentos(nuevosIntentos);

      if (nuevosIntentos >= 2) {
        setJuegoTerminado(true);
        setPuntajeFinal(puntaje);
        reiniciarJuego();
      } else {
        setRetroalimentacion("❌ Incorrecto. Inténtalo de nuevo.");
      }
    }
  };

  const reiniciarJuego = () => {
    setCategoriaActual("Colores");
    setPuntaje(0);
    setRespuestasCorrectas(0);
    setJuegoTerminado(false);
    obtenerSenas("Colores");
    guardarProgresoJuego(0);
  };

  return (
    <section className="to-blue-1000 relative z-10 overflow-hidden bg-gradient-to-r from-indigo-500 pb-[80px] pt-[120px] dark:bg-gray-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h1 className="mb-4 text-3xl font-extrabold sm:text-3xl md:text-4xl">
            Adivina la Seña - {categoriaActual}
          </h1>
          <p className="md:text-1xl mx-auto mb-10 max-w-3xl text-lg leading-relaxed sm:text-xl">
            Selecciona la respuesta correcta para la seña mostrada:
          </p>
        </div>

        {!juegoTerminado ? (
          <>
            {senaActual && (
              <div className="mb-6 flex justify-center">
                <img
                  src={senaActual.imagen}
                  alt={`Seña de ${senaActual.sena}`}
                  className="animate-fade-in h-72 w-72 rounded-lg border-4 border-white shadow-lg"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {opciones.map((opcion) => (
                <button
                  key={opcion.sena}
                  onClick={() => manejarSeleccionOpcion(opcion.sena)}
                  className="rounded-lg bg-white px-6 py-3 font-bold text-indigo-700 shadow-md transition duration-300 hover:bg-indigo-100"
                >
                  {opcion.sena}
                </button>
              ))}
            </div>

            {retroalimentacion && (
              <p className="animate-fade-in mt-4 text-lg font-semibold text-white">
                {retroalimentacion}
              </p>
            )}

            <div className="mt-4 text-center text-lg text-white">
              <p>Puntuación Total: {puntaje}</p>
              <p>Categoría Actual: {categoriaActual}</p>
              <p>Intentos Restantes: {2 - intentos}</p>
            </div>
          </>
        ) : (
          <div className="rounded-lg bg-indigo-600 p-8 text-center text-white shadow-lg">
            <h2 className="mb-6 text-3xl font-bold">¡Juego Finalizado!</h2>
            <p className="mb-8 text-2xl">
              Puntaje Total Final: {puntajeFinal} puntos
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={reiniciarJuego}
                className="rounded-lg bg-green-500 px-6 py-3 font-bold text-white shadow-md transition hover:bg-green-600"
              >
                Jugar de Nuevo
              </button>
              <Link
                to="/jugar"
                className="rounded-lg bg-blue-500 px-6 py-3 font-bold text-white shadow-md transition hover:bg-blue-600"
              >
                Volver a Niveles
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default IntermediateLevel;
