import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
  Dimensions,
  FlatList,
  Pressable,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { fetchAppointments, databases, Config } from '../appwrite';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const AppointmentsList = ({ navigation }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('scheduled');
  const [notificationCount, setNotificationCount] = useState(3);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [specialtyFocus, setSpecialtyFocus] = useState('diabetes');

  const notificationAnimation = useState(new Animated.Value(-SCREEN_HEIGHT))[0];

  const toggleNotifications = useCallback(() => {
    Animated.spring(notificationAnimation, {
      toValue: showNotifications ? -SCREEN_HEIGHT : 0,
      useNativeDriver: true,
    }).start();
    setShowNotifications(!showNotifications);
  }, [showNotifications, notificationAnimation]);

  useEffect(() => {
    fetchAppointmentsData();
  }, []);

  const fetchAppointmentsData = async () => {
    try {
      const fetchedAppointments = await fetchAppointments();
      setAppointments(fetchedAppointments);

      const today = new Date().toISOString().split('T')[0];
      const todayAppts = fetchedAppointments.filter(appt => isToday(new Date(appt.date)));
      setTodayAppointments(todayAppts);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const categories = useMemo(() => [
    { id: 1, name: 'Glucose Monitoring', color: '#FF6B6B', icon: 'tint', specialty: 'diabetes' },
    { id: 2, name: 'Blood Pressure', color: '#4ECDC4', icon: 'heart', specialty: 'hypertension' },
    { id: 3, name: 'Medication', color: '#45B7D1', icon: 'pills', specialty: 'both' },
    { id: 4, name: 'Diet Plan', color: '#FFA07A', icon: 'apple-alt', specialty: 'both' },
    { id: 5, name: 'Exercise Log', color: '#98D8C8', icon: 'running', specialty: 'both' },
  ], []);

  const EmptyTodayAppointments = () => (
    <View style={styles.emptyTodayContainer}>
      <View style={styles.emptyStateCard}>
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          style={[styles.todayAppointmentGradient, styles.emptyGradient]}
        >
          <BlurView intensity={20} style={styles.blurView}>
            <View style={styles.emptyIconContainer}>
              <Feather name="calendar" size={40} color="#94a3b8" />
            </View>
            <Text style={styles.emptyStateTitle}>No Appointments Today</Text>
            <Text style={styles.emptyStateSubtitle}>Take care of your health!</Text>
          </BlurView>
        </LinearGradient>
      </View>

      <TouchableOpacity
        style={styles.addAppointmentCard}
        onPress={() => navigation.navigate('BookAppointment')}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          style={[styles.todayAppointmentGradient, styles.emptyGradient]}
        >
          <BlurView intensity={20} style={styles.blurView}>
            <View style={styles.addIconContainer}>
              <Feather name="plus-circle" size={40} color="#34d399" />
            </View>
            <Text style={styles.addCardTitle}>Schedule Check-up</Text>
            <Text style={styles.addCardSubtitle}>
              {specialtyFocus === 'diabetes' ? 'Monitor your glucose levels' : 'Check your blood pressure'}
            </Text>
          </BlurView>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );


  const renderTodayAppointmentCard = useCallback(({ item }) => {

    
    // Generate a unique random number for each card
    const randomImageNumber = Math.floor(Math.random() * 10) + 1;

    return (
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
            {/* Use the randomImageNumber to get the corresponding image */}
            <Image source={images[randomImageNumber]} style={styles.todayDoctorImage} />
            <View style={styles.appointmentInfo}>
              <Ionicons name="medkit-outline" size={16} color="#34d399" />
              <Text style={styles.todayDoctorName}>{item.doctorName}</Text>
            </View>
            <View style={styles.appointmentInfo}>
              <Ionicons name="time-outline" size={16} color="#fed7aa" />
              <Text style={styles.todayAppointmentTime}>{formatTime(new Date(item.date))}</Text>
            </View>
            <View style={styles.appointmentInfo}>
              <Ionicons name="clipboard-outline" size={16} color="#a78bfa" />
              <Text style={styles.todayAppointmentSpecialization}>{item.doctorSpecialization}</Text>
            </View>
          </BlurView>
        </LinearGradient>
      </TouchableOpacity>
    );
  }, []);



  const images = {
    1: require('../assets/images/appointmentcards/1.jpeg'),
    2: require('../assets/images/appointmentcards/2.jpeg'),
    3: require('../assets/images/appointmentcards/3.jpeg'),
    4: require('../assets/images/appointmentcards/4.jpeg'),
    5: require('../assets/images/appointmentcards/5.jpeg'),
    6: require('../assets/images/appointmentcards/6.jpeg'),
    7: require('../assets/images/appointmentcards/7.jpeg'),
    8: require('../assets/images/appointmentcards/8.jpeg'),
    9: require('../assets/images/appointmentcards/9.jpeg'),
    10: require('../assets/images/appointmentcards/10.jpeg'),
  };

  const renderAppointmentCard = useCallback(({ item, index }) => {
    // Generate a unique random number for each card
    const randomImageNumber = Math.floor(Math.random() * 10) + 1;

    return (
      <TouchableOpacity
        style={[styles.appointmentCard, getStatusColor(item.status)]}
        onPress={() => {
          setSelectedAppointment(item);
          setShowAppointmentDetails(true);
        }}
      >
        {/* Use the randomImageNumber to get the corresponding image */}
        <Image
          source={images[randomImageNumber]}
          style={styles.appointmentCardImage}
        />
        <View style={styles.appointmentDetails}>
          <Text style={styles.appointmentDoctorName}>{item.doctorName}</Text>
          <Text style={styles.appointmentSpecialization}>{item.doctorSpecialization}</Text>
          <Text style={styles.appointmentDate}>{formatDate(new Date(item.date))}</Text>
          <Text style={styles.appointmentTime}>{formatTime(new Date(item.date))}</Text>
          <View style={styles.statusContainer}>
            <FontAwesome5 name={getStatusIcon(item.status)} size={16} color={getStatusColor(item.status).borderColor} />
            <Text style={[styles.appointmentStatus, getStatusTextColor(item.status)]}>{item.status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);

  const renderCategoryCard = useCallback(({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        { backgroundColor: item.color },
        selectedCategory === item.id && styles.selectedCategoryCard,
        styles.categoryCardEnhanced
      ]}
      onPress={() => {
        setSelectedCategory(selectedCategory === item.id ? null : item.id);
        setSpecialtyFocus(item.specialty === 'both' ? specialtyFocus : item.specialty);
      }}
    >
      <FontAwesome5 name={item.icon} size={24} color="#FFFFFF" />
      <Text style={styles.categoryName}>{item.name}</Text>
      {item.specialty !== 'both' && (
        <View style={styles.specialtyBadge}>
          <Text style={styles.specialtyBadgeText}>
            {item.specialty === 'diabetes' ? 'D' : 'H'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  ), [selectedCategory, specialtyFocus]);

  const getStatusColor = useCallback((status) => {
    switch (status.toLowerCase()) {
      case 'completed': return { borderColor: '#4CAF50' };
      case 'cancelled': return { borderColor: '#F44336' };
      case 'scheduled': return { borderColor: '#2196F3' };
      default: return { borderColor: '#FFA000' };
    }
  }, []);

  const getStatusTextColor = useCallback((status) => {
    switch (status.toLowerCase()) {
      case 'completed': return { color: '#4CAF50' };
      case 'cancelled': return { color: '#F44336' };
      case 'scheduled': return { color: '#2196F3' };
      default: return { color: '#FFA000' };
    }
  }, []);

  const getStatusIcon = useCallback((status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'check-circle';
      case 'cancelled': return 'times-circle';
      case 'scheduled': return 'calendar-check';
      default: return 'question-circle';
    }
  }, []);

  const handleDeleteAppointment = useCallback(async () => {
    try {
      await databases.deleteDocument(
        Config.databaseId,
        Config.appoinmentsCollectionId,
        selectedAppointment.$id
      );
      setShowAppointmentDetails(false);
      fetchAppointmentsData();
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  }, [selectedAppointment]);

  const handleCompleteAppointment = useCallback(async () => {
    try {
      await databases.updateDocument(
        Config.databaseId,
        Config.appoinmentsCollectionId,
        selectedAppointment.$id,
        { status: 'completed' }
      );
      setShowAppointmentDetails(false);
      fetchAppointmentsData();
    } catch (error) {
      console.error("Error completing appointment:", error);
    }
  }, [selectedAppointment]);

  const handleRescheduleAppointment = useCallback(() => {
    setShowAppointmentDetails(false);
    navigation.navigate('BookAppointment', { isRescheduling: true, appointment: selectedAppointment });
  }, [navigation, selectedAppointment]);

  const filteredAppointments = useMemo(() =>
    appointments.filter(a => a.status.toLowerCase() === activeTab),
    [appointments, activeTab]
  );

  const renderNotification = useCallback(({ item }) => (
    <View style={styles.notificationItem}>
      <View style={[styles.notificationDot, { backgroundColor: item.color }]} />
      <Image source={{ uri: item.doctorImage }} style={styles.notificationDoctorImage} />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
    </View>
  ), []);

  // Helper functions to replace date-fns
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  return (
    <View style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Image
          source={require('../assets/images/tba.jpeg')}
          style={styles.headerImage}
        />
        <View style={styles.headerOverlay}>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('profile')}>
              <Image source={require('../assets/images/avatars/default.png')} style={styles.profileIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleNotifications}>
              <Ionicons name="notifications" size={24} color="#FFFFFF" />
              {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>{notificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>My Appointments</Text>
        </View>
      </View>

      <Animated.View
        style={[
          styles.notificationContainer,
          { transform: [{ translateY: notificationAnimation }] }
        ]}
      >
        <BlurView intensity={80} style={styles.notificationBlur}>
          <Text style={styles.notificationHeader}>Notifications</Text>
          <FlatList
            data={[
              { id: 1, title: 'Appointment Reminder', message: 'Dr. John Doe in 1 hour', color: '#4CAF50', doctorImage: 'https://example.com/doctor1.jpg' },
              { id: 2, title: 'New Message', message: 'From Dr. Jane Smith', color: '#2196F3', doctorImage: 'https://example.com/doctor2.jpg' },
              { id: 3, title: 'Prescription Ready', message: 'Ready for pickup', color: '#FFA000', doctorImage: 'https://example.com/pharmacy.jpg' },
            ]}
            renderItem={renderNotification}
            keyExtractor={item => item.id.toString()}
          />
          <TouchableOpacity style={styles.closeNotificationButton} onPress={toggleNotifications}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </BlurView>
      </Animated.View>

      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointmentCard}
        keyExtractor={item => item.$id}
        contentContainerStyle={styles.appointmentList}
        ListHeaderComponent={
          <>
            <View style={styles.todayAppointments}>
              <Text style={styles.sectionTitle}>Today's Appointments</Text>
              {todayAppointments.length === 0 ? (
                <EmptyTodayAppointments />
              ) : (
                <FlatList
                  data={todayAppointments}
                  renderItem={renderTodayAppointmentCard}
                  keyExtractor={item => item.$id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.todayAppointmentList}
                />
              )}
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

            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'scheduled' && styles.activeTab]}
                onPress={() => setActiveTab('scheduled')}
              >
                <Text style={[styles.tabText, activeTab === 'scheduled' && styles.activeTabText]}>Scheduled</Text>
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
        ListFooterComponent={
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('BookAppointment')}
            >
              <LinearGradient
                colors={['#34d399', '#0c4a6e']}
                style={styles.addButtonGradient}
              >
                <Feather name="plus" size={24} color="#ffffff" />
                <Text style={styles.addButtonText}>Book Appointment</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        }
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
                  <Image source={{ uri: selectedAppointment.doctorImage }} style={styles.modalDoctorImage} />
                  <Text style={styles.modalDoctorName}>{selectedAppointment.doctorName}</Text>
                  <Text style={styles.modalAppointmentDate}>{formatDate(new Date(selectedAppointment.date))}</Text>
                  <Text style={styles.modalAppointmentTime}>{formatTime(new Date(selectedAppointment.date))}</Text>
                  <Text style={[styles.modalAppointmentStatus, getStatusTextColor(selectedAppointment.status)]}>
                    {selectedAppointment.status}
                  </Text>
                  <Text style={styles.modalAppointmentReason}>Reason: {selectedAppointment.reason}</Text>
                  <View style={styles.modalButtonContainer}>
                    {selectedAppointment.status.toLowerCase() === 'scheduled' && (
                      <>
                        <TouchableOpacity style={[styles.modalButton, styles.modalRescheduleButton]} onPress={handleRescheduleAppointment}>
                          <FontAwesome5 name="calendar-alt" size={20} color="#FFFFFF" />
                          <Text style={styles.modalButtonText}>Reschedule</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, styles.modalCancelButton]} onPress={handleDeleteAppointment}>
                          <FontAwesome5 name="times-circle" size={20} color="#FFFFFF" />
                          <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, styles.modalCompleteButton]} onPress={handleCompleteAppointment}>
                          <FontAwesome5 name="check-circle" size={20} color="#FFFFFF" />
                          <Text style={styles.modalButtonText}>Complete</Text>
                        </TouchableOpacity>
                      </>
                    )}
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
    backgroundColor: '#000',
    paddingBottom: 80,

  },
  header: {
    height: 300,
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  appointmentCardImage: {
    width: 150,
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 15,
    borderColor: "#10b981",
    borderWidth: 2,

  },
  contentContainer: {
    paddingBottom: 80,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "#34d399",
    borderWidth: 2,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
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
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.6,
    backgroundColor: 'rgba(20,40,90,0.95)',
    zIndex: 1000,
    borderRadius: 30,
  },
  notificationBlur: {
    flex: 1,
    padding: 20,
  },
  notificationHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    fontFamily: 'Rubik-Bold',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderColor: "#34d399",
    borderWidth: 2,

  },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  notificationDoctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Rubik-Medium',
  },
  notificationMessage: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Rubik-Regular',
  },
  closeNotificationButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 20,
    marginBottom: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  todayAppointments: {
    marginTop: 20,
    height: 250,

  },
  todayAppointmentList: {
    paddingHorizontal: 10,
  },
  todayAppointmentCard: {
    width: 140,
    height: 210,
    backgroundColor: '#1f2937',
    borderRadius: 15,
    marginRight: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  todayAppointmentGradient: {
    flex: 1,
    padding: 10,
  },
  blurView: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  todayDoctorImage: {
    width: '100%',
    height: '60%',
    borderRadius: 15,
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 2,
    top: 3,
  },
  todayDoctorName: {
    color: '#34d399',
    marginLeft: 5,
  },
  todayAppointmentTime: {
    color: '#fed7aa',
    marginLeft: 5,
  },
  todayAppointmentSpecialization: {
    color: '#a78bfa',
    marginLeft: 5,
  },
  categories: {
    marginTop: 20,
  },
  categoryList: {
    paddingHorizontal: 10,
    right: 20,
  },
  categoryCard: {
    width: 90,
    height: 90,
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
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Kanit-Regular',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
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
    fontSize: 14,
    fontFamily: 'Raleway-Medium',
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
    color: '#34d399',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold',
  },
  appointmentSpecialization: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  appointmentDate: {
    color: '#fed7aa',
    fontSize: 14,
    marginTop: 5,
    fontFamily: 'Poppins-Regular',
  },
  appointmentTime: {
    color: '#fed7aa',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  appointmentStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
    fontFamily: 'Poppins-SemiBold',
  },
  footer: {
    paddingBottom: 80,
  },
  bookAppointmentButton: {
    marginHorizontal: 20,
    marginVertical: 30,
    borderRadius: 15,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  buttonIcon: {
    marginRight: 10,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  addButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 10,
  },
  bookAppointmentButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
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
    fontFamily: 'Poppins-Bold',
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
    fontFamily: 'Poppins-SemiBold',
  },
  modalAppointmentDate: {
    color: '#CCCCCC',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
  },
  modalAppointmentTime: {
    color: '#CCCCCC',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  modalAppointmentStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    fontFamily: 'Poppins-SemiBold',
  },
  modalAppointmentReason: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
  },
  modalRescheduleButton: {
    backgroundColor: '#2196F3',
  },
  modalCancelButton: {
    backgroundColor: '#F44336',
  },
  modalCompleteButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
    fontFamily: 'Poppins-SemiBold',
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
    fontFamily: 'Poppins-Medium',
  },
  emptyTodayContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    height: 210,
    width: 350,
    right: 20,
  },
  emptyStateCard: {
    width: '48%',
    height: '100%',
    backgroundColor: '#1f2937',
    borderRadius: 15,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#94a3b8',
    overflow: 'hidden',
  },
  addAppointmentCard: {
    width: '48%',
    height: '100%',
    backgroundColor: '#1f2937',
    borderRadius: 15,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#34d399',
    overflow: 'hidden',
  },
  emptyGradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'center',
    top: 5,
  },
  addIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'center',
    top: 5,
    
  },
  emptyStateTitle: {
    color: '#94a3b8',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    color: '#64748b',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 5,
  },
  addCardTitle: {
    color: '#34d399',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  addCardSubtitle: {
    color: '#10b981',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 5,
  },
  categoryCardEnhanced: {
    position: 'relative',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  specialtyBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialtyBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default AppointmentsList;