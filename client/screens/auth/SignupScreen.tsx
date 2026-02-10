import React, { useState } from "react";
import { StyleSheet, View, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";
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

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { signup, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = "Must include uppercase, lowercase, and number";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      await signup({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim() || undefined,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed";
      Alert.alert("Signup Failed", message);
    }
  };

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Login");
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((e) => ({ ...e, [field]: undefined }));
    }
  };

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
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Image
            source={require("../../../assets/images/icon.png")}
            style={styles.logo}
            contentFit="contain"
          />
          <ThemedText type="h1" style={styles.title}>
            Create Account
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            Join Tatekulu and start booking your cuts
          </ThemedText>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={(text) => {
              setName(text);
              clearError("name");
            }}
            autoCapitalize="words"
            autoComplete="name"
            leftIcon="user"
            error={errors.name}
          />

          <View style={styles.inputSpacer} />

          <Input
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              clearError("email");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            leftIcon="mail"
            error={errors.email}
          />

          <View style={styles.inputSpacer} />

          <Input
            label="Phone (Optional)"
            placeholder="+1 234 567 8900"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoComplete="tel"
            leftIcon="phone"
          />

          <View style={styles.inputSpacer} />

          <Input
            label="Password"
            placeholder="Create a strong password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              clearError("password");
            }}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="password-new"
            leftIcon="lock"
            rightIcon={showPassword ? "eye-off" : "eye"}
            onRightIconPress={() => setShowPassword(!showPassword)}
            error={errors.password}
          />

          <View style={styles.inputSpacer} />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              clearError("confirmPassword");
            }}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            leftIcon="lock"
            error={errors.confirmPassword}
          />

          {/* Password Requirements */}
          <View
            style={[
              styles.requirements,
              { backgroundColor: theme.backgroundSecondary },
            ]}
          >
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Password must contain:
            </ThemedText>
            <View style={styles.requirementsList}>
              <RequirementItem
                met={password.length >= 8}
                text="At least 8 characters"
                theme={theme}
              />
              <RequirementItem
                met={/[A-Z]/.test(password)}
                text="One uppercase letter"
                theme={theme}
              />
              <RequirementItem
                met={/[a-z]/.test(password)}
                text="One lowercase letter"
                theme={theme}
              />
              <RequirementItem
                met={/\d/.test(password)}
                text="One number"
                theme={theme}
              />
            </View>
          </View>

          <Button
            onPress={handleSignup}
            disabled={isLoading}
            style={styles.signupButton}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </View>

        {/* Terms */}
        <ThemedText
          type="caption"
          style={[styles.terms, { color: theme.textTertiary }]}
        >
          By creating an account, you agree to our{" "}
          <ThemedText type="caption" style={{ color: theme.accent }}>
            Terms of Service
          </ThemedText>{" "}
          and{" "}
          <ThemedText type="caption" style={{ color: theme.accent }}>
            Privacy Policy
          </ThemedText>
        </ThemedText>

        {/* Login Link */}
        <View style={styles.loginSection}>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            Already have an account?{" "}
          </ThemedText>
          <Pressable
            onPress={handleLogin}
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

function RequirementItem({
  met,
  text,
  theme,
}: {
  met: boolean;
  text: string;
  theme: any;
}) {
  return (
    <View style={styles.requirementItem}>
      <View
        style={[
          styles.requirementDot,
          { backgroundColor: met ? theme.success : theme.textTertiary },
        ]}
      />
      <ThemedText
        type="caption"
        style={{ color: met ? theme.success : theme.textTertiary }}
      >
        {text}
      </ThemedText>
    </View>
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
  headerSection: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginBottom: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    textAlign: "center",
  },
  form: {
    marginBottom: Spacing.xl,
  },
  inputSpacer: {
    height: Spacing.md,
  },
  requirements: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.md,
  },
  requirementsList: {
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  requirementDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: Spacing.sm,
  },
  signupButton: {
    marginTop: Spacing.xl,
  },
  terms: {
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: 18,
  },
  loginSection: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
