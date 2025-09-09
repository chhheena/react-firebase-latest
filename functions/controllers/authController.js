const { admin, firestore, rtdb } = require("../config/firebaseAdmin");

const signup = async (req, res) => {
  try {
    const { phone, password, name, role } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ success: false, message: "Phone and password are required" });
    }

    // 1️⃣ Check if user exists in Firestore
    const userDoc = await firestore.collection("users").doc(phone).get();
    if (userDoc.exists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // 2️⃣ Create user in Firebase Auth
    const user = await admin.auth().createUser({
      uid: phone,
      phoneNumber: phone,
      password,
      displayName: name || "",
    });

    // 3️⃣ Save user in Firestore (permanent storage)
    const userData = {
      phone,
      uid: user.uid,
      name: name || "",
      role: role || "player",
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      linkedPhones: [],
      gameCredits: {},   // shop credits
      coupons: [],       // coupons list
      playHistory: [],
      preferredLanguage: "en",
      interfaceSettings: { theme: "light", showTimer: true },
    };

    await firestore.collection("users").doc(phone).set(userData);

    // 4️⃣ Initialize user in RTDB (for real-time game)
    await rtdb.ref("users/" + phone).set({ 
      isOnline: false, 
      currentGame: null 
    });

    res.json({ success: true, uid: user.uid });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


// Login Controller
const login = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone is required" });
    }

    // Check Firestore user
    const userDoc = await firestore.collection("users").doc(phone).get();
    if (!userDoc.exists) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // Create custom token
    const customToken = await admin.auth().createCustomToken(phone);

    const lastActive = new Date().toISOString();

    // Update Firestore
    await firestore.collection("users").doc(phone).update({ lastActiveAt: lastActive });

    // Update RTDB for real-time games
    await rtdb.ref("users/" + phone).update({ isOnline: true, lastActiveAt: lastActive });

    res.json({ success: true, token: customToken, uid: phone });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Login failed", error: err.message });
  }
};

module.exports = { signup, login };
