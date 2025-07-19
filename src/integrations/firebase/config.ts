
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBzBrWBE_BzOhHGzq9xeVWF7mCpXgY5jKs",
  authDomain: "taskwise-n03h6.firebaseapp.com",
  projectId: "taskwise-n03h6",
  storageBucket: "taskwise-n03h6.firebasestorage.app",
  messagingSenderId: "213940587539",
  appId: "1:213940587539:web:3369067cd1b826be9dc3e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Firebase Functions and get a reference to the service
export const functions = getFunctions(app);

export default app;
