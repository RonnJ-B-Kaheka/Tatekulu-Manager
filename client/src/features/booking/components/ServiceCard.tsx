import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Service } from "../slice";
import { Spacing, BorderRadius, Shadows } from "../../../theme";
import { useTheme } from "../../../theme/ThemeContext";
import { Typography } from "../../../components/ui/Typography";

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onPress: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isSelected,
  onPress,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(service)}
      style={[
        styles.container,
        { backgroundColor: theme.card, borderColor: theme.border },
        isSelected && { backgroundColor: theme.primary, borderColor: theme.primary }
      ]}
    >
      <View style={[
        styles.iconContainer,
        { backgroundColor: theme.gray[100] },
        isSelected && { backgroundColor: "rgba(255,255,255,0.2)" }
      ]}>
        <Ionicons
          name="cut-outline"
          size={24}
          color={isSelected ? theme.white : theme.primary}
        />
      </View>

      <View style={styles.info}>
        <Typography
          variant="body1"
          bold
          color={isSelected ? theme.white : theme.black}
        >
          {service.name}
        </Typography>
        <Typography
          variant="body2"
          color={isSelected ? "rgba(255,255,255,0.8)" : theme.gray[600]}
        >
          {service.duration} min • ${service.price}
        </Typography>
      </View>

      <View style={[
        styles.radio,
        { borderColor: theme.gray[300], backgroundColor: theme.white },
        isSelected && { borderColor: theme.white }
      ]}>
        {isSelected && <Ionicons name="checkmark" size={16} color={theme.primary} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    ...Shadows.light,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
