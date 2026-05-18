import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Mic, Clock, Settings } from 'lucide-react-native';

import { RecordScreen } from '../screens/RecordScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';

import { useTheme } from '../theme/useTheme';
import { useAuthStore } from '../store/authStore';
import { Typography, Spacing, Radii, Shadows } from '../theme/typography';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CustomTabBar({ state, descriptors, navigation }: any) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  const tabs = [
    { name: 'Record', label: 'Record', Icon: Mic },
    { name: 'History', label: 'History', Icon: Clock },
    { name: 'SettingsTab', label: 'Settings', Icon: Settings },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab, idx) => {
        const isFocused = state.index === idx;
        return (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tabItem, isFocused && styles.tabItemActive]}
            onPress={() => navigation.navigate(tab.name)}
            activeOpacity={0.8}
          >
            <tab.Icon
              size={18}
              color={isFocused ? colors.white : colors.textMuted}
            />
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Record" component={RecordScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen
            name="Result"
            component={ResultScreen}
            options={{
              presentation: 'card',
              gestureEnabled: true,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: Radii.xl,
    gap: 2,
  },
  tabItemActive: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    ...Typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: colors.white,
  },
});
