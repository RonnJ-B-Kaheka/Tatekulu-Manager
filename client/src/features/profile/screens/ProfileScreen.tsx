import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';
import { Spacing, BorderRadius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeContext';

export const ProfileScreen = () => {
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const { theme, isDarkMode, toggleTheme } = useTheme();

    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveProfile = () => {
        setIsSaving(true);
        // Simulate save
        setTimeout(() => {
            setIsSaving(false);
            Alert.alert('Success', 'Profile updated successfully');
        }, 1000);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <Typography variant="h1">My Profile</Typography>
                    <Typography variant="body2" color={theme.textSecondary}>
                        Manage your account settings
                    </Typography>
                </View>

                <View style={[styles.profileSection, { backgroundColor: theme.surface }]}>
                    <View style={styles.avatarContainer}>
                        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                            <Ionicons name="person" size={40} color={theme.white} />
                        </View>
                        <TouchableOpacity style={[styles.editAvatar, { backgroundColor: theme.black, borderColor: theme.white }]}>
                            <Ionicons name="camera" size={16} color={theme.white} />
                        </TouchableOpacity>
                    </View>
                    <Typography variant="h3" style={styles.name}>{name || 'Premium Guest'}</Typography>
                    <Typography variant="caption" color={theme.textSecondary}>{user?.email}</Typography>
                </View>

                <View style={styles.section}>
                    <Typography variant="h3" style={styles.sectionTitle}>Settings</Typography>
                    <Card style={styles.settingsCard} padding="md">
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Ionicons name="moon-outline" size={20} color={theme.text} style={styles.settingIcon} />
                                <Typography variant="body1">Dark Mode</Typography>
                            </View>
                            <Switch
                                value={isDarkMode}
                                onValueChange={toggleTheme}
                                trackColor={{ false: theme.gray[300], true: theme.primary }}
                                thumbColor={theme.white}
                            />
                        </View>
                    </Card>
                </View>

                <View style={[styles.form, { marginTop: Spacing.xl }]}>
                    <Input
                        label="Display Name"
                        value={name}
                        onChangeText={setName}
                        icon="person-outline"
                    />
                    <Input
                        label="Phone Number"
                        value={phone}
                        onChangeText={setPhone}
                        icon="call-outline"
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.actions}>
                    <Button
                        title="Update Profile"
                        onPress={handleSaveProfile}
                        isLoading={isSaving}
                    />
                    <Button
                        title="Delete Account"
                        variant="outline"
                        onPress={() => { }}
                        style={styles.deleteBtn}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { padding: Spacing.xl },
    header: { marginBottom: Spacing.huge },
    profileSection: {
        alignItems: 'center',
        marginBottom: Spacing.huge,
        padding: Spacing.xl,
        borderRadius: BorderRadius.xl,
    },
    avatarContainer: { position: 'relative', marginBottom: Spacing.md },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editAvatar: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    name: { marginTop: Spacing.sm },
    section: { marginBottom: Spacing.xl },
    sectionTitle: { marginBottom: Spacing.md },
    settingsCard: {
        borderWidth: 0,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIcon: {
        marginRight: Spacing.md,
    },
    form: { marginBottom: Spacing.huge },
    actions: { gap: Spacing.md },
    deleteBtn: { marginTop: Spacing.sm },
});
