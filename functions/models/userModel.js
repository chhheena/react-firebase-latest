const admin = require("firebase-admin");
const db = admin.firestore();

/**
 * Create a new user in Firestore with custom fields
 * @param {Object} params
 * @param {string} params.uid - Firebase Auth UID (or phone)
 * @param {string} params.phone - User phone number (unique)
 * @param {string} params.name - Optional display name
 * @param {string} params.role - Optional role (admin/player)
 */
const createUser = async ({ uid, phone, name, role }) => {
  return db.collection("users").doc(phone).set({
    phone,                
    uid,                  
    name: name || "",
    role: role || "player",
    linkedPhones: [],     
    gameCredits: {},      
    playHistory: [],      
    preferredLanguage: "en",
    interfaceSettings: { theme: "light", showTimer: true },
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  });
};

module.exports = { createUser };
