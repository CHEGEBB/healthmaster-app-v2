import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  TextInput,
  ImageBackground,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const Profile = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Emily Sanson',
    email: 'emilysanson8@hotmail.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-05-15',
    gender: 'Male',
    bloodType: 'A+',
    height: '175 cm',
    weight: '70 kg',
    allergies: 'None',
    emergencyContact: 'Jane Doe (+1 555-987-6543)',
  });

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    twoFactor: false,
    locationServices: true,
  });

  const healthStats = [
    { label: 'Blood Pressure', value: '120/80 mmHg' },
    { label: 'Heart Rate', value: '72 bpm' },
    { label: 'Glucose Level', value: '90 mg/dL' },
    { label: 'Cholesterol', value: '180 mg/dL' },
  ];

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the updated userData to your backend
  };

  const handleLogout = () => {
    // Implement logout logic here
    // navigation.navigate();
  };

  const toggleSetting = (setting) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [setting]: !prevSettings[setting]
    }));
  };

  const renderEditableField = (label, value, key) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) => setUserData({ ...userData, [key]: text })}
        />
      ) : (
        <Text style={styles.fieldValue}>{value}</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <ImageBackground
        source={require('../../assets/images/prof.jpeg')}
        style={styles.header}
      >
        <LinearGradient
          colors={['rgba(100, 116, 139, 0.8)', 'rgba(12, 74, 110, 0.8)']}
          style={styles.headerOverlay}
        >
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Ionicons name={isEditing ? "save-outline" : "create-outline"} size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.profileImageContainer}>
            <TouchableOpacity>
              <Image
                source={require('../../assets/images/12.jpeg')}
                style={styles.profileImage}
              />
              <View style={styles.cameraIconContainer}>
                <Ionicons name="camera" size={20} color="#ffffff" />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.email}>{userData.email}</Text>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.content}>
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          {renderEditableField('Phone', userData.phone, 'phone')}
          {renderEditableField('Date of Birth', userData.dateOfBirth, 'dateOfBirth')}
          {renderEditableField('Gender', userData.gender, 'gender')}
        </Animated.View>

        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.cardTitle}>Health Information</Text>
          {renderEditableField('Blood Type', userData.bloodType, 'bloodType')}
          {renderEditableField('Height', userData.height, 'height')}
          {renderEditableField('Weight', userData.weight, 'weight')}
          {renderEditableField('Allergies', userData.allergies, 'allergies')}
        </Animated.View>

        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.cardTitle}>Emergency Contact</Text>
          {renderEditableField('Emergency Contact', userData.emergencyContact, 'emergencyContact')}
        </Animated.View>

        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.cardTitle}>Health Stats</Text>
          {healthStats.map((stat, index) => (
            <View key={index} style={styles.statContainer}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.settingsHeader}
            onPress={() => setShowSettings(!showSettings)}
          >
            <Text style={styles.cardTitle}>Settings</Text>
            <Ionicons
              name={showSettings ? "chevron-up-outline" : "chevron-down-outline"}
              size={24}
              color="#0d9488"
            />
          </TouchableOpacity>
          {showSettings && (
            <View>
              {Object.entries(settings).map(([key, value]) => (
                <View key={key} style={styles.settingItem}>
                  <Text style={styles.settingLabel}>
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </Text>
                  <Switch
                    value={value}
                    onValueChange={() => toggleSetting(key)}
                    trackColor={{ false: "#767577", true: "#0d9488" }}
                    thumbColor={value ? "#f4f3f4" : "#f4f3f4"}
                  />
                </View>
              ))}
            </View>
          )}
        </Animated.View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#374151',
  },
  contentContainer: {
    paddingBottom: 80, 
  },
  header: {
    height: 280,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerOverlay: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  profileImageContainer: {
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0d9488',
    borderRadius: 20,
    padding: 8,
  },
  name: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#ffffff',
    marginTop: 10,
  },
  email: {
    fontFamily: 'Raleway-Medium',
    fontSize: 16,
    color: '#e2e8f0',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#4b5563',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 18,
    color: '#0d9488',
    marginBottom: 15,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontFamily: 'Raleway-Medium',
    fontSize: 14,
    color: '#d4d4d8',
    marginBottom: 5,
  },
  fieldValue: {
    fontFamily: 'Raleway-Regular',
    fontSize: 16,
    color: '#ffffff',
  },
  input: {
    fontFamily: 'Raleway-Regular',
    fontSize: 16,
    color: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#0d9488',
    paddingVertical: 5,
  },
  statContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statLabel: {
    fontFamily: 'Raleway-Medium',
    fontSize: 14,
    color: '#d4d4d8',
  },
  statValue: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    color: '#0d9488',
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  settingLabel: {
    fontFamily: 'Raleway-Medium',
    fontSize: 16,
    color: '#ffffff',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
});

export default Profile;