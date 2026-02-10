import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { StylistCard } from "@/components/StylistCard";
import { ServiceCard } from "@/components/ServiceCard";
import { ReviewCard } from "@/components/ReviewCard";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import {
  getShopById,
  getStylistsByShopId,
  getServicesByShopId,
  getReviewsByShopId,
} from "@/lib/mockData";
import { getFavoriteShops, toggleFavoriteShop } from "@/lib/storage";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import type { Barbershop, Stylist, Service, Review } from "@/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ShopDetailRouteProp = RouteProp<RootStackParamList, "ShopDetail">;

export default function ShopDetailScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ShopDetailRouteProp>();

  const { shopId } = route.params;

  const [shop, setShop] = useState<Barbershop | null>(null);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);

  useEffect(() => {
    loadShopData();
  }, [shopId]);

  const loadShopData = async () => {
    const shopData = getShopById(shopId);
    if (shopData) {
      setShop(shopData);
      setStylists(getStylistsByShopId(shopId));
      setServices(getServicesByShopId(shopId));
      setReviews(getReviewsByShopId(shopId));

      const favorites = await getFavoriteShops();
      setIsFavorite(favorites.includes(shopId));
    }
  };

  const handleFavoritePress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newState = await toggleFavoriteShop(shopId);
    setIsFavorite(newState);
  };

  const handleBookPress = () => {
    if (!shop) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("BookingFlow", { shopId });
  };

  const displayedServices = showAllServices ? services : services.slice(0, 3);

  if (!shop) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: shop.imageUrl }}
            style={styles.heroImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.heroGradient}
          />
          <View style={[styles.heroOverlay, { top: insets.top + Spacing.md }]}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [
                styles.iconButton,
                {
                  backgroundColor: theme.backgroundDefault,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Feather name="arrow-left" size={20} color={theme.text} />
            </Pressable>
            <Pressable
              onPress={handleFavoritePress}
              style={({ pressed }) => [
                styles.iconButton,
                {
                  backgroundColor: theme.backgroundDefault,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Feather
                name={isFavorite ? "heart" : "heart"}
                size={20}
                color={isFavorite ? theme.error : theme.text}
              />
            </Pressable>
          </View>
          <View style={styles.heroContent}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: shop.isOpen
                    ? theme.success
                    : theme.textTertiary,
                },
              ]}
            >
              <ThemedText type="caption" style={{ color: "#FFFFFF" }}>
                {shop.isOpen ? "Open Now" : "Closed"}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Shop Info */}
        <View style={styles.section}>
          <ThemedText type="h1">{shop.name}</ThemedText>
          <View style={styles.infoRow}>
            <View style={styles.ratingRow}>
              <Feather name="star" size={16} color={theme.accent} />
              <ThemedText type="body" style={{ marginLeft: 4 }}>
                {shop.rating} ({shop.reviewCount} reviews)
              </ThemedText>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Feather name="map-pin" size={16} color={theme.textSecondary} />
            <ThemedText
              type="body"
              style={{
                marginLeft: Spacing.sm,
                color: theme.textSecondary,
                flex: 1,
              }}
            >
              {shop.address}
            </ThemedText>
          </View>
          <View style={styles.infoRow}>
            <Feather name="clock" size={16} color={theme.textSecondary} />
            <ThemedText
              type="body"
              style={{ marginLeft: Spacing.sm, color: theme.textSecondary }}
            >
              {shop.openingHours}
            </ThemedText>
          </View>
          <ThemedText
            type="body"
            style={{ color: theme.textSecondary, marginTop: Spacing.md }}
          >
            {shop.description}
          </ThemedText>
        </View>

        {/* Stylists */}
        {stylists.length > 0 ? (
          <View style={styles.section}>
            <ThemedText type="h3" style={styles.sectionTitle}>
              Our Stylists
            </ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.stylistsScroll}
            >
              {stylists.map((stylist) => (
                <StylistCard key={stylist.id} stylist={stylist} />
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* Services */}
        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            Services
          </ThemedText>
          {displayedServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
          {services.length > 3 ? (
            <Pressable
              onPress={() => setShowAllServices(!showAllServices)}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <ThemedText
                type="body"
                style={{ color: theme.accent, textAlign: "center" }}
              >
                {showAllServices
                  ? "Show Less"
                  : `View All ${services.length} Services`}
              </ThemedText>
            </Pressable>
          ) : null}
        </View>

        {/* Reviews */}
        {reviews.length > 0 ? (
          <View style={styles.section}>
            <ThemedText type="h3" style={styles.sectionTitle}>
              Reviews
            </ThemedText>
            {reviews.slice(0, 3).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </View>
        ) : null}
      </ScrollView>

      {/* Book Button */}
      <View
        style={[
          styles.bookButtonContainer,
          {
            paddingBottom: insets.bottom + Spacing.lg,
            backgroundColor: theme.backgroundRoot,
            borderTopColor: theme.border,
          },
        ]}
      >
        <Button onPress={handleBookPress} style={styles.bookButton}>
          Book Appointment
        </Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    height: 280,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },
  heroOverlay: {
    position: "absolute",
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.small,
  },
  heroContent: {
    position: "absolute",
    bottom: Spacing.lg,
    left: Spacing.lg,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stylistsScroll: {
    paddingRight: Spacing.lg,
  },
  bookButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
  },
  bookButton: {
    width: "100%",
  },
});
