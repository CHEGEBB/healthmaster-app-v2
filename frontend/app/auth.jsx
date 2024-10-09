import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ImageBackground, StyleSheet, Dimensions,
  TextInput, TouchableOpacity, Animated, Keyboard,
  KeyboardAvoidingView, Platform, ScrollView, Modal, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

export default function AuthScreen() {
  const router = useRouter();
  const [isNewUser, setIsNewUser] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
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
  };

  const handleAuth = async () => {
    if (!email || !password || (isNewUser && !name)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      if (isNewUser) {
        // Create new user
        const response = await fetch('http://192.168.205.123:5000/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create account');
        }
        
        Alert.alert('Success', 'Account created successfully. You can now log in.');
        setIsNewUser(false); 
      } else {
        // Login existing user
        const response = await fetch('http://192.168.205.123:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error('Failed to log in');
        }
        
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          router.push('/started');
        }, 3000);
      }
    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserType = () => {
    setIsNewUser(!isNewUser);
    setName('');
    setEmail('');
    setPassword('');
  };

  const renderInput = (icon, placeholder, value, onChangeText, keyboardType = 'default', secureTextEntry = false) => (
    <Animated.View
      style={[
        styles.inputContainer,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <Ionicons name={icon} size={24} color="#4BE3AC" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={require("../assets/images/register.png")}
        style={styles.backgroundPattern}
      >
        <View style={styles.overlay}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.imageWrapper}>
              <ImageBackground
                source={require("../assets/images/back.webp")}
                style={styles.Imagecontainer}
              >
                <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
              </ImageBackground>
            </View>

            <Animated.View style={styles.ContentContainer}>
              <View style={styles.logoContainer}>
                <LottieView
                  source={require('../assets/animations/logo.json')}
                  autoPlay
                  loop
                  style={styles.logoAnimation}
                />
                <Text style={styles.logoText}>Health Master</Text>
              </View>
              
              <View style={styles.authTypeContainer}>
                <Text style={styles.authTypeText}>
                  {isNewUser ? 'Create Account' : 'Welcome Back!'}
                </Text>
              </View>

              {!isNewUser ? (
                <>
                  {renderInput('mail-outline', 'Email', email, setEmail, 'email-address')}
                  {renderInput('lock-closed-outline', 'Password', password, setPassword, 'default', true)}
                  <TouchableOpacity 
                    style={[styles.authButton, isLoading && styles.authButtonDisabled]}
                    onPress={handleAuth}
                    disabled={isLoading}
                  >
                    <Text style={styles.authButtonText}>
                      {isLoading ? 'Processing...' : 'Log In'}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {renderInput('person-outline', 'Full Name', name, setName)}
                  {renderInput('mail-outline', 'Email', email, setEmail, 'email-address')}
                  {renderInput('lock-closed-outline', 'Password', password, setPassword, 'default', true)}
                  <TouchableOpacity 
                    style={[styles.authButton, isLoading && styles.authButtonDisabled]}
                    onPress={handleAuth}
                    disabled={isLoading}
                  >
                    <Text style={styles.authButtonText}>
                      {isLoading ? 'Processing...' : 'Sign Up'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              
              <TouchableOpacity onPress={toggleUserType}>
                <Text style={styles.switchAuthText} className="text-emerald-500">
                  {isNewUser ? 'Already have an account? Log in' : 'Need an account? Sign up'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </View>
      </ImageBackground>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LottieView
              source={require('../assets/animations/loading.json')}
              autoPlay
              loop={false}
              style={styles.loadingAnimation}
            />
            <Text style={styles.modalText}>
              {isNewUser ? 'Welcome to Health Master!' : 'Welcome Back!'}
            </Text>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundPattern: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(22, 22, 34, 0.5)',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  imageWrapper: {
    height: height * 0.4,
    width: '100%',
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  Imagecontainer: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  ContentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -50,
    alignSelf: 'flex-start',
    marginLeft: -10,
  },
  logoAnimation: {
    width: 50,
    height: 50,
    marginTop: -40,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 5,
    marginTop: -40,
    fontFamily: 'Poppins-Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 10,
  },
  authButton: {
    backgroundColor: '#4BE3AC',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  authButtonDisabled: {
    backgroundColor: 'gray',
  },
  authButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchAuthText: {
    color: '#fff',
    marginTop: 15,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingAnimation: {
    width: 100,
    height: 100,
  },
  modalText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  authTypeText :{
    color: '#4BE3AC',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  }
});
