const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

const getPrivateKey = () => {
  const key = process.env.FIREBASE_PRIVATE_KEY;
  if (!key) {
    console.error('FIREBASE_PRIVATE_KEY is not set in the environment variables');
    return null;
  }
  // Remove quotes from start and end if present
  let privateKey = key.replace(/^["']|["']$/g, '');
  // Replace literal \n with actual newlines if necessary
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.split('\\n').join('\n');
  }
  return privateKey;
};

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: getPrivateKey(),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

if (serviceAccount.private_key) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DB_URL,
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
} else {
  console.error('Failed to initialize Firebase Admin due to missing private key');
}

module.exports = admin;