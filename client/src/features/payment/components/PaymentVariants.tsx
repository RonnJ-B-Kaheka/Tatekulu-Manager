import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from '../../components/ui/Button';

/** 
 * VARIANT 1: STRIPE (Using @stripe/stripe-react-native)
 * Note: Requires Stripe account in supported country
 */
export const StripePayment = ({ amount, onResult }: any) => {
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        setLoading(true);
        try {
            // 1. Fetch Payment Intent from Backend
            // const { clientSecret } = await fetchPaymentIntent(amount);

            // 2. Present Payment Sheet (Native)
            // const { error } = await presentPaymentSheet({ clientSecret });

            Alert.alert("Stripe Mocked", "Payment Successful!");
            onResult({ success: true, method: 'stripe' });
        } catch (e) {
            Alert.alert("Error", "Payment Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Stripe (Credit/Debit)</Text>
            <Text style={styles.desc}>Best for international cards. Secure local storage.</Text>
            <Button title={`Pay $${amount}`} onPress={handlePay} isLoading={loading} />
        </View>
    );
};

/** 
 * VARIANT 2: PAYPAL (Using WebView / PayPal SDK)
 * Note: Available in Namibia but difficult funds withdrawal
 */
export const PayPalPayment = ({ amount, onResult }: any) => {
    const [loading, setLoading] = useState(false);

    const handlePay = () => {
        // Typically opens a WebView or redirects to PayPal app
        setLoading(true);
        setTimeout(() => {
            Alert.alert("PayPal Mocked", "Redirecting to PayPal...");
            setLoading(false);
            onResult({ success: true, method: 'paypal' });
        }, 1500);
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>PayPal</Text>
            <Text style={styles.desc}>Standard global choice. High trust but high fees.</Text>
            <Button title="Login with PayPal" variant="outline" onPress={handlePay} isLoading={loading} />
        </View>
    );
};

const styles = StyleSheet.create({
    card: { padding: 20, backgroundColor: '#f8f9fa', borderRadius: 12, marginBottom: 16 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    desc: { color: '#666', marginBottom: 16 }
});
