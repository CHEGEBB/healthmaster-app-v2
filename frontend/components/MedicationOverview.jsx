import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import * as Appwrite from '../appwrite';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width, height } = Dimensions.get('window');

const EditMedicationModal = ({ visible, medication, onClose, onUpdate }) => {
  const [name, setName] = useState(medication?.name || '');
  const [dosage, setDosage] = useState(medication?.dosage || '');
  const [time, setTime] = useState(medication?.timeOfDay || '');
  const [quantity, setQuantity] = useState(medication?.quantity || '');
  const [startDate, setStartDate] = useState(new Date(medication?.startDate || Date.now()));
  const [endDate, setEndDate] = useState(new Date(medication?.endDate || Date.now()));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  const handleUpdate = async () => {
    try {
      const updatedData = {
        name,
        dosage,
        timeOfDay: time,
        quantity,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      await Appwrite.updateMedication(medication.$id, updatedData);
      onUpdate();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update medication');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Medication</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalForm}>
            <Text style={styles.inputLabel}>Medication Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter medication name"
              placeholderTextColor="#94a3b8"
            />

            <Text style={styles.inputLabel}>Dosage</Text>
            <TextInput
              style={styles.input}
              value={dosage}
              onChangeText={setDosage}
              placeholder="Enter dosage"
              placeholderTextColor="#94a3b8"
            />

            <Text style={styles.inputLabel}>Time of Day</Text>
            <TextInput
              style={styles.input}
              value={time}
              onChangeText={setTime}
              placeholder="Enter time of day"
              placeholderTextColor="#94a3b8"
            />

            <Text style={styles.inputLabel}>Quantity</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="Enter quantity"
              placeholderTextColor="#94a3b8"
            />

            <TouchableOpacity 
              style={styles.dateButton} 
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={styles.dateButtonText}>
                Start Date: {startDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dateButton} 
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={styles.dateButtonText}>
                End Date: {endDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                onChange={(event, selectedDate) => {
                  setShowStartPicker(false);
                  if (selectedDate) setStartDate(selectedDate);
                }}
              />
            )}

            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                onChange={(event, selectedDate) => {
                  setShowEndPicker(false);
                  if (selectedDate) setEndDate(selectedDate);
                }}
              />
            )}

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
              <Text style={styles.updateButtonText}>Update Medication</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const SuccessMessage = ({ visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.successMessage}>
      <Feather name="check-circle" size={24} color="#22c55e" />
      <Text style={styles.successText}>Successfully updated!</Text>
    </View>
  );
};

