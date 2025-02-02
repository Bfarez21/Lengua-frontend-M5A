// src/firebase/firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import firebaseConfig from './firebaseConfig';

// Inicializar Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

const auth = firebaseApp.auth();

export { auth };
