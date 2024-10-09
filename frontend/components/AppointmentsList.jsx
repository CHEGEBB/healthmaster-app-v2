import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const AppointmentsList = ({ navigation }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [notificationCount, setNotificationCount] = useState(3);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const notificationPosition = useSharedValue(-300);

  const animatedNotificationStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: notificationPosition.value }],
  }));

  const toggleNotifications = useCallback(() => {
    notificationPosition.value = withSpring(showNotifications ? -300 : 0);
    setShowNotifications(!showNotifications);
  }, [showNotifications, notificationPosition]);

  const todayAppointments = useMemo(() => [
    { id: 1, doctorName: 'Dr. Sarah Wong', time: '10:00 AM', image: require('../assets/images/as.jpeg'), specialization: 'Cardiologist' },
    { id: 2, doctorName: 'Dr. Jane Smith', time: '2:00 PM', image: require('../assets/images/am.jpeg'), specialization: 'Dermatologist' },
    { id: 3, doctorName: 'Dr. Mike Johnson', time: '11:30 AM', image: require('../assets/images/ab2.jpeg'), specialization: 'Pediatrician' },
    { id: 4, doctorName: 'Dr. Sarah Brown', time: '3:30 PM', image: require('../assets/images/ab.jpeg'), specialization: 'Neurologist' },
  ], []);

  const appointments = useMemo(() => [
    { id: 1, doctorName: 'Dr. Olivia Don', date: '2024-06-07', time: '10:00 AM', status: 'upcoming', image: require('../assets/images/ab4.jpeg'), specialization: 'Cardiologist' },
    { id: 2, doctorName: 'Dr. Jane Snow', date: '2024-06-08', time: '2:00 PM', status: 'upcoming', image: require('../assets/images/2.png'), specialization: 'Dermatologist' },
    { id: 3, doctorName: 'Dr. Mike Ming', date: '2024-06-09', time: '11:30 AM', status: 'upcoming', image: require('../assets/images/as2.jpeg'), specialization: 'Pediatrician' },
    { id: 4, doctorName: 'Dr. Emily Kapoor', date: '2024-06-10', time: '3:30 PM', status: 'upcoming', image: require('../assets/images/i.jpeg'), specialization: 'Neurologist' },
    { id: 5, doctorName: 'Dr. John Doe', date: '2024-06-05', time: '9:00 AM', status: 'completed', image: require('../assets/images/1.png'), specialization: 'Cardiologist' },
    { id: 6, doctorName: 'Dr. Jane Smith', date: '2024-06-06', time: '1:00 PM', status: 'cancelled', image: require('../assets/images/2.png'), specialization: 'Dermatologist' },
  ], []);

  const categories = useMemo(() => [
    { id: 1, name: 'Cardiology', color: '#FF6B6B', icon: 'heart' },
    { id: 2, name: 'Dermatology', color: '#4ECDC4', icon: 'hand-paper' },
    { id: 3, name: 'Pediatrics', color: '#45B7D1', icon: 'baby' },
    { id: 4, name: 'Neurology', color: '#FFA07A', icon: 'brain' },
    { id: 5, name: 'Orthopedics', color: '#98D8C8', icon: 'bone' },
  ], []);

  const renderTodayAppointmentCard = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.todayAppointmentCard}
      onPress={() => {
        setSelectedAppointment(item);
        setShowAppointmentDetails(true);
      }}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
        style={styles.todayAppointmentGradient}
      >
        <BlurView intensity={20} style={styles.blurView}>
          <Image source={item.image} style={styles.todayDoctorImage} />
          <Text style={styles.todayDoctorName}>{item.doctorName}</Text>
          <Text style={styles.todayAppointmentTime}>{item.time}</Text>
          <Text style={styles.todayAppointmentSpecialization}>{item.specialization}</Text>
        </BlurView>
      </LinearGradient>
    </TouchableOpacity>
  ), []);

  const renderAppointmentCard = useCallback(({ item }) => (
    <TouchableOpacity
      style={[styles.appointmentCard, getStatusColor(item.status)]}
      onPress={() => {
        setSelectedAppointment(item);
        setShowAppointmentDetails(true);
      }}
    >
      <Image source={item.image} style={styles.doctorImage} />
      <View style={styles.appointmentDetails}>
        <Text style={styles.appointmentDoctorName}>{item.doctorName}</Text>
        <Text style={styles.appointmentSpecialization}>{item.specialization}</Text>
        <Text style={styles.appointmentDate}>{item.date}</Text>
        <Text style={styles.appointmentTime}>{item.time}</Text>
        <Text style={[styles.appointmentStatus, getStatusTextColor(item.status)]}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  ), []);

  const renderCategoryCard = useCallback(({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        { backgroundColor: item.color },
        selectedCategory === item.id && styles.selectedCategoryCard
      ]}
      onPress={() => setSelectedCategory(selectedCategory === item.id ? null : item.id)}
    >
      <FontAwesome5 name={item.icon} size={24} color="#FFFFFF" />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  ), [selectedCategory]);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'completed': return { borderColor: '#4CAF50' };
      case 'cancelled': return { borderColor: '#F44336' };
      case 'upcoming': return { borderColor: '#2196F3' };
      default: return {};
    }
  }, []);

  const getStatusTextColor = useCallback((status) => {
    switch (status) {
      case 'completed': return { color: '#4CAF50' };
      case 'cancelled': return { color: '#F44336' };
      case 'upcoming': return { color: '#2196F3' };
      default: return {};
    }
  }, []);

  const handleDeleteAppointment = useCallback(() => {
    // Logic to delete appointment
    setShowAppointmentDetails(false);
    // Update appointments list
  }, []);

  const handleRescheduleAppointment = useCallback(() => {
    setShowAppointmentDetails(false);
    navigation.navigate('BookAppointment', { isRescheduling: true, appointment: selectedAppointment });
  }, [navigation, selectedAppointment]);

  const filteredAppointments = useMemo(() =>
    appointments.filter(a => a.status === activeTab),
    [appointments, activeTab]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={32} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointments</Text>
        <TouchableOpacity style={styles.notificationButton} onPress={toggleNotifications}>
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>{notificationCount}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.notificationContainer, animatedNotificationStyle]}>
        <BlurView intensity={80} style={styles.notificationBlur}>
          <Text style={styles.notificationTitle}>Notifications</Text>
          <FlatList
            data={[
              { id: 1, message: 'Appointment reminder: Dr. John Doe in 1 hour', icon: 'time-outline' },
              { id: 2, message: 'New message from Dr. Jane Smith', icon: 'chatbubble-outline' },
              { id: 3, message: 'Your prescription is ready for pickup', icon: 'medical-outline' },
            ]}
            renderItem={({ item }) => (
              <View style={styles.notificationItem}>
                <Ionicons name={item.icon} size={24} color="#4ade80" style={styles.notificationIcon} />
                <Text style={styles.notificationText}>{item.message}</Text>
              </View>
            )}
            keyExtractor={item => item.id.toString()}
          />
        </BlurView>
      </Animated.View>

      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.todayAppointments}>
              <Text style={styles.sectionTitle}>Today's Appointments</Text>
              <FlatList
                data={todayAppointments}
                renderItem={renderTodayAppointmentCard}
                keyExtractor={item => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.todayAppointmentList}
              />
            </View>

            <View style={styles.categories}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <FlatList
                data={categories}
                renderItem={renderCategoryCard}
                keyExtractor={item => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryList}
              />
            </View>

            <TouchableOpacity
              style={styles.bookAppointmentButton}
              onPress={() => navigation.navigate('BookAppointment')}
            >
              <Text style={styles.bookAppointmentButtonText}>Book Appointment</Text>
            </TouchableOpacity>

            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
                onPress={() => setActiveTab('upcoming')}
              >
                <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
                onPress={() => setActiveTab('completed')}
              >
                <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Completed</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]}
                onPress={() => setActiveTab('cancelled')}
              >
                <Text style={[styles.tabText, activeTab === 'cancelled' && styles.activeTabText]}>Cancelled</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        data={filteredAppointments}
        renderItem={renderAppointmentCard}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.appointmentList}
      />

      <Modal
        visible={showAppointmentDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAppointmentDetails(false)}
      >
        <View style={styles.modalContainer}>
          <BlurView intensity={80} style={styles.modalBlur}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Appointment Details</Text>
              {selectedAppointment && (
                <>
                  <Image source={selectedAppointment.image} style={styles.modalDoctorImage} />
                  <Text style={styles.modalDoctorName}>{selectedAppointment.doctorName}</Text>
                  <Text style={styles.modalAppointmentDate}>{selectedAppointment.date}</Text>
                  <Text style={styles.modalAppointmentTime}>{selectedAppointment.time}</Text>
                  <Text style={styles.modalAppointmentStatus}>{selectedAppointment.status}</Text>
                  <View style={styles.modalButtonContainer}>
                    <TouchableOpacity style={styles.modalButton} onPress={handleRescheduleAppointment}>
                      <Text style={styles.modalButtonText}>Reschedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.modalButton, styles.modalCancelButton]} onPress={handleDeleteAppointment}>
                      <Text style={styles.modalButtonText}>Cancel Appointment</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowAppointmentDetails(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  profileButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  notificationButton: {
    padding: 5,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notificationContainer: {
    position: 'absolute',
    top: 40,
    right: 80,
    width: SCREEN_WIDTH * 0.8,
    maxHeight: 300,
    borderRadius: 20,
    overflow: 'hidden',
    zIndex: 1000,
    backgroundColor: '#334155',
  },
  notificationBlur: {
    padding: 20,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  notificationIcon: {
    marginRight: 10,
  },
  notificationText: {
    color: '#FFFFFF',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 20,
    marginBottom: 10,
  },
  todayAppointments: {
    marginTop: 20,
  },
  todayAppointmentList: {
    paddingHorizontal: 10,
  },
  todayAppointmentCard: {
    width: 150,
    height: 200,
    marginHorizontal: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  todayAppointmentGradient: {
    flex: 1,
  },
  blurView: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  todayDoctorImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignSelf: 'center',
  },
  todayDoctorName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  todayAppointmentTime: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  todayAppointmentSpecialization: {
    color: '#CCCCCC',
    fontSize: 12,
    textAlign: 'center',
  },
  categories: {
    marginTop: 20,
  },
  categoryList: {
    paddingHorizontal: 10,
  },
  categoryCard: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategoryCard: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  categoryName: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  bookAppointmentButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    margin: 20,
    padding: 15,
    alignItems: 'center',
  },
  bookAppointmentButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    color: '#CCCCCC',
    fontSize: 16,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  appointmentList: {
    paddingHorizontal: 20,
  },
  appointmentCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    borderLeftWidth: 5,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  appointmentDetails: {
    marginLeft: 15,
    flex: 1,
  },
  appointmentDoctorName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  appointmentSpecialization: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  appointmentDate: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 5,
  },
  appointmentTime: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  appointmentStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  modalBlur: {
    width: '90%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalDoctorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 15,
  },
  modalDoctorName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalAppointmentDate: {
    color: '#CCCCCC',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  modalAppointmentTime: {
    color: '#CCCCCC',
    fontSize: 16,
    textAlign: 'center',
  },
  modalAppointmentStatus: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
  },
  modalCancelButton: {
    backgroundColor: '#F44336',
  },
  modalButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default AppointmentsList;