// src/hooks/useWebVoiceChat.js - PRODUCTION VOICE WEBSOCKET
import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

export function useWebVoiceChat() {
  const token = useAuthStore(state => state.token);
  const user = useAuthStore(state => state.user);
  
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [phoenixState, setPhoenixState] = useState('idle'); // idle, listening, thinking, speaking, alert

  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);

  /**
   * Connect to Phoenix voice WebSocket
   */
  const connect = useCallback(() => {
    if (!token || !user) {
      setError('Not authenticated');
      return;
    }

    try {
      const wsUrl = process.env.REACT_APP_VOICE_WS_URL || 
                    'wss://pal-backend-production.up.railway.app/ws/voice';
      
      const ws = new WebSocket(`${wsUrl}?userId=${user._id}&token=${token}`);

      ws.onopen = () => {
        console.log('🎤 Voice WebSocket connected');
        setIsConnected(true);
        setError(null);
        setPhoenixState('idle');
      };

      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        await handleServerMessage(data);
      };

      ws.onerror = (err) => {
        console.error('Voice WebSocket error:', err);
        setError('Connection error');
        setPhoenixState('idle');
      };

      ws.onclose = () => {
        console.log('🔇 Voice WebSocket disconnected');
        setIsConnected(false);
        setPhoenixState('idle');
        
        // Auto-reconnect after 3 seconds
        setTimeout(() => {
          if (token && user) {
            connect();
          }
        }, 3000);
      };

      wsRef.current = ws;

    } catch (err) {
      console.error('Voice connection error:', err);
      setError(err.message);
    }
  }, [token, user]);

  /**
   * Handle messages from server
   */
  const handleServerMessage = async (data) => {
    switch (data.type) {
      case 'session_ready':
        console.log('✅ Voice session ready');
        setPhoenixState('idle');
        break;

      case 'audio':
        // Receive audio from Phoenix
        audioQueueRef.current.push(data.audio);
        if (!isPlayingRef.current) {
          await playAudioQueue();
        }
        break;

      case 'transcript':
        // Phoenix's spoken response transcript
        setTranscript(data.text);
        break;

      case 'speech_started':
        setIsSpeaking(true);
        setPhoenixState('speaking');
        break;

      case 'speech_ended':
        setIsSpeaking(false);
        setPhoenixState('idle');
        break;

      case 'response_complete':
        setIsSpeaking(false);
        setTranscript('');
        setPhoenixState('idle');
        break;

      case 'intervention':
        // Proactive alert from Phoenix
        setPhoenixState('alert');
        setTranscript(data.message);
        break;

      case 'error':
        setError(data.message);
        setPhoenixState('idle');
        break;
    }
  };

  /**
   * Start recording audio
   */
  const startRecording = async () => {
    if (!isConnected) {
      setError('Not connected to voice server');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 24000
        } 
      });

      // Initialize audio context
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: 24000
        });
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 24000
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioToServer(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100); // Collect data every 100ms
      mediaRecorderRef.current = mediaRecorder;
      
      setIsRecording(true);
      setPhoenixState('listening');
      setError(null);

      console.log('🎤 Recording started');

    } catch (err) {
      console.error('Recording error:', err);
      setError('Microphone access denied');
    }
  };

  /**
   * Stop recording audio
   */
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setPhoenixState('thinking');
      console.log('🛑 Recording stopped');
    }
  };

  /**
   * Send audio to server
   */
  const sendAudioToServer = async (audioBlob) => {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64Audio = reader.result.split(',')[1];
        
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'audio',
            audio: base64Audio
          }));

          // Signal end of audio
          wsRef.current.send(JSON.stringify({
            type: 'audio_end'
          }));
        }
      };
    } catch (err) {
      console.error('Error sending audio:', err);
      setError('Failed to send audio');
    }
  };

  /**
   * Play audio queue from Phoenix
   */
  const playAudioQueue = async () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;

    try {
      const base64Audio = audioQueueRef.current.shift();
      
      // Decode base64 to audio
      const audioData = atob(base64Audio);
      const arrayBuffer = new ArrayBuffer(audioData.length);
      const view = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i);
      }

      // Decode and play
      const audioContext = audioContextRef.current || new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      source.onended = () => {
        // Play next in queue
        playAudioQueue();
      };

      source.start(0);

    } catch (err) {
      console.error('Audio playback error:', err);
      isPlayingRef.current = false;
    }
  };

  /**
   * Interrupt Phoenix (cancel current response)
   */
  const interrupt = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'interrupt'
      }));
      
      // Clear audio queue
      audioQueueRef.current = [];
      isPlayingRef.current = false;
      setIsSpeaking(false);
      setPhoenixState('idle');
    }
  };

  /**
   * Disconnect voice WebSocket
   */
  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsConnected(false);
    setIsRecording(false);
    setIsSpeaking(false);
    setPhoenixState('idle');
  };

  /**
   * Auto-connect on mount
   */
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect]);

  /**
   * Request notification permissions
   */
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {
    isConnected,
    isRecording,
    isSpeaking,
    phoenixState,
    transcript,
    error,
    startRecording,
    stopRecording,
    interrupt,
    disconnect
  };
}
