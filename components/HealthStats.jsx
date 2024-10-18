import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Image,
  Modal,
  FlatList,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const watches = [
  { id: 1, name: 'Apple Watch', image: require('../assets/images/apple.png') },
  { id: 2, name: 'Fitbit Versa', image: require('../assets/images/fitbit.png') },
  { id: 3, name: 'Samsung Galaxy Watch', image: require('../assets/images/samsung.png') },
  { id: 4, name: 'Garmin Forerunner', image: require('../assets/images/garmin.png') },
  { id: 5, name: 'Fossil Gen 5', image: require('../assets/images/fossil.png') },
  { id: 6, name: 'Huawei Watch GT', image: require('../assets/images/huawei.png') },
  { id: 7, name: 'Amazfit GTS', image: require('../assets/images/amazfit.png') },
  { id: 8, name: 'Withings ScanWatch', image: require('../assets/images/withings.png') },
  { id: 9, name: 'TicWatch Pro', image: require('../assets/images/ticwatch.png') },
  { id: 10, name: 'Polar Vantage V2', image: require('../assets/images/polar.png') },
];

const activities = [
  {
    id: 1,
    title: 'Yoga for Blood Pressure',
    image: require('../assets/images/yoga.jpeg'),
    description: 'Practice yoga to help lower your blood pressure naturally.',
    benefits: [
      'Reduces stress and anxiety',
      'Improves blood circulation',
      'Promotes better sleep',
      'Enhances flexibility',
      'Strengthens core muscles'
    ]
  },
  {
    id: 2,
    title: 'Walking for Diabetes',
    image: require('../assets/images/walking.jpeg'),
    description: 'Regular walking can help control blood sugar levels.',
    benefits: [
      'Controls blood sugar levels',
      'Improves cardiovascular health',
      'Aids in weight management',
      'Boosts energy levels',
      'Reduces risk of complications'
    ]
  },
  {
    id: 3,
    title: 'Meditation for Stress',
    image: require('../assets/images/meditation.jpeg'),
    description: 'Reduce stress and improve overall health with daily meditation.',
    benefits: [
      'Lowers blood pressure',
      'Reduces anxiety and depression',
      'Improves emotional well-being',
      'Enhances focus and concentration',
      'Promotes better sleep quality'
    ]
  },
];

