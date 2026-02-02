import { Text, View, ScrollView, Pressable, FlatList, Modal } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { getDifficultyColor } from "@/utils"
import SingleQuestionsCard from "@/components/SingleQuestionsCard"
import { useContext, useEffect, useState } from "react"
import { Question } from "@/interface"
import axios from 'axios'
import { supabase } from "@/lib/supabase"
import { BASE_URL } from "@/BASE_URL"
import { authContext } from "@/contexts/AuthContext"
import SolvedCalendar from "@/components/SolvedCalendar"
// import { useState } from "react"


const DailyQuestionsScreen = () => {

    const [otherQuestions, setOtherQuestions] = useState<Question[]>([])
    const [dailyQuestion, setDailyQuestion] = useState<Question | null>(null)
    const auth = useContext(authContext)
    const [calendarOpen, setCalendarOpen] = useState(false)


    const getDailyQuestion = async () => {



        try {
            const resp = await axios.get(BASE_URL + '/questions/daily', { headers: { Authorization: 'Bearer ' + auth.token } })
            console.log(resp.data)
            setDailyQuestion(resp.data)
        } catch (e: any) {
            console.log('could not load the daily question')
            console.log(e.response?.data || e.message);
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
            } catch (e: any) {
                console.log('could not load the daily question')
                console.log(e.response?.data || e.message);
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
                        <Pressable onPress={() => setCalendarOpen(true)} className="active:opacity-70">
                            <Ionicons name="calendar" size={24} color="#4B5563" />
                        </Pressable>
                        <SolvedCalendar visible={calendarOpen} onClose={() => setCalendarOpen(false)} />
                </View>

                {dailyQuestion && (
                    <SingleQuestionsCard item={dailyQuestion} />
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