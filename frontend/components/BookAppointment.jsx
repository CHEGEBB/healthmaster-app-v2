import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import LottieView from 'lottie-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const BookAppointment = ({ navigation, route }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [severity, setSeverity] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDoctorDetails, setShowDoctorDetails] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const cardScale = useSharedValue(1);

  useEffect(() => {
    if (route.params?.isRescheduling) {
      setIsRescheduling(true);
      const appointment = route.params.appointment;
      setSelectedDoctor(appointment.doctor);
      setSelectedDate(appointment.date);
      setSelectedTime(appointment.time);
      setReason(appointment.reason || '');
      setSeverity(appointment.severity || '');
    }
  }, [route.params]);

  const doctors = [
    { id: 1, name: 'Dr. John Anderson', specialization: 'Cardiologist', image: require('../assets/images/am3.jpeg'), rating: 4.8, patients: 1000, availability: '9:00 AM - 5:00 PM', about: 'Dr. John Doe is a renowned cardiologist with over 15 years of experience in treating cardiovascular diseases.' },
    { id: 2, name: 'Dr. Jane Smith', specialization: 'Dermatologist', image: require('../assets/images/am.jpeg'), rating: 4.9, patients: 1200, availability: '10:00 AM - 6:00 PM', about: 'Dr. Jane Smith is a board-certified dermatologist specializing in both medical and cosmetic dermatology.' },
    { id: 3, name: 'Dr. Mike Johnson', specialization: 'Pediatrician', image: require('../assets/images/ab2.jpeg'), rating: 4.7, patients: 800, availability: '8:00 AM - 4:00 PM', about: 'Dr. Mike Johnson is a caring pediatrician dedicated to providing comprehensive healthcare for children from infancy through adolescence.' },
    { id: 4, name: 'Dr. Sarah Brown', specialization: 'Neurologist', image: require('../assets/images/ab.jpeg'), rating: 4.6, patients: 950, availability: '11:00 AM - 7:00 PM', about: 'Dr. Sarah Brown is an experienced neurologist specializing in the diagnosis and treatment of disorders of the nervous system.' },
  ];

  const availableSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: cardScale.value }],
    };
  });

  const renderDoctorCard = useCallback(({ item }) => (
    <AnimatedTouchableOpacity
      style={[styles.doctorCard, animatedCardStyle]}
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
    </AnimatedTouchableOpacity>
  ), [cardScale]);

  const handleBookAppointment = useCallback(() => {
    if (selectedDoctor && selectedDate && selectedTime && reason && severity) {
      const newAppointment = {
        doctor: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        reason: reason,
        severity: severity,
      };
      
      // Here you would typically save the appointment to your backend or state management
      console.log('New Appointment:', newAppointment);
      
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.goBack();
      }, 3000);
    } else {
      // Show an error message or highlight missing fields
      alert('Please fill in all fields before booking the appointment.');
    }
  }, [selectedDoctor, selectedDate, selectedTime, reason, severity, navigation]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Animated.View 
        style={styles.header}
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(500)}
      >
        <Text style={styles.headerTitle}>
          {isRescheduling ? 'Reschedule Appointment' : 'Book Appointment'}
        </Text>
      </Animated.View>

      {!isRescheduling && (
        <Animated.View 
          style={styles.doctorSelection}
          entering={FadeIn.duration(500).delay(200)}
        >
          <Text style={styles.sectionTitle}>Select a Doctor</Text>
          <FlatList
            data={doctors}
            renderItem={renderDoctorCard}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.doctorList}
          />
        </Animated.View>
      )}

      <Animated.View entering={FadeIn.duration(500).delay(400)}>
        <TouchableOpacity style={styles.dateSelection} onPress={() => setShowCalendar(true)}>
          <Text style={styles.dateSelectionText}>
            {selectedDate ? selectedDate : 'Select Date'}
          </Text>
        </TouchableOpacity>

        <View style={styles.timeSlots}>
          <Text style={styles.sectionTitle}>Available Time Slots</Text>
          <FlatList
            data={availableSlots}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.timeSlot,
                  selectedTime === item && styles.selectedTimeSlot
                ]}
                onPress={() => setSelectedTime(item)}
              >
                <Text style={[
                  styles.timeSlotText,
                  selectedTime === item && styles.selectedTimeSlotText
                ]}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

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

        <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment}>
          <Text style={styles.bookButtonText}>
            {isRescheduling ? 'Reschedule Appointment' : 'Book Appointment'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={showCalendar}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalContainer}>
          <BlurView intensity={80} style={styles.modalBlur}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <Calendar
                markedDates={{
                  [selectedDate]: { selected: true, selectedColor: '#4CAF50' },
                }}
                theme={{
                  backgroundColor: '#1e293b',
                  calendarBackground: '#1e293b',
                  textSectionTitleColor: '#FFFFFF',
                  selectedDayBackgroundColor: '#4CAF50',
                  selectedDayTextColor: '#FFFFFF',
                  todayTextColor: '#4CAF50',
                  dayTextColor: '#FFFFFF',
                  textDisabledColor: '#555555',
                  dotColor: '#4CAF50',
                  selectedDotColor: '#FFFFFF',
                  arrowColor: '#4CAF50',
                  monthTextColor: '#FFFFFF',
                }}
                onDayPress={(day) => {
                  setSelectedDate(day.dateString);
                  setShowCalendar(false);
                }}
              />
            </View>
          </BlurView>
        </View>
      </Modal>

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
              <Text style={styles.successText}>
                {isRescheduling ? 'Appointment Rescheduled Successfully!' : 'Appointment Booked Successfully!'}
              </Text>
              <Text style={styles.successDetails}>
                {`Doctor: ${selectedDoctor?.name}\nDate: ${selectedDate}\nTime: ${selectedTime}`}
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
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  doctorSelection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 20,
    marginBottom: 10,
  },
  doctorList: {
    paddingHorizontal: 10,
  },
  doctorCard: {
    width: 160,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  doctorCardImage: {
    width: '100%',
    height: 120,
  },
  doctorCardDetails: {
    padding: 10,
  },
  doctorCardName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  doctorCardSpecialization: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  doctorCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  doctorCardRatingText: {
    color: '#FFFFFF',
    marginLeft: 5,
  },
  dateSelection: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    margin: 20,
    padding: 15,
    alignItems: 'center',
  },
  dateSelectionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  timeSlots: {
    marginTop: 20,
  },
  timeSlot: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
  },
  selectedTimeSlot: {
    backgroundColor: '#4CAF50',
  },
  timeSlotText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  selectedTimeSlotText: {
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    margin: 20,
    padding: 15,
    color: '#FFFFFF',
    fontSize: 16,
  },
  severitySelection: {
    marginTop: 20,
  },
  severityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  },
  selectedSeverityOptionText: {
    fontWeight: 'bold',
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
  },
  modalDoctorSpecialization: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 10,
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
  },
  modalDoctorAbout: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
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
  },
  successDetails: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default BookAppointment;