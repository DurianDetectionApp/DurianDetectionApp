import { create } from 'zustand';
import { RipenessType } from '../theme/colors';

export type RecordingState = 'idle' | 'recording' | 'processing' | 'done' | 'error';

export interface AIResult {
  ripeness: RipenessType;
  confidence: number;
  variety: string;
  texture: string;
  description: string;
  timestamp: string;
  audioUri?: string;
}

interface RecordStore {
  recordingState: RecordingState;
  currentResult: AIResult | null;
  audioUri: string | null;
  setRecordingState: (state: RecordingState) => void;
  setCurrentResult: (result: AIResult) => void;
  setAudioUri: (uri: string | null) => void;
  reset: () => void;
}

export const useRecordStore = create<RecordStore>((set) => ({
  recordingState: 'idle',
  currentResult: null,
  audioUri: null,
  setRecordingState: (state) => set({ recordingState: state }),
  setCurrentResult: (result) => set({ currentResult: result }),
  setAudioUri: (uri) => set({ audioUri: uri }),
  reset: () => set({ recordingState: 'idle', currentResult: null, audioUri: null }),
}));
