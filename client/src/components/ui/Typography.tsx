import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Typography as TypographyTokens } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';

interface Props extends TextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'body1' | 'body2' | 'caption' | 'label';
    color?: string;
    align?: 'left' | 'center' | 'right';
    bold?: boolean;
}

export const Typography = ({
    variant = 'body1',
    color,
    align = 'left',
    bold = false,
    style,
    ...props
}: Props) => {
    const { theme } = useTheme();
    const textColor = color || (variant.startsWith('h') ? theme.text : (variant === 'caption' ? theme.textSecondary : theme.text));

    return (
        <Text
            style={[
                styles.base,
                styles[variant],
                { color: textColor, textAlign: align },
                bold && styles.bold,
                style
            ]}
            {...props}
        />
    );
};

const styles = StyleSheet.create({
    base: {
        fontFamily: TypographyTokens.family.regular,
    },
    bold: {
        fontWeight: '700',
    },
    h1: {
        fontSize: TypographyTokens.size.huge,
        fontWeight: '800',
        lineHeight: 40,
    },
    h2: {
        fontSize: TypographyTokens.size.xxl,
        fontWeight: '700',
        lineHeight: 32,
    },
    h3: {
        fontSize: TypographyTokens.size.xl,
        fontWeight: '700',
        lineHeight: 28,
    },
    body1: {
        fontSize: TypographyTokens.size.md,
        lineHeight: 24,
    },
    body2: {
        fontSize: TypographyTokens.size.sm,
        lineHeight: 20,
    },
    caption: {
        fontSize: TypographyTokens.size.xs,
        lineHeight: 16,
    },
    label: {
        fontSize: TypographyTokens.size.sm,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});
