const admin = require("firebase-admin");
const serviceAccount = require("../jawabyantest-firebase-adminsdk-fbsvc-8171e781c1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jawabeen-80492-default-rtdb.firebaseio.com",
  storageBucket: "jawabeen-80492.appspot.com", // <- yaha aapka bucket name
});

// Exports
const firestore = admin.firestore();
const rtdb = admin.database();
const db = rtdb;
const storage = admin.storage(); // ab storage.bucket() call possible hai

module.exports = { admin, firestore, rtdb, db, storage };
