import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TextInput, TouchableOpacity, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import Medlist from "../../components/Medlist";
import Appointments from "../../components/Appointments";
import HealthStats from "../../components/HealthStats";
import Reminders from "../../components/Reminders";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Make sure to install axios if you haven't already

const ScheduleItem = ({ schedule, openModal }) => {
  if (!schedule) return null;

  return (
    <View style={styles.scheduleItem}>
      <Image source={schedule.image} style={styles.doctorImage} />
      <View style={styles.scheduleDetails}>
        <Text style={styles.scheduleItemTitle}>{schedule.time}</Text>
        <Text style={styles.scheduleItemText}>{schedule.doctor}</Text>
      </View>
      <TouchableOpacity onPress={() => openModal(schedule)}>
        <Ionicons name="ellipsis-vertical" size={24} color="#777" />
      </TouchableOpacity>
    </View>
  );
};

const ActionCard = ({ icon, text, count, style }) => (
  <View style={[styles.card, style]}>
    <Ionicons name={icon} size={30} color="#FFF" />
    <Text style={styles.cardText}>{text}</Text>
    <Text style={styles.cardCount}>{count}</Text>
  </View>
);

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [alarmsCount, setAlarmsCount] = useState(0);
  const [scheduleCount, setScheduleCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const navigation = useNavigation();

  const handleProfilePress = useCallback(() => {
    navigation.navigate('profile');
  }, [navigation]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/login'); // Replace with your actual login endpoint
      setUserData(response.data);
      // Assume response.data contains the counts
      setAppointmentsCount(response.data.appointmentsCount);
      setAlarmsCount(response.data.alarmsCount);
      setScheduleCount(response.data.scheduleCount);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const openModal = useCallback((schedule) => {
    setSelectedSchedule(schedule);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedSchedule(null);
  }, []);

  const schedules = [
    { time: "10:00 AM", doctor: "Dr. John Wong", image: require('../../assets/images/as2.jpeg') },
    { time: "12:00 PM", doctor: "Dr. Jane Smith", image: require('../../assets/images/am.jpeg') },
    { time: "14:00 PM", doctor: "Dr. Mike Johnson", image: require('../../assets/images/ab3.jpeg') }
  ];

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.headerContainer}>
        <ImageBackground
          source={require('../../assets/images/register.png')}
          style={styles.imageContainer}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay} />

          <View style={styles.row}>
            <Text style={styles.headerText}>Hi, {userData ? userData.name : "User"}👋!</Text>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.healthText}>How is Your Health Today?</Text>

          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#555" style={styles.iconLeft} />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#777"
              style={styles.input}
            />
            <TouchableOpacity>
              <Ionicons name="mic-outline" size={20} color="#555" style={styles.iconRight} />
            </TouchableOpacity>
          </View>

          <View style={styles.dateRow}>
            <View style={styles.dateSection}>
              <Ionicons name="calendar-outline" size={20} color="#FFF" />
              <Text style={styles.dateText}>Today is {new Date().toLocaleDateString()}</Text>
            </View>
            <TouchableOpacity style={styles.profileContainer} onPress={handleProfilePress}>
              <Image
                source={require('../../assets/images/12.jpeg')}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.actionRow}>
            <ActionCard icon="calendar-outline" text="Appointments" count={appointmentsCount} style={styles.cardAppointments} />
            <ActionCard icon="alarm-outline" text="Alarms" count={alarmsCount} style={styles.cardAlarms} />
            <ActionCard icon="list-outline" text="Schedule" count={scheduleCount} style={styles.cardSchedule} />
          </View>
        </ImageBackground>
      </View>

      <View style={styles.appointmentsContainer}>
        <Appointments />
      </View>

      <View style={styles.upcomingSchedule}>
        <View style={styles.upcomingScheduleHeader}>
          <Text style={styles.upcomingScheduleTitle}>Upcoming Schedule</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {schedules.map(schedule => (
          <ScheduleItem key={schedule.time} schedule={schedule} openModal={openModal} />
        ))}
      </View>

      {selectedSchedule && (
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedSchedule.doctor}</Text>
              <Text style={styles.modalTime}>Scheduled at {selectedSchedule.time}</Text>
              <Image source={selectedSchedule.image} style={styles.modalDoctorImage} />

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalButtonDone}>
                  <Ionicons name="checkmark-outline" size={20} color="#FFF" />
                  <Text style={styles.modalButtonText}>Done</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButtonCancel}>
                  <Ionicons name="close-outline" size={20} color="#FFF" />
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
                <Ionicons name="close-outline" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <View style={styles.medContainer}>
        <Medlist />
      </View>
      <View style={styles.myReminders}>
        <Reminders />
      </View>

      <View style={styles.healthstats}>
        <HealthStats />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E383F',
  },
  contentContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    width: '100%',
    height: 400,
    position: 'relative',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 100, 0.2)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  iconButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 50,
  },
  healthText: {
    fontSize: 18,
    color: '#FFF',
    marginTop: 10,
  },
  searchBar: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 15,
    height: 40,
  },
  iconLeft: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#555',
  },
  iconRight: {
    marginLeft: 10,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#FFF',
    marginLeft: 5,
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#4A4E69',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cardAppointments: {
    backgroundColor: '#FF6F61',
  },
  cardAlarms: {
    backgroundColor: '#6B5B95',
  },
  cardSchedule: {
    backgroundColor: '#88B04B',
  },
  cardText: {
    color: '#FFF',
    fontSize: 18,
    marginTop: 5,
  },
  cardCount: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  appointmentsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  upcomingSchedule: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  upcomingScheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  upcomingScheduleTitle: {
    fontSize: 20,
    color: '#FFF',
  },
  seeAllText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 10,
    marginBottom: 10,
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleItemTitle: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  scheduleItemText: {
    fontSize: 14,
    color: '#AAA',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalTime: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalDoctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  modalButtonDone: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 5,
  },
  modalButtonCancel: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 5,
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
  medContainer: {
    marginTop: 20,
  },
  myReminders: {
    marginTop: 20,
  },
  healthstats: {
    marginTop: 20,
  },
});
