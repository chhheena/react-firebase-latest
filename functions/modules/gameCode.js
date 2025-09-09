// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.gameCode = functions.https.onCall(async (data, context) => {
  const { code } = data;
  if (!code) throw new functions.https.HttpsError('invalid-argument', 'Code is required');

  // Check code in Firestore
  const codeDoc = await db.collection("gameCodes").doc(code).get();
  if (!codeDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Invalid game code');
  }

  return { valid: true, code: codeDoc.id, data: codeDoc.data() };
});
