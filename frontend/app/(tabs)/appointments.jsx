import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppointmentsList from '../../components/AppointmentsList';
import BookAppointment from '../../components/BookAppointment';

const Stack = createStackNavigator();

const AppointmentsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1e293b',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="AppointmentsList" 
        component={AppointmentsList} 
        options={{ title: 'Appointments' }}
      />
      <Stack.Screen 
        name="BookAppointment" 
        component={BookAppointment} 
        options={{ title: 'Book Appointment' }}
      />
    </Stack.Navigator>
  );
};

export default AppointmentsNavigator;