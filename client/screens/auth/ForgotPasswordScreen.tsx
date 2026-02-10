import React, { useState } from "react";
import { StyleSheet, View, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { AuthStackParamList } from "@/navigation/AuthStackNavigator";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { requestPasswordReset } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateEmail()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    try {
      await requestPasswordReset({ email: email.trim().toLowerCase() });
      setIsSuccess(true);
    } catch (err) {
      Alert.alert("Error", "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Login");
  };

  if (isSuccess) {
    return (
      <ThemedView style={styles.container}>
        <View
          style={[
            styles.successContent,
            {
              paddingTop: insets.top + Spacing["4xl"],
              paddingBottom: insets.bottom + Spacing["2xl"],
            },
          ]}
        >
          <View
            style={[styles.successIcon, { backgroundColor: theme.success }]}
          >
            <Feather name="mail" size={40} color="#FFFFFF" />
          </View>
          <ThemedText type="h1" style={styles.successTitle}>
            Check Your Email
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.successMessage, { color: theme.textSecondary }]}
          >
            We've sent a password reset link to{"\n"}
            <ThemedText type="body" style={{ fontWeight: "600" }}>
              {email}
            </ThemedText>
          </ThemedText>
          <ThemedText
            type="small"
            style={[styles.successHint, { color: theme.textTertiary }]}
          >
            Didn't receive the email? Check your spam folder or try again.
          </ThemedText>
          <Button onPress={handleBackToLogin} style={styles.backButton}>
            Back to Sign In
          </Button>
          <Pressable
            onPress={() => {
              setIsSuccess(false);
              setEmail("");
            }}
            style={({ pressed }) => [
              styles.resendLink,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <ThemedText type="body" style={{ color: theme.accent }}>
              Try a different email
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollViewCompat
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing["3xl"],
            paddingBottom: insets.bottom + Spacing["2xl"],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <Pressable
          onPress={handleBackToLogin}
          style={({ pressed }) => [
            styles.backLink,
            { opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <Feather name="arrow-left" size={20} color={theme.text} />
          <ThemedText type="body" style={{ marginLeft: Spacing.sm }}>
            Back
          </ThemedText>
        </Pressable>

        {/* Header */}
        <View style={styles.headerSection}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.backgroundSecondary },
            ]}
          >
            <Feather name="lock" size={32} color={theme.accent} />
          </View>
          <ThemedText type="h1" style={styles.title}>
            Forgot Password?
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            No worries! Enter your email and we'll send you a reset link.
          </ThemedText>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email Address"
            placeholder="your@email.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoFocus
            leftIcon="mail"
            error={error}
          />

          <Button
            onPress={handleSubmit}
            disabled={isLoading}
            style={styles.submitButton}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </View>

        {/* Login Link */}
        <View style={styles.loginSection}>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            Remember your password?{" "}
          </ThemedText>
          <Pressable
            onPress={handleBackToLogin}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <ThemedText
              type="body"
              style={{ color: theme.accent, fontWeight: "600" }}
            >
              Sign In
            </ThemedText>
          </Pressable>
        </View>
      </KeyboardAwareScrollViewCompat>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  backLink: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing["2xl"],
    alignSelf: "flex-start",
    paddingVertical: Spacing.sm,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 24,
  },
  form: {
    marginBottom: Spacing["2xl"],
  },
  submitButton: {
    marginTop: Spacing.xl,
  },
  loginSection: {
    flexDirection: "row",
    justifyContent: "center",
  },
  successContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing["2xl"],
  },
  successTitle: {
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  successMessage: {
    textAlign: "center",
    marginBottom: Spacing.lg,
    lineHeight: 24,
  },
  successHint: {
    textAlign: "center",
    marginBottom: Spacing["2xl"],
  },
  backButton: {
    width: "100%",
    marginBottom: Spacing.lg,
  },
  resendLink: {
    paddingVertical: Spacing.sm,
  },
});
