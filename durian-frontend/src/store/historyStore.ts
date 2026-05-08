import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AIResult } from './recordStore';

export interface ScanRecord extends AIResult {
  id: string;
  timestamp: string;
  userId?: string;
  username?: string;
}

interface HistoryStore {
  scans: ScanRecord[];
  globalScans: ScanRecord[];
  isLoaded: boolean;
  loadHistory: () => Promise<void>;
  addScan: (result: AIResult) => Promise<void>;
  deleteScan: (id: string) => Promise<void>;
  simulateGlobalActivity: () => void;
}

const HISTORY_KEY = '@durly_history';

const MOCK_GLOBAL_USERS = ['Aiman', 'Siti', 'Kevin', 'Linh', 'Somchai', 'Chen', 'Hiro', 'Maria', 'Alex', 'Zara'];
const VARIETIES = ['Musang King', 'D24 Sultan', 'Black Thorn', 'Red Prawn', 'Golden Phoenix'];

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  scans: [],
  globalScans: [],
  isLoaded: false,

  loadHistory: async () => {
    try {
      const raw = await AsyncStorage.getItem(HISTORY_KEY);
      if (raw) {
        set({ scans: JSON.parse(raw), isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  addScan: async (result: AIResult) => {
    const newScan: ScanRecord = {
      ...result,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    const updated = [newScan, ...get().scans];
    set({ scans: updated });
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  },

  deleteScan: async (id: string) => {
    const updated = get().scans.filter((s) => s.id !== id);
    set({ scans: updated });
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  },

  simulateGlobalActivity: () => {
    const generateScan = (): ScanRecord => {
      const user = MOCK_GLOBAL_USERS[Math.floor(Math.random() * MOCK_GLOBAL_USERS.length)];
      return {
        id: Math.random().toString(36).substr(2, 9),
        ripeness: ['ripe', 'under_ripe', 'over_ripe'][Math.floor(Math.random() * 3)] as any,
        confidence: 0.85 + Math.random() * 0.1,
        variety: VARIETIES[Math.floor(Math.random() * VARIETIES.length)],
        texture: 'Creamy & Thick',
        description: 'Generated from community scan.',
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
        username: user,
      };
    };

    // Initialize with 10 records
    const initialGlobal = Array.from({ length: 10 }).map(generateScan)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    set({ globalScans: initialGlobal });

    // Simulate real-time updates every 10 seconds
    const interval = setInterval(() => {
      const newGlobal = generateScan();
      const current = get().globalScans;
      const updated = [newGlobal, ...current].slice(0, 10);
      set({ globalScans: updated });
    }, 10000);

    return () => clearInterval(interval);
  },
}));
