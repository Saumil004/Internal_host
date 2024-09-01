import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCVs1HZ2x7ZLtkq6MM6CgzmW-uSr9_wHH4",
  authDomain: "newapp-4316b.firebaseapp.com",
  projectId: "newapp-4316b",
  storageBucket: "newapp-4316b.appspot.com",
  messagingSenderId: "472257499265",
  appId: "1:472257499265:web:7819d317428edcd4c1bd80",
  measurementId: "G-4J37JZFSQX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const isAuthenticated = () => {
  return !!auth.currentUser; // Checks if a user is currently signed in
};


export { db, auth, isAuthenticated};
