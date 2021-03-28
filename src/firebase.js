import firebase from "firebase/app";
import "firebase/auth";

const app = firebase.initializeApp({
  //   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  //   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  //   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  //   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  //   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  //   appId: process.env.REACT_APP_FIREBASE_APP_ID,
  apiKey: "AIzaSyAtGbqupi0UOiljI6KdWb2NEZAdzd0UKcQ",
  authDomain: "auth-development-env.firebaseapp.com",
  projectId: "auth-development-env",
  storageBucket: "auth-development-env.appspot.com",
  messagingSenderId: "254554328802",
  appId: "1:254554328802:web:611056b3632eb37a1098bb",
});

export const auth = app.auth();
export default app;
