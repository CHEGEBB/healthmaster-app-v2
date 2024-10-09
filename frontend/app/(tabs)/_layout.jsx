import { Tabs } from 'expo-router';
import { Ionicons, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
      </View>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#334155',
            borderTopWidth: 0,
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
            borderRadius: 20, 
            position: 'absolute', 
            bottom: 0,
            left: 0,
            right: 0,
            marginHorizontal: 10, 
            marginBottom: 10, 
            
          },
          tabBarActiveTintColor: '#1EE2C7',
          tabBarInactiveTintColor: '#83839C',
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
          },
          tabBarIconStyle: {
            marginBottom: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <Foundation name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="appointments"
          options={{
            title: 'Appointments',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar-blank-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="myMeds"
          options={{
            title: 'My Meds',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Ionicons name="medical-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="reminders"
          options={{
            title: 'Reminders',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="clock-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2D', 
  },
  content: {
    backgroundColor: '#1E1E2D', 

  },
});
