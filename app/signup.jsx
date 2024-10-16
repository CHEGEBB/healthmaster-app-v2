import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, 
  Dimensions, Modal, Platform, Image, ScrollView, KeyboardAvoidingView, Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createUser } from '../appwrite';
import LottieView from 'lottie-react-native';

const { height, width } = Dimensions.get('window');

const passwordStrengthLabels = {
  0: { label: 'Very Weak', color: '#ff4444' },
  1: { label: 'Weak', color: '#ffbb33' },
  2: { label: 'Medium', color: '#ffbb33' },
  3: { label: 'Strong', color: '#00C851' },
  4: { label: 'Very Strong', color: '#007E33' },
};

export default function SignUp() {
  const router = useRouter();
  const [focusedInput, setFocusedInput] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return Math.min(score, 4);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setPasswordStrength(calculatePasswordStrength(text));
  };

  const isPasswordValid = () => passwordStrength >= 2;

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    if (!isEmailValid(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!isPasswordValid()) {
      Alert.alert(
        'Weak Password',
        'Please choose a stronger password for better security.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const newUser = await createUser(email, password, username);
      
      if (newUser) {
        setShowConfetti(true);
        setTimeout(() => {
          setShowModal(true);
        }, 500);
        
        setTimeout(() => {
          setShowConfetti(false);
        }, 2000);
      } else {
        throw new Error('Failed to create user');
      }
    } catch (error) {
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error.message.includes('409')) {
        errorMessage = 'An account with this email already exists.';
      } else if (error.message.includes('400')) {
        errorMessage = 'Invalid email or password format.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPasswordStrengthBar = () => (
    <View style={styles.strengthBarContainer}>
      {[0, 1, 2, 3].map((index) => (
        <View
          key={index}
          style={[styles.strengthBarSegment, {
            backgroundColor: index < passwordStrength 
              ? passwordStrengthLabels[passwordStrength].color 
              : '#444',
          }]}
        />
      ))}
    </View>
  );

  const renderInput = (icon, placeholder, value, setValue, keyboardType = 'default', secureTextEntry = false, isPassword = false) => (
    <View>
      <Animated.View
        style={[styles.inputContainer, focusedInput === placeholder && styles.focusedInput, { transform: [{ translateY: slideAnim }] }]}
      >
        <Ionicons name={icon} size={24} color="#4BE3AC" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          onFocus={() => setFocusedInput(placeholder)}
          onBlur={() => setFocusedInput(null)}
          value={value}
          onChangeText={isPassword ? handlePasswordChange : setValue}
        />
      </Animated.View>
      {isPassword && password.length > 0 && (
        <View style={styles.passwordFeedbackContainer}>
          {renderPasswordStrengthBar()}
          <Text style={[styles.strengthText, { color: passwordStrengthLabels[passwordStrength].color }]}>
            {passwordStrengthLabels[passwordStrength].label}
          </Text>
          <Text style={styles.passwordRequirements}>
            For best security, use a mix of letters, numbers, and symbols.
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle-outline" size={32} color="#fff" />
        </TouchableOpacity>
        <View style={styles.imageWrapper}>
          <ImageBackground source={require('../assets/images/6.jpeg')} style={styles.Imagecontainer}>
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
              <View style={styles.imageWrapperHeader}>
              <View style={styles.overlay2}>
                <ImageBackground source={require('../assets/images/ab6.jpeg') } style={styles.imageContainerHeader}>
                <View style={styles.logo}>
                  <View style={styles.logimage} className="bg-gray-300 rounded-2xl border-cyan-400">
                  <Image source={require('../assets/images/healthmaster.png')} style={styles.lottie}/>
                  </View>
                  <View style={styles.nameContainer}>
                    <Text style={styles.nameText} >Health Master</Text>
                  </View>
                </View>
                </ImageBackground>
                </View>
              </View>
              <View style={styles.signupTextContainer}>
                <Text style={styles.signupText}>Sign Up</Text>
              </View>
              
              <View style={styles.FormContainer}>
                {renderInput('person-outline', 'Username', username, setUsername)}
                {renderInput('mail-outline', 'Email', email, setEmail, 'email-address')}
                {renderInput('lock-closed-outline', 'Password', password, setPassword, 'default', true, true)}
                <TouchableOpacity 
                  style={[styles.button, (!isPasswordValid() || !isEmailValid(email) || !username.trim() || isLoading) && styles.buttonDisabled]} 
                  onPress={handleSignUp}
                  disabled={!isPasswordValid() || !isEmailValid(email) || !username.trim() || isLoading}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Signing Up...' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/login')}>
                  <Text style={styles.loginLinkText}>
                    Already have an account? <Text style={styles.loginLinkHighlight}>Login here</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ImageBackground>
        </View>
      </ScrollView>
      {showConfetti && (
        <LottieView
          source={require('../assets/animations/confetti.json')}
          autoPlay
          loop={false}
          style={styles.confetti}
        />
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sign Up Successful! 🎉</Text>
            <Text style={styles.modalText}>Welcome to HealthMaster!</Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.loginButton]}
              onPress={() => {
                setShowModal(false);
                router.push('/login');
              }}
            >
              <Text style={styles.modalButtonText}>Login to your account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232533',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  overlay2: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
  
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  imageWrapper: {
    flex: 1,
    width: '100%',
    height: height,
  },
  imageWrapperHeader: {
    height: height * 0.3,
    width: '100%',
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flex: 1 / 2,
    shadowColor: '#2dd4bf',
    shadowOffset: {
      width: 2, 
      height: 10,
    },
    shadowOpacity: 0.25, 
    shadowRadius: 10, 
    elevation: 5,
  },
  imageContainerHeader: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  Imagecontainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  FormContainer: {
    flex: 1/2,
    width: '100%',
    paddingHorizontal: 20,
    top: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    height: 50,
  },
  focusedInput: {
    borderColor: '#4BE3AC',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4BE3AC',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#666',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#fff',
    fontSize: 14,
  },
  loginLinkHighlight: {
    color: '#4BE3AC',
    fontWeight: 'bold',
  },
  confetti: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#232533',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#4BE3AC',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#fff',
  },
  modalButton: {
    backgroundColor: '#4BE3AC',
    borderRadius: 10,
    padding: 15,
    minWidth: 200,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  lottie: {
    width: 60,
    height: 60,
    bottom: 5,
    alignSelf: 'center',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    top:"80%",
    width: '100%',
    left : '5%',
    gap: 2,
  },
  logimage :{
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 25,
    borderColor: '#2dd4bf',
    borderWidth: 2,
    overflow: 'hidden',
  },
  nameContainer: {
    marginLeft: 10,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: "Rubik-Bold",
  },
  signupTextContainer: {
    alignItems: 'flex-start',
    marginLeft: 25,
    marginBottom: 10,
  },
  signupText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4BE3AC',
    top: 20,

  },
  passwordFeedbackContainer: {
    marginTop: 5,
    marginBottom: 15,
  },
  strengthBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  strengthBarSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  strengthText: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'left',
  },
  passwordRequirements: {
    fontSize: 11,
    color: '#aaa',
    textAlign: 'left',
  },
});