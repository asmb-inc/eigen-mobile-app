import { Tabs, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabsLayout() {
  const navigation = useNavigation();

  return (
    
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#7C3AED",
          tabBarInactiveTintColor: "#94A3B8",
          headerShown: true,
          headerStyle: { backgroundColor: '#7C3AED' },
          headerTintColor: 'white'
        }}
      >
        <Tabs.Screen
          name="contests"

          options={{
            title: "Contests",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="trophy-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="dailyquestions"
          options={{
            title: "Daily Questions",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="blog"
          options={{
            title: "Blog",

            tabBarIcon: ({ color, size }) => (
              <Ionicons name="newspaper-outline" size={size} color={color} />
            ),
          }}
        />


        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    
  );
}
