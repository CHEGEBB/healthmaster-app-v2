import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  ImageBackground, 
  Image, 
  TouchableOpacity, 
  Modal, 
  FlatList,
  Dimensions,
  Animated
} from 'react-native';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const Caregivers = () => {
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const caregivers = [
    { 
      id: '1', 
      name: 'John Doe', 
      specialization: 'Chronic Disease Management', 
      years: 5, 
      rating: 4.8, 
      image: require('../../assets/images/caregivers/1.jpeg'),
      skills: ['Blood pressure monitoring', 'Diabetes management', 'Medication administration']
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      specialization: 'Geriatric Care with Diabetes Focus', 
      years: 7, 
      rating: 4.9, 
      image: require('../../assets/images/caregivers/2.jpeg'),
      skills: ['Insulin management', 'Dietary planning for diabetics', 'Cardiovascular health']
    },
    { 
      id: '3', 
      name: 'Mike Johnson', 
      specialization: 'Hypertension and Diabetes Care', 
      years: 3, 
      rating: 4.7, 
      image: require('../../assets/images/caregivers/3.jpeg'),
      skills: ['Blood glucose monitoring', 'Hypertension management', 'Exercise planning']
    },
    { 
      id: '4', 
      name: 'Mary Johnson', 
      specialization: 'Chronic Disease Home Care', 
      years: 3, 
      rating: 4.4, 
      image: require('../../assets/images/caregivers/4.jpeg'),
      skills: ['Wound care for diabetics', 'Nutrition counseling', 'Medication management']
    },
    { 
      id: '5', 
      name: 'Sarah Brown', 
      specialization: 'Home Health for Diabetes', 
      years: 4, 
      rating: 4.6, 
      image: require('../../assets/images/caregivers/5.jpeg'),
      skills: ['Diabetic foot care', 'Blood pressure control', 'Patient education']
    },
    { 
      id: '6', 
      name: 'Tom Wilson', 
      specialization: 'Chronic Disease Disability Care', 
      years: 6, 
      rating: 4.8, 
      image: require('../../assets/images/caregivers/6.jpeg'),
      skills: ['Mobility assistance for diabetics', 'Medication adherence', 'Lifestyle modification coaching']
    },
  ];

  const availableCaregivers = [
    { id: '4', name: 'Sarah Brown', specialization: 'Home Health', years: 4, rating: 4.6, image: require('../../assets/images/caregivers/4.jpeg') },
    { id: '5', name: 'Tom Wilson', specialization: 'Disability Care', years: 6, rating: 4.8, image: require('../../assets/images/caregivers/5.jpeg') },
    { id: '6', name: 'Mary Johnson', specialization: 'Palliative Care', years: 3, rating: 4.4, image: require('../../assets/images/caregivers/4.jpeg') },
    { id: '7', name: 'Mike Johnson', specialization: 'Palliative Care', years: 3, rating: 4.7, image: require('../../assets/images/caregivers/3.jpeg') },

  ];

  const animatedValue = new Animated.Value(0);

  const handleCardPress = (caregiver) => {
    setSelectedCaregiver(caregiver);
    setShowModal(true);
  };

  const handleSelectCaregiver = () => {
    setShowModal(false);
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 7000);
  };

  const renderCaregiverCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardSpecialization}>{item.specialization}</Text>
        <View style={styles.cardDetails}>
          <Text style={styles.cardYears}>{item.years} years</Text>
          <View style={styles.cardRating}>
            <AntDesign name="star" size={16} color="#FFD700" />
            <Text style={styles.cardRatingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAvailableCaregiverCard = ({ item }) => (
    <View style={styles.availableCard}>
      <Image source={item.image} style={styles.availableCardImage} />
      <Text style={styles.availableCardName}>{item.name}</Text>
      <Text style={styles.availableCardSpecialization}>{item.specialization}</Text>
      <View style={styles.availableCardDetails}>
        <Text style={styles.availableCardYears}>{item.years} years</Text>
        <View style={styles.availableCardRating}>
          <AntDesign name="star" size={14} color="#FFD700" />
          <Text style={styles.availableCardRatingText}>{item.rating}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container} contentContainerStyle={styles.contentContainer}>
      <ScrollView>
        <ImageBackground
          source={require('../../assets/images/caregivers/header.jpeg')}
          style={styles.header}
        >
          <View style={styles.headerOverlay}>
            <Text style={styles.headerTitle}>Our Caregivers</Text>
            <Text style={styles.headerSubtitle}>Professional and Compassionate Care</Text>
          </View>
        </ImageBackground>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Caregivers</Text>
          <FlatList
            data={caregivers}
            renderItem={renderCaregiverCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Now</Text>
          <FlatList
            data={availableCaregivers}
            renderItem={renderAvailableCaregiverCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedCaregiver && (
              <>
                <Image source={selectedCaregiver.image} style={styles.modalImage} />
                <Text style={styles.modalName}>{selectedCaregiver.name}</Text>
                <Text style={styles.modalSpecialization}>{selectedCaregiver.specialization}</Text>
                <View style={styles.modalDetails}>
                  <FontAwesome name="briefcase" size={16} color="#666" />
                  <Text style={styles.modalText}>{selectedCaregiver.years} years of experience</Text>
                </View>
                <View style={styles.modalDetails}>
                  <AntDesign name="star" size={16} color="#FFD700" />
                  <Text style={styles.modalText}>Rating: {selectedCaregiver.rating}</Text>
                </View>
                <TouchableOpacity style={styles.selectButton} onPress={handleSelectCaregiver}>
                  <Text style={styles.selectButtonText}>Select Caregiver</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
                  <AntDesign name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {showSuccessAnimation && (
        <View style={styles.successAnimation}>
          <LottieView
            source={require('../../assets/animations/succ.json')}
            autoPlay
            loop={false}
            style={styles.lottieAnimation}
          />
          <Text style={styles.successText}>Caregiver Selected!</Text>
        </View>
      )}
    </View>
  );
};

export default Caregivers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#475569',
    paddingBottom: 80,

  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  header: {
    height: 300,
    justifyContent: 'flex-end',
  },
  headerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    top: 150,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    top: 150,

  },
  section: {
    padding: 20,
    // height: 450,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
  card: {
    width: width - 140,
    marginRight: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  cardImage: {
    width: '100%',
    height: (width - 60) * 0.75,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  cardInfo: {
    padding: 15,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
  cardSpecialization: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
    color: '#fff',

  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
  },
  cardYears: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  cardRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRatingText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',

  },
  availableCard: {
    width: 150,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#94a3b8',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  availableCardImage: {
    width: '100%',
    height: 100,
  },
  availableCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  availableCardSpecialization: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 10,
    fontFamily: 'Poppins-Regular',
    color: '#fff',

  },
  availableCardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  availableCardYears: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    color: '#fff',

  },
  availableCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availableCardRatingText: {
    marginLeft: 3,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',

  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#374151',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: (width - 60) * 0.75,
    borderRadius: 25,
    marginBottom: 20,
  },
  modalName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    textAlign: 'left',
    alignSelf: 'flex-start',


  },
  modalSpecialization: {
    fontSize: 18,
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    textAlign: 'left',
    alignSelf: 'flex-start',

  },
  modalDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'flex-start',
    
  },
  modalText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    textAlign: 'left',
  },
  selectButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 5,
  },
  successAnimation: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    fontFamily: 'Poppins-Bold',
  },
})