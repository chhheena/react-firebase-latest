// routes/authRoutes.js
const { onRequest } = require("firebase-functions/v2/https");
const { signup, login } = require("../controllers/authController");

exports.signup = onRequest(signup);
exports.login = onRequest(login);
