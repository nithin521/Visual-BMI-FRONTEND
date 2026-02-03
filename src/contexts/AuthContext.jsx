import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../firebase.config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  async function signup(email, password, displayName) {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // Update profile with display name
    await updateProfile(userCredential.user, {
      displayName: displayName,
    });

    // Create user document in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      displayName: displayName,
      email: email,
      createdAt: new Date().toISOString(),
      preferences: {
        theme: "light",
        units: "metric", // metric or imperial
        notifications: true,
      },
    });

    return userCredential;
  }

  // Login with email and password
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Login with Google
  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    // Check if user document exists, if not create it
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", userCredential.user.uid), {
        displayName: userCredential.user.displayName,
        email: userCredential.user.email,
        photoURL: userCredential.user.photoURL,
        createdAt: new Date().toISOString(),
        preferences: {
          theme: "light",
          units: "metric",
          notifications: true,
        },
      });
    }

    return userCredential;
  }

  // Logout
  function logout() {
    return signOut(auth);
  }

  // Load user preferences from Firestore
  async function loadUserPreferences(uid) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUserPreferences(userDoc.data());
        return userDoc.data();
      }
    } catch (error) {
      console.error("Error loading user preferences:", error);
    }
    return null;
  }

  // Update user preferences
  async function updateUserPreferences(preferences) {
    if (!currentUser) return;

    try {
      const userRef = doc(db, "users", currentUser.uid);

      try {
        await updateDoc(userRef, {
          preferences: preferences,
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        if (error.code === "not-found") {
          // Document doesn't exist, create it
          await setDoc(userRef, {
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL || null,
            createdAt: new Date().toISOString(),
            preferences: preferences,
            bmiHistory: [],
            aiHistory: [],
          });
        } else {
          throw error;
        }
      }

      // Update local state
      setUserPreferences((prev) => ({
        ...prev,
        preferences: preferences,
      }));

      // Cache to localStorage
      const updatedData = {
        ...userPreferences,
        preferences: preferences,
      };
      localStorage.setItem(
        `userPrefs_${currentUser.uid}`,
        JSON.stringify(updatedData),
      );

      return true;
    } catch (error) {
      console.error("Error updating preferences:", error);
      throw error;
    }
  }

  // Save user data (BMI results, progress, etc.)
  async function saveUserData(dataType, data) {
    if (!currentUser) return;

    try {
      const userDataRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDataRef, {
        [`data.${dataType}`]: data,
        [`data.${dataType}_lastUpdated`]: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving user data:", error);
      throw error;
    }
  }

  async function addBMIRecord(record, type = "calculator") {
    if (!currentUser) return;

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const fieldName = type === "calculator" ? "bmiHistory" : "aiHistory";

      await updateDoc(userRef, {
        [fieldName]: arrayUnion(record),
      });
    } catch (error) {
      console.error("Error adding BMI record:", error);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadUserPreferences(user.uid);
      } else {
        setUserPreferences(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userPreferences,
    signup,
    login,
    loginWithGoogle,
    logout,
    loadUserPreferences,
    updateUserPreferences,
    saveUserData,
    addBMIRecord,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
