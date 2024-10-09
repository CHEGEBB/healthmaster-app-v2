import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions, Animated, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Stack } from 'expo-router';

const { width, height } = Dimensions.get('window');

const carouselData = [
  {
    title: "Medication Reminders",
    text: "Manage your medications and take them on time with Health Master",
    image: require('../assets/images/land1.png'),
  },
  {
    title: "Doctor Appointments",
    text: "Health Master helps you manage appointments with doctors",
    image: require('../assets/images/welcome.png'),
  },
  {
    title: "Health Stats",
    text: "See your health stats and track your progress",
    image: require('../assets/images/heart.jpeg'),
  },
];

export default function Land() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const position = Animated.divide(scrollX, width);
  const flatListRef = useRef(null);

  const infiniteScroll = useRef(null);

  const getItemLayout = (data, index) => ({
    length: width,
    offset: width * index,
    index,
  });

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const infiniteCarouselData = [...carouselData, ...carouselData, ...carouselData];

  useEffect(() => {
    const scrollToIndex = (index) => {
      flatListRef.current.scrollToIndex({ index, animated: true });
    };

    infiniteScroll.current = setInterval(() => {
      const newIndex = (currentIndex + 1) % carouselData.length;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex + carouselData.length);
    }, 2000);

    return () => {
      if (infiniteScroll.current) {
        clearInterval(infiniteScroll.current);
      }
    };
  }, [currentIndex]);

  const handleMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width) % carouselData.length;
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Animated.FlatList
        ref={flatListRef}
        data={infiniteCarouselData}
        renderItem={({ item, index }) => (
          <View style={styles.slide} key={index}>
            <ImageBackground source={item.image} style={styles.imageContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.text}>{item.text}</Text>
              </View>
            </ImageBackground>
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        getItemLayout={getItemLayout}
        initialScrollIndex={carouselData.length}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      />
      <View style={styles.pagination}>
        {carouselData.map((_, i) => {
          const opacity = position.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp'
          });
          return (
            <Animated.View
              key={i}
              style={[styles.paginationDot, { opacity }]}
            />
          );
        })}
      </View>
      <Pressable 
        style={styles.button}
        onPress={() => router.push('/auth')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'hsla(231, 19%, 17%, 1)',
  },
  slide: {
    width,
    height,
  },
  imageContainer: {
    flex: 3/4,
    resizeMode: 'contain',
    justifyContent: 'flex-end',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  textContainer: {
    backgroundColor: 'hsla(231, 19%, 17%, 0.8)',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    fontFamily: 'Outfit-Bold',
  },
  text: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Raleway-Regular',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4BE3AC',
    margin: 5,
    bottom: 60,
  },
  button: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#57C4A5',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    width: '60%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});