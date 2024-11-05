import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAmYRo5T2w_jsrPvznFuPULLGBv9J7jkis",
  authDomain: "newproject-d7ad0.firebaseapp.com",
  projectId: "newproject-d7ad0",
  storageBucket: "newproject-d7ad0.firebasestorage.app",
  messagingSenderId: "982016168269",
  appId: "1:982016168269:web:93c56b99a68ee0d62ae704",
  measurementId: "G-3XQVP3CQCZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable persistence
auth.setPersistence('local');

// Initialize auth state
auth.onAuthStateChanged((user) => {
  console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
});