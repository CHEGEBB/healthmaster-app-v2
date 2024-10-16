import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TextInput, TouchableOpacity, Image, Modal, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import Medlist from "../../components/Medlist";
import HealthStats from "../../components/HealthStats";
import Reminders from "../../components/Reminders";
import { getCurrentUser, fetchAppointments } from '../../appwrite';
import { LinearGradient } from 'expo-linear-gradient';

const cardImages = [
  require('../../assets/images/cards/1.jpeg'),
  require('../../assets/images/cards/2.jpeg'),
  require('../../assets/images/cards/3.jpeg'),
  require('../../assets/images/cards/4.jpeg'),
  require('../../assets/images/cards/5.jpeg'),
];

const getRandomImage = () => cardImages[Math.floor(Math.random() * cardImages.length)];

const AppointmentCard = ({ appointment, onPress }) => {
  return (
    <TouchableOpacity style={styles.appointmentCard} onPress={onPress}>
      <ImageBackground source={getRandomImage()} style={styles.appointmentImage}>
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
          style={styles.appointmentGradient}
        >
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentTime}>{new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            <Text style={styles.appointmentDoctor}>{appointment.doctorName}</Text>
            <Text style={styles.appointmentSpecialty}>{appointment.doctorSpecialization}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const UpcomingScheduleItem = ({ appointment, onPress }) => {
  return (
    <TouchableOpacity style={styles.scheduleItem} onPress={onPress}>
      <Image source={getRandomImage()} style={styles.scheduleDoctorImage} />
      <View style={styles.scheduleDetails}>
        <Text style={styles.scheduleItemTitle}>{new Date(appointment.date).toLocaleString()}</Text>
        <Text style={styles.scheduleItemText}>{appointment.doctorName}</Text>
        <Text style={styles.scheduleItemSpecialty}>{appointment.doctorSpecialization}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#fff" />
    </TouchableOpacity>
  );
};

const MedicationCard = ({ medication }) => (
  <View style={styles.medicationCard}>
    <Image source={medication.image} style={styles.medicationImage} />
    <View style={styles.medicationInfo}>
      <Text style={styles.medicationName}>{medication.name}</Text>
      <Text style={styles.medicationDosage}>{medication.dosage}</Text>
    </View>
  </View>
);

const ImportantMedicationItem = ({ medication }) => (
  <View style={styles.importantMedicationItem}>
    <Image source={medication.image} style={styles.importantMedicationImage} />
    <View style={styles.importantMedicationInfo}>
      <Text style={styles.importantMedicationName}>{medication.name}</Text>
      <Text style={styles.importantMedicationTime}>{medication.time}</Text>
    </View>
    <TouchableOpacity style={styles.takeMedicationButton}>
      <Text style={styles.takeMedicationButtonText}>Take</Text>
    </TouchableOpacity>
  </View>
);

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [greeting, setGreeting] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  const handleProfilePress = useCallback(() => {
    router.push('/profile');
  }, [router]);

  const handleAppointmentPress = useCallback((appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedAppointment(null);
  }, []);

  const handleCancelAppointment = useCallback(() => {
    console.log('Cancelling appointment:', selectedAppointment.$id);
    handleCloseModal();
  }, [selectedAppointment, handleCloseModal]);

  const handleCompleteAppointment = useCallback(() => {
    console.log('Completing appointment:', selectedAppointment.$id);
    handleCloseModal();
  }, [selectedAppointment, handleCloseModal]);

  const fetchUserData = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUserData(currentUser);
        const hour = new Date().getHours();
        let greetingText = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
        setGreeting(`${greetingText}, ${currentUser.username || 'User'}👋!`);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  const fetchAppointmentsData = useCallback(async () => {
    try {
      const allAppointments = await fetchAppointments();
      setAppointments(allAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchAppointmentsData();
  }, [fetchUserData, fetchAppointmentsData]);

  const medications = [
    { name: 'Aspirin', dosage: '100mg', image: require('../../assets/images/aspirin.jpeg') },
    { name: 'Lisinopril', dosage: '10mg', image: require('../../assets/images/lisinopril.jpeg') },
    { name: 'Metformin', dosage: '500mg', image: require('../../assets/images/metformin.jpeg') },
  ];

  const importantMedications = [
    { name: 'Aspirin', time: '8:00 AM', image: require('../../assets/images/aspirin.jpeg') },
    { name: 'Lisinopril', time: '12:00 PM', image: require('../../assets/images/lisinopril.jpeg') },
  ];
  const SmallCard = ({ title, value, icon }) => (
    <View style={styles.smallCard}>
      <View style={styles.smallCardCircle}>
        <Text style={styles.smallCardValue}>{value}</Text>
      </View>
      <Text style={styles.smallCardTitle}>{title}</Text>
      {icon && <Ionicons name={icon} size={24} color="#FFF" style={styles.smallCardIcon} />}
    </View>
  );
  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header section */}
      <ImageBackground
        source={require('../../assets/images/bgh.jpeg')}
        style={styles.headerContainer}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.5)']}
          style={styles.headerOverlay}
        >
          <View style={styles.headerContent}>
            <View style={styles.profileSection}>
              <TouchableOpacity style={styles.profileContainer} onPress={handleProfilePress}>
                <Image source={{ uri: userData?.avatar }} style={styles.profileImage} />
                <Text style={styles.profileName}>{userData?.username || 'User'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="notifications-outline" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.headerText}>{greeting}</Text>

            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color="#fff" style={styles.iconLeft} />
              <TextInput
                placeholder="Search"
                placeholderTextColor="#ccc"
                style={styles.input}
              />
              <TouchableOpacity>
                <Ionicons name="mic-outline" size={20} color="#fff" style={styles.iconRight} />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarSection}>
              <View style={styles.dateSection}>
                <Ionicons name="calendar-outline" size={20} color="#FFF" />
                <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
              </View>
              <TouchableOpacity 
                style={styles.appointmentCountSection}
                onPress={() => router.push('/appointments')}
              >
                <Ionicons name="calendar" size={20} color="#FFF" style={styles.appointmentCountIcon} />
                <Text style={styles.appointmentCountText}>{appointments.length} Appointments</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>

      
 {/* Stats section */}
 <View style={styles.statsContainer}>
        <SmallCard title="Adherence" value="85%" icon="checkmark-circle-outline" />
        <SmallCard title="Past Visits" value="12" icon="time-outline" />
        <SmallCard title="Plan" value="Gold" icon="star" />
      </View>

      {/* Today's Appointments section */}
<View style={styles.appointmentsContainer}>
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Today's Appointments</Text>
    <TouchableOpacity onPress={() => router.push('/appointments')}>
      <Text style={styles.seeAllText}>See All</Text>
    </TouchableOpacity>
  </View>
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.appointmentsScroll}>
    {appointments.length === 0 ? (
      <TouchableOpacity onPress={() => router.push('/appointments')} style={styles.placeholderCard}>
        <Image
          source={require('../../assets/images/cards/3.jpeg')}
          style={styles.placeholderImage}
        />
        <View style={styles.placeholderContent}>
          <Ionicons name="add-circle" size={40} color="#4A90E2" />
          <Text style={styles.placeholderText}>Appointments will appear here</Text>
        </View>
      </TouchableOpacity>
    ) : (
      appointments.map((appointment) => (
        <AppointmentCard 
          key={appointment.$id} 
          appointment={appointment} 
          onPress={() => handleAppointmentPress(appointment)}
        />
      ))
    )}
  </ScrollView>
