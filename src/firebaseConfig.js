// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCsd4qmQRq9Zmcgjiof0rBNlzdyT86nzNY",
    authDomain: "afam-869e8.firebaseapp.com",
    projectId: "afam-869e8",
    storageBucket: "afam-869e8.appspot.com",
    messagingSenderId: "1073565326856",
    appId: "1:1073565326856:web:3833c071271342a84ffbbd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
