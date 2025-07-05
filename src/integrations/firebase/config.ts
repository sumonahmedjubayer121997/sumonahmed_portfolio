
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBzpfzyxJiIcKfoHmkDIfe6mOLKpeVpwno",
  authDomain: "todoapp-a512d.firebaseapp.com",
  projectId: "todoapp-a512d",
  storageBucket: "todoapp-a512d.firebasestorage.app",
  messagingSenderId: "447087261794",
  appId: "1:447087261794:web:914333a73fb5d64a87393b",
  measurementId: "G-0M2MJSPKTK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
