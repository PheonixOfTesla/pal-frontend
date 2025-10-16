// Mobile/hooks/useVoiceChat.js - React Native Voice Chat Hook
import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const WS_URL = 'wss://your-backend-url.com/voice/connect'; // Replace with your URL

export const useVoiceChat = (token) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  const wsRef = useRef(null);
  const recordingRef = useRef(null);
  const soundRef = useRef(null);
  const audioBufferRef = useRef([]);

  // Initialize WebSocket connection
  const connect = async () => {
    try {
      // Request audio permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Audio permission required');
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false
      });

      // Connect to WebSocket
      const ws = new WebSocket(`${WS_URL}?token=${token}`);

      ws.onopen = () => {
        console.log('🎤 Voice connected');
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        await handleServerMessage(data);
      };

      ws.onerror = (e) => {
        console.error('WebSocket error:', e);
        setError('Connection error');
      };

      ws.onclose = () => {
        console.log('🔌 Voice disconnected');
        setIsConnected(false);
      };

      wsRef.current = ws;

    } catch (err) {
      console.error('Connection error:', err);
      setError(err.message);
    }
  };

  // Handle messages from server
  const handleServerMessage = async (data) => {
    switch (data.type) {
      case 'session_ready':
        console.log('✅ Session ready');
        break;

      case 'audio':
        // Decode base64 audio and add to buffer
        audioBufferRef.current.push(data.audio);
        if (!isSpeaking) {
          await playAudioBuffer();
        }
        break;

      case 'transcript':
        setTranscript(prev => prev + data.text);
        break;

      case 'speech_started':
        setIsSpeaking(true);
        break;

      case 'response_complete':
        setIsSpeaking(false);
        setTranscript('');
        break;

      case 'error':
        setError(data.message);
        break;
    }
  };

  // Play audio buffer
  const playAudioBuffer = async () => {
    if (audioBufferRef.current.length === 0) return;

    try {
      setIsSpeaking(true);

      // Combine audio chunks
      const audioData = audioBufferRef.current.join('');
      audioBufferRef.current = [];

      // Convert base64 to audio file
      const uri = `${FileSystem.cacheDirectory}phoenix_response.wav`;
      await FileSystem.writeAsStringAsync(uri, audioData, {
        encoding: FileSystem.EncodingType.Base64
      });

      // Play audio
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );

      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsSpeaking(false);
        }
      });

    } catch (err) {
      console.error('Audio playback error:', err);
      setIsSpeaking(false);
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      console.log('🎤 Recording started');

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
          sampleRate: 24000,
          numberOfChannels: 1,
          bitRate: 384000
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 24000,
          numberOfChannels: 1,
          bitRate: 384000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false
        }
      });

      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);

      // Stream audio in chunks
      streamAudio(recording);

    } catch (err) {
      console.error('Recording error:', err);
      setError('Failed to start recording');
    }
  };

  // Stream audio to server
  const streamAudio = async (recording) => {
    // Note: This is simplified. In production, you'd use a proper
    // streaming approach with smaller chunks
    const interval = setInterval(async () => {
      if (!recordingRef.current || !isRecording) {
        clearInterval(interval);
        return;
      }

      try {
        const uri = recording.getURI();
        if (uri) {
          const audioData = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64
          });

          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              type: 'audio',
              audio: audioData
            }));
          }
        }
      } catch (err) {
        console.error('Streaming error:', err);
      }
    }, 100); // Stream every 100ms
  };

  // Stop recording
  const stopRecording = async () => {
    try {
      if (!recordingRef.current) return;

      console.log('🛑 Recording stopped');
      await recordingRef.current.stopAndUnloadAsync();
      recordingRef.current = null;
      setIsRecording(false);

    } catch (err) {
      console.error('Stop recording error:', err);
    }
  };

  // Disconnect
  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'end' }));
      wsRef.current.close();
      wsRef.current = null;
    }

    if (recordingRef.current) {
      recordingRef.current.stopAndUnloadAsync();
      recordingRef.current = null;
    }

    if (soundRef.current) {
      soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    setIsConnected(false);
    setIsRecording(false);
    setIsSpeaking(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    isRecording,
    isSpeaking,
    transcript,
    error,
    connect,
    disconnect,
    startRecording,
    stopRecording
  };
};
