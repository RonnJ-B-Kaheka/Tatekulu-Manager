import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 30 },
    header: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
    section: { marginBottom: 10 },
    row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#EEE', paddingVertical: 5 },
    label: { width: 100, fontWeight: 'bold' },
    value: { flex: 1 },
    footer: { marginTop: 30, fontSize: 10, color: '#666', textAlign: 'center' }
});

export const BookingReportPDF = ({ bookings }: any) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.header}>Tatekulu Barbershop - Booking Report</Text>

            {bookings.map((booking: any, index: number) => (
                <View key={index} style={styles.section}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Date:</Text>
                        <Text style={styles.value}>{booking.date}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Service:</Text>
                        <Text style={styles.value}>{booking.service}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Customer:</Text>
                        <Text style={styles.value}>{booking.customer}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Total:</Text>
                        <Text style={styles.value}>${booking.amount}</Text>
                    </View>
                </View>
            ))}

            <Text style={styles.footer}>Generated on {new Date().toLocaleDateString()}</Text>
        </Page>
    </Document>
);
