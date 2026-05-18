import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'admin' | 'user';

interface UserProfile {
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  historyStatus: 'active' | 'archived';
  memberSince: string;
}

interface AuthStore {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (username: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AUTH_KEY = '@durly_auth';

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,

  login: async (username: string, role: UserRole = 'user') => {
    // Simulate role logic based on username for demo
    const assignedRole = username.toLowerCase().includes('admin') ? 'admin' : role;
    
    const user: UserProfile = {
      username: username,
      email: `${username.toLowerCase()}@durly.ai`,
      role: assignedRole,
      historyStatus: 'active',
      memberSince: new Date().getFullYear().toString(),
    };
    set({ isAuthenticated: true, user });
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
  },

  logout: async () => {
    set({ isAuthenticated: false, user: null });
    await AsyncStorage.removeItem(AUTH_KEY);
  },

  checkAuth: async () => {
    try {
      const raw = await AsyncStorage.getItem(AUTH_KEY);
      if (raw) {
        set({ isAuthenticated: true, user: JSON.parse(raw) });
      }
    } catch {}
  },
}));
