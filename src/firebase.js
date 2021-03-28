import firebase from "firebase/app";
import "firebase/auth";

const app = firebase.initializeApp({ 
  apiKey: "AIzaSyCpuTti-_w9NnS-O4LFXWVlOZp6YEOe9Zg",
  authDomain: "orders-f1805.firebaseapp.com",
  projectId: "orders-f1805",
  storageBucket: "orders-f1805.appspot.com",
  messagingSenderId: "135728280874",
  appId: "1:135728280874:web:776012b7577a67e2625a53",
});

export const auth = app.auth();
export default app;
