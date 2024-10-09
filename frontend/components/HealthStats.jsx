import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const organData = [
  {
    id: 1,
    name: 'Heart',
    image: require('../assets/images/heart.jpeg'),
    health: 92,
    doctor: 'Dr. Emily Cardio',
    lastCheckup: '2023-09-15',
    details: 'Normal heart rhythm, slight elevation in cholesterol levels.',
    change: '+2.5%',
    status: 'Excellent',
    nextCheckup: '2024-03-15',
    icon: 'heart',
  },
  {
    id: 2,
    name: 'Liver',
    image: require('../assets/images/liver.jpeg'),
    health: 88,
    doctor: 'Dr. Michael Hepato',
    lastCheckup: '2023-10-02',
    details: 'Slight fatty liver detected. Recommended lifestyle changes.',
    change: '+1.8%',
    status: 'Good',
    nextCheckup: '2024-04-02',
    icon: 'medical',
  },
  {
    id: 3,
    name: 'Lungs',
    image: require('../assets/images/lungs.jpeg'),
    health: 95,
    doctor: 'Dr. Sarah Pulmo',
    lastCheckup: '2023-11-20',
    details: 'Excellent lung capacity. No signs of respiratory issues.',
    change: '+3.2%',
    status: 'Optimal',
    nextCheckup: '2024-05-20',
    icon: 'fitness',
  },
  {
    id: 4,
    name: 'Kidneys',
    image: require('../assets/images/kidneys.jpeg'),
    health: 85,
    doctor: 'Dr. David Nephro',
    lastCheckup: '2023-12-10',
    details: 'Mild kidney stones detected. Recommended increased water intake.',
    change: '+1.2%',
    status: 'Good',
    nextCheckup: '2024-06-10',
    icon: 'flask',
  },
  {
    id: 5,
    name: 'Brain',
    image: require('../assets/images/brain.jpeg'),
    health: 90,
    doctor: 'Dr. Alex Neuro',
    lastCheckup: '2024-01-05',
    details: 'Normal brain activity, no signs of cognitive decline.',
    change: '+2.0%',
    status: 'Excellent',
    nextCheckup: '2024-07-05',
    icon: 'flask',
  },
];

const AnimatedHealthNumber = ({ value }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const animatedText = animatedValue.interpolate({
    inputRange: [0, value],
    outputRange: [0, value],
  });

  return (
    <Animated.Text style={styles.healthPercentage}>
      {animatedText.interpolate({
        inputRange: [0, value],
        outputRange: [0, value].map(String),
      })}%
    </Animated.Text>
  );
};

const HealthStats = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const openModal = (organ) => {
    setSelectedOrgan(organ);
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setSelectedOrgan(null);
    });
  };

  const renderOrganCard = (organ) => {
    const progressWidth = new Animated.Value(0);
    
    useEffect(() => {
      Animated.timing(progressWidth, {
        toValue: organ.health,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }, []);

    const progressBarWidth = progressWidth.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    });

    return (
      <TouchableOpacity
        key={organ.id}
        style={styles.organCard}
        onPress={() => openModal(organ)}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image source={organ.image} style={styles.organImage} />
          <View style={styles.imageOverlay} />
          <View style={styles.cardContent}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.organName}>{organ.name}</Text>
                <View style={styles.statusContainer}>
                  <Ionicons name={organ.icon} size={16} color="#4A90E2" />
                  <Text style={styles.statusText}>{organ.status}</Text>
                </View>
              </View>
              <View style={styles.healthContainer}>
                <AnimatedHealthNumber value={organ.health} />
                <View style={styles.changeContainer}>
                  <Ionicons name="arrow-up" size={16} color="#4CAF50" />
                  <Text style={styles.changeText}>{organ.change}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.infoRow}>
            <Ionicons name="person" size={16} color="#8E8E93" />
            <Text style={styles.infoText}>{organ.doctor}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={16} color="#8E8E93" />
            <Text style={styles.infoText}>{organ.lastCheckup}</Text>
          </View>
          <View style={styles.progressContainer}>
            <Animated.View
              style={[styles.progressBar, { width: progressBarWidth }]}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Health Stats</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {organData.map(renderOrganCard)}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeModal}
        animationType="none"
      >
        <Animated.View 
          style={[
            styles.modalOverlay,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity style={styles.modalBackground} onPress={closeModal} />
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {selectedOrgan && (
              <ScrollView>
                <View style={styles.modalImageContainer}>
                  <Image source={selectedOrgan.image} style={styles.modalImage} />
                  <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <Ionicons name="close" size={24} color="#FFF" />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalBody}>
                  <Text style={styles.modalOrganName}>{selectedOrgan.name}</Text>
                  <View style={styles.modalHealthContainer}>
                    <AnimatedHealthNumber value={selectedOrgan.health} />
                    <View style={styles.modalChangeContainer}>
                      <Ionicons name="arrow-up" size={20} color="#4CAF50" />
                      <Text style={styles.modalChangeText}>{selectedOrgan.change}</Text>
                    </View>
                  </View>
                  <View style={styles.modalInfoGrid}>
                    <View style={styles.modalInfoItem}>
                      <Text style={styles.modalInfoLabel}>Doctor</Text>
                      <Text style={styles.modalInfoValue}>{selectedOrgan.doctor}</Text>
                    </View>
                    <View style={styles.modalInfoItem}>
                      <Text style={styles.modalInfoLabel}>Last Checkup</Text>
                      <Text style={styles.modalInfoValue}>{selectedOrgan.lastCheckup}</Text>
                    </View>
                    <View style={styles.modalInfoItem}>
                      <Text style={styles.modalInfoLabel}>Next Appointment</Text>
                      <Text style={styles.modalInfoValue}>{selectedOrgan.nextCheckup}</Text>
                    </View>
                    <View style={styles.modalInfoItem}>
                      <Text style={styles.modalInfoLabel}>Status</Text>
                      <Text style={styles.modalInfoValue}>{selectedOrgan.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.modalDetailsLabel}>Details</Text>
                  <Text style={styles.modalDetails}>{selectedOrgan.details}</Text>
                </View>
              </ScrollView>
            )}
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  organCard: {
    backgroundColor: '#2E383F',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageContainer: {
    height: height * 0.3,
    width: '100%',
  },
  organImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  organName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: '#4A90E2',
    marginLeft: 5,
    fontSize: 16,
  },
  healthContainer: {
    alignItems: 'flex-end',
  },
  healthPercentage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    color: '#4CAF50',
    marginLeft: 2,
  },
  cardFooter: {
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    color: '#8E8E93',
    marginLeft: 8,
    fontSize: 14,
  },
  progressContainer: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4A90E2',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#161622',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalImageContainer: {
    height: height * 0.4,
    width: '100%',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  modalBody: {
    padding: 20,
  },
  modalOrganName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  modalHealthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  modalChangeText: {
    color: '#4CAF50',
    fontSize: 18,
    marginLeft: 5,
  },
  modalInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  modalInfoItem: {
    width: '50%',
    marginBottom: 15,
  },
  modalInfoLabel: {
    color: '#8E8E93',
    fontSize: 14,
    marginBottom: 5,
  },
  modalInfoValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  modalDetailsLabel: {
    color: '#8E8E93',
    fontSize: 14,
    marginBottom: 5,
  },
  modalDetails: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default HealthStats;