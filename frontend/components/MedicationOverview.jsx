import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const MedicationOverview = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const medications = [
    { id: 1, name: 'Metformin', image: require('../assets/images/metformin.jpeg'), dosage: '500mg', time: '8:00 AM', type: 'tablet', category: 'Heart' },
    { id: 2, name: 'Lisinopril', image: require('../assets/images/lisinopril.jpeg'), dosage: '10mg', time: '9:00 AM', type: 'tablet', category: 'Heart' },
    { id: 3, name: 'Ibuprofen', image: require('../assets/images/ibuprofen.jpeg'), dosage: '200mg', time: '2:00 PM', type: 'tablet', category: 'Painkillers' },
    { id: 4, name: 'Amoxicillin', image: require('../assets/images/amoxicillin.jpeg'), dosage: '250mg', time: '6:00 PM', type: 'liquid', category: 'Antibiotics' },
    { id: 5, name: 'Loratadine', image: require('../assets/images/loratadine.jpeg'), dosage: '10mg', time: '10:00 PM', type: 'tablet', category: 'Brain' },
    { id: 6, name: 'Omeprazole', image: require('../assets/images/omeprazole.jpeg'), dosage: '20mg', time: '7:00 AM', type: 'capsule', category: 'Heart' },
    { id: 7, name: 'Aspirin', image: require('../assets/images/aspirin.jpeg'), dosage: '81mg', time: '7:30 AM', type: 'tablet', category: 'Heart' },
    { id: 8, name: 'Sertraline', image: require('../assets/images/sertraline.jpeg'), dosage: '50mg', time: '9:30 AM', type: 'tablet', category: 'Brain' },
  ];

  const recommendedMedications = [
    { id: 101, name: 'Vitamin D3', image: require('../assets/images/vitamind.jpeg'), dosage: '2000 IU', description: 'Supports bone health' },
    { id: 102, name: 'Omega-3', image: require('../assets/images/omega3.jpeg'), dosage: '1000mg', description: 'Heart health supplement' },
    { id: 103, name: 'Magnesium', image: require('../assets/images/magnesium.jpeg'), dosage: '400mg', description: 'Supports muscle function' },
  ];

  const categories = [
    { id: 1, name: 'All', icon: 'apps', color: '#0d9488' },
    { id: 2, name: 'Heart', icon: 'fitness-outline', color: '#ef4444' },
    { id: 3, name: 'Brain', icon: 'invert-mode-outline', color: '#8b5cf6' },
    { id: 4, name: 'Painkillers', icon: 'bandage', color: '#f59e0b' },
    { id: 5, name: 'Antibiotics', icon: 'flask', color: '#10b981' },
  ];

  const renderMedicationCard = (med) => {
    if (selectedCategory !== 'All' && med.category !== selectedCategory) return null;
    
    return (
      <TouchableOpacity
        key={med.id}
        style={styles.medicationCard}
        onPress={() => navigation.navigate('SeeMedication', { medication: med })}
      >
        <Image source={med.image} style={styles.medicationImage} />
        <View style={styles.medicationInfo}>
          <Text style={styles.medicationName}>{med.name}</Text>
          <Text style={styles.medicationDosage}>{med.dosage}</Text>
          <Text style={styles.medicationTime}>{med.time}</Text>
        </View>
        <MaterialCommunityIcons 
          name={med.type === 'tablet' ? 'pill' : med.type === 'liquid' ? 'bottle-tonic' : 'pill'} 
          size={24} 
          color="#94a3b8" 
        />
      </TouchableOpacity>
    );
  };

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
            <TouchableOpacity>
              <Feather name="camera" size={24} color="#ffffff" />
            </TouchableOpacity>
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
            {medications.map(renderMedicationCard)}
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
            {medications.slice(0, 3).map(med => (
              <View key={med.id} style={styles.scheduleItem}>
                <Text style={styles.scheduleTime}>{med.time}</Text>
                <Text style={styles.scheduleName}>{med.name}</Text>
                <Text style={styles.scheduleDosage}>{med.dosage}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

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
  },
  medicationCard: {
    width: '48%',
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
});

export default MedicationOverview;