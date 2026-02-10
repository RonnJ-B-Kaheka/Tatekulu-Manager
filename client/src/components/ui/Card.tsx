import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { Spacing, BorderRadius, Shadows } from "../../theme";
import { useTheme } from "../../theme/ThemeContext";

interface Props extends ViewProps {
    padding?: keyof typeof Spacing;
    elevated?: boolean;
}

export const Card = ({
    children,
    padding = 'lg',
    elevated = true,
    style,
    ...props
}: Props) => {
    const { theme, isDarkMode } = useTheme();

    return (
        <View
            style={[
                styles.card,
                {
                    padding: Spacing[padding],
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                },
                elevated && (isDarkMode ? styles.darkShadow : Shadows.light),
                style
            ]}
            {...props}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
    },
    darkShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    }
});
