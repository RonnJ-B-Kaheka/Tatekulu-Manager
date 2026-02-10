import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, Shadows } from '../../theme';
import { Typography } from '../ui/Typography';
import { useTheme } from '../../theme/ThemeContext';

const TABS = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { name: 'Book', icon: 'calendar-outline', activeIcon: 'calendar' },
    { name: 'Profile', icon: 'person-outline', activeIcon: 'person' },
];

export const BottomNavigation = ({ activeTab, onSelect }: any) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.wrapper, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
            <SafeAreaView style={styles.container}>
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.name;
                    return (
                        <TouchableOpacity
                            key={tab.name}
                            style={styles.tab}
                            onPress={() => onSelect(tab.name)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={(isActive ? tab.activeIcon : tab.icon) as any}
                                size={24}
                                color={isActive ? theme.primary : theme.icon}
                            />
                            <Typography
                                variant="caption"
                                bold={isActive}
                                color={isActive ? theme.primary : theme.icon}
                                style={styles.label}
                            >
                                {tab.name}
                            </Typography>
                        </TouchableOpacity>
                    );
                })}
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        ...Shadows.medium,
        borderTopWidth: 1,
    },
    container: {
        flexDirection: 'row',
        height: Platform.OS === 'ios' ? 85 : 65,
        paddingHorizontal: Spacing.lg,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Spacing.sm,
    },
    label: {
        marginTop: 2,
        fontSize: 10,
    },
});
