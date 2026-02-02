import { View, Text, ScrollView } from "react-native";
import { useContext, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { BASE_URL } from "@/BASE_URL";
import { authContext } from "@/contexts/AuthContext";

export default function ContestScreen() {
    const { id } = useLocalSearchParams();
    const auth = useContext(authContext);

    const [contest, setContest] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchContest = async () => {
        try {
            const resp = await axios.get(`${BASE_URL}/contests/${id}`);
            setContest(resp.data);
        } catch (e) {
            setError("Contest not found");
        }
    };

    const fetchQuestions = async () => {
        try {
            const resp = await axios.get(
                `${BASE_URL}/contests/${id}/questions`,
                { headers: { Authorization: "Bearer " + auth.token } }
            );
            setQuestions(resp.data);
        } catch (e: any) {
            setError(
                e?.response?.data?.detail || "Contest has not started yet"
            );
        }
    };

    useEffect(() => {
        fetchContest();
        if (auth.token) {
            fetchQuestions();
        }
    }, [auth.token]);

    if (error) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-red-500">{error}</Text>
            </View>
        );
    }

    if (!contest) return null;

    return (
        <ScrollView className="flex-1 px-4 pt-6">
            <Text className="text-2xl font-bold">{contest.name}</Text>

            <Text className="mt-4 text-lg font-semibold">
                Questions
            </Text>

            {questions.map((q, i) => (
                <View key={q.id} className="mt-3 p-3 bg-white rounded-lg shadow">
                    <Text className="font-medium">
                        Q{i + 1}. {q.title}
                    </Text>
                </View>
            ))}
        </ScrollView>
    );
}
