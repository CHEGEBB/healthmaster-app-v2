const admin = require('../config/firebase');

exports.createUserProfile = async (uid, data) => {
  const db = admin.firestore();
  await db.collection('users').doc(uid).set(data);
};

exports.getUserProfile = async (uid) => {
  const db = admin.firestore();
  const userDoc = await db.collection('users').doc(uid).get();

  if (!userDoc.exists) {
    throw new Error('User not found');
  }

  return userDoc.data();
};
