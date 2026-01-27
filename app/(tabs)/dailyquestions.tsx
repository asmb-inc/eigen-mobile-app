import { Text, View, ScrollView, Pressable, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { getDifficultyColor } from "@/utils"
import SingleQuestionsCard from "@/components/SingleQuestionsCard"
import { useContext, useEffect, useState } from "react"
import { Question } from "@/interface"
import axios from 'axios'
import { supabase } from "@/lib/supabase"
import { BASE_URL } from "@/BASE_URL"
import { authContext } from "@/contexts/AuthContext"


const DailyQuestionsScreen = () => {

    const [otherQuestions, setOtherQuestions] = useState<Question[]>([])
    const [dailyQuestion, setDailyQuestion] = useState<Question | null>(null)
    const auth = useContext(authContext)


    const getDailyQuestion = async () => {


       
            try {
                const resp = await axios.get(BASE_URL + '/questions/daily', { headers: { Authorization: 'Bearer ' + auth.token } })
                console.log(resp.data)
                setDailyQuestion(resp.data)
            } catch (e) {
                console.log('could not load the daily question')
                console.log(e)
            }
     


    }

    const getOtherQuestios = async () => {
        const {
            data: { session },
            error,
        } = await supabase.auth.getSession();
        if (session) {
            const accessToken = session.access_token;
            // console.log("Access token:", accessToken);
            try {
                const resp = await axios.get(BASE_URL + '/questions/all', { headers: { Authorization: 'Bearer ' + accessToken } })
                // console.log(resp.data)
                setOtherQuestions(resp.data)
            } catch (e) {
                console.log('could not load the daily question')
                console.log(e)
            }
        } else {

            console.log("can't get session issue")
        }

    }

    useEffect(() => {
        getDailyQuestion()
        getOtherQuestios()
    }, [])




    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="px-4 py-6">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-2xl font-semibold text-gray-800">
                        Question of the Day
                    </Text>
                    <Pressable onPress={()=>{}} className="active:opacity-70">
                        <Ionicons name="calendar" size={24} color="#4B5563" />
                    </Pressable>
                </View>

                {dailyQuestion && (
                    <SingleQuestionsCard item={dailyQuestion}  />
                )}
            </View>

            <View className="px-4 pb-6">
                <Text className="text-2xl font-semibold text-gray-800 mb-4">
                    Other Questions
                </Text>

                <FlatList
                    data={otherQuestions}
                    renderItem={SingleQuestionsCard}
                    keyExtractor={(item: Question) => item.id.toString()}
                    scrollEnabled={false}
                />
            </View>
        </ScrollView>
    )
}

export default DailyQuestionsScreen