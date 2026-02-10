import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../components/ui/Button";
import { useNavigation } from "@react-navigation/native";
import { Typography } from "../../../components/ui/Typography";
import { useTheme } from "../../../theme/ThemeContext";

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Typography variant="h1" style={styles.title}>Reset Password</Typography>
        <Typography variant="body1" color={theme.textSecondary} style={styles.subtitle}>
          Feature coming soon.
        </Typography>
        <Button
          title="Back to Login"
          variant="outline"
          onPress={() => navigation.goBack()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: { marginBottom: 8 },
  subtitle: { marginBottom: 24 },
});
