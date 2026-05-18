import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, Image, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Lock, UserPlus, ArrowLeft } from 'lucide-react-native';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../theme/useTheme';
import { Typography, Spacing, Radii, Shadows } from '../theme/typography';

export function RegisterScreen({ navigation }: any) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { login } = useAuthStore();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (username && email && password) {
      await login(username);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the Durly family today 🍈</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <User size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={colors.textMuted}
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <Text style={styles.termsText}>
              By registering, you agree to our{' '}
              <Text style={styles.termsLink}>Terms</Text> and{' '}
              <Text style={styles.termsLink}>Privacy</Text>.
            </Text>

            <TouchableOpacity 
              style={[styles.registerBtn, Shadows.button]} 
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.registerBtnText}>Create Account</Text>
              <UserPlus size={20} color={colors.white} />
            </TouchableOpacity>
          </View>

          {/* Mascot Decoration */}
          <View style={styles.mascotFooter}>
            <Image 
              source={require('../../assets/images/durly_mascot.png')}
              style={styles.mascotImg}
              resizeMode="contain"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bgLight },
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  backBtn: {
    marginTop: Spacing.md,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.display,
    color: colors.textPrimary,
    fontSize: 26,
  },
  subtitle: {
    ...Typography.body,
    color: colors.textSecondary,
    marginTop: 4,
  },
  form: {
    gap: Spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    height: 48,
    gap: 12,
  },
  input: {
    flex: 1,
    ...Typography.bodyLarge,
    color: colors.textPrimary,
  },
  termsText: {
    ...Typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: Spacing.md,
    fontSize: 10,
  },
  termsLink: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  registerBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: Radii.pill,
    gap: 10,
    marginTop: Spacing.sm,
  },
  registerBtnText: {
    ...Typography.h3,
    color: colors.white,
    fontWeight: '800',
  },
  mascotFooter: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    opacity: 0.6,
  },
  mascotImg: {
    width: 60,
    height: 60,
  },
});
