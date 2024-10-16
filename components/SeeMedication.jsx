import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const SeeMedication = ({ route, navigation }) => {
  const { medication } = route.params;

  // Safely handle category display with fallback
  const category = medication?.category || 'General';
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ImageBackground
          source={{ uri: medication.imageUrl }} // Use imageUrl from medication data
          style={styles.header}
          imageStyle={styles.headerImage}
        >
          <LinearGradient
            colors={['rgba(4, 47, 46, 0.1)', '#374151']}
            style={styles.headerGradient}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.medicationName}>{medication.name}</Text>
            <Text style={styles.medicationDosage}>{medication.dosage}</Text>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.content}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons name="pill" size={24} color="#0d9488" />
                <Text style={styles.infoLabel}>Type</Text>
                <Text style={styles.infoValue}>{medication.type || 'Oral'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Feather name="clock" size={24} color="#0d9488" />
                <Text style={styles.infoLabel}>Time</Text>
                <Text style={styles.infoValue}>{medication.timeOfDay}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Feather name="calendar" size={24} color="#0d9488" />
                <Text style={styles.infoLabel}>Frequency</Text>
                <Text style={styles.infoValue}>{medication.frequency || 'Daily'}</Text>
              </View>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons name="flask-outline" size={24} color="#0d9488" />
                <Text style={styles.infoLabel}>Category</Text>
                <Text style={styles.infoValue}>{category}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.sectionContent}>
              {medication.name} is a medication used to treat various conditions. 
              It belongs to a class of drugs known as {category.toLowerCase()}. 
              {medication.description || 'Always follow your doctor\'s instructions for taking this medication.'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Side Effects</Text>
            <Text style={styles.sectionContent}>
              {medication.sideEffects || 
                'Common side effects may include nausea, headache, and dizziness. Consult your doctor if you experience any severe or persistent side effects.'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Precautions</Text>
            <Text style={styles.sectionContent}>
              {medication.precautions ||
                `Inform your doctor of any allergies or medical conditions before taking ${medication.name}. 
                Do not consume alcohol while on this medication. Keep out of reach of children.`}
            </Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => navigation.navigate('EditMedication', { medication })}
      >
        <LinearGradient
          colors={['#059669', '#047857']}
          style={styles.editButtonGradient}
        >
          <Feather name="edit-2" size={24} color="#ffffff" />
          <Text style={styles.editButtonText}>Edit Medication</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

// In MedicationOverview.jsx, update the renderMedicationCard function:
const renderMedicationCard = (med) => {
  if (selectedCategory !== 'All' && med.category !== selectedCategory) return null;
  
  return (
    <TouchableOpacity
      key={med.$id}
      style={styles.medicationCard}
      onPress={() => navigation.navigate('SeeMedication', { 
        medication: {
          ...med,
          // Ensure all required properties are included
          type: med.type || 'Oral',
          category: med.category || 'General',
          frequency: med.frequency || 'Daily',
          description: med.description,
          sideEffects: med.sideEffects,
          precautions: med.precautions
        }
      })}
    >
      <Image source={{ uri: med.imageUrl }} style={styles.medicationImage} />
      <View style={styles.medicationInfo}>
        <Text style={styles.medicationName}>{med.name}</Text>
        <Text style={styles.medicationDosage}>{med.dosage}</Text>
        <Text style={styles.medicationTime}>{med.timeOfDay}</Text>
      </View>
      <MaterialCommunityIcons 
        name="pill" 
        size={24} 
        color="#94a3b8" 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: 300,
  },
  headerImage: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  medicationName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 5,
  },
  medicationDosage: {
    fontFamily: 'Raleway-SemiBold',
    fontSize: 18,
    color: '#94a3b8',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#134e4a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoItem: {
    alignItems: 'center',
    width: '45%',
  },
  infoLabel: {
    fontFamily: 'Raleway-Medium',
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 5,
  },
  infoValue: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    color: '#ffffff',
    marginTop: 3,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 10,
  },
  sectionContent: {
    fontFamily: 'Raleway-Regular',
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 22,
  },
  editButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  editButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  editButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 10,
  },
});

export default SeeMedication;