import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert } from "react-native";
import { Mail, Lock, LogIn, User } from "lucide-react-native";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../theme/useTheme";
import { Typography, Spacing, Radii, Shadows } from "../theme/typography";

export function LoginScreen({ navigation }: any) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { login } = useAuthStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (username && password) {
      await login(username);
    }
  };

  const handleGuestLogin = async () => {
    await login("guest");
  };

  const handleGoogleLogin = async () => {
    // Quick demo fallback: create a demo google user locally.
    // Replace with proper Google OAuth flow (expo-auth-session or GoogleSignIn)
    Alert.alert(
      "Google Sign-In",
      "Google Sign-In is not configured. Signing in with a demo Google account.\n\nTo enable real Google login, configure OAuth client IDs and use expo-auth-session or @react-native-google-signin/google-signin.",
      [{ text: "OK" }],
    );
    await login("google_user");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Mascot Section */}
          <View style={styles.mascotContainer}>
            <View style={[styles.mascotBg, Shadows.card]}>
              <Image
                source={require("../../assets/images/durly_idle.jpg")}
                style={styles.mascotImg}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.welcomeTitle}>Welcome Back!</Text>
            <Text style={styles.welcomeSub}>Login to your Durly account</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Mail size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={colors.textMuted}
                value={username}
                onChangeText={setUsername}
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

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginBtn, Shadows.button]}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginBtnText}>Login</Text>
              <LogIn size={20} color={colors.white} />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.line} />
          </View>

          {/* Social Login */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={[styles.socialBtn, Shadows.card]}
              onPress={handleGoogleLogin}
            >
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/300/300221.png",
                }}
                style={styles.googleIcon}
              />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialBtn, Shadows.card]}
              onPress={handleGuestLogin}
            >
              <User size={20} color={colors.textPrimary} />
              <Text style={styles.socialText}>Guest</Text>
            </TouchableOpacity>
          </View>

          {/* Register Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.footerLink}>Register Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.bgLight },
    scroll: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
      paddingTop: Spacing.lg,
    },
    mascotContainer: {
      alignItems: "center",
      marginBottom: Spacing.xl,
    },
    mascotBg: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.accentYellow,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: Spacing.md,
      borderWidth: 2,
      borderColor: colors.white,
    },
    mascotImg: {
      width: 100,
      height: 100,
    },
    welcomeTitle: {
      ...Typography.display,
      color: colors.textPrimary,
      fontSize: 24,
    },
    welcomeSub: {
      ...Typography.body,
      color: colors.textSecondary,
      marginTop: 4,
    },
    form: {
      gap: Spacing.md,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
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
    forgotBtn: {
      alignSelf: "flex-end",
    },
    forgotText: {
      ...Typography.caption,
      color: colors.primaryDark,
      fontWeight: "700",
    },
    loginBtn: {
      backgroundColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 50,
      borderRadius: Radii.pill,
      gap: 10,
      marginTop: Spacing.sm,
    },
    loginBtnText: {
      ...Typography.h3,
      color: colors.white,
      fontWeight: "800",
    },
    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: Spacing.lg,
      gap: 12,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      ...Typography.caption,
      color: colors.textMuted,
      fontWeight: "800",
    },
    socialRow: {
      flexDirection: "row",
      gap: Spacing.md,
    },
    socialBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
      height: 48,
      borderRadius: Radii.lg,
      gap: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    googleIcon: {
      width: 18,
      height: 18,
    },
    socialText: {
      ...Typography.label,
      color: colors.textPrimary,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: Spacing.xl,
    },
    footerText: {
      ...Typography.body,
      color: colors.textSecondary,
    },
    footerLink: {
      ...Typography.body,
      color: colors.primaryDark,
      fontWeight: "800",
    },
  });