const MedicationOverview = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [medications, setMedications] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    { id: '1', name: 'All', icon: 'apps', color: '#0d9488' },
    { id: '2', name: 'Heart', icon: 'fitness-outline', color: '#ef4444' },
    { id: '3', name: 'Brain', icon: 'invert-mode-outline', color: '#8b5cf6' },
    { id: '4', name: 'Painkillers', icon: 'bandage', color: '#f59e0b' },
    { id: '5', name: 'Antibiotics', icon: 'flask', color: '#10b981' },
  ];

  const recommendedMedications = [
    { 
      id: '101', 
      name: 'Vitamin D3', 
      image: require('../assets/images/vitamind.jpeg'), 
      dosage: '2000 IU', 
      description: 'Supports bone health' 
    },
    { 
      id: '102', 
      name: 'Omega-3', 
      image: require('../assets/images/omega3.jpeg'), 
      dosage: '1000mg', 
      description: 'Heart health supplement' 
    },
    { 
      id: '103', 
      name: 'Magnesium', 
      image: require('../assets/images/magnesium.jpeg'), 
      dosage: '400mg', 
      description: 'Supports muscle function' 
    },
  ];

  const fetchMedications = useCallback(async () => {
    try {
      const fetchedMedications = await Appwrite.fetchMedications();
      setMedications(fetchedMedications);
    } catch (error) {
      console.error("Error fetching medications:", error);
      Alert.alert("Error", "Failed to fetch medications");
    }
  }, []);

  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleComplete = async (medicationId) => {
    try {
      await Appwrite.completeMedication(medicationId);
      showSuccessMessage();
      fetchMedications();
    } catch (error) {
      Alert.alert("Error", "Failed to complete medication");
    }
  };

  const handleDelete = async (medicationId) => {
    try {
      await Appwrite.deleteMedication(medicationId);
      fetchMedications();
    } catch (error) {
      Alert.alert("Error", "Failed to delete medication");
    }
  };

  const handleEdit = (medication) => {
    setSelectedMedication(medication);
    setEditModalVisible(true);
  };

  const renderMedicationCard = (med) => (
    <View key={med.$id} style={styles.medicationCard}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: med.imageUrl }} style={styles.medicationImage} />
        <View style={styles.cardActionButtonsVertical}>
          <TouchableOpacity 
            onPress={() => handleComplete(med.$id)} 
            style={styles.cardActionButton}
          >
            <Feather name="check-circle" size={20} color="#22c55e" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleEdit(med)} 
            style={styles.cardActionButton}
          >
            <Feather name="edit" size={20} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleDelete(med.$id)} 
            style={styles.cardActionButton}
          >
            <Feather name="trash-2" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.medicationInfo}>
        <Text style={styles.medicationName}>{med.name}</Text>
        <Text style={styles.medicationDosage}>{med.dosage}</Text>
        <Text style={styles.medicationTime}>{med.timeOfDay}</Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.medicationCardEmpty}>
      <TouchableOpacity
        style={[styles.emptyStateContainer]}
        onPress={() => navigation.navigate('AddMedication')}
      >
        <Feather name="plus-circle" size={68} color="#DDD" />
        <Text style={styles.emptyStateText}>Add Your First Medication</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderRecommendedCard = (med) => (
    <TouchableOpacity key={med.id} style={styles.recommendedCard}>
      <Image source={med.image} style={styles.recommendedImage} />
      <View style={styles.recommendedInfo}>
        <Text style={styles.recommendedName}>{med.name}</Text>
        <Text style={styles.recommendedDosage}>{med.dosage}</Text>
        <Text style={styles.recommendedDescription}>{med.description}</Text>
      </View>
      <Feather name="chevron-right" size={24} color="#94a3b8" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/land1.png')}
        style={styles.header}
        imageStyle={styles.headerImage}
      >
        <LinearGradient
          colors={['rgba(4, 47, 46, 0.1)', '#374151']}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>My Medications</Text>
          <View style={styles.searchBar}>
            <Feather name="search" size={24} color="#ffffff" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search medications..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </LinearGradient>
      </ImageBackground>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.name && styles.activeCategoryCard,
                  { backgroundColor: selectedCategory === category.name ? category.color : '#134e4a' }
                ]}
                onPress={() => setSelectedCategory(category.name)}
              >
                <Ionicons 
                  name={category.icon} 
                  size={24} 
                  color={selectedCategory === category.name ? '#ffffff' : '#94a3b8'} 
                />
                <Text style={[
                  styles.categoryName,
                  selectedCategory === category.name && styles.activeCategoryName
                ]}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Medications</Text>
          <View style={styles.medicationGrid}>
            {medications.length > 0 
              ? medications.map(renderMedicationCard)
              : renderEmptyState()}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <View style={styles.recommendedContainer}>
            {recommendedMedications.map(renderRecommendedCard)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medication Schedule</Text>
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <Feather name="calendar" size={24} color="#94a3b8" />
              <Text style={styles.scheduleTitle}>Today's Schedule</Text>
            </View>
            {medications.map(med => (
              <View key={med.$id} style={styles.scheduleItem}>
                <Text style={styles.scheduleTime}>{med.timeOfDay}</Text>
                <Text style={styles.scheduleName}>{med.name}</Text>
                <Text style={styles.scheduleDosage}>{med.dosage}</Text>
                <View style={styles.scheduleActions}>
                  <TouchableOpacity 
                    onPress={() => handleComplete(med.$id)} 
                    style={styles.actionButton}
                  >
                    <Feather name="check-circle" size={20} color="#22c55e" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleEdit(med)} 
                    style={styles.actionButton}
                  >
                    <Feather name="edit" size={20} color="#3b82f6" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
      
      <EditMedicationModal
        visible={editModalVisible}
        medication={selectedMedication}
        onClose={() => setEditModalVisible(false)}
        onUpdate={() => {
          fetchMedications();
          showSuccessMessage();
        }}
      />

      <SuccessMessage visible={showSuccess} />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddMedication')}
      >
        <LinearGradient
          colors={['#059669', '#047857']}
          style={styles.addButtonGradient}
        >
          <Feather name="plus" size={24} color="#ffffff" />
          <Text style={styles.addButtonText}>Add Medication</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  header: {
    height: 350,
    justifyContent: 'flex-end',
  },
  headerImage: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerGradient: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#ffffff',
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#134e4a',
    borderRadius: 10,
    padding: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Raleway-Regular',
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 10,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  categoriesContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#134e4a',
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    minWidth: 100,
  },
  activeCategoryCard: {
    backgroundColor: '#0d9488',
  },
  categoryName: {
    fontFamily: 'Raleway-Medium',
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 5,
  },
  activeCategoryName: {
    color: '#ffffff',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 15,
  },
  medicationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 50,
  },
  medicationCard: {
    width: '48%',
    height: 250,
    backgroundColor: '#134e4a',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  medicationImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  medicationInfo: {
    padding: 10,
  },
  medicationName: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    color: '#ffffff',
  },
  medicationDosage: {
    fontFamily: 'Raleway-Regular',
    fontSize: 14,
    color: '#94a3b8',
  },
  medicationTime: {
    fontFamily: 'Raleway-Regular',
    fontSize: 14,
    color: '#94a3b8',
  },
  recommendedContainer: {
    marginTop: 10,
  },
  recommendedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#134e4a',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  recommendedImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  recommendedInfo: {
    flex: 1,
    marginLeft: 15,
  },
  recommendedName: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    color: '#ffffff',
  },
  recommendedDosage: {
    fontFamily: 'Raleway-Regular',
    fontSize: 14,
    color: '#94a3b8',
  },
  recommendedDescription: {
    fontFamily: 'Raleway-Regular',
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 5,
  },
  scheduleCard: {
    backgroundColor: '#134e4a',
    borderRadius: 15,
    padding: 15,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  scheduleTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#ffffff',
    marginLeft: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#0f766e',
  },
  scheduleTime: {
    fontFamily: 'Rubik-Medium',
    fontSize: 14,
    color: '#22d3ee',
    width: '25%',
  },
  scheduleName: {
    fontFamily: 'Raleway-Medium',
    fontSize: 14,
    color: '#ffffff',
    width: '45%',
  },
  scheduleDosage: {
    fontFamily: 'Raleway-Regular',
    fontSize: 14,
    color: '#94a3b8',
    width: '30%',
    textAlign: 'right',
  },
  bottomPadding: {
    height: 100,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  addButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 10,
  },
  placeholderCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: 'Raleway-Medium',
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 10,
  },
  scheduleActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '25%',
  },
  pastMedicationsContainer: {
    backgroundColor: '#134e4a',
    borderRadius: 15,
    padding: 15,
  },
  pastMedicationItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#0f766e',
    paddingVertical: 10,
  },
  pastMedicationName: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    color: '#ffffff',
  },
  pastMedicationDosage: {
    fontFamily: 'Raleway-Regular',
    fontSize: 14,
    color: '#94a3b8',
  },
  pastMedicationDate: {
    fontFamily: 'Raleway-Regular',
    fontSize: 12,
    color: '#64748b',
    marginTop: 5,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#0f766e',
  },
  scheduleTime: {
    fontFamily: 'Rubik-Medium',
    fontSize: 14,
    color: '#22d3ee',
    width: '20%',
  },
  scheduleName: {
    fontFamily: 'Raleway-Medium',
    fontSize: 14,
    color: '#ffffff',
    width: '35%',
  },
  scheduleDosage: {
    fontFamily: 'Raleway-Regular',
    fontSize: 14,
    color: '#94a3b8',
    width: '20%',
  },
  scheduleActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '25%',
  },
  actionButton: {
    marginLeft: 10,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  medicationImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardActionButtons: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderRadius: 20,
    padding: 4,
  },
  cardActionButton: {
    marginHorizontal: 4,
    padding: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicationCardEmpty: {
    width: '60%',
    height: 160,
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#0d9488',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    aspectRatio: 1.5,
    top: 30,
  },
  emptyStateText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    fontFamily : "Raleway-SemiBold",
    textAlign: 'center',
  },
  medicationInfo: {
    padding: 10,
 
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.8,
    height: height * 0.8,
    backgroundColor: '#1f2937',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#ffffff',
  },
  modalForm: {
    flex: 1,
  },
  inputLabel: {
    fontFamily: 'Raleway-Medium',
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 10,
    padding: 12,
    color: '#ffffff',
    marginBottom: 16,
  },
  dateButton: {
    backgroundColor: '#374151',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  dateButtonText: {
    color: '#ffffff',
    fontFamily: 'Raleway-Medium',
  },
  updateButton: {
    backgroundColor: '#059669',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: '#ffffff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  successMessage: {
    position: 'absolute',
    top: 100,
    left: width * 0.1,
    right: width * 0.1,
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    color: '#ffffff',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginLeft: 10,
  },
  cardActionButtonsVertical: {
    position: 'absolute',
    top: "110%",
    right: 4,
    flexDirection: 'column',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderRadius: 20,
    padding: 4,
    gap: 6,
  },
  placeholderCard: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContent: {
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontFamily: 'Raleway-Medium',
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default MedicationOverview;