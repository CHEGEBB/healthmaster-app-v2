import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AddMedication from '../../components/AddMedication';
import SeeMedication from '../../components/SeeMedication';
import MedicationOverview from '../../components/MedicationOverview';

const Stack = createStackNavigator();

const MyMeds = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="MedicationOverview"
        screenOptions={{
          headerShown: false,
          header: () => null,  
        }}
      >
        <Stack.Screen 
          name="MedicationOverview" 
          component={MedicationOverview}
          options={{
            headerShown: false,
            header: () => null,
          }}
        />
        <Stack.Screen 
          name="AddMedication" 
          component={AddMedication}
          options={{
            headerShown: false,
            header: () => null,
          }}
        />
        <Stack.Screen 
          name="SeeMedication" 
          component={SeeMedication}
          options={{
            headerShown: false,
            header: () => null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyMeds;