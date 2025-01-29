import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

const CategoryDetailSigns = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Obtener ID de la URL o localStorage
        const categoryId = id || localStorage.getItem("selectedCategoryId");
        console.log("id cat seleccionado", categoryId);
        if (!categoryId) {
          setError("No se encontró la categoría seleccionada.");
          setLoading(false);
          // Redirigir al listado de categorías si no hay ID
          navigate('/categories');
          return;
        }

        // Si tenemos ID en la URL pero no en localStorage, lo guardamos
        if (id && id !== localStorage.getItem("selectedCategoryId")) {
          localStorage.setItem("selectedCategoryId", id);
        }

        const response = await fetch(`${API_URL}/gifs/por_categoria/?id=${categoryId}`);
        if (!response.ok) {
          throw new Error("Error al cargar los detalles de la categoría.");
        }

        const data = await response.json();
        console.log("Datos obtenidos de la API:", data); // Verifica cómo llega la respuesta

        // Verificar que los datos estén dentro de la propiedad 'data' de la respuesta
        if (!data.success || !Array.isArray(data.data)) {
          throw new Error("Formato de datos incorrecto");
        }

        // Guardar los detalles correctamente
        setDetails(data.data); // Accedemos a la propiedad 'data' que contiene los detalles

      } catch (err) {
        console.error("Error fetching details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, navigate]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-lg text-white">Cargando detalles...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-lg text-red-300">{error}</p>
        </div>
      );
    }

    if (details.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-lg text-gray-200">
            No se encontraron señas para esta categoría.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {details.map((detail) => (
          <div
            key={detail.id}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center hover:bg-white/20 transition-all"
          >
            <div className="w-full h-[400px] relative overflow-hidden rounded-lg shadow-xl">
              <img
                src={detail.archivo}
                alt={detail.nombre}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <h3 className="mt-4 text-center text-lg font-medium text-white">
              {detail.nombre}
            </h3>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section
      className="relative z-10 bg-gradient-to-r from-indigo-500 to-blue-1000 overflow-hidden pt-[120px] pb-[80px] dark:bg-gray-dark">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">
          Señas por Categoría
        </h1>
        {renderContent()}
      </div>
    </section>
  );
};

export default CategoryDetailSigns;
