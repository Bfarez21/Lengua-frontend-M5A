import React, { useContext, useEffect, useState } from "react";
import SectionTitle from "../Common/SectionTitle";
import SingleTestimonial from "./SingleTestimonial";
import { AuthContext } from "../../firebase/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Testimonials = () => {

    const { user } = useContext(AuthContext); // Obtener el usuario autenticado
    const [userId, setUserId] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [comentario, setComentario] = useState("");
    const navigate = useNavigate();
    const [rating, setRating] = useState(5);
    const [nombreUsuario, setNombreUsuario] = useState("");

    const handleRating = (value) => {
        setRating(value);
    };

    const processComments = (comments) => {
        return comments
          .sort((a, b) => new Date(b.fecha_fee) - new Date(a.fecha_fee))
          .slice(0, 3);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!user) {
            navigate('/signin');
            return;
        }

        try {
            const feedbackData = {
                comentario_fee: comentario,
                calificacion_fee: rating,
                fecha_fee: new Date().toISOString(),
                fk_id_usu: userId,
                nombreUsuario: user.displayName
            };

            //console.log("Datos a enviar:", JSON.stringify(feedbackData, null, 2));

            const response = await fetch("http://localhost:8000/api/feedback/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    //header de autenticación
                },
                body: JSON.stringify(feedbackData),
            });

            if (response.ok) {
                const newFeedback = await response.json();

                const feedbackConNombre = {
                    ...newFeedback,
                    nombreUsuario: user.displayName || nombreUsuario || "Anónimo",
                    fk_id_usu: userId
                };

                setComentarios(prevComentarios =>
                  processComments([feedbackConNombre, ...prevComentarios])
                );
                await Swal.fire({
                    title: '¡Gracias!',
                    text: 'Tu comentario y calificación han sido enviados.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });

                // Limpiar el formulario
                setComentario("");
                setRating(5);

                // Actualizar la lista de comentarios
                const updatedResponse = await fetch("http://localhost:8000/api/feedback/");
                if (updatedResponse.ok) {
                    const updatedComments = await updatedResponse.json();
                    const commentosConNombres = updatedComments.map(comment => ({
                        ...comment,
                        nombreUsuario: comment.fk_id_usu === userId
                          ? (user.displayName || nombreUsuario || "Anónimo")
                          : (comment.nombreUsuario || "Anónimo")
                    }));
                    setComentarios(processComments(commentosConNombres));
                }
            } else {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al enviar el comentario');
            }
        } catch (error) {
            console.error("Error:", error);
            await Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al enviar tu comentario. Por favor, intenta nuevamente.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    useEffect(() => {
        if (user && user.displayName) {
            setNombreUsuario(user.displayName);
            //console.log("Usuario actual:", user.displayName);
        }
    }, [user]);

    useEffect(() => {
        const fetchComentarios = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/feedback/");
                if (response.ok) {
                    const data = await response.json();

                    // Obtener los datos de usuario para cada comentario
                    const comentariosConUsuarios = await Promise.all(
                      data.map(async (comentario) => {
                          try {

                              // Si el comentario es del usuario actual, usar su nombre
                              if (comentario.fk_id_usu === userId) {
                                  return {
                                      ...comentario,
                                      nombreUsuario: user?.displayName || nombreUsuario || "Anónimo"
                                  };
                              }

                              const userResponse = await fetch(`http://localhost:8000/api/usuarios/${comentario.fk_id_usu.uid.displayName}`);
                              if (userResponse.ok) {
                                  const userData = await userResponse.json();
                                  const nombreMostrado = user.id && comentario.fk_id_usu === userId
                                    ? user.displayName
                                    : userData.id || "Anónimo";
                                  return {
                                      ...comentario,
                                      nombreUsuario: nombreMostrado
                                  };
                              }
                              //console.log("NOMBREEE", comentario);
                              return comentario;
                          } catch (error) {
                              return {
                                  ...comentario,
                                  nombreUsuario: user && comentario.fk_id_usu === userId
                                    ? user.displayName
                                    : "Anónimo"
                              };
                          }
                      })
                    );

                    //console.log("Comentarios con usuarios:", comentariosConUsuarios);
                    setComentarios(processComments(comentariosConUsuarios));
                } else {
                    console.error("Error al obtener comentarios");
                }
            } catch (error) {
                console.error("Error al obtener comentarios:", error);
            }
        };

        fetchComentarios();
    }, [user, userId]);

    useEffect(() => {
        const fetchUserId = async () => {
            if (user?.uid) {
                try {
                    const response = await fetch(`http://localhost:8000/api/usuarios/google/${user.uid}`);
                    if (response.ok) {
                        const userData = await response.json();
                        setUserId(userData.id);
                    }
                } catch (error) {
                    console.error("Error al obtener el ID del usuario:", error);
                }
            }
        };

        fetchUserId();
    }, [user]);

    // useEffect(() => {
    //     const obtenerIdUsuario = async () => {
    //         if (user?.google_id) {
    //             try {
    //                 const response = await fetch(`http://localhost:8000/api/usuarios/google/${user.google_id}`);
    //                 console.log("Respuesta del servidor:", response);
    //                 if (response.ok) {
    //                     const userData = await response.json();
    //                     setUserId(userData.id); // Guarda el ID del usuario (4 en tu caso)
    //                     console.log("ID A enviar :" , userData);
    //                 }
    //             } catch (error) {
    //                 console.error("Error al obtener el ID del usuario:", error);
    //             }
    //         }
    //     };
    //
    //     obtenerIdUsuario();
    // }, [user]);

    useEffect(() => {
        //console.log("Usuario ID:", userId);
    }, [userId]);

    return (
        <section className="dark:bg-bg-color-dark bg-gray-light relative z-10 py-16 md:py-20 lg:py-28">
            <div className="container">
                <SectionTitle
                  title="Comentarios"
                  paragraph="Tus opiniones importan. Descubre lo que nuestros usuarios tienen que decir sobre su experiencia con nuestra aplicación.
                    ¡Tu comentario también puede ayudarnos a mejorar cada día!"
                  center
                />

                <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    {comentarios.map((testimonial) => (
                      <SingleTestimonial key={testimonial.id} testimonial={testimonial} />
                    ))}
                </div>


                <form>
                    <div className="-mx-4 flex flex-wrap">
                        <div className="w-full px-4">
                            <div className="mb-1">
                                <label
                                  htmlFor="message"
                                  className="mb-3 block text-sm font-medium text-dark dark:text-white"
                                >
                                    Tu Comentario
                                </label>
                                <textarea
                                  name="message"
                                  rows={5}
                                  placeholder="Ingresa tu comentario"
                                  value={comentario}
                                  onChange={(e) => setComentario(e.target.value)}
                                  className="border-stroke w-full resize-none rounded-2xl border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                                ></textarea>
                            </div>
                        </div>
                        {/* Sección de calificación */}
                        <div className="w-full px-5 mb-2">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    className={`text-4xl ${star <= rating ? 'text-yellow' : 'text-gray-300'}`}
                                    onClick={() => handleRating(star)} // Actualiza la calificación
                                  >
                                      ★
                                  </button>
                                ))}
                            </div>
                        </div>
                        <div className="w-full px-4">
                            <button
                              type="submit"
                              onClick={handleSubmit}
                              className="rounded-2xl bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark">
                                Enviar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="absolute right-0 top-5 z-[-1]">
                <svg
                  width="238"
                  height="531"
                  viewBox="0 0 238 531"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                    <rect
                      opacity="0.3"
                      x="422.819"
                      y="-70.8145"
                      width="196"
                      height="541.607"
                      rx="2"
                      transform="rotate(51.2997 422.819 -70.8145)"
                      fill="url(#paint0_linear_83:2)"
                    />
                    <rect
                      opacity="0.3"
                      x="426.568"
                      y="144.886"
                      width="59.7544"
                      height="541.607"
                      rx="2"
                      transform="rotate(51.2997 426.568 144.886)"
                      fill="url(#paint1_linear_83:2)"
                    />
                    <defs>
                        <linearGradient
                          id="paint0_linear_83:2"
                          x1="517.152"
                          y1="-251.373"
                          x2="517.152"
                          y2="459.865"
                          gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#4A6CF7" />
                            <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_83:2"
                          x1="455.327"
                          y1="-35.673"
                          x2="455.327"
                          y2="675.565"
                          gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#4A6CF7" />
                            <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div className="absolute bottom-5 left-0 z-[-1]">
                <svg
                  width="279"
                  height="106"
                  viewBox="0 0 279 106"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                    <g opacity="0.5">
                        <path
                          d="M-57 12L50.0728 74.8548C55.5501 79.0219 70.8513 85.7589 88.2373 79.3692C109.97 71.3821 116.861 60.9642 156.615 63.7423C178.778 65.291 195.31 69.2985 205.911 62.3533C216.513 55.408 224.994 47.7682 243.016 49.1572C255.835 50.1453 265.278 50.8936 278 45.3373"
                          stroke="url(#paint0_linear_72:302)"
                        />
                        <path
                          d="M-57 1L50.0728 63.8548C55.5501 68.0219 70.8513 74.7589 88.2373 68.3692C109.97 60.3821 116.861 49.9642 156.615 52.7423C178.778 54.291 195.31 58.2985 205.911 51.3533C216.513 44.408 224.994 36.7682 243.016 38.1572C255.835 39.1453 265.278 39.8936 278 34.3373"
                          stroke="url(#paint1_linear_72:302)"
                        />
                        <path
                          d="M-57 23L50.0728 85.8548C55.5501 90.0219 70.8513 96.7589 88.2373 90.3692C109.97 82.3821 116.861 71.9642 156.615 74.7423C178.778 76.291 195.31 80.2985 205.911 73.3533C216.513 66.408 224.994 58.7682 243.016 60.1572C255.835 61.1453 265.278 61.8936 278 56.3373"
                          stroke="url(#paint2_linear_72:302)"
                        />
                        <path
                          d="M-57 35L50.0728 97.8548C55.5501 102.022 70.8513 108.759 88.2373 102.369C109.97 94.3821 116.861 83.9642 156.615 86.7423C178.778 88.291 195.31 92.2985 205.911 85.3533C216.513 78.408 224.994 70.7682 243.016 72.1572C255.835 73.1453 265.278 73.8936 278 68.3373"
                          stroke="url(#paint3_linear_72:302)"
                        />
                    </g>
                    <defs>
                        <linearGradient
                            id="paint0_linear_72:302"
                            x1="256.267"
                            y1="53.6717"
                            x2="-40.8688"
                            y2="8.15715"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#4A6CF7" stopOpacity="0" />
                            <stop offset="1" stopColor="#4A6CF7" />
                        </linearGradient>
                        <linearGradient
                            id="paint1_linear_72:302"
                            x1="256.267"
                            y1="42.6717"
                            x2="-40.8688"
                            y2="-2.84285"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#4A6CF7" stopOpacity="0" />
                            <stop offset="1" stopColor="#4A6CF7" />
                        </linearGradient>
                        <linearGradient
                            id="paint2_linear_72:302"
                            x1="256.267"
                            y1="64.6717"
                            x2="-40.8688"
                            y2="19.1572"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#4A6CF7" stopOpacity="0" />
                            <stop offset="1" stopColor="#4A6CF7" />
                        </linearGradient>
                        <linearGradient
                            id="paint3_linear_72:302"
                            x1="256.267"
                            y1="76.6717"
                            x2="-40.8688"
                            y2="31.1572"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#4A6CF7" stopOpacity="0" />
                            <stop offset="1" stopColor="#4A6CF7" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </section>
    );
};

export default Testimonials;
