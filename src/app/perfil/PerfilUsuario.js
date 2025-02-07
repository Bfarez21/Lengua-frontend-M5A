import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { obtenerDetalles } from "../../firebase/authService";
import ServicioUsuario from "../../services/ServicioUsuario";

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

const PerfilUsuario = () => {
  const [detalles, setDetalles] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await obtenerDetalles();
        setDetalles(userDetails);

        if (userDetails?.uid) {
          const stats = await ServicioUsuario.obtenerEstadisticasUsuario(userDetails.uid);
          console.log("📊 Estadísticas recibidas:", stats);
          setEstadisticas(stats);
        }
      } catch (error) {
        console.error("Error al obtener detalles del usuario:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const chartData = useMemo(() => {
    if (!estadisticas || !estadisticas.niveles || estadisticas.niveles.length === 0) {
      return null;
    }

    return {
      labels: estadisticas.niveles.map(nivel => nivel.nombre), // Nombres de niveles en X
      datasets: [
        {
          label: "Puntos acumulados",
          data: estadisticas.niveles.map(nivel => nivel.puntos), // Puntos en Y
          backgroundColor: "rgba(255, 99, 132, 0.6)", // Color más llamativo
          borderColor: "rgb(255, 99, 132)",
          borderWidth: 2
        }
      ]
    };
  }, [estadisticas]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#fff"
        }
      },
      title: {
        display: true,
        text: "Puntos Acumulados por Nivel",
        color: "#fff",
        font: {
          size: 16
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#fff"
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)"
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#fff"
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)"
        }
      }
    }
  }), []);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (chartData) {
      chartInstanceRef.current = new ChartJS(chartRef.current, {
        type: "bar",
        data: chartData,
        options: chartOptions
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData, chartOptions]);

  return (
    <section className="relative z-10 overflow-hidden bg-white pb-16 pt-[100px] dark:bg-gray-dark">
      <div className="container">
        <div className="mx-auto max-w-[800px] text-center">
          <h1 className="mb-5 text-3xl font-bold text-black dark:text-white">Perfil de Usuario</h1>
          <p className="mb-12 text-lg text-body-color dark:text-body-color-dark">
            Analiza tus resultados y sigue progresando.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-12">
          <div className="w-full lg:w-6/12 px-6">
            <div className="bg-white px-8 py-11 shadow-three dark:bg-gray-dark">
              <div className="flex flex-row items-start gap-8 mb-8">
                <img
                  src={detalles?.photoURL || "https://via.placeholder.com/150"}
                  alt="Foto de perfil"
                  className="w-[100px] h-[100px] rounded-full"
                />
                <div>
                  <h6 className="font-semibold text-xl">{detalles?.displayName || "No disponible"}</h6>
                  <p className="text-gray-600">{detalles?.email || "No disponible"}</p>
                  <p className="text-green-600">
                    {detalles?.emailVerified ? "Email verificado" : "Email no verificado"}
                  </p>
                </div>
              </div>

              <h6 className="font-semibold text-lg mb-4">Progreso y Aprendizaje</h6>
              <p className="text-lg text-gray-900 dark:text-gray-100">
                Puntos acumulados: {estadisticas?.total_puntos || 0}
              </p>
            </div>
          </div>

          <div className="w-full lg:w-9/12 px-6">
            <div className="bg-white px-8 py-11 shadow-three dark:bg-gray-dark">
              <h6 className="font-semibold text-lg mb-4">Puntos Acumulados por Nivel</h6>
              {chartData ? (
                <div style={{ height: "300px" }}>
                  <canvas ref={chartRef}></canvas>
                </div>
              ) : (
                <p className="text-gray-400 text-center">No hay datos disponibles para mostrar.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerfilUsuario;
