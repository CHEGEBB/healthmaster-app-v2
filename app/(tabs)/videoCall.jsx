import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform, 
  Dimensions,
  Animated,
  Image
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ConnectingOverlay = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <Animated.View style={styles.overlay}>
      <View style={styles.connectingContainer}>
        <View style={styles.loadingDots}>
          <Animated.View style={[styles.dot, styles.dot1]} />
          <Animated.View style={[styles.dot, styles.dot2]} />
          <Animated.View style={[styles.dot, styles.dot3]} />
        </View>
        <Text style={styles.connectingText}>Connecting...</Text>
      </View>
    </Animated.View>
  );
};

const ConnectedOverlay = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.overlay, styles.connectedOverlay]}>
      <View style={styles.connectedContainer}>
        <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />
        <Text style={styles.connectedText}>Connected</Text>
      </View>
    </Animated.View>
  );
};

const CallEndedOverlay = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.overlay, styles.callEndedOverlay]}>
      <View style={styles.callEndedContainer}>
        <Ionicons name="call" size={50} color="#FF4444" />
        <Text style={styles.callEndedText}>Call Ended</Text>
      </View>
    </Animated.View>
  );
};

export default function VideoCall() {
  const router = useRouter();
  const [callState, setCallState] = useState('connecting'); 
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setCameraOn] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const videoRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let timer;
    
    const initializeCall = async () => {
      // Show connecting overlay for 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCallState('connected');
      
      // Show connected overlay for 1.5 seconds
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCallState('ongoing');
      
      // Start the video
      if (videoRef.current) {
        await videoRef.current.playAsync();
      }
      
      // Start timer for call duration
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      
      // Automatically end call after 30 seconds
      setTimeout(() => {
        handleEndCall();
      }, 30000);
    };

    initializeCall();

    return () => {
      if (timer) clearInterval(timer);
      if (videoRef.current) {
        videoRef.current.stopAsync();
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = async () => {
    setCallState('ended');
    if (videoRef.current) {
      await videoRef.current.stopAsync();
    }
    
    // Show call ended overlay for 1.5 seconds before navigating back
    setTimeout(() => {
      router.back();
    }, 1500);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.setIsMutedAsync(!isMuted);
    }
  };

  const toggleCamera = () => {
    setCameraOn(!isCameraOn);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Main Video Area */}
      <View style={styles.mainVideoArea}>
        <Video
          ref={videoRef}
          source={require('../../assets/video/doc.mp4')}
          style={styles.video}
          resizeMode="cover"
          isLooping={false}
          shouldPlay={true}
        />

        {/* Call Info Bar */}
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          style={styles.callInfoBar}
        >
          <View style={styles.callInfo}>
            <Text style={styles.doctorName}>Dr. James Wilson</Text>
            <Text style={styles.callDuration}>{formatTime(elapsedTime)}</Text>
          </View>
          <View style={styles.connectionInfo}>
            <Ionicons name="wifi" size={16} color="#4CAF50" />
            <Text style={styles.connectionQuality}>Excellent</Text>
          </View>
        </LinearGradient>

        {/* User Video Preview */}
        {callState === 'ongoing' && (
          <View style={styles.userVideoContainer}>
            <Video
          ref={videoRef}
          source={require('../../assets/video/pat.mp4')}
          style={styles.userVideo}
          resizeMode="cover"
          isLooping={false}
          shouldPlay={true}
        />
            {!isCameraOn && (
              <View style={styles.cameraPaused}>
                <Ionicons name="videocam-off" size={24} color="#FFF" />
              </View>
            )}
          </View>
        )}

        {/* Call Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={[styles.controlButton, isMuted && styles.controlButtonActive]}
            onPress={toggleMute}
          >
            <Ionicons name={isMuted ? "mic-off" : "mic"} size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlButton, styles.endCallButton]}
            onPress={handleEndCall}
          >
            <Ionicons name="call" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlButton, !isCameraOn && styles.controlButtonActive]}
            onPress={toggleCamera}
          >
            <Ionicons name={isCameraOn ? "videocam" : "videocam-off"} size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Overlays */}
      <ConnectingOverlay isVisible={callState === 'connecting'} />
      <ConnectedOverlay isVisible={callState === 'connected'} />
      <CallEndedOverlay isVisible={callState === 'ended'} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mainVideoArea: {
    flex: 1,
    position: 'relative',
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  callInfoBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  callInfo: {
    flex: 1,
  },
  doctorName: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  callDuration: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 4,
  },
  connectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  connectionQuality: {
    color: '#FFF',
    fontSize: 12,
    marginLeft: 4,
  },
  userVideoContainer: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 120,
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userVideo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cameraPaused: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  controlButtonActive: {
    backgroundColor: '#EF4444',
  },
  endCallButton: {
    backgroundColor: '#EF4444',
    transform: [{ rotate: '135deg' }],
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  connectingContainer: {
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
    marginHorizontal: 5,
  },
  connectingText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  connectedContainer: {
    alignItems: 'center',
  },
  connectedText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  callEndedContainer: {
    alignItems: 'center',
  },
  callEndedText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  }
});