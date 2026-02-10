import React, { useState } from "react";
import { View, TextInput, StyleSheet, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Spacing, BorderRadius, Typography } from "../../theme";
import { Typography as TypographyComponent } from "./Typography";
import { useTheme } from "../../theme/ThemeContext";

interface InputProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  error,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <TypographyComponent
          variant="body2"
          bold
          style={[styles.label, { color: theme.textSecondary }]}
        >
          {label}
        </TypographyComponent>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border
          },
          isFocused && { borderColor: theme.primary, backgroundColor: theme.background },
          error ? { borderColor: theme.error, backgroundColor: isFocused ? theme.background : theme.surface } : null,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? theme.error : isFocused ? theme.primary : theme.icon}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, { color: theme.text }, style]}
          placeholderTextColor={theme.icon}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
      </View>
      {error && (
        <TypographyComponent
          variant="caption"
          color={theme.error}
          style={styles.errorText}
        >
          {error}
        </TypographyComponent>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
    width: "100%",
  },
  label: {
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    height: 56,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.size.md,
    height: "100%",
  },
  errorText: {
    marginTop: Spacing.xs,
  },
});

