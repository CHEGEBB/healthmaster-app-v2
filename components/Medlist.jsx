import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const medicationData = [
  {
    id: 1,
    name: 'Aspirin',
    image: require('../assets/images/aspirin.jpeg'),
    time: '08:00 AM',
    date: 'Monday, Jun 5, 2023',
    dosage: '500mg',
    frequency: 'Once daily',
    description: 'Used to reduce pain, fever, or inflammation.',
  },
  {
    id: 2,
    name: 'Lisinopril',
    image: require('../assets/images/lisinopril.jpeg'),
    time: '09:00 AM',
    date: 'Monday, Jun 5, 2023',
    dosage: '10mg',
    frequency: 'Once daily',
    description: 'Used to treat high blood pressure and heart failure.',
  },
  {
    id: 3,
    name: 'Metformin',
    image: require('../assets/images/metformin.jpeg'),
    time: '09:00 AM',
    date: 'Monday, Jun 5, 2023',
    dosage: '500mg',
    frequency: 'Twice daily',
    description: 'Used to control blood sugar levels in type 2 diabetes.',
  },
  {
    id: 4,
    name: 'Simvastatin',
    image: require('../assets/images/simvastatin.jpeg'),
    time: '08:00 PM',
    date: 'Monday, Jun 5, 2023',
    dosage: '20mg',
    frequency: 'Once daily',
    description: 'Used to lower cholesterol and triglycerides in the blood.',
  },
];

const MedicationDrawer = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);

  const openModal = (medication) => {
    setSelectedMedication(medication);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMedication(null);
  };

  const renderMedicationCard = (item) => (
    <TouchableOpacity 
      key={item.id}
      style={styles.medicationCard}
      onPress={() => openModal(item)}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
        style={styles.cardGradient}
      >
        <Image source={item.image} style={styles.medicationImage} />
        <View style={styles.cardContent}>
          <Text style={styles.medicationName}>{item.name}</Text>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={16} color="#fff" />
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          <View style={styles.takeNowContainer}>
            <Text style={styles.takeNowText}>Take Now</Text>
            <Ionicons name="chevron-forward-outline" size={16} color="#fff" />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderModalContent = () => (
    <View style={styles.modalContent}>
      <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
        <Ionicons name="close" size={24} color="#FFF" />
      </TouchableOpacity>
      {selectedMedication && (
        <View>
          <Image source={selectedMedication.image} style={styles.modalImage} />
          <Text style={styles.modalTitle}>{selectedMedication.name}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="medical-outline" size={24} color="#4A90E2" />
            <Text style={styles.infoText}>Dosage: {selectedMedication.dosage}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={24} color="#4A90E2" />
            <Text style={styles.infoText}>Time: {selectedMedication.time}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={24} color="#4A90E2" />
            <Text style={styles.infoText}>Date: {selectedMedication.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="repeat-outline" size={24} color="#4A90E2" />
            <Text style={styles.infoText}>Frequency: {selectedMedication.frequency}</Text>
          </View>
          <Text style={styles.descriptionTitle}>Description:</Text>
          <Text style={styles.descriptionText}>{selectedMedication.description}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Medication Drawer</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardContainer}>
          {medicationData.map((item) => (
            <View key={item.id} style={styles.cardWrapper}>
              {renderMedicationCard(item)}
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <BlurView intensity={100} style={styles.modalContainer}>
          {renderModalContent()}
        </BlurView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 20,
  },
  medicationCard: {
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: 15,
  },
  medicationImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 14,
    color: '#FFF',
    marginLeft: 5,
  },
  takeNowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.3)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  takeNowText: {
    fontSize: 14,
    color: '#FFF',
    marginRight: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(30, 30, 46, 0.9)',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  modalImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
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
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 20,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#BBB',
    lineHeight: 24,
  },
});

export default MedicationDrawer;