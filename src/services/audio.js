// src/services/audio.js
class AudioService {
  constructor() {
    this.audioContext = null;
    this.soundEffects = {};
    this.ttsVoice = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize Audio Context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Load voices for TTS
      if ('speechSynthesis' in window) {
        const voices = speechSynthesis.getVoices();
        this.ttsVoice = voices.find(voice => 
          voice.name.includes('Google') || voice.name.includes('Premium')
        ) || voices[0];
      }

      this.initialized = true;
      console.log('Audio service initialized');
    } catch (error) {
      console.error('Error initializing audio service:', error);
    }
  }

  // Play sound effect
  playSound(soundName, volume = 1.0) {
    if (!this.initialized) {
      console.warn('Audio service not initialized');
      return;
    }

    const sounds = {
      notification: this.createBeep(440, 0.1),
      success: this.createChord([523.25, 659.25, 783.99], 0.3),
      error: this.createBeep(200, 0.2),
      click: this.createBeep(800, 0.05),
      alert: this.createSiren(800, 1200, 0.5)
    };

    const sound = sounds[soundName];
    if (sound) {
      sound.volume = volume;
      sound.play().catch(err => console.error('Error playing sound:', err));
    }
  }

  // Create beep tone
  createBeep(frequency, duration) {
    const audio = new Audio();
    const audioContext = this.audioContext;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration
    );

    const play = () => {
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
      return Promise.resolve();
    };

    return { play, volume: 1 };
  }

  // Create chord
  createChord(frequencies, duration) {
    const audioContext = this.audioContext;
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);

    const oscillators = frequencies.map(freq => {
      const osc = audioContext.createOscillator();
      osc.connect(gainNode);
      osc.frequency.value = freq;
      osc.type = 'sine';
      return osc;
    });

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration
    );

    const play = () => {
      const startTime = audioContext.currentTime;
      oscillators.forEach(osc => {
        osc.start(startTime);
        osc.stop(startTime + duration);
      });
      return Promise.resolve();
    };

    return { play, volume: 1 };
  }

  // Create siren effect
  createSiren(freq1, freq2, duration) {
    const audioContext = this.audioContext;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

    const play = () => {
      const startTime = audioContext.currentTime;
      const endTime = startTime + duration;
      const cycles = 3;

      for (let i = 0; i < cycles; i++) {
        const cycleStart = startTime + (duration / cycles) * i;
        const cycleMid = cycleStart + (duration / cycles) * 0.5;
        
        oscillator.frequency.setValueAtTime(freq1, cycleStart);
        oscillator.frequency.linearRampToValueAtTime(freq2, cycleMid);
        oscillator.frequency.linearRampToValueAtTime(freq1, cycleMid + (duration / cycles) * 0.5);
      }

      oscillator.start(startTime);
      oscillator.stop(endTime);
      return Promise.resolve();
    };

    return { play, volume: 1 };
  }

  // Text-to-speech
  speak(text, options = {}) {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return Promise.reject(new Error('Speech synthesis not supported'));
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.voice = this.ttsVoice || null;
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      utterance.onend = resolve;
      utterance.onerror = reject;

      speechSynthesis.speak(utterance);
    });
  }

  // Stop all speech
  stopSpeaking() {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  // Check if speaking
  isSpeaking() {
    return 'speechSynthesis' in window && speechSynthesis.speaking;
  }

  // Clean up
  cleanup() {
    this.stopSpeaking();
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.initialized = false;
  }
}

// Export singleton instance
const audioService = new AudioService();
export default audioService;