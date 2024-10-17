import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Started = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = new Animated.Value(0);

  const content = [
    {
      title: "Never Miss a Dose",
      description: "Set reminders for all your medications and stay on track with your health.",
      icon: "medical-outline"
    },
    {
      title: "Track Your Appointments",
      description: "Keep all your medical appointments organized in one place.",
      icon: "calendar-outline"
    },
    {
      title: "Monitor Your Health",
      description: "Log and visualize your vital signs and health metrics over time.",
      icon: "stats-chart-outline"
    },
    {
      title: "Connect with Caregivers",
      description: "Share your health information securely with family members or healthcare providers.",
      icon: "people-outline"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true })
    ]).start();
  }, [currentIndex]);

  const handleGetStarted = () => {
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground source={require('../assets/images/pillss.jpeg')} style={styles.imageContainer}>
        <View style={styles.overlay}>
          <View style={styles.contentContainer}>
            <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
              <Ionicons name={content[currentIndex].icon} size={60} color="#4BE3AC" style={styles.icon} />
              <Text style={styles.textTitle}>
                {content[currentIndex].title}
              </Text>
              <Text style={styles.textDescription}>
                {content[currentIndex].description}
              </Text>
            </Animated.View>
            <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
              <Text style={styles.buttonText}>Get Started Now</Text>
              <Ionicons name="arrow-forward" size={24} color="#161622" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Started;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'Poppins-Regular',

  },
  imageContainer: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(22, 22, 34, 0.7)',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
    fontFamily: 'Poppins-Regular',

  },
  icon: {
    marginBottom: 20,
  },
  textTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',

  },
  textDescription: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Rubik-Regular',

  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4BE3AC',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#4BE3AC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#161622',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});