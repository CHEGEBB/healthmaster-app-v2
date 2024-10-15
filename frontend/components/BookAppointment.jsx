import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import LottieView from 'lottie-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import { createAppointment } from '../appwrite';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const BookAppointment = ({ navigation }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reason, setReason] = useState('');
  const [severity, setSeverity] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDoctorDetails, setShowDoctorDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const cardScale = useSharedValue(1);

  const doctors = [
    { id: 1, name: 'Dr. John Anderson', specialization: 'Cardiologist', image: require('../assets/images/ab.jpeg'), rating: 4.8, patients: 1000, availability: '9:00 AM - 5:00 PM', about: 'Dr. John Anderson is a renowned cardiologist with over 15 years of experience in treating cardiovascular diseases.' },
    { id: 2, name: 'Dr. Jane Smith', specialization: 'Dermatologist', image: require('../assets/images/as.jpeg'), rating: 4.9, patients: 1200, availability: '10:00 AM - 6:00 PM', about: 'Dr. Jane Smith is a board-certified dermatologist specializing in both medical and cosmetic dermatology.' },
    { id: 3, name: 'Dr. Mike Johnson', specialization: 'Pediatrician', image: require('../assets/images/am.jpeg'), rating: 4.7, patients: 800, availability: '8:00 AM - 4:00 PM', about: 'Dr. Mike Johnson is a caring pediatrician dedicated to providing comprehensive healthcare for children from infancy through adolescence.' },
    { id: 4, name: 'Dr. Sarah Brown', specialization: 'Neurologist', image: require('../assets/images/ab2.jpeg'), rating: 4.6, patients: 950, availability: '11:00 AM - 7:00 PM', about: 'Dr. Sarah Brown is an experienced neurologist specializing in the diagnosis and treatment of disorders of the nervous system.' },
    { id: 5, name: 'Dr. Michael Davis', specialization: 'Gynecologist', image: require('../assets/images/as2.jpeg'), rating: 4.9, patients: 1100, availability: '10:00 AM - 6:00 PM', about: 'Dr. Michael Davis is a board-certified gynecologist specializing in the management of reproductive issues.' },
  ];

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: cardScale.value }],
    };
  });

  const renderDoctorCard = useCallback(({ item }) => (
    <AnimatedTouchableOpacity
      key={item.id}
      style={[styles.doctorCard, animatedCardStyle, selectedDoctor?.id === item.id && styles.selectedDoctorCard]}
      onPress={() => {
        setSelectedDoctor(item);
        setShowDoctorDetails(true);
        cardScale.value = withSpring(1.05, {}, () => {
          cardScale.value = withSpring(1);
        });
      }}
    >
      <Image source={item.image} style={styles.doctorCardImage} />
      <View style={styles.doctorCardDetails}>
        <Text style={styles.doctorCardName}>{item.name}</Text>
        <Text style={styles.doctorCardSpecialization}>{item.specialization}</Text>
        <View style={styles.doctorCardRating}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.doctorCardRatingText}>{item.rating}</Text>
        </View>
      </View>
      {selectedDoctor?.id === item.id && (
        <View style={styles.selectedDoctorIndicator}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        </View>
      )}
    </AnimatedTouchableOpacity>
  ), [selectedDoctor, cardScale]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || new Date();
    setShowTimePicker(false);
    setSelectedDate(currentTime);
  };

  const handleBookAppointment = useCallback(async () => {
    if (selectedDoctor && selectedDate && reason && severity) {
      setIsLoading(true);
      try {
        const appointmentDetails = {
          doctorId: selectedDoctor.id.toString(),
          doctorName: selectedDoctor.name,
          doctorSpecialization: selectedDoctor.specialization,
          date: selectedDate.toISOString(),
          reason: reason,
          severity: severity,
        };

        
        const response = await createAppointment(appointmentDetails);

        console.log('Appointment booked:', response);

        
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.goBack();
        }, 3000);
      } catch (error) {
        console.error('Error booking appointment:', error);
        Alert.alert('Error', 'Failed to book appointment. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert('Incomplete Information', 'Please fill in all fields before booking the appointment.');
    }
  }, [selectedDoctor, selectedDate, reason, severity, navigation]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Image
          source={require('../assets/images/6.jpeg')}
          style={styles.headerImage}
        />
        <View style={styles.headerOverlay}>
          <Text style={styles.headerTitle}>Book Appointment</Text>
        </View>
      </View>

      <Animated.View 
        style={styles.content}
        entering={FadeIn.duration(500)}
      >
        <Text style={styles.sectionTitle}>Select a Doctor</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.doctorList}
        >
          {doctors.map((doctor) => renderDoctorCard({ item: doctor }))}
        </ScrollView>

        <TouchableOpacity style={styles.dateSelection} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
          <Text style={styles.dateSelectionText}>
            {selectedDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateSelection} onPress={() => setShowTimePicker(true)}>
          <Ionicons name="time-outline" size={24} color="#4CAF50" />
          <Text style={styles.dateSelectionText}>
            {selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Reason for appointment"
          placeholderTextColor="#CCCCCC"
          value={reason}
          onChangeText={setReason}
        />

        <View style={styles.severitySelection}>
          <Text style={styles.sectionTitle}>Condition Severity</Text>
          <View style={styles.severityOptions}>
            {['Mild', 'Moderate', 'Severe'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.severityOption,
                  severity === option && styles.selectedSeverityOption
                ]}
                onPress={() => setSeverity(option)}
              >
                <Text style={[
                  styles.severityOptionText,
                  severity === option && styles.selectedSeverityOptionText
                ]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.bookButton} 
          onPress={handleBookAppointment}
          disabled={isLoading}
        >
          <Text style={styles.bookButtonText}>
            {isLoading ? 'Booking...' : 'Book Appointment'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <Modal
        visible={showDoctorDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDoctorDetails(false)}
      >
        <View style={styles.modalContainer}>
          <BlurView intensity={80} style={styles.modalBlur}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Doctor Details</Text>
              {selectedDoctor && (
                <>
                  <Image source={selectedDoctor.image} style={styles.modalDoctorImage} />
                  <Text style={styles.modalDoctorName}>{selectedDoctor.name}</Text>
                  <Text style={styles.modalDoctorSpecialization}>{selectedDoctor.specialization}</Text>
                  <View style={styles.modalDoctorRating}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.modalDoctorRatingText}>{selectedDoctor.rating}</Text>
                  </View>
                  <Text style={styles.modalDoctorAbout}>{selectedDoctor.about}</Text>
                </>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowDoctorDetails(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>

      <Modal
        visible={showSuccessModal}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <BlurView intensity={80} style={styles.modalBlur}>
            <View style={styles.successModalContent}>
              <LottieView
                source={require('../assets/animations/success.json')}
                autoPlay
                loop={false}
                style={styles.successAnimation}
              />
              <Text style={styles.successText}>Appointment Booked Successfully!</Text>
              <Text style={styles.successDetails}>
                {`Doctor: ${selectedDoctor?.name}\nDate: ${selectedDate.toLocaleDateString()}\nTime: ${selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              </Text>
            </View>
          </BlurView>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  contentContainer: {
    paddingBottom: 80,
  },
  header: {
    height: SCREEN_HEIGHT * 0.4,
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    fontFamily: 'Poppins-Bold',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    fontFamily: 'Rubik-Medium',
  },
  doctorList: {
    paddingBottom: 20,
  },
  doctorCard: {
    width: 160,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    marginRight: 15,
    overflow: 'hidden',
  },
  selectedDoctorCard: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  doctorCardImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  doctorCardDetails: {
    padding: 10,
  },
  doctorCardName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Raleway-Bold',
  },
  doctorCardSpecialization: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Raleway-Regular',
  },
  doctorCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  doctorCardRatingText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontFamily: 'Rubik-Regular',
  },
  selectedDoctorIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
  },
dateSelection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    marginVertical: 10,
    padding: 15,
  },
  dateSelectionText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'Rubik-Regular',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    marginVertical: 10,
    padding: 15,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Rubik-Regular',
  },
  severitySelection: {
    marginTop: 20,
  },
  severityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  severityOption: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
  },
  selectedSeverityOption: {
    backgroundColor: '#4CAF50',
  },
  severityOptionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Raleway-Regular',
  },
  selectedSeverityOptionText: {
    fontWeight: 'bold',
    fontFamily: 'Raleway-Bold',
  },
  bookButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    margin: 20,
    padding: 15,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBlur: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2d3748',
    borderRadius: 20,
    padding: 20,
    width: SCREEN_WIDTH - 40,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    fontFamily: 'Poppins-Bold',
  },
  modalDoctorImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  modalDoctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
    fontFamily: 'Raleway-Bold',
  },
  modalDoctorSpecialization: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 10,
    fontFamily: 'Raleway-Regular',
  },
  modalDoctorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalDoctorRatingText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontSize: 16,
    fontFamily: 'Rubik-Regular',
  },
  modalDoctorAbout: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Rubik-Regular',
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  successModalContent: {
    backgroundColor: '#2d3748',
    borderRadius: 20,
    padding: 20,
    width: SCREEN_WIDTH - 40,
    alignItems: 'center',
  },
  successAnimation: {
    width: 150,
    height: 150,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Poppins-Bold',
  },
  successDetails: {
    fontSize: 16,
    color: '#CCCCCC', 
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Rubik-Regular',
  },
});

export default BookAppointment;