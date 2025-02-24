import React, { useContext, useEffect, useState } from "react";
import NewsLatterBox from "./NewsLatterBox";
import { AuthContext } from "../../firebase/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Asegúrate de que la ruta sea correcta

const Contact = () => {

    const { user } = useContext(AuthContext); // Obtener el usuario autenticado
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {

        if (!user) {
            navigate('/signin');
            return;
        }

        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {

            const feedbackData = {
                mensaje_log: formData.message,
                email_log: formData.email,
                fecha_log: new Date().toISOString(),
                fk_id_usu: userId
            };

            //console.log("Datos a enviar:", JSON.stringify(feedbackData, null, 2));

            const response = await fetch('http://localhost:8000/api/logs/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackData),
            });

            if (!response.ok) {
                throw new Error('Error al enviar el mensaje');

            } else {
                await Swal.fire({
                    title: '¡Gracias!',
                    text: 'Tu mensaje ha sido enviado.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            }

            setSuccess(true);
            setFormData({ email: '', message: '' });
        } catch (err) {
            setError('Hubo un error al enviar el mensaje. Por favor, intente nuevamente.');
            console.error('Error:', err);
            await Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al enviar tu mensaje. Por favor, intenta nuevamente.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUserId = async () => {
            if (user?.uid) {
                try {
                    const response = await fetch(`http://localhost:8000/api/usuarios/google/${user.uid}`);
                    if (response.ok) {
                        const userData = await response.json();
                        setUserId(userData.id);
                        console.log("ID USUARIO: " + userData.id);
                    }
                } catch (error) {
                    console.error("Error al obtener el ID del usuario:", error);
                }
            }
        };

        fetchUserId();
    }, [user]);

    return (
        <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
            <div className="container">
                <div className="-mx-4 flex flex-wrap">
                    <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
                        <div
                            className="mb-12 rounded-sm bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
                            data-wow-delay=".15s"
                        >
                            <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                                ¿Necesita ayuda?
                            </h2>
                            <p className="mb-12 text-base font-medium text-body-color">
                                Si tienes alguna pregunta, comentario o sugerencia, no dudes en
                                escribirnos. Estamos aquí para ayudarte y brindarte toda la
                                información que necesites.
                            </p>
                            <form onSubmit={handleSubmit}>
                                <div className="-mx-4 flex flex-wrap">
                                    <div className="w-full px-4 md:w-1/2">
                                        <div className="mb-8">
                                            <label
                                                htmlFor="email"
                                                className="mb-3 block text-sm font-medium text-dark dark:text-white"
                                            >
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Ingresa tu email"
                                                className="border-stroke w-full rounded-2xl border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full px-4">
                                        <div className="mb-8">
                                            <label
                                                htmlFor="message"
                                                className="mb-3 block text-sm font-medium text-dark dark:text-white"
                                            >
                                                Tu Mensaje
                                            </label>
                                            <textarea
                                                name="message"
                                                rows={5}
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Ingresa tu mensaje"
                                                required
                                                className="border-stroke w-full resize-none rounded-2xl border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="w-full px-4">
                                        <button
                                          type="submit"
                                          disabled={loading}
                                          className="rounded-2xl bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark">
                                            {loading ? 'Enviando...' : 'Enviar'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
                        <NewsLatterBox />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
