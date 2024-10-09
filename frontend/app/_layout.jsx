import { Stack } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import CustomSplashScreen from '../components/SplashScreen';

const fontFiles = {
  'Jost-Regular': require('../assets/fonts/Jost-Regular.ttf'),
  'Jost-SemiBold': require('../assets/fonts/Jost-SemiBold.ttf'),
  'Jost-Bold': require('../assets/fonts/Jost-Bold.ttf'),
  'Jost-ExtraBold': require('../assets/fonts/Jost-ExtraBold.ttf'),
  'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
  'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
  'Sora-Regular': require('../assets/fonts/Sora-Regular.ttf'),
  'Sora-SemiBold': require('../assets/fonts/Sora-SemiBold.ttf'),
  'Sora-Bold': require('../assets/fonts/Sora-Bold.ttf'),
  'Sora-ExtraBold': require('../assets/fonts/Sora-ExtraBold.ttf'),
  'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
  'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
  'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
  'Roboto-Black': require('../assets/fonts/Roboto-Black.ttf'),
  'Kanit-Regular': require('../assets/fonts/Kanit-Regular.ttf'),
  'Kanit-SemiBold': require('../assets/fonts/Kanit-SemiBold.ttf'),
  'Kanit-Bold': require('../assets/fonts/Kanit-Bold.ttf'),
  'Kanit-ExtraBold': require('../assets/fonts/Kanit-ExtraBold.ttf'),
  'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
  'Outfit-SemiBold': require('../assets/fonts/Outfit-SemiBold.ttf'),
  'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
  'Outfit-ExtraBold': require('../assets/fonts/Outfit-ExtraBold.ttf'),
  'Rubik-Regular': require('../assets/fonts/Rubik-Regular.ttf'),
  'Rubik-SemiBold': require('../assets/fonts/Rubik-SemiBold.ttf'),
  'Rubik-Bold': require('../assets/fonts/Rubik-Bold.ttf'),
  'Rubik-ExtraBold': require('../assets/fonts/Rubik-ExtraBold.ttf'),
  'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
  'OpenSans-SemiBold': require('../assets/fonts/OpenSans-SemiBold.ttf'),
  'OpenSans-Bold': require('../assets/fonts/OpenSans-Bold.ttf'),
  'OpenSans-ExtraBold': require('../assets/fonts/OpenSans-ExtraBold.ttf'),
  'Raleway': require('../assets/fonts/Raleway-Regular.ttf'),
  'Raleway-SemiBold': require('../assets/fonts/Raleway-SemiBold.ttf'),
  'Raleway-Bold': require('../assets/fonts/Raleway-Bold.ttf'),
  'Raleway-ExtraBold': require('../assets/fonts/Raleway-ExtraBold.ttf'),
  'RopaSans-Regular': require('../assets/fonts/RopaSans-Regular.ttf'),
  'Poppins-Italic': require('../assets/fonts/Poppins-Italic.ttf'),
  'Popppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
  'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
  'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
  'Poppins-Black': require('../assets/fonts/Poppins-Black.ttf'),
  'Outfit-Light': require('../assets/fonts/Outfit-Light.ttf'),
  'Jost-Light': require('../assets/fonts/Jost-Light.ttf'),
  'Rubik-Light': require('../assets/fonts/Rubik-Light.ttf'),
  'Outfit-Medium': require('../assets/fonts/Outfit-Medium.ttf'),
  'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
  'Outfit-ExtraBold': require('../assets/fonts/Outfit-ExtraBold.ttf'),
  'Raleway-Light': require('../assets/fonts/Raleway-Light.ttf'),
  'Raleway-Medium': require('../assets/fonts/Raleway-Medium.ttf'),
  'Raleway-Regular': require('../assets/fonts/Raleway-Regular.ttf'),
  'Rubik-Medium': require('../assets/fonts/Rubik-Medium.ttf'),
};

export default function Layout() {
  const [isSplashScreen, setIsSplashScreen] = useState(true);
  const [fontsLoaded, fontError] = useFonts(fontFiles);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await new Promise(resolve => setTimeout(resolve, 7000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsSplashScreen(false);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (isSplashScreen) {
    return <CustomSplashScreen />;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="login" />
        <Stack.Screen name="started" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});