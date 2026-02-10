import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { markAsRead, Notification } from '../slice';
import { Typography } from '../../../components/ui/Typography';
import { Spacing, BorderRadius } from '../../../theme';
import { useTheme } from '../../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export const NotificationCenter = () => {
    const { items } = useSelector((state: RootState) => state.notifications);
    const dispatch = useDispatch();
    const { theme } = useTheme();

    const renderItem = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            style={[
                styles.item,
                { borderBottomColor: theme.border },
                !item.isRead && { backgroundColor: theme.primary + '10' }
            ]}
            onPress={() => dispatch(markAsRead(item.id))}
            activeOpacity={0.7}
        >
            <View style={[
                styles.iconContainer,
                { backgroundColor: theme.gray[100] },
                !item.isRead && { backgroundColor: theme.primary + '20' }
            ]}>
                <Ionicons
                    name={item.type === 'booking' ? 'calendar' : item.type === 'revenue' ? 'trending-up' : 'notifications'}
                    size={22}
                    color={item.isRead ? theme.gray[500] : theme.primary}
                />
            </View>
            <View style={styles.content}>
                <Typography variant="body1" bold={!item.isRead} numberOfLines={1}>
                    {item.title}
                </Typography>
                <Typography variant="body2" color={theme.gray[600]} numberOfLines={2} style={styles.body}>
                    {item.body}
                </Typography>
                <Typography variant="caption" color={theme.gray[400]} style={styles.time}>
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
            </View>
            {!item.isRead && <View style={[styles.dot, { backgroundColor: theme.primary }]} />}
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <Typography variant="h2">Notifications</Typography>
            </View>
            <FlatList
                data={items}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="notifications-off-outline" size={48} color={theme.gray[300]} />
                        <Typography variant="body1" color={theme.gray[500]} style={styles.emptyText}>
                            No notifications yet
                        </Typography>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        padding: Spacing.xl,
        borderBottomWidth: 1,
    },
    list: { paddingBottom: Spacing.xl },
    item: {
        flexDirection: 'row',
        padding: Spacing.lg,
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    content: { flex: 1 },
    body: { marginTop: 2 },
    time: { marginTop: 4 },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: Spacing.sm
    },
    empty: { padding: Spacing.huge, alignItems: 'center' },
    emptyText: { marginTop: Spacing.lg }
});
