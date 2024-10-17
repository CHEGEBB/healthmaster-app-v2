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
  Modal,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentUser, Config, databases } from '../../appwrite';

// Import all avatar images
const avatarImages = {
  avatar1: require('../../assets/images/avatars/1.png'),
  avatar2: require('../../assets/images/avatars/2.png'),
  avatar3: require('../../assets/images/avatars/3.png'),
  avatar4: require('../../assets/images/avatars/4.png'),
  avatar5: require('../../assets/images/avatars/5.png'),
  avatar6: require('../../assets/images/avatars/6.png'),
  avatar7: require('../../assets/images/avatars/7.png'),
  avatar8: require('../../assets/images/avatars/8.png'),
  avatar9: require('../../assets/images/avatars/9.png'),
  avatar10: require('../../assets/images/avatars/10.png'),
  avatar11: require('../../assets/images/avatars/11.png'),
  avatar12: require('../../assets/images/avatars/12.png'),
};

const Profile = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
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
    avatar: 'avatar1',
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

  const avatars = Object.keys(avatarImages);

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
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          dateOfBirth: user.dateOfBirth || '',
          gender: user.gender || '',
          bloodType: user.bloodType || '',
          height: user.height || '',
          weight: user.weight || '',
          allergies: user.allergies || '',
          emergencyContact: user.emergencyContact || '',
          avatar: user.avatar || 'avatar1',
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
            name: userData.name,
            phone: userData.phone,
            dateOfBirth: userData.dateOfBirth,
            gender: userData.gender,
            bloodType: userData.bloodType,
            height: userData.height,
            weight: userData.weight,
            allergies: userData.allergies,
            emergencyContact: userData.emergencyContact,
            avatar: userData.avatar,
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
      navigation.navigate('Login');
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

  const handleAvatarSelection = (avatar) => {
    setUserData({ ...userData, avatar });
    setShowAvatarModal(false);
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

  const renderAvatarItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleAvatarSelection(item)}>
      <Image source={avatarImages[item]} style={styles.avatarOption} />
    </TouchableOpacity>
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
            <TouchableOpacity onPress={() => setShowAvatarModal(true)}>
              <Image
                source={avatarImages[userData.avatar]}
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

      <Modal
        visible={showAvatarModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAvatarModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose an Avatar</Text>
            <FlatList
              data={avatars}
              renderItem={renderAvatarItem}
              keyExtractor={(item) => item}
              numColumns={3}
              contentContainerStyle={styles.avatarList}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAvatarModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#4b5563',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  avatarList: {
    alignItems: 'center',
  },
  avatarOption: {
    width: 80,
    height: 80,
    borderRadius: 40,
    margin: 10,
  },
  closeButton: {
    backgroundColor: '#0d9488',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
});

export default Profile;