import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Alert,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { createMedication } from '../appwrite';
import LottieView from 'lottie-react-native';
import { Picker } from '@react-native-picker/picker';

const AddMedication = ({ navigation }) => {
  const [medicationName, setMedicationName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [dosage, setDosage] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);

  const animationRef = useRef(null);

  const medicationStyles = [
    { icon: 'pill', label: 'Capsule' },
    { icon: 'needle', label: 'Injection' },
    { icon: 'tablet', label: 'Solid' },
    { icon: 'cup-water', label: 'Liquid' },
  ];

  const medicationImages = [
    { name: 'Aspirin', url: 'https://cloud.appwrite.io/v1/storage/buckets/670fa2bd0016e53a0e6f/files/670fa2da000dea3766b6/view?project=6704d37c003c8a2f6a36&project=6704d37c003c8a2f6a36&mode=admin' },
    { name: 'Ibuprofen', url: 'https://cloud.appwrite.io/v1/storage/buckets/670fa2bd0016e53a0e6f/files/670fa2e4003836be6e18/view?project=6704d37c003c8a2f6a36&project=6704d37c003c8a2f6a36&mode=admin' },
    { name: 'Sertraline', url: 'https://cloud.appwrite.io/v1/storage/buckets/670fa2bd0016e53a0e6f/files/670fa2f400086b2d51be/view?project=6704d37c003c8a2f6a36&project=6704d37c003c8a2f6a36&mode=admin' },
    { name: 'Simvastatin', url: 'https://cloud.appwrite.io/v1/storage/buckets/670fa2bd0016e53a0e6f/files/670fa2fd002cdedfe35e/view?project=6704d37c003c8a2f6a36&project=6704d37c003c8a2f6a36&mode=admin' },
    { name: 'General pill', url: 'https://cloud.appwrite.io/v1/storage/buckets/670fa2bd0016e53a0e6f/files/670fa7e50000b66b7ef9/view?project=6704d37c003c8a2f6a36&project=6704d37c003c8a2f6a36&mode=admin' },
    { name: 'Paracetamol', url: 'https://cloud.appwrite.io/v1/storage/buckets/670fa2bd0016e53a0e6f/files/670fb4dd003d5cca6244/view?project=6704d37c003c8a2f6a36&project=6704d37c003c8a2f6a36&mode=admin' },
    { name: 'Amoxicillin', url: 'https://cloud.appwrite.io/v1/storage/buckets/670fa2bd0016e53a0e6f/files/670fb510003464a09c60/view?project=6704d37c003c8a2f6a36&project=6704d37c003c8a2f6a36&mode=admin' },
    { name: 'Omeprazole', url: 'https://cloud.appwrite.io/v1/storage/buckets/670fa2bd0016e53a0e6f/files/670fb577000514fc5c89/view?project=6704d37c003c8a2f6a36&project=6704d37c003c8a2f6a36&mode=admin' },
    { name: 'Metformin', url: 'https://cloud.appwrite.io/v1/storage/buckets/670fa2bd0016e53a0e6f/files/670fb59a0039ea514bb7/view?project=6704d37c003c8a2f6a36&project=6704d37c003c8a2f6a36&mode=admin' },
    { name: 'Lisinopril', url: 'https://cloud.appwrite.io/v1/storage/buckets/670fa2bd0016e53a0e6f/files/670fb5be0013646511b8/view?project=6704d37c003c8a2f6a36&project=6704d37c003c8a2f6a36&mode=admin' },
  ];

  const handleAddMedication = async () => {
    try {
      if (!medicationName || !quantity || !selectedTime || !selectedImage) {
        Alert.alert('Error', 'Please fill in all required fields and select an image');
        return;
      }

      const medicationDetails = {
        name: medicationName,
        quantity,
        dosage,
        startDate,
        endDate,
        time: selectedTime,
        style: medicationStyles[selectedStyle].label,
        imageUrl: selectedImage,
      };

      await createMedication(medicationDetails);
      setShowSuccess(true);
      animationRef.current?.play();
      setTimeout(() => {
        setShowSuccess(false);
        navigation.goBack();
      }, 5000);
    } catch (error) {
      console.error('Error adding medication:', error);
      Alert.alert('Error', 'Failed to add medication. Please try again.');
    }
  };

  const renderImageSelection = () => {
    const displayedImages = showAllImages ? medicationImages : medicationImages.slice(0, 4);

    return (
      <View>
        <View style={styles.imageContainer}>
          {displayedImages.map((image, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.imageButton,
                selectedImage === image.url && styles.selectedImageButton,
              ]}
              onPress={() => setSelectedImage(image.url)}
            >
              <Image 
                source={{ uri: image.url }} 
                style={styles.medicationImage} 
              />
              <Text style={styles.imageText}>{image.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {!showAllImages && (
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() => setShowAllImages(true)}
          >
            <Text style={styles.showMoreButtonText}>Show More</Text>
          </TouchableOpacity>
        )}
        {showAllImages && (
          <Picker
            selectedValue={selectedImage}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedImage(itemValue)}
          >
            {medicationImages.map((image, index) => (
              <Picker.Item key={index} label={image.name} value={image.url} />
            ))}
          </Picker>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.ImageWrapper}>
        <ImageBackground
          source={require('../assets/images/md.jpeg')}
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
          <Text style={styles.label}>Quantity</Text>
          <View style={styles.textInputContainer}>
            <Ionicons name="flask-outline" size={24} color="#6B7280" />
            <TextInput
              style={styles.textInput}
              placeholder="eg 200mg"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
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
      value={Number(dosage)}
      onValueChange={(value) => setDosage(value.toString())}
    />
    <Text style={styles.sliderLabel}>3</Text>
  </View>
  <Text style={styles.dosageText}>{`${dosage} time${Number(dosage) > 1 ? 's' : ''} per day`}</Text>
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
          <View style={styles.textInputContainer}>
            <Ionicons name="time-outline" size={24} color="#6B7280" />
            <TextInput
              style={styles.textInput}
              placeholder="Enter time (e.g., 08:00 AM)"
              placeholderTextColor="#9CA3AF"
              value={selectedTime}
              onChangeText={setSelectedTime}
            />
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
       
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Medication Image</Text>
          {renderImageSelection()}
        </View>

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

      {showSuccess && (
        <View style={styles.successOverlay}>
          <View style={styles.success}>
          <LottieView
            ref={animationRef}
            source={require('../assets/animations/success.json')}
            autoPlay
            loop={false}
            style={styles.successAnimation}
          />
          <Text style={styles.successText}>Medication added successfully!😊</Text>
          </View>
        </View>
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
    alignSelf: 'flex-start',
    fontFamily: "Rubik-Bold",
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
    imageContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    imageButton: {
      width: '48%',
      backgroundColor: '#1F2937',
      borderRadius: 12,
      padding: 10,
      alignItems: 'center',
      marginBottom: 10,
    },
    selectedImageButton: {
      borderColor: '#3B82F6',
      borderWidth: 2,
    },
    medicationImage: {
      width: "100%",
      height: 80,
      borderRadius: 8,
    },
    imageText: {
      color: '#FFFFFF',
      marginTop: 5,
      fontSize: 12,
    },
    showMoreButton: {
      backgroundColor: '#3B82F6',
      borderRadius: 12,
      padding: 10,
      alignItems: 'center',
      marginTop: 10,
    },
    showMoreButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    picker: {
      backgroundColor: '#1F2937',
      color: '#FFFFFF',
      marginTop: 10,
    },
    successOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    successAnimation: {
      width: 200,
      height: 200,
      position: 'absolute',
      top: '70%',
      left: '50%',
      transform: [{ translateX: -100 }, { translateY: -100 }],
      zIndex: 10,
    },
    successText: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 20,
      position: 'absolute',
      top: '90%',
      left: '50%',
      transform: [{ translateX: -160 }, { translateY: 80 }],
      zIndex: 10,
    },
    success :{
      backgroundColor: '#FFF',
      padding: 20,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowRadius: 10,
      shadowOpacity: 0.3,
      elevation: 5,
      position: 'absolute',
      top: '80%',
      left: '80%',
      transform: [{ translateX: -100 }, { translateY: -100 }],
      zIndex: 10,
    }
  });

export default AddMedication;