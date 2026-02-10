import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Typography } from "../../../components/ui/Typography";
import { useAuth } from "../hooks/useAuth";
import { Spacing } from "../../../theme";
import { useTheme } from "../../../theme/ThemeContext";

export const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const { login, isLoading, error } = useAuth();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleLogin = async () => {
    setValidationError("");
    if (!email || !password) {
      setValidationError("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Please enter a valid email address");
      return;
    }

    try {
      await login({ email, password });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <LinearGradient
          colors={[theme.primary, theme.black]}
          style={styles.headerBackground}
        />

        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.content}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.header}>
                <Typography variant="h1" color={theme.white}>
                  Welcome Back!
                </Typography>
                <Typography variant="body1" color="rgba(255, 255, 255, 0.8)">
                  Sign in to manage your appointments
                </Typography>
              </View>

              <Card style={styles.formCard}>
                {(error || validationError) && (
                  <View style={[styles.errorBanner, { backgroundColor: theme.error + '20', borderColor: theme.error + '40' }]}>
                    <Typography variant="body2" color={theme.error} align="center">
                      {validationError || error}
                    </Typography>
                  </View>
                )}

                <Input
                  label="Email"
                  icon="mail-outline"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />

                <Input
                  label="Password"
                  icon="lock-closed-outline"
                  placeholder="Enter your password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />

                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Typography variant="body2" bold color={theme.primary}>
                    Forgot Password?
                  </Typography>
                </TouchableOpacity>

                <Button
                  title="Sign In"
                  variant="primary"
                  onPress={handleLogin}
                  isLoading={isLoading}
                  style={styles.signInButton}
                />

                <View style={styles.footer}>
                  <Typography variant="body2" color={theme.textSecondary}>
                    Don't have an account?{" "}
                  </Typography>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Signup")}
                  >
                    <Typography variant="body2" bold color={theme.primary}>
                      Sign Up
                    </Typography>
                  </TouchableOpacity>
                </View>
              </Card>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackground: {
    height: 350,
    width: "100%",
    position: "absolute",
    top: 0,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  formCard: {
    padding: Spacing.xl,
    marginTop: Spacing.md,
  },
  errorBanner: {
    padding: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.lg,
    borderWidth: 1,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: Spacing.xl,
  },
  signInButton: {
    marginBottom: Spacing.xl,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

