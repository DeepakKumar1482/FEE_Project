const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const firebaseConfig = {
    apiKey: "AIzaSyCWxQGLrQCs3BKxvpDrY7FQTxNQD4gEXxY",
    authDomain: "codebuddymedia.firebaseapp.com",
    projectId: "codebuddymedia",
    storageBucket: "codebuddymedia.appspot.com",
    messagingSenderId: "1011375331924",
    appId: "1:1011375331924:web:d4fc29a5115400e1c52bc1"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
module.exports = db;