const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

// Initialize Firebase Admin with the service account credentials
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});

module.exports = admin;
