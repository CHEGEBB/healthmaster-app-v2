import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  ImageBackground,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const AddMedication = ({ navigation }) => {
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [medicineImage, setMedicineImage] = useState(null);

  const medicationStyles = [
    { icon: 'pill', label: 'Capsule' },
    { icon: 'needle', label: 'Injection' },
    { icon: 'tablet', label: 'Solid' },
    { icon: 'cup-water', label: 'Liquid' },
  ];

  const timeSlots = [
    { id: 1, time: '08:00 AM' },
    { id: 2, time: '12:00 PM' },
    { id: 3, time: '04:00 PM' },
    { id: 4, time: '08:00 PM' },
  ];

  const handleAddMedication = () => {
    // Implement your logic to add medication
    console.log('Medication added:', {
      name: medicationName,
      dosage,
      startDate,
      endDate,
      time: timeSlots.find(slot => slot.id === selectedTime)?.time,
      style: medicationStyles[selectedStyle].label,
      image: medicineImage,
    });
    navigation.goBack();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setMedicineImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
       <View style={styles.ImageWrapper}>
      <ImageBackground
        source={require('../assets/images/register.png')}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerHeading}>Add Medication</Text>
      </ImageBackground>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Medication Name</Text>
          <View style={styles.textInputContainer}>
            <Ionicons name="medical-outline" size={24} color="#6B7280" />
            <TextInput
              style={styles.textInput}
              placeholder="Enter medication name"
              placeholderTextColor="#9CA3AF"
              value={medicationName}
              onChangeText={setMedicationName}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Medication Dosage</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>1</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={3}
              step={1}
              minimumTrackTintColor="#3B82F6"
              maximumTrackTintColor="#1F2937"
              thumbTintColor="#3B82F6"
              value={dosage}
              onValueChange={setDosage}
            />
            <Text style={styles.sliderLabel}>3</Text>
          </View>
          <Text style={styles.dosageText}>{`${dosage} time${dosage > 1 ? 's' : ''} per day`}</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Medication Duration</Text>
          <View style={styles.dateContainer}>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowStartDatePicker(true)}
            >
              <MaterialCommunityIcons name="calendar" size={24} color="#6B7280" />
              <Text style={styles.dateText}>
                {startDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowEndDatePicker(true)}
            >
              <MaterialCommunityIcons name="calendar" size={24} color="#6B7280" />
              <Text style={styles.dateText}>
                {endDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Time</Text>
          <View style={styles.timeContainer}>
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.timeSlot,
                  selectedTime === slot.id && styles.selectedTimeSlot,
                ]}
                onPress={() => setSelectedTime(slot.id)}
              >
                <MaterialCommunityIcons 
                  name="clock-outline" 
                  size={24} 
                  color={selectedTime === slot.id ? '#FFFFFF' : '#6B7280'} 
                />
                <Text style={[
                  styles.timeText,
                  selectedTime === slot.id && styles.selectedTimeText,
                ]}>
                  {slot.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Medication Style</Text>
          <View style={styles.styleContainer}>
            {medicationStyles.map((style, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.styleButton,
                  selectedStyle === index && styles.selectedStyleButton,
                ]}
                onPress={() => setSelectedStyle(index)}
              >
                <MaterialCommunityIcons 
                  name={style.icon} 
                  size={30} 
                  color={selectedStyle === index ? '#FFFFFF' : '#6B7280'} 
                />
                <Text style={[
                  styles.styleText,
                  selectedStyle === index && styles.selectedStyleText,
                ]}>
                  {style.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={pickImage}
        >
          <MaterialCommunityIcons name="image-plus" size={24} color="#FFFFFF" />
          <Text style={styles.uploadButtonText}>Upload Medicine Image</Text>
        </TouchableOpacity>

        {medicineImage && (
          <Image source={{ uri: medicineImage }} style={styles.medicineImage} />
        )}

        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddMedication}
        >
          <Text style={styles.addButtonText}>Add Medication</Text>
          <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}
    </ScrollView>
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
  ImageWrapper:{
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#14b8a6',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.3,
    elevation: 5,


  },
  header: {
    width: '100%',
    height: 300,
    justifyContent: 'flex-end',

  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    borderWidth:2,
borderColor:"#fff",
borderRadius:5,
  },
  headerHeading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    marginLeft : 20,
    alignSelf: 'flex-start',
    fontFamily: "Rubik-Bold",
   
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
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 56,
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 16,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  sliderLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  dosageText: {
    color: '#3B82F6',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 15,
    width: '48%',
  },
  dateText: {
    color: '#FFFFFF',
    marginLeft: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: '48%',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedTimeSlot: {
    backgroundColor: '#3B82F6',
  },
  timeText: {
    color: '#6B7280',
    marginTop: 5,
  },
  selectedTimeText: {
    color: '#FFFFFF',
  },
  styleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  styleButton: {
    width: '48%',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedStyleButton: {
    backgroundColor: '#3B82F6',
  },
  styleText: {
    color: '#6B7280',
    marginTop: 5,
  },
  selectedStyleText: {
    color: '#FFFFFF',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
  },
  medicineImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default AddMedication;