</View>
{/* Upcoming Schedule section */}
<View style={styles.upcomingSchedule}>
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Upcoming Schedule</Text>
    <TouchableOpacity onPress={() => router.push('/appointments')}>
      <Text style={styles.seeAllText}>See All</Text>
    </TouchableOpacity>
  </View>
  {appointments.length === 0 ? (
    <TouchableOpacity onPress={() => router.push('/appointments')} style={styles.smallPlaceholderCard}>
      <Image
        source={require('../../assets/images/cards/6.jpeg')}
        style={styles.smallPlaceholderImage}
      />
      <View style={styles.smallPlaceholderContent}>
        <Ionicons name="add-circle" size={24} color="#4A90E2" />
        <Text style={styles.smallPlaceholderText}>Add upcoming schedules</Text>
      </View>
    </TouchableOpacity>
  ) : (
    appointments.map((appointment) => (
      <UpcomingScheduleItem 
        key={appointment.$id} 
        appointment={appointment} 
        onPress={() => handleAppointmentPress(appointment)}
      />
    ))
  )}
</View>
      {/* Medications section */}
      <View style={styles.medicationsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Medications</Text>
          <TouchableOpacity onPress={() => router.push('/medications')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.medicationGrid}>
          {medications.map((medication, index) => (
            <MedicationCard key={index} medication={medication} />
          ))}
        </View>
      </View>

      {/* Today's Important Medications section */}
      <View style={styles.importantMedicationsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Important Medications</Text>
        </View>
        {importantMedications.map((medication, index) => (
          <ImportantMedicationItem key={index} medication={medication} />
        ))}
      </View>

      <HealthStats />
      {/* <Reminders /> */}


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedAppointment && (
              <>
                <Image 
                  source={getRandomImage()} 
                  style={styles.modalDoctorImage} 
                />
                <Text style={styles.modalDoctorName}>{selectedAppointment.doctorName}</Text>
                <Text style={styles.modalSpecialty}>{selectedAppointment.doctorSpecialization}</Text>
                <Text style={styles.modalTime}>{new Date(selectedAppointment.date).toLocaleString()}</Text>
                <Text style={styles.modalReason}>Reason: {selectedAppointment.reason}</Text>
                <Text style={styles.modalSeverity}>Severity: {selectedAppointment.severity}</Text>
                <Text style={styles.modalStatus}>Status: {selectedAppointment.status}</Text>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.modalButton} onPress={handleCancelAppointment}>
                    <Ionicons name="close-circle-outline" size={24} color="#FFF" />
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={handleCompleteAppointment}>
                    <Ionicons name="checkmark-circle-outline" size={24} color="#FFF" />
                    <Text style={styles.modalButtonText}>Complete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            
            <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseModal}>
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  headerContainer: {
    width: '100%',
    height: 330,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  headerOverlay: {
    flex: 1,
    padding: 20,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 90,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Raleway-Bold',
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    color: '#FFF',
    paddingVertical: 10,
    marginLeft: 10,
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  calendarSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: '#FFF',
    marginLeft: 5,
  },
  appointmentCountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  appointmentCountIcon: {
    marginRight: 5,
  },
  appointmentCountText: {
    color: '#FFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  smallCard: {
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 10,
    padding: 15,
    width: '30%',
  },
  smallCardCircle: {
    backgroundColor: '#4B5563',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  smallCardValue: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  smallCardTitle: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
  },
  smallCardIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  medicationContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  medicationScroll: {
    paddingLeft: 20,
  },
  medicationCard: {
    width: 150,
    height: 200,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  medicationImage: {
    width: '100%',
    height: '75%',
  },
  medicationInfo: {
    padding: 10,
    backgroundColor: '#374151',
  },
  medicationName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  medicationDosage: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  appointmentsContainer: {
    marginBottom: 20,
  },
  appointmentsScroll: {
    paddingLeft: 20,
  },
  appointmentCard: {
    width: 200,
    height: 250,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  appointmentImage: {
    width: '100%',
    height: '100%',
  },
  appointmentGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 15,
  },
  appointmentInfo: {
    marginTop: 'auto',
  },
  appointmentTime: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  appointmentDoctor: {
    color: '#FFF',
    fontSize: 14,
  },
  appointmentSpecialty: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 10,
  },
  upcomingSchedule: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  scheduleDoctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleItemTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scheduleItemText: {
    color: '#FFF',
    fontSize: 14,
  },
  scheduleItemSpecialty: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#374151',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalDoctorImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalDoctorName: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalSpecialty: {
    color: '#9CA3AF',
    fontSize: 16,
    marginBottom: 10,
  },
  modalTime: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B5563',
    borderRadius: 10,
    padding: 10,
  },
  modalButtonText: {
    color: '#FFF',
    marginLeft: 5,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalReason: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 5,
  },
  modalSeverity: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 5,
  },
  modalStatus: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 20,
  },
  medicationsContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  medicationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  medicationCard: {
    width: '48%',
    aspectRatio: 0.8,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#374151',
  },
  medicationImage: {
    width: '100%',
    height: '75%',
  },
  medicationInfo: {
    padding: 10,
  },
  medicationName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  medicationDosage: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  placeholderMedicationContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  importantMedicationsContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  importantMedicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  importantMedicationImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  importantMedicationInfo: {
    flex: 1,
  },
  importantMedicationName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  importantMedicationTime: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  takeMedicationButton: {
    backgroundColor: '#4B5563',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  takeMedicationButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  appointmentCard: {
    width: 200,
    height: 250,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  appointmentImage: {
    width: '100%',
    height: '100%',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  scheduleDoctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  placeholderCard: {
    width: 280,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.3,
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  smallPlaceholderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  smallPlaceholderImage: {
    width: 80,
    height: 80,
    opacity: 0.3,
  },
  smallPlaceholderContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  smallPlaceholderText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});