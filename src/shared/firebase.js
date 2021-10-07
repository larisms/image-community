import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/database";


const firebaseConfig = {
    apiKey: "AIzaSyAe5RPQkjv5dBbp4eEMTSGbd5-YgnhNtHg",
    authDomain: "image-community-83bf4.firebaseapp.com",
    projectId: "image-community-83bf4",
    storageBucket: "image-community-83bf4.appspot.com",
    messagingSenderId: "690207917652",
    appId: "1:690207917652:web:c6ecdc07a5b34d1897cfc1",
    measurementId: "G-0FNRLZ79DN"
};

firebase.initializeApp(firebaseConfig);

const apiKey = firebaseConfig.apiKey;
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();
const realtime = firebase.database();

export {auth, apiKey, firestore, storage, realtime};