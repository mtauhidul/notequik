import { db } from "@/firebase/firebase";
import {
  doc,
  getDoc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

// Save or update user in Firestore
export const saveUser = async (email) => {
  try {
    const userRef = doc(db, "users", email);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // User exists, update visit count and last seen
      await updateDoc(userRef, {
        lastSeen: serverTimestamp(),
        visitCount: increment(1),
      });
      return { isNewUser: false, userData: userDoc.data() };
    } else {
      // New user, create document
      const newUserData = {
        email,
        firstSeen: serverTimestamp(),
        lastSeen: serverTimestamp(),
        visitCount: 1,
        notesGenerated: 0,
      };

      await setDoc(userRef, newUserData);

      // Update global stats for new user
      await updateGlobalStats({ newUser: true });

      return { isNewUser: true, userData: newUserData };
    }
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
};

// Update user's notes generated count
export const incrementUserNotes = async (email) => {
  try {
    const userRef = doc(db, "users", email);
    await updateDoc(userRef, {
      notesGenerated: increment(1),
    });

    // Update global stats for new note
    await updateGlobalStats({ newNote: true });
  } catch (error) {
    console.error("Error updating user notes:", error);
    throw error;
  }
};

// Update global statistics
export const updateGlobalStats = async ({
  newUser = false,
  newNote = false,
}) => {
  try {
    const statsRef = doc(db, "stats", "global");
    const updateData = {};

    if (newUser) {
      updateData.totalUsers = increment(1);
    }

    if (newNote) {
      updateData.totalNotes = increment(1);
    }

    if (Object.keys(updateData).length > 0) {
      await updateDoc(statsRef, updateData);
    }
  } catch (error) {
    // If document doesn't exist, create it
    if (error.code === "not-found") {
      const initialData = {
        totalUsers: newUser ? 1 : 0,
        totalNotes: newNote ? 1 : 0,
        lastUpdated: serverTimestamp(),
      };

      await setDoc(doc(db, "stats", "global"), initialData);
    } else {
      console.error("Error updating global stats:", error);
      throw error;
    }
  }
};

// Get global statistics
export const getGlobalStats = async () => {
  try {
    const statsRef = doc(db, "stats", "global");
    const statsDoc = await getDoc(statsRef);

    if (statsDoc.exists()) {
      return statsDoc.data();
    } else {
      return { totalUsers: 0, totalNotes: 0 };
    }
  } catch (error) {
    console.error("Error fetching global stats:", error);
    return { totalUsers: 0, totalNotes: 0 };
  }
};

// Local storage utilities
export const getUserEmailFromStorage = () => {
  return localStorage.getItem("notequik_user_email");
};

export const saveUserEmailToStorage = (email) => {
  localStorage.setItem("notequik_user_email", email);
};

export const clearUserEmailFromStorage = () => {
  localStorage.removeItem("notequik_user_email");
};
