import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ControlPanelState, ControlUpdater, TabKey } from '../components/control-panel/types';

interface UseVoiceControlOptions {
  locale?: string;
  onNavigate?: (tab: TabKey) => void;
  onCommandRecognized?: (command: VoiceCommandDescriptor, transcript: string) => void;
}

export interface VoiceCommandDescriptor {
  phrase: string;
  synonyms?: string[];
  description?: string;
  category?: string;
  action: () => void;
}

export interface UseVoiceControlResult {
  isSupported: boolean;
  isEnabled: boolean;
  isListening: boolean;
  transcript: string;
  error: string | null;
  availableCommands: VoiceCommandDescriptor[];
  lastCommand: VoiceCommandDescriptor | null;
  analytics: {
    totalRecognized: number;
    lastCommandPhrase: string | null;
  };
  enable: () => void;
  disable: () => void;
  toggleEnabled: () => void;
  startListening: () => void;
  stopListening: () => void;
  registerCommand: (descriptor: VoiceCommandDescriptor) => void;
}

const getRecognitionConstructor = (): any => {
  if (typeof window === 'undefined') {
    return null;
  }
  const candidate =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    (window as any).mozSpeechRecognition ||
    (window as any).msSpeechRecognition;
  return candidate ?? null;
};

const normalize = (value: string) => value.trim().toLowerCase().replace(/[.,!?؟]/g, '');

