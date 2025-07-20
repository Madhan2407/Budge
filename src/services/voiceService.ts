export class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
    
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-IN';
    } else if ('SpeechRecognition' in window) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-IN';
    }
  }

  startListening(onResult: (text: string) => void, onError?: (error: string) => void): void {
    if (!this.recognition) {
      onError?.('Speech recognition not supported');
      return;
    }

    if (this.isListening) return;

    this.isListening = true;
    
    this.recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult(text);
      this.isListening = false;
    };

    this.recognition.onerror = (event) => {
      onError?.(event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    this.recognition.start();
  }

  speak(text: string): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    this.synthesis.speak(utterance);
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  stopSpeaking(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
  }
}

export const voiceService = new VoiceService();