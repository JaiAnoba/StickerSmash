"use client"

import type React from "react"
import { useState, useEffect } from "react" 
import { View, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, FlatList, Image } from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../../App"
import { useCooking } from "../context/CookingContext"
import Text from "../components/CustomText"

type CookingHistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, "CookingHistory">

interface Props {
  navigation: CookingHistoryScreenNavigationProp
}

const CookingHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const { cookingSessions } = useCooking()
  const [groupedSessions, setGroupedSessions] = useState<any>({})

  useEffect(() => {
    // Group sessions by date
    const grouped = cookingSessions
      .filter((session) => session.completed)
      .reduce(
        (acc, session) => {
          const date = new Date(session.date).toLocaleDateString()
          if (!acc[date]) {
            acc[date] = []
          }
          acc[date].push(session)
          return acc
        },
        {} as Record<string, typeof cookingSessions>,
      )

    // Sort dates in descending order
    const sortedGrouped = Object.keys(grouped)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .reduce(
        (acc, date) => {
          acc[date] = grouped[date]
          return acc
        },
        {} as Record<string, typeof cookingSessions>,
      )

    setGroupedSessions(sortedGrouped)
  }, [cookingSessions])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const hrs = Math.floor(mins / 60)

    if (hrs > 0) {
      return `${hrs}h ${mins % 60}m`
    } else {
      return `${mins}m`
    }
  }

  const renderSessionItem = ({ item }: { item: any }) => (
    <View style={styles.sessionItem}>
      <View style={styles.sessionIconContainer}>
        <Image source={{ uri: "https://img.icons8.com/material-rounded/96/hamburger.png" }} style={{width: 22, height: 22, tintColor: '#8B0000', zIndex: 50,}} />
      </View>
      <View style={styles.sessionInfo}>
        <Text weight="semiBold" style={styles.sessionName}>
          {item.burgerName}
        </Text>
        <Text style={styles.sessionTime}>
          {formatTime(item.cookingTime)} •{" "}
          {new Date(item.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
    </View>
  )

  const renderDateSection = ({ item }: { item: string }) => (
    <View style={styles.dateSection}>
      <Text weight="semiBold" style={styles.dateHeader}>
        {item}
      </Text>
      <FlatList
        data={groupedSessions[item]}
        renderItem={renderSessionItem}
        keyExtractor={(item, index) => `${item.burgerId}-${index}`}
        scrollEnabled={false}
      />
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={{ uri: "https://img.icons8.com/sf-black/100/back.png" }} style={styles.backIcon} />
        </TouchableOpacity>
        <Text weight="semiBold" style={styles.headerTitle}>
          Cooking History
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {Object.keys(groupedSessions).length > 0 ? (
          <FlatList
            data={Object.keys(groupedSessions)}
            renderItem={renderDateSection}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyState}>
            <Image source={{ uri: "https://img.icons8.com/windows/64/cook-male.png" }} style={styles.emptyIcon} />
            <Text weight="semiBold" style={styles.emptyTitle}>
              No cooking history yet
            </Text>
            <Text style={styles.emptyText}>Start cooking your favorite burger recipes and they'll appear here.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#8B0000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
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
  headerTitle: {
    color: "white",
    fontSize: 18,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 15,
  },
  dateSection: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 14,
    marginBottom: 10,
    color: "#4B5563",
  },
  sessionItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sessionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  sessionIcon: {
    fontSize: 20,
  },
  sessionInfo: {
    flex: 1,
    justifyContent: "center",
  },
  sessionName: {
    fontSize: 16,
    marginBottom: 4,
    color: "#1F2937",
  },
  sessionTime: {
    fontSize: 13,
    color: "#6B7280",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: "#1F2937",
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    maxWidth: 300,
  },
})

export default CookingHistoryScreen
