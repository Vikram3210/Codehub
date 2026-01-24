// src/services/firebase.js - FINAL CORRECTED CODE

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// ------------------- Firebase Config -------------------
const firebaseConfig = {
  // Use your actual config here
  apiKey: "AIzaSyDwvfidCEamvwCJ3j23PJJTf5aiKW102Zc",
  authDomain: "code-learning-app-fa86a.firebaseapp.com",
  projectId: "code-learning-app-fa86a",
  storageBucket: "code-learning-app-fa86a.appspot.com",
  messagingSenderId: "597658737138",
  appId: "1:597658737138:web:90a5c0fe196443b76c736b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ------------------- Helper/Gamification Logic -------------------

function calculateNewLevel(currentXP, xpGained) {
  const totalXP = currentXP + xpGained;
  let newLevel = 1;

  if (totalXP >= 500) newLevel = 3;
  else if (totalXP >= 150) newLevel = 2;
  
  return newLevel;
}

// ------------------- Auth Functions -------------------

/** Fetches user profile data including role and XP from Firestore */
export async function fetchUserProfile(uid) {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
}

/** Registers a new user with email/password and saves their info to Firestore */
export async function register(email, password, username) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName: username });
  await sendEmailVerification(user);

  // Save user info to Firestore with default role/XP/Level
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email,
    username,
    role: 'student', // Default Role for RBAC
    xp: 0, // Initial Gamification XP
    currentLevel: 1, // Initial Gamification Level
    createdAt: new Date().toISOString(),
  });

  return user;
}

/** Logs in user with email/password */
export async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/** Logs in user with Google and creates Firestore entry if new */
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  // Create Firestore record only if user doesn't exist
  if (!userSnap.exists()) {
    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email,
        username: user.displayName || user.email,
        avatarUrl: user.photoURL || null,
        role: 'student', // Default Role for RBAC
        xp: 0, // Initial Gamification XP
        currentLevel: 1, // Initial Gamification Level
        createdAt: new Date().toISOString(),
      }
    );
  }
  return user;
}

/** Logs out the current user */
export function logout() {
  return signOut(auth);
}

// ------------------- Firestore/Data Functions -------------------

/**
 * Updates user's global XP, level, and marks a challenge as complete.
 */
export async function updateChallengeCompletion(uid, lang, challengeId, xpAmount) {
  const userRef = doc(db, 'users', uid);

  // 1. Get current user data
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    throw new Error('User profile not found.');
  }
  const userData = userSnap.data();

  // 2. Check if already complete to prevent double XP
  const completedChallenges = userData.completedChallenges || {};
  const currentLangChallenges = new Set(completedChallenges[lang] || []);
  
  if (currentLangChallenges.has(challengeId)) {
      console.log('Challenge already completed. Skipping XP update.');
      return userData; 
  }
  
  // 3. Calculate New XP and Level
  const currentGlobalXP = userData.xp || 0;
  const newGlobalXP = currentGlobalXP + xpAmount;
  const newLevel = calculateNewLevel(currentGlobalXP, xpAmount);
  
  // 4. Update Progress Array
  currentLangChallenges.add(challengeId);

  // 5. Prepare and commit the update
  const updatedData = {
    xp: newGlobalXP,
    currentLevel: newLevel,
    completedChallenges: {
      ...completedChallenges,
      [lang]: Array.from(currentLangChallenges),
    },
  };

  await updateDoc(userRef, updatedData);
  
  return updatedData;
}