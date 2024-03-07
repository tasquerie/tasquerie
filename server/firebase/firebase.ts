// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount: admin.ServiceAccount = {
  // type: process.env.FIREBASE_TYPE,
  projectId: process.env.FIREBASE_PROJECT_ID,
  // private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // client_id: process.env.FIREBASE_CLIENT_ID,
  // auth_uri: process.env.FIREBASE_AUTH_URI,
  // token_uri: process.env.FIREBASE_TOKEN_URI,
  // auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  // client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  // universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgsDVLKI3gCRmvGcDz_9jjP_d2tgg984M",
  authDomain: "tasquerie-9e335.firebaseapp.com",
  projectId: "tasquerie-9e335",
  storageBucket: "tasquerie-9e335.appspot.com",
  messagingSenderId: "1022656812063",
  appId: "1:1022656812063:web:5e0c11e71e6a9b5fff312a",
  measurementId: "G-TZJR1F6X2Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = admin.firestore();

export { admin, db };
// export const auth = getAuth(app);
// export const database = getFirestore(app);