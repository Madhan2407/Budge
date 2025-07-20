import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC5ZNgwfDCD2x48-sEFDJ4zDkqnpQmPRyw",
  authDomain: "budge-4a164.firebaseapp.com",
  projectId: "budge-4a164",
  storageBucket: "budge-4a164.firebasestorage.app",
  messagingSenderId: "907191172914",
  appId: "1:907191172914:web:282b9f24b638ad20a3212b",
  measurementId: "G-ZNZ4C5F6QH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// For development, you can use Firebase emulators
// Uncomment these lines if you want to use local emulators
// if (location.hostname === 'localhost') {
//   connectAuthEmulator(auth, 'http://localhost:9099');
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

export default app;