// import { Text, View, TouchableOpacity } from "react-native";
// import { useContext, useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { authContext } from "@/contexts/AuthContext";
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';
// import DailyQuestionsSlide from "@/components/DailyQuestionsSlide";
// import BlogSlide from "@/components/BlogSlide";

// const Tab = createBottomTabNavigator();

// function ContestsScreen() {
//   const [displayName, setDisplayName] = useState<string | null>(null);
//   const auth = useContext(authContext);
//   const handleLogout = async () => {
//     auth.setUser(null);
//     await supabase.auth.signOut();
//   };

//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();

//       if (user) {
//         auth.setUser(user);
//         setDisplayName(
//           user.user_metadata?.full_name ||
//           user.email ||
//           "User"
//         );
//       } else {
//         setDisplayName("Guest");
//       }
//     };

//     fetchUser();
//   }, []);

//   return (
//     <View className="flex-1 items-center justify-center">
//       <Text className="text-xl font-semibold">
//         Welcome, {displayName}!
//       </Text>
//       <Text className="mt-4">
//         Get ready for awesome contests at Eigen !!
//       </Text>
//       <TouchableOpacity
//         onPress={handleLogout}
//         className="mt-8 bg-red-500 px-4 py-2 rounded"
//       >
//         <Text className="text-white font-semibold">Logout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }





// export default function Home() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName: any;

//           if (route.name === 'Contests') {
//             iconName = focused ? 'trophy' : 'trophy-outline';
//           } else if (route.name === 'Daily Questions') {
//             iconName = focused ? 'help-circle' : 'help-circle-outline';
//           // } else if (route.name === 'Blog') {
//             iconName = focused ? 'newspaper' : 'newspaper-outline';
//           }

//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: 'blue',
//         tabBarInactiveTintColor: 'gray',
//       })}
//     >
      
//       <Tab.Screen name="Contests" component={ContestsScreen} />
//       <Tab.Screen name="Daily Questions" component={DailyQuestionsSlide} />
//       <Tab.Screen name="Blog" component={BlogSlide} />
//     </Tab.Navigator>
//   );
// }
