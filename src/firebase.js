import firebase from "firebase/app";
import "firebase/auth";

const app = firebase.initializeApp({ 
  apiKey: "AIzaSyA8N2XJRf6iQ2tUJT3LtzUCcVzFbtJgl2w",
  authDomain: "orderinteams.firebaseapp.com",
  projectId: "orderinteams",
  storageBucket: "orderinteams.appspot.com",
  messagingSenderId: "124756348342",
  appId: "1:124756348342:web:3d2bc3bd1cff288cccc517",
});

export const auth = app.auth();
export default app;
