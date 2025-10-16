// src/utils/audioProcessing.js
export const audioProcessing = {
  // Convert blob to base64
  blobToBase64: (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },

  // Convert base64 to blob
  base64ToBlob: (base64, mimeType = 'audio/webm') => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  },

  // Normalize audio volume
  normalizeVolume: (audioBuffer, targetVolume = 0.8) => {
    const channelData = audioBuffer.getChannelData(0);
    let max = 0;
    
    // Find peak volume
    for (let i = 0; i < channelData.length; i++) {
      const abs = Math.abs(channelData[i]);
      if (abs > max) max = abs;
    }
    
    // Normalize
    const multiplier = targetVolume / max;
    for (let i = 0; i < channelData.length; i++) {
      channelData[i] *= multiplier;
    }
    
    return audioBuffer;
  },

  // Get audio duration
  getAudioDuration: (audioBlob) => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.onloadedmetadata = () => {
        resolve(audio.duration);
      };
      audio.onerror = reject;
      audio.src = URL.createObjectURL(audioBlob);
    });
  },

  // Trim silence from audio
  trimSilence: async (audioBuffer, threshold = 0.01) => {
    const channelData = audioBuffer.getChannelData(0);
    let start = 0;
    let end = channelData.length - 1;
    
    // Find start
    while (start < channelData.length && Math.abs(channelData[start]) < threshold) {
      start++;
    }
    
    // Find end
    while (end > start && Math.abs(channelData[end]) < threshold) {
      end--;
    }
    
    // Create new buffer with trimmed audio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const trimmedLength = end - start + 1;
    const trimmedBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      trimmedLength,
      audioBuffer.sampleRate
    );
    
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const oldData = audioBuffer.getChannelData(channel);
      const newData = trimmedBuffer.getChannelData(channel);
      for (let i = 0; i < trimmedLength; i++) {
        newData[i] = oldData[start + i];
      }
    }
    
    return trimmedBuffer;
  },

  // Convert audio format
  convertFormat: async (audioBlob, targetFormat = 'audio/mp3') => {
    // Note: This is a simplified version
    // In production, you'd want to use a library like ffmpeg.wasm
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // This is where you'd do actual format conversion
    // For now, we'll just return the original
    return audioBlob;
  },

  // Create waveform data for visualization
  createWaveformData: (audioBuffer, samples = 100) => {
    const channelData = audioBuffer.getChannelData(0);
    const blockSize = Math.floor(channelData.length / samples);
    const waveformData = [];
    
    for (let i = 0; i < samples; i++) {
      const start = blockSize * i;
      let sum = 0;
      
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(channelData[start + j]);
      }
      
      waveformData.push(sum / blockSize);
    }
    
    return waveformData;
  },

  // Apply audio effects
  applyEffect: (audioBuffer, effectType = 'none', intensity = 0.5) => {
    const channelData = audioBuffer.getChannelData(0);
    
    switch (effectType) {
      case 'echo':
        const delay = Math.floor(audioBuffer.sampleRate * 0.3); // 300ms delay
        for (let i = delay; i < channelData.length; i++) {
          channelData[i] += channelData[i - delay] * intensity;
        }
        break;
        
      case 'reverb':
        // Simplified reverb
        const reverbDelay = Math.floor(audioBuffer.sampleRate * 0.05);
        for (let i = reverbDelay; i < channelData.length; i++) {
          channelData[i] += channelData[i - reverbDelay] * intensity * 0.5;
        }
        break;
        
      case 'distortion':
        for (let i = 0; i < channelData.length; i++) {
          channelData[i] = Math.tanh(channelData[i] * (1 + intensity * 10));
        }
        break;
        
      default:
        // No effect
        break;
    }
    
    return audioBuffer;
  }
};

export default audioProcessing;