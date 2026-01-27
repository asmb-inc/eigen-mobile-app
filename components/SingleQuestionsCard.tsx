import { Question } from "@/interface"
import { getDifficultyColor } from "@/utils"
import { useRouter } from "expo-router"
import { Pressable, Text, View } from "react-native"

const SingleQuestionsCard = ({ item }: { item:Question,  }) => {
    const colors = getDifficultyColor(item.difficulty)
    const router = useRouter()    
    return (
        <Pressable onPress={()=>{router.push(`/question/${item.id}`)}} className="active:opacity-70 mb-3">
            <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <View className="flex-row justify-between items-start">
                    <Text className="text-base font-semibold text-gray-800 flex-1 pr-2">
                        {item.title}
                    </Text>
                    <View className={`${colors.bg} px-2 py-1 rounded-full ml-2`}>
                        <Text className={`text-xs font-semibold ${colors.text}`}>
                            
                            {item.difficulty}
                        </Text>
                    </View>
                </View>
            </View>
        </Pressable>
    )
}

export default SingleQuestionsCard