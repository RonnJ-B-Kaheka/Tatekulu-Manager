import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { Typography } from "../../components/ui/Typography";
import { useAuth } from "../auth/hooks/useAuth";
import { Spacing } from "../../theme";
import { useTheme } from "../../theme/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";

export const HomeScreen = () => {
  const { logout, user } = useAuth();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={[theme.black, theme.primary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <Typography variant="h1" color={theme.white}>Tatekulu</Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              Premium Barbering Experience
            </Typography>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.welcomeSection}>
          <Typography variant="h2">Welcome back,</Typography>
          <Typography variant="h1" color={theme.primary}>{user?.name || "Guest"}!</Typography>
          <Typography variant="body1" color={theme.textSecondary} style={styles.roleText}>
            Role: {user?.role || "Customer"}
          </Typography>
        </View>

        <View style={styles.footer}>
          <Button title="Logout" onPress={logout} variant="outline" />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    padding: Spacing.xl,
  },
  scroll: {
    flexGrow: 1,
    padding: Spacing.xl,
  },
  welcomeSection: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.huge,
  },
  roleText: {
    marginTop: Spacing.sm,
  },
  footer: {
    marginTop: "auto",
    paddingBottom: Spacing.xl,
  },
});

