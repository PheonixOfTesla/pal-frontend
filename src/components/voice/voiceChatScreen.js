// Mobile/screens/VoiceChatScreen.jsx - Phoenix Voice Chat Screen
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useVoiceChat } from '../hooks/useVoiceChat';
import { useAuth } from '../context/AuthContext'; // Your auth context

export default function VoiceChatScreen({ navigation }) {
  const { token } = useAuth(); // Get JWT token
  const {
    isConnected,
    isRecording,
    isSpeaking,
    transcript,
    error,
    connect,
    disconnect,
    startRecording,
    stopRecording
  } = useVoiceChat(token);

  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  // Pulse animation when Phoenix is speaking
  useEffect(() => {
    if (isSpeaking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
          })
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isSpeaking]);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Talk to Phoenix</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        
        {/* Phoenix Avatar */}
        <Animated.View 
          style={[
            styles.avatarContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <View style={[
            styles.avatar,
            isSpeaking && styles.avatarSpeaking,
            isRecording && styles.avatarListening
          ]}>
            <Text style={styles.avatarEmoji}>🔥</Text>
          </View>
        </Animated.View>

        {/* Status Text */}
        <Text style={styles.statusText}>
          {!isConnected && 'Connecting...'}
          {isConnected && !isRecording && !isSpeaking && 'Tap to talk'}
          {isRecording && 'Listening...'}
          {isSpeaking && 'Phoenix speaking...'}
        </Text>

        {/* Transcript */}
        {transcript && (
          <View style={styles.transcriptContainer}>
            <Text style={styles.transcriptText}>{transcript}</Text>
          </View>
        )}

        {/* Error */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>

      {/* Push to Talk Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.talkButton,
            isRecording && styles.talkButtonActive,
            !isConnected && styles.talkButtonDisabled
          ]}
          onPressIn={startRecording}
          onPressOut={stopRecording}
          disabled={!isConnected || isSpeaking}
          activeOpacity={0.8}
        >
          <Text style={styles.talkButtonText}>
            {isRecording ? '🎤 Release to send' : '🎤 Push to talk'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.helperText}>
          Hold to talk, release to send
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222'
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backButtonText: {
    fontSize: 28,
    color: '#FFDD00'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  placeholder: {
    width: 40
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  avatarContainer: {
    marginBottom: 30
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#1a1a1a',
    borderWidth: 3,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarSpeaking: {
    borderColor: '#00FF88',
    backgroundColor: '#00FF8820'
  },
  avatarListening: {
    borderColor: '#FFDD00',
    backgroundColor: '#FFDD0020'
  },
  avatarEmoji: {
    fontSize: 80
  },
  statusText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20
  },
  transcriptContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    maxWidth: '100%'
  },
  transcriptText: {
    fontSize: 16,
    color: '#00FF88',
    lineHeight: 24
  },
  errorContainer: {
    backgroundColor: '#ff444420',
    borderRadius: 8,
    padding: 15,
    marginTop: 20
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center'
  },
  talkButton: {
    backgroundColor: '#FFDD00',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 50,
    minWidth: 250,
    alignItems: 'center',
    shadowColor: '#FFDD00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  talkButtonActive: {
    backgroundColor: '#00FF88',
    shadowColor: '#00FF88'
  },
  talkButtonDisabled: {
    backgroundColor: '#333',
    shadowOpacity: 0
  },
  talkButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000'
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginTop: 15
  }
});
