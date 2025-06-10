"use client"

import type React from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from "react-native"
import { useTheme } from "../context/ThemeContext"
import Button from "../components/Button"

const ShareAppScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme()

  const shareApp = async () => {
    try {
      const result = await Share.share({
        message:
          "Check out Burgerpedia! 🍔 The ultimate app for burger lovers with amazing recipes, cooking tips, and an AI chef assistant. Download it now!",
        url: "https://burgerpedia.app", // Replace with actual app store URL
        title: "Burgerpedia - The Ultimate Burger App",
      })

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          Alert.alert("Success", "Thanks for sharing Burgerpedia!")
        } else {
          Alert.alert("Success", "Thanks for sharing Burgerpedia!")
        }
      }
    } catch (error) {
      console.error("Error sharing app:", error)
      Alert.alert("Error", "Failed to share the app. Please try again.")
    }
  }

  const shareWithFriends = async () => {
    try {
      await Share.share({
        message:
          "Hey! I found this amazing burger app called Burgerpedia 🍔 It has tons of delicious recipes and even an AI chef to help you cook! You should definitely check it out: https://burgerpedia.app",
      })
    } catch (error) {
      console.error("Error sharing with friends:", error)
    }
  }

  const shareOnSocial = async (platform: string) => {
    const messages = {
      facebook:
        "Just discovered Burgerpedia! 🍔 Amazing burger recipes and cooking tips all in one app. #Burgerpedia #BurgerLovers",
      twitter:
        "Just discovered @Burgerpedia! 🍔 Amazing burger recipes and an AI chef assistant. Perfect for all burger lovers! #Burgerpedia #BurgerLovers #Cooking",
      instagram:
        "Loving this new burger app! 🍔✨ So many delicious recipes to try. #Burgerpedia #BurgerLovers #Foodie",
    }

    try {
      await Share.share({
        message: messages[platform as keyof typeof messages] || messages.facebook,
      })
    } catch (error) {
      console.error(`Error sharing on ${platform}:`, error)
    }
  }

  const copyLink = () => {
    // In a real app, you would copy to clipboard
    Alert.alert("Link Copied", "App link has been copied to clipboard!")
  }

  const ShareOption: React.FC<{
    title: string
    subtitle: string
    icon: string
    onPress: () => void
    color?: string
  }> = ({ title, subtitle, icon, onPress, color }) => (
    <TouchableOpacity
      style={[styles.shareOption, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
    >
      <View style={styles.shareOptionLeft}>
        <Text style={[styles.shareIcon, color ? { color } : null]}>{icon}</Text>
        <View style={styles.shareContent}>
          <Text style={[styles.shareTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.shareSubtitle, { color: colors.subtext }]}>{subtitle}</Text>
        </View>
      </View>
      <Text style={[styles.shareArrow, { color: colors.primary }]}>→</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.statusBar} barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Share Burgerpedia</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroIcon}>🍔</Text>
          <Text style={[styles.heroTitle, { color: colors.text }]}>Share the Love for Burgers!</Text>
          <Text style={[styles.heroSubtitle, { color: colors.subtext }]}>
            Help your friends discover amazing burger recipes and cooking tips
          </Text>
        </View>

        {/* Quick Share */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Share</Text>

          <Button title="Share Burgerpedia" onPress={shareApp} icon="📤" style={styles.primaryShareButton} fullWidth />
        </View>

        {/* Share Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Share With</Text>

          <ShareOption
            title="Friends & Family"
            subtitle="Send a personal message"
            icon="👥"
            onPress={shareWithFriends}
          />

          <ShareOption title="Copy Link" subtitle="Copy app link to clipboard" icon="🔗" onPress={copyLink} />
        </View>

        {/* Social Media */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Social Media</Text>

          <ShareOption
            title="Facebook"
            subtitle="Share on your timeline"
            icon="📘"
            onPress={() => shareOnSocial("facebook")}
            color="#1877F2"
          />

          <ShareOption
            title="Twitter"
            subtitle="Tweet about the app"
            icon="🐦"
            onPress={() => shareOnSocial("twitter")}
            color="#1DA1F2"
          />

          <ShareOption
            title="Instagram"
            subtitle="Share to your story"
            icon="📷"
            onPress={() => shareOnSocial("instagram")}
            color="#E4405F"
          />
        </View>

        {/* Why Share */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Why Share Burgerpedia?</Text>

          <View style={[styles.benefitCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🍔</Text>
              <Text style={[styles.benefitText, { color: colors.text }]}>Amazing burger recipes for every taste</Text>
            </View>

            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🤖</Text>
              <Text style={[styles.benefitText, { color: colors.text }]}>AI chef assistant for cooking help</Text>
            </View>

            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>⏱️</Text>
              <Text style={[styles.benefitText, { color: colors.text }]}>Built-in cooking timer and tools</Text>
            </View>

            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🛒</Text>
              <Text style={[styles.benefitText, { color: colors.text }]}>Smart shopping list generator</Text>
            </View>

            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>❤️</Text>
              <Text style={[styles.benefitText, { color: colors.text }]}>Save and organize favorite recipes</Text>
            </View>
          </View>
        </View>

        {/* Referral Program */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Referral Rewards</Text>

          <View
            style={[
              styles.rewardCard,
              {
                backgroundColor: isDarkMode ? "#1F2937" : "#F3F4F6",
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={styles.rewardIcon}>🎁</Text>
            <Text style={[styles.rewardTitle, { color: colors.text }]}>Coming Soon!</Text>
            <Text style={[styles.rewardDescription, { color: colors.subtext }]}>
              Earn rewards for every friend you refer to Burgerpedia. Get exclusive recipes, premium features, and more!
            </Text>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About Burgerpedia</Text>

          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.infoText, { color: colors.text }]}>
              Burgerpedia is the ultimate companion for burger enthusiasts. Whether you're a beginner or a seasoned
              chef, our app provides everything you need to create delicious burgers at home.
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>100+</Text>
                <Text style={[styles.statLabel, { color: colors.subtext }]}>Recipes</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>50K+</Text>
                <Text style={[styles.statLabel, { color: colors.subtext }]}>Users</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>4.8★</Text>
                <Text style={[styles.statLabel, { color: colors.subtext }]}>Rating</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.subtext }]}>
            Thank you for being part of the Burgerpedia community! 🍔❤️
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroSection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  heroIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  primaryShareButton: {
    marginBottom: 10,
  },
  shareOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  shareOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  shareIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  shareContent: {
    flex: 1,
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  shareSubtitle: {
    fontSize: 14,
  },
  shareArrow: {
    fontSize: 16,
  },
  benefitCard: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  benefitText: {
    fontSize: 16,
    flex: 1,
  },
  rewardCard: {
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  rewardIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  rewardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  rewardDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  infoCard: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
})

export default ShareAppScreen
