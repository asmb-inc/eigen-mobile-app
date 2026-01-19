import { Stack } from "expo-router"

export default function QuestionLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true, // 🔥 disable implicit header
      }}
    />
  )
}
