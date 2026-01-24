import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyAT71FksZpYMx9cLOLP13kuI9OqN0nFLcM",
  authDomain: "aptitude-game-site-f5edb.firebaseapp.com",
  projectId: "aptitude-game-site-f5edb",
  storageBucket: "aptitude-game-site-f5edb.firebasestorage.app",
  messagingSenderId: "409441420415",
  appId: "1:409441420415:web:5a93c7f4496b3559f16b4a",
  measurementId: "G-EPFW7YW60V"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);



