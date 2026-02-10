import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Button } from '../../../components/ui/Button';
import { Typography } from '../../../components/ui/Typography';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spacing, BorderRadius, Shadows } from '../../../theme';
import { useTheme } from '../../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface Service {
    id: string;
    name: string;
    price: number;
    duration: number;
}

export const ServiceManager = () => {
    const { theme } = useTheme();
    const [services, setServices] = useState<Service[]>([
        { id: '1', name: 'Fresh Cut', price: 25, duration: 45 },
        { id: '2', name: 'Beard Trim', price: 15, duration: 20 },
    ]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentService, setCurrentService] = useState<Partial<Service>>({});

    const handleSave = () => {
        if (!currentService.name || !currentService.price) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (currentService.id) {
            setServices(services.map(s => s.id === currentService.id ? currentService as Service : s));
        } else {
            setServices([...services, { ...currentService, id: Date.now().toString() } as Service]);
        }
        setIsEditing(false);
        setCurrentService({});
    };

    const deleteService = (id: string) => {
        Alert.alert('Confirm', 'Delete this service?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => setServices(services.filter(s => s.id !== id)) }
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Typography variant="h2">Services</Typography>
                <Button
                    title="Add New"
                    variant="primary"
                    size="sm"
                    onPress={() => { setIsEditing(true); setCurrentService({}); }}
                    style={styles.addButton}
                />
            </View>

            {isEditing ? (
                <Card elevated style={[styles.form, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Input
                        label="Service Name"
                        placeholder="e.g. Skin Fade"
                        value={currentService.name}
                        onChangeText={t => setCurrentService({ ...currentService, name: t })}
                    />
                    <Input
                        label="Price ($)"
                        placeholder="0.00"
                        keyboardType="numeric"
                        value={currentService.price?.toString()}
                        onChangeText={t => setCurrentService({ ...currentService, price: parseFloat(t) || 0 })}
                    />
                    <Input
                        label="Duration (min)"
                        placeholder="30"
                        keyboardType="numeric"
                        value={currentService.duration?.toString()}
                        onChangeText={t => setCurrentService({ ...currentService, duration: parseInt(t) || 0 })}
                    />
                    <View style={styles.formButtons}>
                        <Button title="Save Service" onPress={handleSave} />
                        <Button title="Cancel" variant="outline" onPress={() => setIsEditing(false)} />
                    </View>
                </Card>
            ) : (
                <FlatList
                    data={services}
                    scrollEnabled={false}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <Card style={[styles.item, { backgroundColor: theme.card, borderColor: theme.border }]}>
                            <View>
                                <Typography variant="h3">{item.name}</Typography>
                                <Typography variant="body2" color={theme.gray[600]}>
                                    {item.duration} min • ${item.price}
                                </Typography>
                            </View>
                            <View style={styles.actions}>
                                <TouchableOpacity onPress={() => { setIsEditing(true); setCurrentService(item); }}>
                                    <Ionicons name="pencil" size={20} color={theme.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteService(item.id)} style={{ marginLeft: Spacing.md }}>
                                    <Ionicons name="trash" size={20} color={theme.error} />
                                </TouchableOpacity>
                            </View>
                        </Card>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: Spacing.xl },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg
    },
    addButton: { width: 120 },
    form: { padding: Spacing.lg, marginBottom: Spacing.xl },
    formButtons: { gap: Spacing.sm },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.lg,
        marginBottom: Spacing.md
    },
    actions: { flexDirection: 'row' }
});
