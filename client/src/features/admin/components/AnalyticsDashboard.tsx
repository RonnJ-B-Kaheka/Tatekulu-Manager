import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Spacing } from '../../../theme';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';

const data = [
    { name: 'Mon', revenue: 400 },
    { name: 'Tue', revenue: 300 },
    { name: 'Wed', revenue: 600 },
    { name: 'Thu', revenue: 800 },
    { name: 'Fri', revenue: 500 },
    { name: 'Sat', revenue: 900 },
    { name: 'Sun', revenue: 400 },
];

export const AnalyticsDashboard = () => {
    const { theme } = useTheme();
    return (
        <Card style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Typography variant="h3" style={styles.title}>Revenue Trends</Typography>
            <View style={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                        <XAxis
                            dataKey="name"
                            stroke={theme.gray[600]}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke={theme.gray[600]}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: 8,
                                borderWeight: 0,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                backgroundColor: theme.card,
                                color: theme.text
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke={theme.primary}
                            strokeWidth={3}
                            dot={{ fill: theme.primary, r: 4 }}
                            activeDot={{ r: 8, fill: theme.primary }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: { margin: Spacing.xl, padding: Spacing.lg },
    title: { marginBottom: Spacing.lg },
    chartContainer: { height: 300, width: '100%' }
});
