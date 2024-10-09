import React, { useEffect, useRef } from 'react';
import { View, Text, ImageBackground, Animated, StyleSheet, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

const AnimatedPhrase = ({ phrases }) => {
  const fadeAnim = useRef(phrases.map(() => new Animated.Value(0))).current;
  const [currentIndex, setCurrentIndex] = React.useState(0);

  useEffect(() => {
    const animate = (index) => {
      Animated.sequence([
        Animated.timing(fadeAnim[index], { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(fadeAnim[index], { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(fadeAnim[index], { toValue: 0, duration: 1000, useNativeDriver: true }),
      ]).start(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
      });
    };

    animate(currentIndex);
  }, [currentIndex]);

  return (
    <View style={styles.animatedPhraseContainer}>
      {phrases.map((phrase, index) => (
        <Animated.Text
          key={index}
          style={[
            styles.animatedPhrase,
            { opacity: fadeAnim[index], display: index === currentIndex ? 'flex' : 'none' }
          ]}
        >
          {phrase}
        </Animated.Text>
      ))}
    </View>
  );
};

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedPhrases = [
    "Your Health, Your Way",
    "Empowering Wellness",
    "Smart Health Decisions",
    "Medication Reminders"
  ];

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/new6.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <Animated.View style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ]
            }
          ]}>
            <View style={styles.logoContainer}>
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <View style={styles.logoWrapper}>
                  <Image source={require('../assets/images/healthmaster.png')} style={styles.logo}/>
                </View>
              </Animated.View>
            </View>
            <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
              Health Master
            </Animated.Text>
            <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
              Where Care and Convenience Converge
            </Animated.Text>
            
            <AnimatedPhrase phrases={animatedPhrases} />
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoWrapper: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 75,
    padding: 10,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Outfit-Bold',
  },
  tagline: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
  },
  animatedPhraseContainer: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  animatedPhrase: {
    color: '#4BE3AC',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
});

export default SplashScreen;