import { Tab, Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet } from "react-native";
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#008000",
        headerShown: false,
        tabBarStyle: {
          height: 55,
          flexDirection: "column"
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Learn",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "school" : "school"}
              color={focused ? "#008000" : "#636363"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "podium" : "podium"}
              color={focused ? "#008000" : "#636363"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person"}
              color={focused ? "#008000" : "#636363"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="lesson"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="ar"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
