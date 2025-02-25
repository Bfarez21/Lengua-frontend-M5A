import { auth } from "./firebase";
import firebase from "firebase/compat/app";
import Swal from "sweetalert2";
import { API_URL } from "../config";

// URL del backend
const BASE_URL = `${API_URL}/usuarios`; // Utiliza la variable de entorno para la URL

//Variable para manejar el estado de las variables
let logueando = false;

// Función para verificar si el servidor está disponible
const isServerAvailable = async () => {
  try {
    const response = await fetch(BASE_URL, { method: "GET" });
    if (response.ok) {
      return true; // Si el servidor responde correctamente
    }
    return false; // Si la respuesta no es OK (por ejemplo, 404 o 500)
  } catch (error) {
    console.error("Error al verificar el servidor:", error.message);
    return false; // Si no se puede conectar, asumimos que el servidor no está disponible
  }
};

// Iniciar sesión con Google
const loginWithGoogle = async () => {
  const serverAvailable = await isServerAvailable(); // Verificar si el servidor está disponible
  //Evitar multiples clicks
  if (logueando) {
    return;
  }
  logueando = true; //Se bloquea el boton

  if (!serverAvailable) {
    Swal.fire({
      icon: "error",
      title: "Error de Conexión",
      text: "El servidor no está disponible. Intenta más tarde.",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#FF6347"
    });
    return; // No continuar con el login si el servidor no está disponible
  }

  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;

    if (user) {
      //console.log("✅ Usuario autenticado en Firebase:", user);
      // Verificar si el usuario ya existe en la base de datos
      const isUserRegistered = await checkIfUserExists(user.uid);
      if (!isUserRegistered) {
        const registered = await registerUser(user.uid); // Usar uid del usuario para el registro
        if (!registered) {
          throw new Error("No se pudo registrar el usuario");
        }
      }

      // Obtener el userId de la base de datos
      const response = await fetch(`${BASE_URL}/buscar/${user.uid}`);
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("userId", userData.id);
        //console.log("✅ userId guardado en localStorage:", userData.id);
      } else {
        //console.error("❌ Error al obtener el userId de la API.");
      }
    }
    return user; // Retorna el usuario autenticado
  } catch (error) {
    if (error.code === "auth/popup-closed-by-user") {
      Swal.fire({
        icon: "warning",
        title: "Inicio de sesión cancelado",
        text: "Parece que cerraste la ventana de autenticación antes de completar el proceso.",
        confirmButtonText: "Intentar de nuevo"
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al Iniciar Sesión",
        text: "Revise su conexión a internet",
        confirmButtonText: "Intentar de nuevo"
      });
    }
  } finally {
    logueando = false; //Desbloquear el boton
  }
};

// Cerrar sesión con confirmación
const logout = async () => {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "¿Deseas cerrar sesión?",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Cerrar sesión",
    confirmButtonColor: "#FF6347",
    cancelButtonColor: "#d33"
  });

  if (result.isConfirmed) {
    try {
      await auth.signOut();
      Swal.fire({
        icon: "success",
        title: "Sesión Cerrada",
        text: "Has cerrado sesión correctamente.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#28a745"
      }).then(() => {
        window.location.replace("/");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al Cerrar Sesión",
        text: error.message,
        confirmButtonText: "Intentar de nuevo"
      });
    }
  } else {
    console.log("Cierre de sesión cancelado");
  }
};

// Verificar si el usuario ya está registrado en la base de datos
const checkIfUserExists = async (googleId) => {
  try {
    const response = await fetch(`${BASE_URL}/buscar/${googleId}`);
    if (response.status === 200) {
      return true; // Usuario ya registrado
    } else if (response.status === 404) {
      return false; // Usuario no existe
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al verificar el usuario.",
        confirmButtonText: "Aceptar"
      });
      return false;
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error de Conexión",
      text: "No se pudo conectar con el servidor.",
      confirmButtonText: "Intentar de nuevo"
    });
    throw error; // Propaga el error hacia el componente de React
  }
};

// Registrar al usuario en la base de datos
const registerUser = async (googleId) => {
  try {
    const response = await fetch(`${BASE_URL}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ google_id: googleId })
    });

    if (response.status === 201) {
      Swal.fire({
        icon: "success",
        title: "Registro Exitoso",
        text: "Usuario registrado con éxito. ¡Bienvenido!",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#28a745"
      });
      return true;
    } else {
      Swal.fire({
        icon: "error",
        title: "Error de Registro",
        text: "Hubo un problema al registrar el usuario.",
        confirmButtonText: "Intentar de nuevo"
      });
      return false;
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error de Conexión",
      text: "No se pudo conectar con el servidor.",
      confirmButtonText: "Intentar de nuevo"
    });
    alert("No se pudo conectar con el servidor.");
    return false;
  }
};

// Obtener detalles del usuario actual autenticado
const obtenerDetalles = async () => {
  const user = auth.currentUser; // Obtén el usuario actual autenticado
  if (user) {
    const userDetails = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    return userDetails;
  } else {
    return null;
  }
};

export { loginWithGoogle, logout, obtenerDetalles };
