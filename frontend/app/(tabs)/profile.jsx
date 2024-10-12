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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getCurrentUser, Config, databases,uploadImage,storage } from '../../appwrite';

const Profile = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    height: '',
    weight: '',
    allergies: '',
    emergencyContact: '',
    avatar: '',
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
    fetchUserData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setUserData({
          name: user.username,
          email: user.email,
          phone: user.phone || '',
          dateOfBirth: user.dateOfBirth || '',
          gender: user.gender || '',
          bloodType: user.bloodType || '',
          height: user.height || '',
          weight: user.weight || '',
          allergies: user.allergies || '',
          emergencyContact: user.emergencyContact || '',
          avatar: user.avatar || '',
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to fetch user data');
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        await databases.updateDocument(
          Config.databaseId,
          Config.userCollectionId,
          user.$id,
          {
            username: userData.name,
            phone: userData.phone,
            dateOfBirth: userData.dateOfBirth,
            gender: userData.gender,
            bloodType: userData.bloodType,
            height: userData.height,
            weight: userData.weight,
            allergies: userData.allergies,
            emergencyContact: userData.emergencyContact,
          }
        );
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // Navigate to login screen or perform any other necessary actions after logout
      navigation.navigate('Login'); // Adjust this based on your navigation structure
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const toggleSetting = (setting) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [setting]: !prevSettings[setting]
    }));
  };

  const handleImageUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        const user = await getCurrentUser();
        if (user) {
          const fileUrl = await uploadImage(result.uri);

          await databases.updateDocument(
            Config.databaseId,
            Config.userCollectionId,
            user.$id,
            { avatar: fileUrl }
          );

          setUserData({ ...userData, avatar: fileUrl });
          Alert.alert('Success', 'Profile picture updated successfully');
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload profile picture');
    }
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
            <TouchableOpacity onPress={handleImageUpload}>
              <Image
                source={userData.avatar ? { uri: userData.avatar } : require('../../assets/images/12.jpeg')}
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