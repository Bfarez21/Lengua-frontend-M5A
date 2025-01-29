import React from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../config";

const CategoriesSigns = () => {
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categoria`);
        if (!response.ok) throw new Error("Error al cargar las categorías");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    // Aseguramos que el ID se guarde como string
    localStorage.setItem('selectedCategoryId', String(categoryId));
    // También podemos guardar el timestamp para control
    localStorage.setItem('categorySelectedAt', new Date().toISOString());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-white">Cargando categorías...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section
      id="categoriesPage"
      className="relative z-10 bg-gradient-to-r from-indigo-500 to-blue-1000 overflow-hidden pt-[120px] pb-[80px] dark:bg-gray-900"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center text-white">
          <h1 className="mb-6 text-4xl font-extrabold sm:text-5xl md:text-6xl">
            Categorías de Señas
          </h1>
          <p className="mb-10 text-lg leading-relaxed sm:text-xl md:text-2xl max-w-3xl mx-auto">
            Explora las distintas categorías de señas, desde lo más básico hasta
            expresiones avanzadas para mejorar tu aprendizaje.
          </p>
        </div>

        {/* Tarjetas de categorías */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white text-center rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-2xl font-bold text-indigo-500 mb-4">
                {category.nombre}
              </h3>
              <p className="text-gray-600 mb-6">
                Explora las señas de esta categoría.
              </p>
              <Link
                to={`/categoria/details/${category.id}`}
                className="bg-indigo-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-600"
                onClick={() => handleCategoryClick(category.id)}
              >
                Ver detalles
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSigns;