const HealthStats = () => {
  const [heartRate, setHeartRate] = useState(75);
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [glucoseLevel, setGlucoseLevel] = useState(100);
  const [oxygenLevel, setOxygenLevel] = useState(98);
  const [steps, setSteps] = useState(5000);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isWatchModalVisible, setWatchModalVisible] = useState(false);
  const [selectedWatch, setSelectedWatch] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [lastAlertTime, setLastAlertTime] = useState(0);

  const alertAnimation = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      updateHealthData();
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isConnecting) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [isConnecting]);

  const updateHealthData = () => {
    const newHeartRate = Math.floor(Math.random() * (100 - 60 + 1) + 60);
    const newSystolic = Math.floor(Math.random() * (150 - 100 + 1) + 100);
    const newDiastolic = Math.floor(Math.random() * (95 - 60 + 1) + 60);
    const newGlucoseLevel = Math.floor(Math.random() * (200 - 70 + 1) + 70);
    const newOxygenLevel = Math.floor(Math.random() * (100 - 95 + 1) + 95);
    const newSteps = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);

    setHeartRate(newHeartRate);
    setSystolic(newSystolic);
    setDiastolic(newDiastolic);
    setGlucoseLevel(newGlucoseLevel);
    setOxygenLevel(newOxygenLevel);
    setSteps(newSteps);

    const currentTime = Date.now();
    if (currentTime - lastAlertTime > 30000) { // Only show alert every 30 seconds
      checkAlerts(newHeartRate, newSystolic, newDiastolic, newGlucoseLevel, newOxygenLevel);
      setLastAlertTime(currentTime);
    }
  };

  const checkAlerts = (hr, sys, dia, glucose, oxygen) => {
    if (hr > 100 || hr < 60) {
      showAlert(`⚠️ Critical Alert: Heart rate at ${hr} bpm`, 'danger');
    } else if (sys > 140 || dia > 90) {
      showAlert(`⚠️ Warning: Blood pressure elevated at ${sys}/${dia} mmHg`, 'danger');
    } else if (glucose > 180 || glucose < 70) {
      showAlert(`⚠️ Alert: Glucose level critical at ${glucose} mg/dL`, 'danger');
    } else if (oxygen < 95) {
      showAlert(`⚠️ Warning: Low oxygen saturation at ${oxygen}%`, 'danger');
    }
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertVisible(true);
    Animated.sequence([
      Animated.timing(alertAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(5000),
      Animated.timing(alertAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => setAlertVisible(false));
  };

  const renderMetric = (title, value, unit, icon, color) => (
    <View style={[styles.metricContainer, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <Ionicons name={icon} size={32} color={color} />
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      <Text style={styles.metricUnit}>{unit}</Text>
    </View>
  );

  const heartRateData = {
    labels: ['1m', '2m', '3m', '4m', '5m'],
    datasets: [
      {
        data: [heartRate - 10, heartRate - 5, heartRate, heartRate + 5, heartRate + 2],
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const renderWatchItem = ({ item }) => (
    <TouchableOpacity
      style={styles.watchItem}
      onPress={() => {
        setSelectedWatch(item);
        setWatchModalVisible(false);
        connectWatch(item);
      }}
    >
      <Image source={item.image} style={styles.watchImage} />
      <Text style={styles.watchName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const connectWatch = (watch) => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      showAlert(`Successfully connected to ${watch.name}`, 'success');
    }, 3000);
  };

  const renderActivityItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.activityCard}
      onPress={() => {
        setSelectedActivity(item);
        setShowActivityModal(true);
      }}
    >
      <Image source={item.image} style={styles.activityImage} />
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleEmergency = () => {
    Linking.openURL('tel:911');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>My Health Stats</Text>
        <View style={styles.metricsContainer}>
          {renderMetric('Heart Rate', heartRate, 'bpm', 'heart', '#FF6384')}
          {renderMetric('Blood Pressure', `${systolic}/${diastolic}`, 'mmHg', 'fitness', '#36A2EB')}
          {renderMetric('Glucose', glucoseLevel, 'mg/dL', 'water', '#FFCE56')}
          {renderMetric('Oxygen', oxygenLevel, '%', 'pulse', '#4BC0C0')}
          {renderMetric('Steps', steps, 'steps', 'walk', '#9966FF')}
        </View>

        <TouchableOpacity
          style={styles.connectButton}
          onPress={() => setWatchModalVisible(true)}
        >
          <Image 
            source={selectedWatch?.image || require('../assets/images/apple.png')} 
            style={styles.connectButtonImage} 
          />
          <Text style={styles.connectButtonText}>
            {isConnected ? `Connected to ${selectedWatch.name}` : 'Connect to Smartwatch'}
          </Text>
          <MaterialCommunityIcons name="watch" size={28} color="#FFFFFF" />
        </TouchableOpacity>


        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Heart Rate Trend</Text>
          <LineChart
            data={heartRateData}
            width={width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#1E2B3D',
              backgroundGradientFrom: '#1E2B3D',
              backgroundGradientTo: '#1E2B3D',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#FF6384',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <Text style={styles.sectionTitle}>Recommended Activities</Text>
        <FlatList
          data={activities}
          renderItem={renderActivityItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activitiesContainer}
        />

        <TouchableOpacity style={styles.updateButton} onPress={updateHealthData}>
          <FontAwesome5 name="sync-alt" size={20} color="#FFFFFF" style={styles.updateIcon} />
          <Text style={styles.updateButtonText}>Update Health Data</Text>
        </TouchableOpacity>
      </ScrollView>

      {alertVisible && (
        <Animated.View
          style={[
            styles.alertContainer,
            {
              transform: [
                {
                  translateY: alertAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.alertText}>{alertMessage}</Text>
          <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergency}>
            <Ionicons name="call" size={24} color="#FFFFFF" />
            <Text style={styles.emergencyButtonText}>Emergency Call</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <Modal
        visible={isWatchModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setWatchModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose a Smartwatch</Text>
            <FlatList
              data={watches}
              renderItem={renderWatchItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setWatchModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showActivityModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowActivityModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.activityModalContent}>
            {selectedActivity && (
              <>
                <Image source={selectedActivity.image} style={styles.modalActivityImage} />
                <Text style={styles.modalActivityTitle}>{selectedActivity.title}</Text>
                <Text style={styles.modalActivityDescription}>
                  {selectedActivity.description}
                </Text>
                <Text style={styles.benefitsTitle}>Benefits:</Text>
                {selectedActivity.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <FontAwesome5 name="check-circle" size={16} color="#4CAF50" />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowActivityModal(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {isConnecting && (
        <Modal
          visible={isConnecting}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.connectingContainer}>
            <View style={styles.connectingContent}>
<Animated.View style={{ transform: [{ rotate: spin }] }}>
                <MaterialCommunityIcons name="watch" size={48} color="#4CAF50" />
              </Animated.View>
              <ActivityIndicator size="large" color="#4CAF50" style={styles.loadingIndicator} />
              <Text style={styles.connectingText}>
                Connecting to {selectedWatch?.name}...
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricContainer: {
    alignItems: 'center',
    backgroundColor: '#1E2B3D',
    borderRadius: 12,
    padding: 15,
    width: '48%',
    marginBottom: 15,
    elevation: 5,
  },
  metricTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 5,
    fontFamily: 'Rubik-Regular',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
    fontFamily: 'Rubik-Bold',
  },
  metricUnit: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Rubik-Regular',
  },
  chartContainer: {
    backgroundColor: '#1E2B3D',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    elevation: 5,
  },
  chartTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E2B3D',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    elevation: 5,
  },
  connectButtonImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1E2B3D',
    elevation: 2,
    borderRadius: 40,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 15,
    fontFamily: 'Rubik-Medium',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
    fontFamily: 'Poppins-SemiBold',
  },
  activitiesContainer: {
    paddingBottom: 20,
  },
  activityCard: {
    width: 280,
    backgroundColor: '#1E2B3D',
    borderRadius: 12,
    marginRight: 15,
    overflow: 'hidden',
    elevation: 5,
  },
  activityImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  activityContent: {
    padding: 15,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 5,
    fontFamily: 'Poppins-SemiBold',
  },
  activityDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    fontFamily: 'Rubik-Regular',
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginTop: 20,
    elevation: 5,
  },
  updateIcon: {
    marginRight: 10,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Rubik-Medium',
  },
  alertContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 59, 48, 0.95)',
    padding: 15,
    elevation: 8,
  },
  alertText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    fontFamily: 'Rubik-Medium',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: '#1E2B3D',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxHeight: '80%',
    elevation: 8,
  },
  activityModalContent: {
    backgroundColor: '#1E2B3D',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
    elevation: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  modalActivityImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
  modalActivityTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  modalActivityDescription: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 20,
    fontFamily: 'Rubik-Regular',
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
    fontFamily: 'Poppins-SemiBold',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 10,
    fontFamily: 'Rubik-Regular',
  },
  watchItem: {
    alignItems: 'center',
    width: '50%',
    marginBottom: 20,
    padding: 10,
  },
  watchImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  watchName: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Raleway-Regular',
  },
  closeButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Rubik-Medium',
  },
  connectingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 43, 61, 0.95)',
  },
  connectingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    borderRadius: 16,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  connectingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
});

export default HealthStats;