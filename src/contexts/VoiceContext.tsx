import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from '@react-native-voice/voice';
import { locale } from '../../i18n';

interface VoiceContextType {
  isRecording: boolean;
  text: string;           
  partialText: string;
  error: string | null;
  startRecognizing: () => Promise<void>;
  stopRecognizing: () => Promise<void>;
  cancelRecognizing: () => Promise<void>;
  destroyRecognizer: () => Promise<void>;
}

export const VoiceContext = createContext({} as VoiceContextType);

export const VoiceProvider = ({ children }: { children: ReactNode }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState('');
  const [partialText, setPartialText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = () => {
    setIsRecording(true);
    setError(null);
  };

  const onSpeechEnd = () => {
    setIsRecording(false);
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    setError(JSON.stringify(e.error));
    setIsRecording(false);
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    if (e.value && e.value[0]) {
      setText(e.value[0]);
      console.log('Final recognized text:', e.value[0]);
    }
  };

  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    if (e.value && e.value[0]) {
      setPartialText(e.value[0]);
    }
  };

  const startRecognizing = useCallback(async () => {
    setText('');
    setPartialText('');
    setError(null);
    
    try {
      await Voice.start(locale);
    } catch (e) {
      console.error(e);
      setError('Failed to start recording');
    }
  }, []);

  const stopRecognizing = useCallback(async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const cancelRecognizing = useCallback(async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const destroyRecognizer = useCallback(async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    setText('');
    setPartialText('');
    setIsRecording(false);
  }, []);

  const value = {
    isRecording,
    text,
    partialText,
    error,
    startRecognizing,
    stopRecognizing,
    cancelRecognizing,
    destroyRecognizer,
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
};