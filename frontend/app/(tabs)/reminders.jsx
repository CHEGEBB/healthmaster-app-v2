import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  Dimensions,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const MEDICATION_IMAGES = [
  { id: '1', source: require('../../assets/images/aspirin.jpeg'), name: 'Aspirin' },
  { id: '2', source: require('../../assets/images/simvastatin.jpeg'), name: 'Simvastatin' },
  { id: '3', source: require('../../assets/images/amoxicillin.jpeg'), name: 'Amoxicillin' },
  { id: '4', source: require('../../assets/images/sertraline.jpeg'), name: 'Sertraline' },
];

const NOTIFICATION_SOUNDS = [
  { id: '1', name: 'Default', sound: 'default_sound' },
  { id: '2', name: 'Chime', sound: 'chime_sound' },
  { id: '3', name: 'Bell', sound: 'bell_sound' },
  { id: '4', name: 'Chirp', sound: 'chirp_sound' },
];

const Reminders = ({ navigation }) => {
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderType, setReminderType] = useState('medication');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [selectedSound, setSelectedSound] = useState(NOTIFICATION_SOUNDS[0]);
  const [showSoundModal, setShowSoundModal] = useState(false);
  const [reminders, setReminders] = useState([]);

  const animationRef = useRef(null);

  const handleSetReminder = () => {
    const newReminder = {
      id: Date.now().toString(),
      title: reminderTitle,
      type: reminderType,
      date: date.toLocaleDateString(),
      time: time.toLocaleTimeString(),
      notes,
      medication: selectedMedication,
      sound: selectedSound,
    };

    setReminders([...reminders, newReminder]);
    setShowSuccessModal(true);
    if (animationRef.current) {
      animationRef.current.play();
    }
  };

  const resetForm = () => {
    setReminderTitle('');
    setReminderType('medication');
    setDate(new Date());
    setTime(new Date());
    setNotes('');
    setSelectedMedication(null);
    setSelectedSound(NOTIFICATION_SOUNDS[0]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <LinearGradient
          colors={['rgba(76, 102, 159, 0.8)', 'rgba(59, 89, 152, 0.8)', 'rgba(25, 47, 106, 0.8)']}
          style={styles.header}
        >
          <Image
            source={require('../../assets/images/bg.jpeg')}
            style={styles.headerBackground}
          />
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
  <MaterialCommunityIcons name="chevron-left" size={30} color="#FFFFFF" />
</TouchableOpacity>

          <Text style={styles.headerHeading}>Set Reminder</Text>
          <View style={styles.reminderCountContainer}>
            <Ionicons name="alarm-outline" size={24} color="#FFFFFF" />
            <Text style={styles.reminderCount}>{reminders.length}</Text>
          </View>
        </LinearGradient>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reminder Title</Text>
            <View style={styles.textInputContainer}>
              <Ionicons name="notifications-outline" size={24} color="#6B7280" />
              <TextInput
                style={styles.textInput}
                placeholder="Enter reminder title"
                placeholderTextColor="#9CA3AF"
                value={reminderTitle}
                onChangeText={setReminderTitle}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reminder Type</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[styles.typeButton, reminderType === 'medication' && styles.selectedTypeButton]}
                onPress={() => setReminderType('medication')}
              >
                <MaterialCommunityIcons 
                  name="pill" 
                  size={24} 
                  color={reminderType === 'medication' ? '#FFFFFF' : '#6B7280'} 
                />
                <Text style={[styles.typeText, reminderType === 'medication' && styles.selectedTypeText]}>
                  Medication
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, reminderType === 'appointment' && styles.selectedTypeButton]}
                onPress={() => setReminderType('appointment')}
              >
                <MaterialCommunityIcons 
                  name="calendar-clock" 
                  size={24} 
                  color={reminderType === 'appointment' ? '#FFFFFF' : '#6B7280'} 
                />
                <Text style={[styles.typeText, reminderType === 'appointment' && styles.selectedTypeText]}>
                  Appointment
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {reminderType === 'medication' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Medication</Text>
              <TouchableOpacity
                style={styles.medicationImageButton}
                onPress={() => setShowMedicationModal(true)}
              >
                {selectedMedication ? (
                  <View style={styles.selectedMedicationContainer}>
                    <Image source={selectedMedication.source} style={styles.medicationImage} />
                    <Text style={styles.medicationName}>{selectedMedication.name}</Text>
                  </View>
                ) : (
                  <Text style={styles.medicationImagePlaceholder}>Select Medication</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity 
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <MaterialCommunityIcons name="calendar" size={24} color="#6B7280" />
              <Text style={styles.dateTimeText}>
                {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time</Text>
            <TouchableOpacity 
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <MaterialCommunityIcons name="clock-outline" size={24} color="#6B7280" />
              <Text style={styles.dateTimeText}>
                {time.toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notification Sound</Text>
            <TouchableOpacity 
              style={styles.dateTimeButton}
              onPress={() => setShowSoundModal(true)}
            >
              <MaterialCommunityIcons name="volume-high" size={24} color="#6B7280" />
              <Text style={styles.dateTimeText}>
                {selectedSound.name}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <View style={styles.textInputContainer}>
              <MaterialCommunityIcons name="notebook-outline" size={24} color="#6B7280" />
              <TextInput
                style={[styles.textInput, styles.notesInput]}
                placeholder="Add any additional notes"
                placeholderTextColor="#9CA3AF"
                value={notes}
                onChangeText={setNotes}
                multiline
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.setReminderButton}
            onPress={handleSetReminder}
          >
            <Text style={styles.setReminderButtonText}>Set Reminder</Text>
            <MaterialCommunityIcons name="alarm-plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) setTime(selectedTime);
            }}
          />
        )}

        <Modal
          transparent={true}
          visible={showSuccessModal}
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <LottieView
                ref={animationRef}
                source={require('../../assets/animations/success.json')}
                autoPlay
                loop={false}
                style={styles.successAnimation}
              />
              <Text style={styles.successText}>Reminder Set Successfully!</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setShowSuccessModal(false);
                  resetForm();
                }}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          transparent={true}
          visible={showMedicationModal}
          onRequestClose={() => setShowMedicationModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Medication</Text>
              <FlatList
                data={MEDICATION_IMAGES}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.medicationItem}
                    onPress={() => {
                      setSelectedMedication(item);
                      setShowMedicationModal(false);
                    }}
                  >
                    <Image source={item.source} style={styles.medicationItemImage} />
                    <Text style={styles.medicationItemName}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
              />
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowMedicationModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          transparent={true}
          visible={showSoundModal}
          onRequestClose={() => setShowSoundModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Notification Sound</Text>
              <FlatList
                data={NOTIFICATION_SOUNDS}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.soundItem}
                    onPress={() => {
                      setSelectedSound(item);
                      setShowSoundModal(false);
                    }}
                  >
                    <Text style={styles.soundItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
              />
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowSoundModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  contentContainer: {
    paddingBottom: 80,
  },
  header: {
    width: '100%',
    height: 300,
    justifyContent: 'flex-end',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 5,
  },
  headerHeading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    marginLeft: 20,
    fontFamily: "Rubik-Bold",
  },
  reminderCountContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 5,
    fontFamily: "Raleway-Regular",
  },
  reminderCount: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
    fontFamily: "Raleway-Regular",
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
    fontFamily: "Raleway-Regular",
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
    fontFamily: "Raleway-Regular",
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 15,
    minHeight: 56,
    fontFamily: "Outfit-Regular",
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: "Outfit-Regular",
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'center',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 15,
    width: '48%',
    fontFamily: "Outfit-Regular",

  },
  selectedTypeButton: {
    backgroundColor: '#3B82F6',
  },
  typeText: {
    color: '#6B7280',
    marginLeft: 10,
  },
  selectedTypeText: {
    color: '#FFFFFF',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 15,
  },
  dateTimeText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "Kanit-Regular",
  },
  setReminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
  },
  setReminderButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    fontFamily: "Kanit-Regular",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    backgroundColor: '#374151',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    width: '80%',
    fontFamily: "Kanit-Regular",
    color: '#fff',

  },
  successAnimation: {
    width: 200,
    height: 200,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 20,
    fontFamily: "Kanit-Regular",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    padding: 10,
    fontFamily: "Kanit-Regular",
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: "Kanit-Regular",
  },
  medicationImageButton: {
    backgroundColor: '#1F2937',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedMedicationContainer: {
    alignItems: 'center',
  },
  medicationImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 50,
    borderWidth:2,
borderColor:"#059669",
  },
  medicationName: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
    fontFamily: "Jost-Regular",

  },
  medicationImagePlaceholder: {
    color: '#6B7280',
    fontSize: 16,
    fontFamily: "Jost-Regular",

  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    fontFamily: "Jost-Regular",
    color: '#FFFFFF',


  },
  medicationItem: {
    width: '50%',
    padding: 10,
    alignItems: 'center',
  },
  medicationItemImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 40,
    borderWidth:2,
borderColor:"#059669",
  },
  medicationItemName: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
    color: '#FFFFFF',

  },
  soundItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  soundItemText: {
    fontSize: 16,
    color: '#111827',
  },
});

export default Reminders;