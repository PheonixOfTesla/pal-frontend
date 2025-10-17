// src/hooks/useWebVoiceChat.js - ENHANCED Voice Chat with Context
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
  const [phoenixState, setPhoenixState] = useState('idle');

  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);

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

  const handleServerMessage = async (data) => {
    switch (data.type) {
      case 'session_ready':
        console.log('✅ Voice session ready');
        setPhoenixState('idle');
        break;

      case 'audio':
        audioQueueRef.current.push(data.audio);
        if (!isPlayingRef.current) {
          await playAudioQueue();
        }
        break;

      case 'transcript':
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
        // Keep transcript for 5 seconds
        setTimeout(() => setTranscript(''), 5000);
        setPhoenixState('idle');
        break;

      case 'intervention':
        setPhoenixState('alert');
        setTranscript(data.message);
        break;

      case 'error':
        setError(data.message);
        setPhoenixState('idle');
        break;
    }
  };

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
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100);
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

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setPhoenixState('thinking');
      console.log('🛑 Recording stopped');
    }
  };

  const sendAudioToServer = async (audioBlob) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64Audio = reader.result.split(',')[1];
        
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'audio',
            audio: base64Audio
          }));

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

  const playAudioQueue = async () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;

    try {
      const base64Audio = audioQueueRef.current.shift();
      
      const audioData = atob(base64Audio);
      const arrayBuffer = new ArrayBuffer(audioData.length);
      const view = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i);
      }

      const audioContext = audioContextRef.current || new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      source.onended = () => {
        playAudioQueue();
      };

      source.start(0);

    } catch (err) {
      console.error('Audio playback error:', err);
      isPlayingRef.current = false;
    }
  };

  const interrupt = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'interrupt'
      }));
      
      audioQueueRef.current = [];
      isPlayingRef.current = false;
      setIsSpeaking(false);
      setPhoenixState('idle');
    }
  };

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

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect]);

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
