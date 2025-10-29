type SpeechRecognitionConstructor = new () => SpeechRecognition;

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult extends Array<SpeechRecognitionAlternative> {
  isFinal: boolean;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    SpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export class AdvancedVoiceCommandSystem {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private commands: Map<string, VoiceCommand> = new Map();

  constructor() {
    this.initializeVoiceRecognition();
    this.loadDefaultCommands();
  }

  private initializeVoiceRecognition(): void {
    const SpeechRecognitionCtor: SpeechRecognitionConstructor | undefined =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognitionCtor) {
      console.warn('Speech recognition is not supported in this browser.');
      return;
    }

    this.recognition = new SpeechRecognitionCtor();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'ar-SA';
    this.recognition.maxAlternatives = 3;

    this.recognition.onresult = event => {
      this.handleSpeechResult(event as SpeechRecognitionEvent);
    };

    this.recognition.onerror = event => {
      console.error('Voice recognition error:', event.error);
      this.logVoiceCommand('error', '', 'error', event.error);
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        this.recognition?.start();
      }
    };
  }

  private loadDefaultCommands(): void {
    const defaultCommands: VoiceCommand[] = [
      {
        id: 'start_simulation',
        phrases: ['ابدأ المحاكاة', 'تشغيل المحاكاة', 'Start simulation'],
        action: () => this.executeMacro('start_simulation'),
        category: 'simulation'
      },
      {
        id: 'stop_simulation',
        phrases: ['أوقف المحاكاة', 'إيقاف المحاكاة', 'Stop simulation'],
        action: () => this.executeMacro('stop_simulation'),
        category: 'simulation'
      },
      {
        id: 'emergency_stop',
        phrases: ['إيقاف طارئ', 'وقف كل شيء', 'Emergency stop'],
        action: () => this.emergencyStop(),
        category: 'emergency'
      },
      {
        id: 'increase_difficulty',
        phrases: ['زود الصعوبة', 'Increase difficulty'],
        action: () => this.increaseDifficulty(),
        category: 'control'
      },
      {
        id: 'show_users',
        phrases: ['اعرض المستخدمين', 'Show users'],
        action: () => this.showUsers(),
        category: 'user'
      }
    ];

    defaultCommands.forEach(command => {
      this.commands.set(command.id, command);
    });
  }

  private handleSpeechResult(event: SpeechRecognitionEvent): void {
    const results = event.results;
    const latest = results[results.length - 1];
    const transcript = latest[0].transcript.trim();

    if (latest.isFinal) {
      this.processVoiceCommand(transcript);
    }
  }

  private processVoiceCommand(transcript: string): void {
    let bestMatch: { command: VoiceCommand; confidence: number } | null = null;

    this.commands.forEach(command => {
      const confidence = this.calculateConfidence(transcript, command.phrases);
      if (confidence > 0.7 && (!bestMatch || confidence > bestMatch.confidence)) {
        bestMatch = { command, confidence };
      }
    });

    if (bestMatch) {
      this.executeVoiceCommand(bestMatch.command, transcript).catch(error => {
        console.error('Failed to execute voice command', error);
      });
    } else {
      this.handleUnknownCommand(transcript);
    }
  }

  private calculateConfidence(transcript: string, phrases: string[]): number {
    let maxConfidence = 0;

    phrases.forEach(phrase => {
      const confidence = this.similarity(transcript, phrase);
      if (confidence > maxConfidence) {
        maxConfidence = confidence;
      }
    });

    return maxConfidence;
  }

  private similarity(str1: string, str2: string): number {
    const words1 = str1.split(' ').filter(Boolean);
    const words2 = str2.split(' ').filter(Boolean);
    if (words1.length === 0 || words2.length === 0) {
      return 0;
    }
    const matches = words1.filter(word => words2.includes(word)).length;
    return matches / Math.max(words1.length, words2.length);
  }

  private async executeVoiceCommand(command: VoiceCommand, transcript: string): Promise<void> {
    try {
      this.showVoiceFeedback(`✅ تم التعرف على: "${transcript}"`);
      await command.action();
      this.logVoiceCommand(command.id, transcript, 'success');
    } catch (error) {
      this.showVoiceFeedback(`❌ خطأ في تنفيذ: "${transcript}"`);
      this.logVoiceCommand(command.id, transcript, 'error', error);
    }
  }

  private handleUnknownCommand(transcript: string): void {
    this.showVoiceFeedback(`❓ لم أفهم: "${transcript}"`);
    this.logVoiceCommand('unknown', transcript, 'unknown');
  }

  private showVoiceFeedback(message: string): void {
    const feedback = document.createElement('div');
    feedback.className = 'voice-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #333;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 10000;
      animation: fadeInOut 3s ease-in-out;
    `;

    document.body.appendChild(feedback);
    setTimeout(() => {
      document.body.removeChild(feedback);
    }, 3000);
  }

  startListening(): void {
    if (this.recognition && !this.isListening) {
      this.recognition.start();
      this.isListening = true;
      this.showVoiceFeedback('🎤 جاهز للاستماع...');
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.showVoiceFeedback('⏸️ توقف الاستماع');
    }
  }

  registerVoiceCommand(command: VoiceCommand): void {
    this.commands.set(command.id, command);
  }

  unregisterVoiceCommand(commandId: string): void {
    this.commands.delete(commandId);
  }

  private async executeMacro(macroId: string): Promise<void> {
    console.info('executeMacro placeholder', macroId);
  }

  private async emergencyStop(): Promise<void> {
    console.warn('emergencyStop placeholder');
  }

  private async increaseDifficulty(): Promise<void> {
    console.info('increaseDifficulty placeholder');
  }

  private async showUsers(): Promise<void> {
    console.info('showUsers placeholder');
  }

  private logVoiceCommand(commandId: string, transcript: string, status: string, error?: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      commandId,
      transcript,
      status,
      error: error?.message ?? null
    };

    try {
      const history = JSON.parse(localStorage.getItem('voiceCommandHistory') || '[]');
      history.push(logEntry);
      localStorage.setItem('voiceCommandHistory', JSON.stringify(history.slice(-100)));
    } catch (storageError) {
      console.error('Failed to record voice command history', storageError);
    }
  }
}

interface VoiceCommand {
  id: string;
  phrases: string[];
  action: () => Promise<void> | void;
  category: string;
  description?: string;
}
