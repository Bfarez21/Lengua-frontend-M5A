import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../firebase/AuthContext";
import { obtenerDetalles } from "../../firebase/authService";
import { Avatar, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Importar el hook useNavigate

const PerfilUsuario = () => {
  const { user } = useContext(AuthContext);
  const [detalles, setDetalles] = useState(null);
  const navigate = useNavigate(); // Usar el hook useNavigate para redirigir

  useEffect(() => {
    if (!user) {
      // Si no hay usuario, redirigir a la página principal
      navigate("/"); // Redirige a la ruta principal
    } else {
      obtenerDetalles().then(setDetalles); // Cargar los detalles del usuario si está autenticado
    }
  }, [user, navigate]); // Dependencias: user y navigate

  return (
    <>
      <section className="relative z-10 overflow-hidden bg-white pb-16 pt-[120px] dark:bg-gray-dark md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[10px] 2xl:pt-[210px]">
        <div className="container">
          <div className="mx-auto max-w-[800px] text-center">
            <h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
              Perfil de Usuario
            </h1>
            <p className="mb-12 text-base !leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg md:text-xl">
              Aquí puedes ver y editar tus detalles de perfil.
            </p>
          </div>

          <div className="w-full px-6 lg:w-12/12 xl:w-12/12">
            <div className="mb-12 rounded-sm bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]">
              <div className="flex items-center justify-center mb-8">
                <Avatar src={detalles?.photoURL} alt="Foto de perfil" className="w-24 h-24 rounded-full" />
              </div>

              <div className="flex flex-col items-center mb-8">
                <Typography variant="h6" className="font-semibold text-lg">
                  Nombre: {detalles?.displayName || "No disponible"}
                </Typography>
                <Typography variant="body1" className="mt-2 text-gray-600">
                  Email: {detalles?.email || "No disponible"}
                </Typography>
                <Typography variant="body1" className="mt-2 text-green-600">
                  {detalles?.emailVerified ? "Email verificado" : "Email no verificado"}
                </Typography>
              </div>

              <Paper className="p-4">
                <Typography variant="h6" className="font-semibold text-lg">
                  Información adicional
                </Typography>
                <Typography variant="body1" className="mt-2 text-gray-600">
                  Aún no hay información adicional.
                </Typography>
              </Paper>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PerfilUsuario;
