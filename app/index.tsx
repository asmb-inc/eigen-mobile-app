import { Stack } from "expo-router";
import { View, Text, Image, TouchableOpacity } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 bg-[#1A1D27] overflow-hidden">
      <Stack.Screen options={{ headerShown: false }} />

      {/* BACKGROUND LAYERS */}

      {/* Crimson battlefield glow */}
      <View className="absolute w-[500px] h-[500px] bg-red-600/25 rounded-full blur-3xl -top-52 right-[-120px]" />

      {/* Electric blue contrast glow */}
      <View className="absolute w-[480px] h-[480px] bg-blue-500/20 rounded-full blur-3xl -bottom-56 left-[-130px]" />

      {/* Diagonal gradient wash */}
      <View className="absolute inset-0 bg-gradient-to-br from-[#141622]/60 via-transparent to-[#0D0F19]/70" />

      {/* Vignette to add battlefield contrast */}
      <View className="absolute inset-0 bg-black/30" />

      {/* Main Content */}
      <View className="flex-1 items-center justify-center px-8">

        {/* Logo */}
        <Image
          source={require("../assets/logo.png")}
          resizeMode="contain"
          className="w-44 h-44 mb-6 drop-shadow-lg"
        />

        {/* Title */}
        <Text className="text-white text-5xl font-extrabold tracking-[4px] uppercase mb-3 text-center drop-shadow-md">
          B A T T L O N
        </Text>

        {/* Subtitle */}
        <Text className="text-gray-300 text-lg text-center max-w-[300px] leading-6 mb-12">
          Practice, compete & conquer.  
          Sharpen your mind. Enter the battlefield of{" "}
          <Text className="text-red-400 font-bold">Math</Text> &{" "}
          <Text className="text-blue-400 font-bold">Physics</Text>.
        </Text>

        {/* CTA Button (Colored) */}
        <TouchableOpacity activeOpacity={0.85}>
          <View className="px-12 py-4 rounded-2xl shadow-2xl shadow-red-900/60 border border-red-400/40
                           bg-gradient-to-r from-red-600 via-red-700 to-red-800">
            <Text className="text-white text-xl font-bold tracking-wide uppercase">
              Enter the Arena
            </Text>
          </View>
        </TouchableOpacity>

      </View>

      {/* Subtle metal top/bottom lines */}
      <View className="absolute top-0 left-0 right-0 h-[2px] bg-white/10" />
      <View className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5" />
    </View>
  );
}
