import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Typography } from "../../../components/ui/Typography";
import { Ionicons } from "@expo/vector-icons";
import { Service, Barber } from "../slice";
import { format } from "date-fns";
import { Spacing, BorderRadius } from "../../../theme";
import { useTheme } from "../../../theme/ThemeContext";

interface ConfirmationModalProps {
  visible: boolean;
  service: Service | null;
  barber: Barber | null;
  date: string | null;
  time: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  service,
  barber,
  date,
  time,
  onConfirm,
  onCancel,
}) => {
  const { theme } = useTheme();
  if (!visible || !service || !date || !time) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.handle, { backgroundColor: theme.gray[300] }]} />
          <Typography variant="h2" align="center" style={styles.title}>
            Confirm Booking
          </Typography>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
            <Card elevated style={[styles.summaryCard, { backgroundColor: theme.gray[100], borderColor: theme.border }]}>
              <View style={styles.row}>
                <Typography variant="body2" color={theme.gray[600]}>Service</Typography>
                <Typography variant="body2" bold>{service.name}</Typography>
              </View>
              <View style={styles.row}>
                <Typography variant="body2" color={theme.gray[600]}>Barber</Typography>
                <Typography variant="body2" bold>{barber?.name || "Any Barber"}</Typography>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <View style={styles.row}>
                <Typography variant="body2" color={theme.gray[600]}>Date</Typography>
                <Typography variant="body2" bold>
                  {format(new Date(date), "MMM d, yyyy")}
                </Typography>
              </View>
              <View style={styles.row}>
                <Typography variant="body2" color={theme.gray[600]}>Time</Typography>
                <Typography variant="body2" bold>{time}</Typography>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <View style={styles.row}>
                <Typography variant="h3">Total</Typography>
                <Typography variant="h3" color={theme.primary}>${service.price}</Typography>
              </View>
            </Card>

            <Typography variant="label" color={theme.gray[600]} style={styles.paymentTitle}>
              Payment Method
            </Typography>
            <View style={styles.paymentMethods}>
              <TouchableOpacity style={[styles.method, { borderColor: theme.primary, backgroundColor: theme.primary + '10' }]}>
                <Ionicons name="card" size={24} color={theme.primary} />
                <Typography variant="body2" bold style={styles.methodText}>Card</Typography>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.method, { borderColor: theme.border }]}>
                <Ionicons name="cash" size={24} color={theme.gray[500]} />
                <Typography variant="body2" style={styles.methodText}>Cash</Typography>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button title="Confirm Appointment" onPress={onConfirm} />
            <Button
              title="Cancel"
              variant="outline"
              onPress={onCancel}
              style={{ marginTop: Spacing.sm }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: "85%",
    padding: Spacing.xl,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.xl,
  },
  content: {
    marginBottom: Spacing.xl,
  },
  summaryCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  paymentTitle: {
    marginBottom: Spacing.md,
    marginLeft: 4,
  },
  paymentMethods: {
    flexDirection: "row",
    marginBottom: Spacing.lg,
  },
  method: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.xs,
  },
  methodText: {
    marginLeft: Spacing.sm,
  },
  footer: {
    paddingBottom: Spacing.lg,
  },
});