export const useVoiceControl = (
  state: ControlPanelState,
  onStateChange: ControlUpdater,
  options?: UseVoiceControlOptions
): UseVoiceControlResult => {
  const [isEnabled, setEnabled] = useState(false);
  const [isListening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [commands, setCommands] = useState<VoiceCommandDescriptor[]>([]);
  const [lastCommand, setLastCommand] = useState<VoiceCommandDescriptor | null>(null);
  const [totalRecognized, setTotalRecognized] = useState(0);

  const recognitionRef = useRef<any>(null);
  const shouldContinueRef = useRef(false);
  const lastTriggerRef = useRef<{ key: string; timestamp: number } | null>(null);
  const stateRef = useRef(state);

  const recognitionCtorRef = useRef<any | null>(getRecognitionConstructor());
  const isSupported = Boolean(recognitionCtorRef.current);

  const commandIndexRef = useRef<Array<VoiceCommandDescriptor & { normalized: string[] }>>([]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const rebuildCommandIndex = useCallback((list: VoiceCommandDescriptor[]) => {
    commandIndexRef.current = list.map(entry => ({ ...entry, normalized: [entry.phrase, ...(entry.synonyms ?? [])].map(normalize) }));
  }, []);

  const registerCommand = useCallback((descriptor: VoiceCommandDescriptor) => {
    setCommands(prev => {
      const existingIndex = prev.findIndex(cmd => normalize(cmd.phrase) === normalize(descriptor.phrase));
      if (existingIndex >= 0) {
        if (prev[existingIndex] === descriptor) {
          return prev;
        }
        const next = [...prev];
        next[existingIndex] = descriptor;
        return next;
      }
      return [...prev, descriptor];
    });
  }, []);

  const { locale: requestedLocale, onNavigate, onCommandRecognized } = options ?? {};
  const locale = requestedLocale ?? 'ar-SA';

  const baseCommands = useMemo<VoiceCommandDescriptor[]>(
    () => [
      {
        phrase: 'بدء المحاكاة',
        synonyms: ['تشغيل المحاكاة', 'ابدأ المحاكاة'],
        description: 'تشغيل الزمن داخل بيئة المحاكاة',
        category: 'simulation',
        action: () =>
          onStateChange(prev => ({
            ...prev,
            globalControls: {
              ...prev.globalControls,
              timeScale: prev.globalControls.timeScale === 0 ? 1 : prev.globalControls.timeScale
            }
          }))
      },
      {
        phrase: 'إيقاف المحاكاة',
        synonyms: ['إيقاف الزمن', 'أوقف المحاكاة'],
        description: 'إيقاف زمن المحاكاة بشكل فوري',
        category: 'simulation',
        action: () =>
          onStateChange(prev => ({
            ...prev,
            globalControls: {
              ...prev.globalControls,
              timeScale: 0
            }
          }))
      },
      {
        phrase: 'زيادة الصعوبة',
        synonyms: ['ارفع الصعوبة'],
        description: 'رفع مستوى صعوبة المحاكاة درجة واحدة',
        category: 'difficulty',
        action: () =>
          onStateChange(prev => ({
            ...prev,
            globalControls: {
              ...prev.globalControls,
              difficulty: Math.min(10, prev.globalControls.difficulty + 1)
            }
          }))
      },
      {
        phrase: 'تقليل الصعوبة',
        synonyms: ['خفض الصعوبة'],
        description: 'خفض مستوى الصعوبة درجة واحدة',
        category: 'difficulty',
        action: () =>
          onStateChange(prev => ({
            ...prev,
            globalControls: {
              ...prev.globalControls,
              difficulty: Math.max(1, prev.globalControls.difficulty - 1)
            }
          }))
      },
      {
        phrase: 'وضع التحدي القصوى',
        synonyms: ['التحدي الأقصى', 'وضع البطولة'],
        description: 'تفعيل أعلى إعدادات صعوبة وعدوانية للذكاء الاصطناعي',
        category: 'difficulty',
        action: () =>
          onStateChange(prev => ({
            ...prev,
            globalControls: {
              ...prev.globalControls,
              difficulty: 10,
              aiAggressiveness: 10
            }
          }))
      },
      {
        phrase: 'تفعيل المراقبة',
        synonyms: ['شغل المراقبة', 'راقب المستخدمين'],
        description: 'تفعيل المراقبة الفورية للنشاط',
        category: 'users',
        action: () =>
          onStateChange(prev => ({
            ...prev,
            userManagement: {
              ...prev.userManagement,
              realTimeMonitoring: true
            }
          }))
      },
      {
        phrase: 'إيقاف المراقبة',
        synonyms: ['أوقف المراقبة'],
        description: 'إيقاف المراقبة الفورية',
        category: 'users',
        action: () =>
          onStateChange(prev => ({
            ...prev,
            userManagement: {
              ...prev.userManagement,
              realTimeMonitoring: false
            }
          }))
      },
      {
        phrase: 'عرض جميع المستخدمين',
        synonyms: ['انتقل إلى المستخدمين', 'لوحة المستخدمين'],
        description: 'فتح لوحة إدارة المستخدمين',
        category: 'navigation',
        action: () => onNavigate?.('users')
      },
      {
        phrase: 'تقرير الحالة',
        synonyms: ['ملخص الحالة', 'أعطني الحالة'],
        description: 'عرض ملخص سريع لحالة المحاكاة الحالية',
        category: 'analytics',
        action: () => {
          const snapshot = stateRef.current;
          console.info('ملخص الحالة', {
            timeScale: snapshot.globalControls.timeScale,
            difficulty: snapshot.globalControls.difficulty,
            threatLevel: snapshot.simulationEnvironment.threatLevel,
            activeScenarios: snapshot.simulationEnvironment.activeScenarios.size
          });
        }
      }
    ],
    [onStateChange, onNavigate]
  );

  const stopRecognition = useCallback(() => {
    shouldContinueRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // ignore stop errors
      }
    }
    setListening(false);
  }, []);

  useEffect(() => {
    setCommands(prev => {
      let next = prev;
      baseCommands.forEach(base => {
        const existingIndex = next.findIndex(candidate => normalize(candidate.phrase) === normalize(base.phrase));
        if (existingIndex >= 0) {
          if (next[existingIndex] !== base) {
            if (next === prev) {
              next = [...prev];
            }
            next[existingIndex] = base;
          }
        } else {
          if (next === prev) {
            next = [...prev];
          }
          next.push(base);
        }
      });
      return next;
    });
  }, [baseCommands]);

  useEffect(() => {
    rebuildCommandIndex(commands);
  }, [commands, rebuildCommandIndex]);

  const findMatchingCommand = useCallback(
    (normalizedTranscript: string): VoiceCommandDescriptor | null => {
      for (const descriptor of commandIndexRef.current) {
        if (descriptor.normalized.some(key => normalizedTranscript.includes(key))) {
          return descriptor;
        }
      }
      return null;
    },
    []
  );

  useEffect(() => {
    if (!isEnabled) {
      stopRecognition();
      return;
    }

    const RecognitionCtor = recognitionCtorRef.current;
    if (!RecognitionCtor) {
      setError('المتصفح الحالي لا يدعم التعرف على الصوت');
      return;
    }

    const recognitionInstance = new RecognitionCtor();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = locale;

    recognitionInstance.onstart = () => {
      setError(null);
      setListening(true);
    };

    recognitionInstance.onresult = (event: any) => {
      const result = event.results[event.resultIndex];
      const rawTranscript = result[0].transcript;
      setTranscript(rawTranscript.trim());

      if (!result.isFinal) {
        return;
      }

      const normalizedTranscript = normalize(rawTranscript);
      if (!normalizedTranscript) {
        return;
      }

      const match = findMatchingCommand(normalizedTranscript);
      if (!match) {
        return;
      }

      const now = Date.now();
      const throttleKey = match.phrase;
      if (lastTriggerRef.current && lastTriggerRef.current.key === throttleKey && now - lastTriggerRef.current.timestamp < 1200) {
        return;
      }

      lastTriggerRef.current = { key: throttleKey, timestamp: now };
      match.action();
      setLastCommand(match);
      setTotalRecognized(prev => prev + 1);
      onCommandRecognized?.(match, rawTranscript);
    };

    recognitionInstance.onerror = event => {
      setError(event.error ?? 'خطأ غير معروف في نظام الأوامر الصوتية');
      setListening(false);
    };

    recognitionInstance.onend = () => {
      setListening(false);
      if (shouldContinueRef.current) {
        recognitionInstance.start();
      }
    };

    recognitionRef.current = recognitionInstance;

    return () => {
      recognitionInstance.stop();
      recognitionRef.current = null;
    };
  }, [findMatchingCommand, isEnabled, locale, onCommandRecognized, stopRecognition]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('التعرف الصوتي غير مجهز حالياً');
      return;
    }
    shouldContinueRef.current = true;
    try {
      recognitionRef.current.start();
    } catch (err) {
      setError('تعذر بدء الاستماع');
    }
  }, []);

  const stopListening = useCallback(() => {
    stopRecognition();
  }, [stopRecognition]);

  const enable = useCallback(() => {
    if (!isSupported) {
      setError('التعرف الصوتي غير مدعوم في هذا المتصفح');
      return;
    }
    setEnabled(true);
  }, [isSupported]);

  const disable = useCallback(() => {
    setEnabled(false);
    stopRecognition();
  }, [stopRecognition]);

  const toggleEnabled = useCallback(() => {
    if (isEnabled) {
      disable();
    } else {
      enable();
    }
  }, [disable, enable, isEnabled]);

  return {
    isSupported,
    isEnabled,
    isListening,
    transcript,
    error,
    availableCommands: commands,
    lastCommand,
    analytics: {
      totalRecognized,
      lastCommandPhrase: lastCommand?.phrase ?? null
    },
    enable,
    disable,
    toggleEnabled,
    startListening,
    stopListening,
    registerCommand
  };
};
