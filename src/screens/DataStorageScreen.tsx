import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import type React from "react"
import { useEffect, useState } from "react"
import { Alert, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native"
import Button from "../components/Button"
import Text from "../components/CustomText"
import ScreenWrapper from "../components/ScreenWrapper"
import { useTheme } from "../context/ThemeContext"

interface StorageInfo {
  favorites: number
  cookingHistory: number
  shoppingList: number
  settings: number
  profileData: number
  totalSize: string
}

const DataStorageScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme()
  const navigation = useNavigation();
  
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    favorites: 0,
    cookingHistory: 0,
    shoppingList: 0,
    settings: 0,
    profileData: 0,
    totalSize: "0 KB",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    calculateStorageInfo()
  }, [])

  const calculateStorageInfo = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys()
      let totalBytes = 0
      const info: StorageInfo = {
        favorites: 0,
        cookingHistory: 0,
        shoppingList: 0,
        settings: 0,
        profileData: 0,
        totalSize: "0 KB",
      }

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key)
        if (value) {
          const bytes = new Blob([value]).size
          totalBytes += bytes

          switch (key) {
            case "favorites":
              const favorites = JSON.parse(value)
              info.favorites = Array.isArray(favorites) ? favorites.length : 0
              break
            case "cookingHistory":
              const history = JSON.parse(value)
              info.cookingHistory = Array.isArray(history) ? history.length : 0
              break
            case "shoppingList":
              const shopping = JSON.parse(value)
              info.shoppingList = Array.isArray(shopping) ? shopping.length : 0
              break
            case "appSettings":
              info.settings = 1
              break
            case "userData":
            case "profileImage":
              info.profileData += 1
              break
          }
        }
      }

      info.totalSize = formatBytes(totalBytes)
      setStorageInfo(info)
    } catch (error) {
      console.error("Error calculating storage info:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const clearSpecificData = (dataType: string) => {
    const dataTypeMap: Record<string, { key: string; name: string; description: string }> = {
      favorites: {
        key: "favorites",
        name: "Favorites",
        description: "All your saved favorite burgers",
      },
      cookingHistory: {
        key: "cookingHistory",
        name: "Cooking History",
        description: "Your cooking records and achievements",
      },
      shoppingList: {
        key: "shoppingList",
        name: "Shopping List",
        description: "All your shopping list items",
      },
      settings: {
        key: "appSettings",
        name: "App Settings",
        description: "Your app preferences and configuration",
      },
    }

    const data = dataTypeMap[dataType]
    if (!data) return

    Alert.alert(
      `Clear ${data.name}`,
      `This will permanently delete ${data.description.toLowerCase()}. This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(data.key)
              await calculateStorageInfo()
              Alert.alert("Success", `${data.name} cleared successfully.`)
            } catch (error) {
              console.error(`Error clearing ${data.name}:`, error)
              Alert.alert("Error", `Failed to clear ${data.name}. Please try again.`)
            }
          },
        },
      ],
    )
  }

  const clearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete ALL your app data including favorites, history, settings, and profile information. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              // Keep user authentication but clear everything else
              const userToken = await AsyncStorage.getItem("userToken")
              const userData = await AsyncStorage.getItem("userData")

              await AsyncStorage.clear()

              // Restore user session
              if (userToken) await AsyncStorage.setItem("userToken", userToken)
              if (userData) await AsyncStorage.setItem("userData", userData)

              await calculateStorageInfo()
              Alert.alert("Success", "All app data has been cleared.")
            } catch (error) {
              console.error("Error clearing all data:", error)
              Alert.alert("Error", "Failed to clear data. Please try again.")
            }
          },
        },
      ],
    )
  }

  const exportData = () => {
    Alert.alert(
      "Export Data",
      "Data export feature is coming soon! You will be able to backup your favorites, cooking history, and settings.",
      [{ text: "OK" }],
    )
  }

  const importData = () => {
    Alert.alert(
      "Import Data",
      "Data import feature is coming soon! You will be able to restore your data from a backup file.",
      [{ text: "OK" }],
    )
  }

  const DataCard: React.FC<{
    title: string
    count: number
    onClear: () => void
    description: string
  }> = ({ title, count, onClear, description }) => (
    <View style={[styles.dataCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.dataCardHeader}>
        <View style={styles.dataCardLeft}>
          <View>
            <Text weight='medium' style={[styles.dataTitle, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.dataDescription, { color: colors.subtext }]}>{description}</Text>
          </View>
        </View>
        <Text weight='semiBold' style={[styles.dataCount, { color: colors.primary }]}>{count}</Text>
      </View>
      <Button title="Clear" onPress={onClear} size="small" style={styles.clearButton} />
    </View>
  )

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Calculating storage...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <ScreenWrapper scroll>
      <StatusBar 
      backgroundColor={isDarkMode ? colors.statusBar : "#8B0000"} 
      barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View style={[styles.header, { backgroundColor: colors.primary }]}>
      
        <TouchableOpacity style={styles.side} onPress={() => navigation.goBack()}>
          <Image source={{ uri: "https://img.icons8.com/sf-black/100/back.png" }} style={styles.backIcon} />
        </TouchableOpacity>
      
        <Text weight='semiBold' style={styles.headerTitle}>Data & Storage</Text>
      
        <View style={styles.side} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Storage Overview */}
        <View style={styles.section}>
          <Text weight='semiBold' style={[styles.sectionTitle, { color: colors.text }]}>Storage Overview</Text>
          <View style={[styles.overviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text weight='semiBold' style={[styles.totalSize, { color: colors.primary }]}>{storageInfo.totalSize}</Text>
            <Text style={[styles.totalLabel, { color: colors.subtext }]}>Total App Data</Text>
          </View>
        </View>

        {/* Data Categories */}
        <View style={styles.section}>
          <Text weight='semiBold' style={[styles.sectionTitle, { color: colors.text }]}>Data Categories</Text>

          <DataCard
            title="Favorites"
            count={storageInfo.favorites}
            description="Saved burger recipes"
            onClear={() => clearSpecificData("favorites")}
          />

          <DataCard
            title="Cooking History"
            count={storageInfo.cookingHistory}
            description="Cooking records and achievements"
            onClear={() => clearSpecificData("cookingHistory")}
          />

          <DataCard
            title="Shopping Lists"
            count={storageInfo.shoppingList}
            description="Shopping list items"
            onClear={() => clearSpecificData("shoppingList")}
          />

          <DataCard
            title="App Settings"
            count={storageInfo.settings}
            description="Preferences and configuration"
            onClear={() => clearSpecificData("settings")}
          />

          <DataCard
            title="Profile Data"
            count={storageInfo.profileData}
            description="Profile info and picture"
            onClear={() =>
              Alert.alert("Info", 'Profile data cannot be cleared individually. Use "Clear All Data" if needed.')
            }
          />
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text weight='semiBold' style={[styles.sectionTitle, { color: colors.text }]}>Data Management</Text>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={exportData}
          >
            <View style={styles.actionContent}>
              <Text weight='medium' style={[styles.actionTitle, { color: colors.text }]}>Export Data</Text>
              <Text style={[styles.actionSubtitle, { color: colors.subtext }]}>Backup your data to a file</Text>
            </View>
            <Image
              source={{ uri: "https://img.icons8.com/material-rounded/48/chevron-right.png" }}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={importData}
          >
            <View style={styles.actionContent}>
              <Text weight='medium' style={[styles.actionTitle, { color: colors.text }]}>Import Data</Text>
              <Text style={[styles.actionSubtitle, { color: colors.subtext }]}>Restore data from a backup file</Text>
            </View>
            <Image
              source={{ uri: "https://img.icons8.com/material-rounded/48/chevron-right.png" }}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => calculateStorageInfo()}
          >
            <View style={styles.actionContent}>
              <Text weight='medium' style={[styles.actionTitle, { color: colors.text }]}>Refresh Storage Info</Text>
              <Text style={[styles.actionSubtitle, { color: colors.subtext }]}>Recalculate storage usage</Text>
            </View>
            <Image
              source={{ uri: "https://img.icons8.com/material-rounded/48/chevron-right.png" }}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text weight='semiBold' style={[styles.sectionTitle, { color: colors.text }]}>Danger Zone</Text>

          <View
            style={[
              styles.dangerCard,
              {
                backgroundColor: isDarkMode ? "#2D1515" : "#FEE2E2",
                borderColor: isDarkMode ? "#5B1F1F" : "#FECACA",
              },
            ]}
          >
            <Text weight='semiBold' style={[styles.dangerTitle, { color: colors.primary }]}>Clear All Data</Text>
            <Text style={[styles.dangerDescription, { color: colors.subtext }]}>
              This will permanently delete all your app data. This action cannot be undone.
            </Text>
            <Button
              title="Clear"
              onPress={clearAllData}
              size= 'small'
              style={styles.dangerButton}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.subtext }]}>
            Data is stored locally on your device and is not shared with external servers.
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 15,
  },
  overviewCard: {
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
  },
  totalSize: {
    fontSize: 25,
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 14,
  },
  dataCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  dataCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dataCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dataIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  dataTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  dataDescription: {
    fontSize: 12,
  },
  dataCount: {
    fontSize: 18,
  },
  clearButton: {
    alignSelf: "flex-start",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
  },
  arrowIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  dangerCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  dangerIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  dangerTitle: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
  dangerDescription: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  dangerButton: {
    minWidth: 150,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Poppins-Italic",
    lineHeight: 20,
  },
})

export default DataStorageScreen
