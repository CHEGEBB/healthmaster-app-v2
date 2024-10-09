const admin = require('../config/firebase');

// Signup User
exports.signupUser = async (req, res) => {
  const { email, password, displayName } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: displayName,
    });

    res.status(201).json({ message: 'User created successfully', user: userRecord });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
};

// Login User with Email and Password
exports.loginUser = async (req, res) => {
    const { email, password } = req.body; // Get email and password from request body
  
    try {
      // Sign in with email and password
      const userRecord = await admin.auth().getUserByEmail(email);
      const token = await admin.auth().createCustomToken(userRecord.uid); // Create a custom token if needed
      
      // Optionally, you could return user info instead of token
      res.status(200).json({ token, user: userRecord });
    } catch (error) {
      res.status(400).json({ message: 'Error logging in user', error: error.message });
    }
  };
  
