import { authContext } from "@/contexts/AuthContext";
import { signInWithGoogle } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Stack, useRouter } from "expo-router";
import { useContext } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
// 280600171280-2tg32pqfjsge1hm0gktb8dkm82fgr5sl.apps.googleusercontent.com

export default function Home() {

  const router = useRouter()
  const auth = useContext(authContext)
  const getIn = async()=>{
    await signInWithGoogle()
    const { data } = await supabase.auth.getUser();
    auth.setUser(data.user)

  }
  return (
    <View className="flex-1 bg-[#1A1D27] overflow-hidden">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-white items-center justify-between px-6 py-16">

        <View />

        <View className="items-center">
          <View
            className="h-24 w-24 rounded-2xl items-center justify-center mb-6"
            style={{ backgroundColor: '#7C3AED' }}
          >
            <Text className="text-white text-4xl font-bold">λ</Text>
          </View>

          <Text className="text-4xl font-semibold text-gray-900">
           E I G E N
          </Text>

          <Text className="mt-3 text-center text-base font-regular">
            Practice and Compete over math and physics problems 
          </Text>
        </View>

        <View className="w-full">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={getIn}
            className="w-full rounded-xl py-4 items-center"
            style={{ backgroundColor: '#7C3AED' }}
          >
            <Text className="text-white text-lg font-semibold">
             Get started with google
            </Text>
          </TouchableOpacity>

        
        </View>

      </View>
    </View>
  );
}


// Use Context API to store from supabase secure storage to 
