import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AIResult } from "./recordStore";
import { useAuthStore } from "./authStore";
import {
  createScanOnServer,
  deleteScanFromServer,
  fetchGlobalScansFromServer,
  fetchUserScansFromServer,
} from "../services/historyService";

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
}

const HISTORY_KEY = "@durly_history";

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  scans: [],
  globalScans: [],
  isLoaded: false,

  loadHistory: async () => {
    try {
      const raw = await AsyncStorage.getItem(HISTORY_KEY);
      if (raw) {
        set({ scans: JSON.parse(raw) });
      } else {
        set({ scans: [] });
      }
    } catch {
      set({ scans: [] });
    }

    try {
      const authState = useAuthStore.getState();
      const username = authState.user?.username;

      if (username) {
        const [userScans, globalScans] = await Promise.all([
          fetchUserScansFromServer(username),
          fetchGlobalScansFromServer(10),
        ]);

        set({ scans: userScans, globalScans, isLoaded: true });
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(userScans));
        return;
      }
    } catch {
      // Keep local fallback data if server is unavailable.
    }

    set({ isLoaded: true });
  },

  addScan: async (result: AIResult) => {
    const authState = useAuthStore.getState();
    const username = authState.user?.username;

    const newScan: ScanRecord = {
      ...result,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      username,
    };

    const updated = [newScan, ...get().scans];
    set({ scans: updated });
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));

    if (!username) {
      return;
    }

    try {
      const serverScan = await createScanOnServer({
        username,
        userId: authState.user?.email,
        result,
      });

      const nextScans = [
        serverScan,
        ...get().scans.filter((scan) => scan.id !== newScan.id),
      ];
      set({ scans: nextScans });
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(nextScans));
    } catch {
      // Local data is preserved when server save fails.
    }
  },

  deleteScan: async (id: string) => {
    const authState = useAuthStore.getState();
    const username = authState.user?.username;

    const updated = get().scans.filter((s) => s.id !== id);
    set({ scans: updated });
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    try {
      await deleteScanFromServer(id, username);
    } catch {
      // Keep UI responsive even if server delete fails.
    }
  },
}));
