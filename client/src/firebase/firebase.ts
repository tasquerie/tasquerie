// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

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

export const auth = getAuth(app);
export const database = getFirestore(app);