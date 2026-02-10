import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import { Spacing, BorderRadius } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { Typography as TypographyComponent } from './Typography';

interface Props extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({
  title,
  variant = 'primary',
  isLoading = false,
  size = 'md',
  style,
  disabled,
  ...props
}: Props) => {
  const { theme } = useTheme();

  const getContainerStyles = (): ViewStyle[] => {
    const baseStyles: ViewStyle[] = [styles.container, styles[`size_${size}`]];

    if (disabled || isLoading) {
      baseStyles.push({ backgroundColor: theme.gray[300] });
    } else {
      if (variant === 'primary') baseStyles.push({ backgroundColor: theme.primary });
      if (variant === 'secondary') baseStyles.push({ backgroundColor: theme.gray[200] });
      if (variant === 'outline') baseStyles.push({ backgroundColor: 'transparent', borderWidth: 2, borderColor: theme.primary });
      if (variant === 'danger') baseStyles.push({ backgroundColor: theme.error });
    }

    return baseStyles;
  };

  const getTextColor = (): string => {
    if (variant === 'outline') return theme.primary;
    if (variant === 'secondary') return theme.black;
    return theme.white;
  };

  return (
    <TouchableOpacity
      style={[getContainerStyles(), style]}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <TypographyComponent
          variant="label"
          color={getTextColor()}
          style={styles.text}
        >
          {title}
        </TypographyComponent>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  size_sm: {
    height: 36,
    paddingHorizontal: Spacing.md
  },
  size_md: {
    height: 48,
    paddingHorizontal: Spacing.xl
  },
  size_lg: {
    height: 56,
    paddingHorizontal: Spacing.xxl
  },
  text: {
    textAlign: 'center',
  }
});
