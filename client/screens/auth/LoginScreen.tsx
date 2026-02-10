import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";
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

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      await login({ email: email.trim().toLowerCase(), password });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      Alert.alert("Login Failed", message);
    }
  };

  const handleForgotPassword = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ForgotPassword");
  };

  const handleSignup = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Signup");
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollViewCompat
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing["4xl"],
            paddingBottom: insets.bottom + Spacing["2xl"],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Image
            source={require("../../../assets/images/icon.png")}
            style={styles.logo}
            contentFit="contain"
          />
          <ThemedText type="h1" style={styles.title}>
            Welcome Back
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            Sign in to continue booking your next fresh cut
          </ThemedText>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            leftIcon="mail"
            error={errors.email}
          />

          <View style={styles.inputSpacer} />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password)
                setErrors((e) => ({ ...e, password: undefined }));
            }}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="password"
            leftIcon="lock"
            rightIcon={showPassword ? "eye-off" : "eye"}
            onRightIconPress={() => setShowPassword(!showPassword)}
            error={errors.password}
          />

          <Pressable
            onPress={handleForgotPassword}
            style={({ pressed }) => [
              styles.forgotPassword,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <ThemedText type="small" style={{ color: theme.accent }}>
              Forgot Password?
            </ThemedText>
          </Pressable>

          <Button
            onPress={handleLogin}
            disabled={isLoading}
            style={styles.loginButton}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View
            style={[styles.dividerLine, { backgroundColor: theme.border }]}
          />
          <ThemedText
            type="small"
            style={[styles.dividerText, { color: theme.textTertiary }]}
          >
            or
          </ThemedText>
          <View
            style={[styles.dividerLine, { backgroundColor: theme.border }]}
          />
        </View>

        {/* Social Login */}
        <View style={styles.socialButtons}>
          <Pressable
            onPress={() =>
              Alert.alert("Coming Soon", "Apple Sign-In coming soon!")
            }
            style={({ pressed }) => [
              styles.socialButton,
              { backgroundColor: theme.text, opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Feather name="smartphone" size={20} color={theme.backgroundRoot} />
            <ThemedText
              type="button"
              style={{ color: theme.backgroundRoot, marginLeft: Spacing.sm }}
            >
              Continue with Apple
            </ThemedText>
          </Pressable>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signupSection}>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            Don't have an account?{" "}
          </ThemedText>
          <Pressable
            onPress={handleSignup}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <ThemedText
              type="body"
              style={{ color: theme.accent, fontWeight: "600" }}
            >
              Sign Up
            </ThemedText>
          </Pressable>
        </View>

        {/* Demo Credentials */}
        <View
          style={[
            styles.demoSection,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <ThemedText
            type="small"
            style={{ color: theme.textSecondary, textAlign: "center" }}
          >
            Demo: Use any email with password "password123"{"\n"}
            Admin: admin@tatekulu.com / admin123
          </ThemedText>
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
  logoSection: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: "center",
  },
  form: {
    marginBottom: Spacing.xl,
  },
  inputSpacer: {
    height: Spacing.lg,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  loginButton: {
    marginTop: Spacing.xl,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: Spacing.lg,
  },
  socialButtons: {
    marginBottom: Spacing.xl,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.full,
  },
  signupSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  demoSection: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
});
