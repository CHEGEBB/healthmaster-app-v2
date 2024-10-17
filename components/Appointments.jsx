import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Image, Animated, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_MARGIN = 15;

const appointmentData = [
  {
    id: 1,
    doctorName: 'Dr. Emily Wong',
    specialty: 'Cardiologist',
    time: '09:30 AM',
    duration: '45 min',
    location: 'Heart Care Center',
    image: require('../assets/images/2.png'),
    color: '#4BE3AC',
    rating: 4.9,
    patients: '2.5k+',
    experience: '15 yrs',
  },
  {
    id: 2,
    doctorName: 'Dr. Michael Chen',
    specialty: 'Dermatologist',
    time: '11:15 AM',
    duration: '30 min',
    location: 'Skin Health Clinic',
    image: require('../assets/images/6.png'),
    color: '#FF6B6B',
    rating: 4.7,
    patients: '1.8k+',
    experience: '10 yrs',
  },
  {
    id: 3,
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Physiotherapist',
    time: '02:00 PM',
    duration: '60 min',
    location: 'Movement Rehabilitation Center',
    image: require('../assets/images/7.png'),
    color: '#4A90E2',
    rating: 4.8,
    patients: '2.2k+',
    experience: '12 yrs',
  },
  {
    id: 4,
    doctorName: 'Dr. Philip Johnson',
    specialty: 'Neurologist',
    time: '05:00 PM',
    duration: '120 min',
    location: 'Neurology Center',
    image: require('../assets/images/6.png'),
    color: '#FFB84D',
    rating: 4.9,
    patients: '3k+',
    experience: '18 yrs',
  },
];

const TodaysAppointments = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const autoScroll = () => {
      if (scrollViewRef.current) {
        const numCards = appointmentData.length;
        let currentIndex = 0;

        setInterval(() => {
          currentIndex = (currentIndex + 1) % numCards;
          scrollViewRef.current.scrollTo({
            x: currentIndex * (CARD_WIDTH + CARD_MARGIN),
            animated: true,
          });
        }, 3000);
      }
    };

    const timeout = setTimeout(autoScroll, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const ModalActionButton = ({ icon, text, onPress }) => (
    <TouchableOpacity style={styles.modalActionButton} onPress={onPress}>
      <Ionicons name={icon} size={24} color="#FFF" />
      <Text style={styles.modalActionText}>{text}</Text>
    </TouchableOpacity>
  );

  const AppointmentCard = ({ item, index }) => {
    const inputRange = [
      (index - 1) * (CARD_WIDTH + CARD_MARGIN),
      index * (CARD_WIDTH + CARD_MARGIN),
      (index + 1) * (CARD_WIDTH + CARD_MARGIN),
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
    });

    return (
      <TouchableOpacity onPress={() => openModal(item)}>
        <Animated.View
          style={[
            styles.appointmentCard,
            {
              transform: [{ scale }],
              opacity,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            },
          ]}
        >
          <View style={styles.cardContent}>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={20} color={item.color} />
              <Text style={[styles.timeText, { color: item.color }]}>{item.time}</Text>
            </View>
            <Image source={item.image} style={styles.doctorImage} />
            <Text style={styles.doctorName}>{item.doctorName}</Text>
            <Text style={styles.specialty}>{item.specialty}</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="star" size={16} color={item.color} />
                <Text style={styles.statText}>{item.rating}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="people" size={16} color={item.color} />
                <Text style={styles.statText}>{item.patients}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="medical" size={16} color={item.color} />
                <Text style={styles.statText}>{item.experience}</Text>
              </View>
            </View>
            
            <View style={styles.durationContainer}>
              <Ionicons name="hourglass-outline" size={16} color="#FFF" />
              <Text style={styles.durationText}>{item.duration}</Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Appointments</Text>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
      >
        {appointmentData.map((item, index) => (
          <AppointmentCard key={item.id} item={item} index={index} />
        ))}
      </Animated.ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
            {selectedAppointment && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={selectedAppointment.image} style={styles.modalImage} />
                <Text style={styles.modalDoctorName}>{selectedAppointment.doctorName}</Text>
                <Text style={styles.modalSpecialty}>{selectedAppointment.specialty}</Text>
                
                <View style={styles.modalStatsContainer}>
                  <View style={styles.modalStatItem}>
                    <Ionicons name="star" size={20} color={selectedAppointment.color} />
                    <Text style={styles.modalStatValue}>{selectedAppointment.rating}</Text>
                    <Text style={styles.modalStatLabel}>Rating</Text>
                  </View>
                  <View style={styles.modalStatItem}>
                    <Ionicons name="people" size={20} color={selectedAppointment.color} />
                    <Text style={styles.modalStatValue}>{selectedAppointment.patients}</Text>
                    <Text style={styles.modalStatLabel}>Patients</Text>
                  </View>
                  <View style={styles.modalStatItem}>
                    <Ionicons name="medical" size={20} color={selectedAppointment.color} />
                    <Text style={styles.modalStatValue}>{selectedAppointment.experience}</Text>
                    <Text style={styles.modalStatLabel}>Experience</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="time-outline" size={24} color={selectedAppointment.color} />
                  <Text style={styles.infoText}>{selectedAppointment.time}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="hourglass-outline" size={24} color={selectedAppointment.color} />
                  <Text style={styles.infoText}>{selectedAppointment.duration}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={24} color={selectedAppointment.color} />
                  <Text style={styles.infoText}>{selectedAppointment.location}</Text>
                </View>

                <View style={styles.modalActionsContainer}>
                  <ModalActionButton icon="videocam" text="Video Call" onPress={() => {}} />
                  <ModalActionButton icon="call" text="Voice Call" onPress={() => {}} />
                  <ModalActionButton icon="chatbubble" text="Message" onPress={() => {}} />
                </View>
                
                <TouchableOpacity style={styles.rescheduleButton}>
                  <Ionicons name="calendar" size={24} color="#FFF" />
                  <Text style={styles.rescheduleButtonText}>Reschedule Appointment</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    height: 340,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
    marginLeft: 20,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
  },
  appointmentCard: {
    width: CARD_WIDTH,
    height: 280,
    marginRight: CARD_MARGIN,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardContent: {
    flex: 1,
    padding: 15,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginVertical: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  doctorName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  specialty: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#FFF',
    marginLeft: 5,
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 10,
  },
  durationText: {
    color: '#FFF',
    marginLeft: 5,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'rgba(45, 45, 45, 0.9)',
    borderRadius: 20,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  modalImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalDoctorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  modalSpecialty: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 20,
  },
  modalStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  modalStatItem: {
    alignItems: 'center',
  },
  modalStatValue: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  modalStatLabel: {
    color: '#FFF',
    opacity: 0.8,
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#FFF',
    marginLeft: 10,
  },
  modalActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  modalActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 5,
  },
  modalActionText: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  rescheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  rescheduleButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default TodaysAppointments;