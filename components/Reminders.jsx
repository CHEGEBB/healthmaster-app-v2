import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, 
  Animated, ImageBackground, Dimensions, Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const medicationReminders = [
  {
    id: 1,
    name: 'Lisinopril',
    time: '08:00 AM',
    details: 'Take with food. Avoid grapefruit.',
    image: require('../assets/images/lisinopril.jpeg'),
    completed: false,
    color: '#FF6B6B',
  },
  {
    id: 2,
    name: 'Metformin',
    time: '01:00 PM',
    details: 'Take with meals to reduce stomach upset.',
    image: require('../assets/images/metformin.jpeg'),
    completed: false,
    color: '#4ECDC4',
  },
  {
    id: 3,
    name: 'Atorvastatin',
    time: '08:00 PM',
    details: 'Take at bedtime. Avoid grapefruit juice.',
    image: require('../assets/images/pillss.jpeg'),
    completed: false,
    color: '#FFB900',
  },
];

const MedicationReminders = () => {
  const [reminders, setReminders] = useState(medicationReminders);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [showAllReminders, setShowAllReminders] = useState(false);
  const [confettiVisible, setConfettiVisible] = useState(false);
  
  const navigation = useNavigation();
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startPulseAnimation();
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const openModal = (reminder) => {
    setSelectedReminder(reminder);
    setModalVisible(true);
    Animated.spring(scaleAnimation, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(scaleAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedReminder(null);
      setConfettiVisible(false);
    });
  };

  const markAsComplete = (id) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, completed: true } : reminder
    ));
    setConfettiVisible(true);
    setTimeout(closeModal, 2000);
  };

  const toggleShowAll = () => {
    setShowAllReminders(!showAllReminders);
    Animated.timing(slideAnimation, {
      toValue: showAllReminders ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const ReminderCard = ({ reminder }) => (
    <Animated.View
      style={[
        styles.reminderItem,
        {
          transform: [{ scale: reminder.id === 1 ? pulseAnimation : 1 }],
        },
      ]}
    >
      <BlurView intensity={80} style={styles.blurContainer}>
        <TouchableOpacity onPress={() => openModal(reminder)} style={styles.reminderContent}>
          <Image source={reminder.image} style={styles.reminderImage} />
          <View style={styles.reminderInfo}>
            <Text style={styles.reminderName}>{reminder.name}</Text>
            <Text style={styles.reminderTime}>{reminder.time}</Text>
            <View style={[styles.statusIndicator, { backgroundColor: reminder.color }]} />
          </View>
          {reminder.completed && (
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" style={styles.completedIcon} />
          )}
        </TouchableOpacity>
      </BlurView>
    </Animated.View>
  );

  const displayedReminders = showAllReminders ? reminders : reminders.slice(0, 2);

  return (
    // <ImageBackground
    //   source={require('../assets/images/app.png')}
    //   style={styles.container}
    //   resizeMode="cover"
    // >
      <View intensity={20} style={styles.contentContainer}>
        <Animated.View style={styles.headerContainer}>
          <Text style={styles.title}>Today's Important Medications</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={toggleShowAll}
            >
              <Ionicons 
                name={showAllReminders ? "chevron-up-circle" : "chevron-down-circle"} 
                size={24} 
                color="#FFF" 
              />
              <Text style={styles.actionButtonText}>
                {showAllReminders ? 'Show Less' : 'See All'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.addButton]}
              onPress={() => navigation.navigate('reminders')}
            >
              <Ionicons name="add-circle" size={24} color="#FFF" />
              <Text style={styles.actionButtonText}>Add New</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.ScrollView
          style={[
            styles.reminderList,
            {
              transform: [
                {
                  translateY: slideAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 20],
                  }),
                },
              ],
            },
          ]}
        >
          {displayedReminders.map(reminder => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))}
        </Animated.ScrollView>

        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <BlurView intensity={90} style={styles.modalContainer}>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ scale: scaleAnimation }],
                },
              ]}
            >
               <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
              {selectedReminder && (
                <ScrollView contentContainerStyle={styles.modalScroll}>
                  <View style={styles.modalImageContainer}>
                    <Image
                      source={selectedReminder.image}
                      style={styles.modalMedicationImage}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.modalInfoContainer}>
                    <Text style={styles.modalMedicationName}>{selectedReminder.name}</Text>
                    <View style={styles.infoRow}>
                      <Ionicons name="time" size={24} color="#4A90E2" />
                      <Text style={styles.infoText}>Time: {selectedReminder.time}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="information-circle" size={24} color="#4A90E2" />
                      <Text style={styles.infoText}>Details: {selectedReminder.details}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.takeNowButton}
                      onPress={() => markAsComplete(selectedReminder.id)}
                    >
                      <Text style={styles.takeNowButtonText}>I'll take it now</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            </Animated.View>
          </BlurView>
        </Modal>

        {confettiVisible && (
          <LottieView
            source={require('../assets/animations/confetti.json')}
            autoPlay
            loop={false}
            style={styles.confetti}
          />
        )}
      </View>
    // </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT* 0.8,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 10,
    width: '48%',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: 'rgba(74, 144, 226, 0.3)',
  },
  actionButtonText: {
    color: '#FFF',
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
  },
  reminderList: {
    flex: 1,
  },
  blurContainer: {
    borderRadius: 20,
    // overflow: 'hidden',
    marginBottom: 15,
  },
  reminderItem: {
    marginBottom: 15,
    borderRadius: 30,
    width: '100%',

  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  reminderImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  reminderTime: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.8,
  },
  statusIndicator: {
    position: 'absolute',
    right: 0,
    top: '50%',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(22, 22, 34, 0.9)',
    borderRadius: 25,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalScroll: {
    flexGrow: 1,
  },
  modalImageContainer: {
    marginBottom: 20,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.9,
    resizeMode: 'cover',
  },
  modalMedicationImage: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_WIDTH * 0.5,
    borderRadius: 20,
  },
  modalInfoContainer: {
    alignItems: 'center',
  },
  modalMedicationName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#FFF',
    marginLeft: 10,
  },
  takeNowButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
  },
  takeNowButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default MedicationReminders;