import { useNavigation } from "@react-navigation/native"
import type React from "react"
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native"
import Button from "../components/Button"
import Text from '../components/CustomText'
import { useTheme } from "../context/ThemeContext"

const ShareAppScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme()
  const navigation = useNavigation();

  const shareApp = async () => {
    try {
      const result = await Share.share({
        message:
          "Check out Burgerpedia! The ultimate app for burger lovers with amazing recipes, cooking tips, and an AI chef assistant. Download it now!",
        url: "https://burgify.app", // Mock
        title: "Burgify - The Ultimate Burger App",
      })

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          Alert.alert("Success", "Thanks for sharing Burgify!")
        } else {
          Alert.alert("Success", "Thanks for sharing Burgify!")
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
          "Hey! I found this amazing burger app called Burgify. It has tons of delicious recipes and even an AI chef to help you cook! You should definitely check it out: https://burgify.app",
      })
    } catch (error) {
      console.error("Error sharing with friends:", error)
    }
  }

  const shareOnSocial = async (platform: string) => {
    const messages = {
      facebook:
        "Just discovered Burgify! Amazing burger recipes and cooking tips all in one app. #Burgify #BurgerLovers",
      twitter:
        "Just discovered @Burgify! Amazing burger recipes and an AI chef assistant. Perfect for all burger lovers! #Burgify #BurgerLovers #Cooking",
      instagram:
        "Loving this new burger app! So many delicious recipes to try. #Burgify #BurgerLovers #Foodie",
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
    onPress: () => void
    color?: string
  }> = ({ title, subtitle, onPress }) => (
    <TouchableOpacity
      style={[styles.shareOption, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
    >
      <View style={styles.shareOptionLeft}>
        <View style={styles.shareContent}>
          <Text weight='medium' style={[styles.shareTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.shareSubtitle, { color: colors.subtext }]}>{subtitle}</Text>
        </View>
      </View>
      <Image
        source={{ uri: "https://img.icons8.com/material-rounded/48/chevron-right.png" }}
        style={styles.arrowIcon}
      />
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
      backgroundColor={isDarkMode ? colors.statusBar : "#8B0000"} 
      barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View style={[styles.header, { backgroundColor: colors.primary }]}>
      
        <TouchableOpacity style={styles.side} onPress={() => navigation.goBack()}>
          <Image source={{ uri: "https://img.icons8.com/sf-black/100/back.png" }} style={styles.backIcon} />
        </TouchableOpacity>
      
        <Text weight='semiBold' style={styles.headerTitle}>Share</Text>
      
        <View style={styles.side} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text weight='semiBold' style={[styles.heroTitle, { color: colors.text }]}>Share the Love for Burgers!</Text>
          <Text style={[styles.heroSubtitle, { color: colors.subtext }]}>
            Help your friends discover amazing burger recipes and cooking tips
          </Text>
        </View>

        {/* Quick Share */}
        <View style={styles.section}>
          <Text weight='semiBold' style={[styles.sectionTitle, { color: colors.text }]}>Quick Share</Text>

          <Button title="Share Burgify" onPress={shareApp} size='small' style={styles.primaryShareButton} fullWidth />
        </View>

        {/* Share Options */}
        <View style={styles.section}>
          <Text weight='semiBold' style={[styles.sectionTitle, { color: colors.text }]}>Share With</Text>

          <ShareOption
            title="Friends & Family"
            subtitle="Send a personal message"
            onPress={shareWithFriends}
          />

          <ShareOption title="Copy Link" subtitle="Copy app link to clipboard" onPress={copyLink} />
        </View>

        {/* Social Media */}
        <View style={styles.section}>
          <Text weight='semiBold' style={[styles.sectionTitle, { color: colors.text }]}>Social Media</Text>

          <ShareOption
            title="Facebook"
            subtitle="Share on your timeline"
            onPress={() => shareOnSocial("facebook")}
            color="#1877F2"
          />

          <ShareOption
            title="Twitter"
            subtitle="Tweet about the app"
            onPress={() => shareOnSocial("twitter")}
            color="#1DA1F2"
          />

          <ShareOption
            title="Instagram"
            subtitle="Share to your story"
            onPress={() => shareOnSocial("instagram")}
            color="#E4405F"
          />
        </View>

        {/* Why Share */}
        <View style={styles.section}>
          <Text weight='semiBold' style={[styles.sectionTitle, { color: colors.text }]}>Why Share Burgerpedia?</Text>

          <View style={[styles.benefitCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.benefitItem}>
              <Text style={[styles.benefitText, { color: colors.text }]}>Amazing burger recipes for every taste</Text>
            </View>

            <View style={styles.benefitItem}>
              <Text style={[styles.benefitText, { color: colors.text }]}>AI chef assistant for cooking help</Text>
            </View>

            <View style={styles.benefitItem}>
              <Text style={[styles.benefitText, { color: colors.text }]}>Built-in cooking timer and tools</Text>
            </View>

            <View style={styles.benefitItem}>
              <Text style={[styles.benefitText, { color: colors.text }]}>Smart shopping list generator</Text>
            </View>

            <View style={styles.benefitItem}>
              <Text style={[styles.benefitText, { color: colors.text }]}>Save and organize favorite recipes</Text>
            </View>
          </View>
        </View>

        {/* Referral Program */}
        {/* <View style={styles.section}>
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
            <Text style={[styles.rewardTitle, { color: colors.text }]}>Coming Soon!</Text>
            <Text style={[styles.rewardDescription, { color: colors.subtext }]}>
              Earn rewards for every friend you refer to Burgify. Get exclusive recipes, premium features, and more!
            </Text>
          </View>
        </View> */}

        {/* App Info */}
        <View style={styles.section}>
          <Text weight='semiBold' style={[styles.sectionTitle, { color: colors.text }]}>About Burgify</Text>

          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.infoText, { color: colors.text }]}>
              Burgify is the ultimate companion for burger enthusiasts. Whether you're a beginner or a seasoned
              chef, our app provides everything you need to create delicious burgers at home.
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text weight='semiBold' style={[styles.statNumber, { color: colors.primary }]}>100+</Text>
                <Text style={[styles.statLabel, { color: colors.subtext }]}>Recipes</Text>
              </View>
              <View style={styles.statItem}>
                <Text weight='semiBold' style={[styles.statNumber, { color: colors.primary }]}>50K+</Text>
                <Text style={[styles.statLabel, { color: colors.subtext }]}>Users</Text>
              </View>
              <View style={styles.statItem}>
                <Text weight='semiBold' style={[styles.statNumber, { color: colors.primary }]}>4.8★</Text>
                <Text style={[styles.statLabel, { color: colors.subtext }]}>Rating</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.subtext }]}>
            Thank you for being part of the Burgify community!
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
    justifyContent: "space-between", 
    marginBottom: 5,
    flexDirection: "row",
    backgroundColor: "#8B0000",
    borderBottomStartRadius: 50,
    borderBottomEndRadius: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: "white",
  },
  side: {
    width: 40, 
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    color: 'white',
    textAlign: "center", 
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
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 24,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 15,
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
    padding: 10,
    marginBottom: 12,
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
    fontSize: 13,
    marginBottom: 2,
  },
  shareSubtitle: {
    fontSize: 12,
  },
  arrowIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  benefitCard: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
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
    fontSize: 12,
    flex: 1,
  },
  rewardCard: {
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
  },
  rewardIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  rewardTitle: {
    fontSize: 20,
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
  },
  infoText: {
    fontSize: 12,
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
    fontSize: 14,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
    fontFamily: 'Poppins-Italic',
  },
})

export default ShareAppScreen
