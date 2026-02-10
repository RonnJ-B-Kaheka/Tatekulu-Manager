import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TextInputProps,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Feather.glyphMap;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightIconPress?: () => void;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}: InputProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {label ? (
        <ThemedText type="small" style={styles.label}>
          {label}
        </ThemedText>
      ) : null}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.backgroundDefault,
            borderColor: error ? theme.error : theme.border,
          },
        ]}
      >
        {leftIcon ? (
          <Feather
            name={leftIcon}
            size={20}
            color={theme.textSecondary}
            style={styles.leftIcon}
          />
        ) : null}
        <TextInput
          style={[
            styles.input,
            {
              color: theme.text,
              paddingLeft: leftIcon ? 0 : Spacing.lg,
              paddingRight: rightIcon ? 0 : Spacing.lg,
            },
            style,
          ]}
          placeholderTextColor={theme.textTertiary}
          {...props}
        />
        {rightIcon ? (
          <Pressable
            onPress={onRightIconPress}
            style={({ pressed }) => [
              styles.rightIcon,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Feather name={rightIcon} size={20} color={theme.textSecondary} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <ThemedText type="small" style={[styles.error, { color: theme.error }]}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    marginBottom: Spacing.sm,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    height: Spacing.inputHeight,
  },
  leftIcon: {
    marginLeft: Spacing.lg,
    marginRight: Spacing.sm,
  },
  rightIcon: {
    paddingHorizontal: Spacing.lg,
    height: "100%",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    height: "100%",
    ...Typography.body,
  },
  error: {
    marginTop: Spacing.xs,
  },
});
