import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { ServiceManager } from '../components/ServiceManager';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { Button } from '../../../components/ui/Button';
import { Typography } from '../../../components/ui/Typography';
import { Spacing } from '../../../theme';
import { useTheme } from '../../../theme/ThemeContext';
import { exportToCSV } from '../utils/export';

// Mock data for exports
const MOCK_BOOKINGS = [
    { date: '2023-10-27', service: 'Fresh Cut', customer: 'John Doe', amount: 25 },
    { date: '2023-10-27', service: 'Beard Trim', customer: 'Jane Smith', amount: 15 },
];

export const AdminDashboardScreen = () => {
    const { theme } = useTheme();
    const handleExportCSV = () => {
        exportToCSV(MOCK_BOOKINGS, 'tatekulu_report.csv');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                    <Typography variant="h1">Dashboard</Typography>
                    <Typography variant="body2" color={theme.textSecondary}>Welcome back, Admin</Typography>
                </View>

                <AnalyticsDashboard />

                <View style={styles.section}>
                    <Typography variant="h3" style={styles.sectionTitle}>Reporting & Exports</Typography>
                    <View style={styles.buttonRow}>
                        <Button title="Export CSV" onPress={handleExportCSV} style={styles.exportBtn} />
                        <Button title="Export PDF" variant="outline" onPress={() => { }} style={styles.exportBtn} />
                    </View>
                </View>

                <View style={styles.section}>
                    <ServiceManager />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { paddingBottom: Spacing.huge },
    header: {
        padding: Spacing.xl,
        borderBottomWidth: 1,
    },
    section: { marginTop: Spacing.xl },
    sectionTitle: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.md },
    buttonRow: { flexDirection: 'row', paddingHorizontal: Spacing.xl, gap: Spacing.md },
    exportBtn: { flex: 1 }
});

