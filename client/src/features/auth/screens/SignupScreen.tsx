import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Typography } from "../../../components/ui/Typography";
import { Spacing } from "../../../theme";
import { useTheme } from "../../../theme/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";

export const SignupScreen = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Account created! Please log in.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    }, 1000);
  };

  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={[theme.black, theme.primary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView edges={["top"]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Typography variant="body1" color={theme.white}>← Back</Typography>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Typography variant="h1" color={theme.white}>Create Account</Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              Start your premium grooming journey
            </Typography>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <Input
              label="Full Name"
              icon="person-outline"
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
            />
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
              placeholder="Create a password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Button
              title="Sign Up"
              onPress={handleSignup}
              isLoading={isLoading}
              style={styles.button}
            />

            <View style={styles.footer}>
              <Typography variant="body2" color={theme.textSecondary}>
                Already have an account?{" "}
              </Typography>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Typography variant="body2" color={theme.primary} bold>
                  Sign In
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    padding: Spacing.xl,
  },
  backButton: {
    padding: Spacing.lg,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.xl,
  },
  form: {
    marginTop: Spacing.lg,
  },
  button: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: Spacing.huge,
  },
});

