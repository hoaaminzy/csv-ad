// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnHVhoWK-g-_fJLLosEvCAQ9fbLFTNYLo",
  authDomain: "tourdulich-bda57.firebaseapp.com",
  projectId: "tourdulich-bda57",
  storageBucket: "tourdulich-bda57.appspot.com",
  messagingSenderId: "77146277905",
  appId: "1:77146277905:web:3314282e882ce460b989b0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
