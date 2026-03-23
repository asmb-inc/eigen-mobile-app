import { View, Text, TextInput, Pressable } from "react-native"
import { useEffect, useState } from "react"
import { useLocalSearchParams, useNavigation } from "expo-router"
import axios from "axios"
import { supabase } from "@/lib/supabase"
import { BASE_URL } from "@/BASE_URL"
import { AnswerResult, DiffcultyColors, Question } from "@/interface"
import MathJaxView from "@/components/Mathview"
import { getDifficultyColor } from "@/utils"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

export default function QuestionDetailScreen() {
  const { id } = useLocalSearchParams()
  const navigation = useNavigation()

  const [question, setQuestion] = useState<Question | null>(null)
  const [answers, setAnswers] = useState<string[]>([])
  const [results, setResults] = useState<AnswerResult[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [difficultyColors, setDifficultyColors] =
    useState<DiffcultyColors>({ bg: "", text: "" })

  useEffect(() => {
    fetchQuestion()
  }, [id])

  useEffect(() => {
    if (question) {
      setDifficultyColors(getDifficultyColor(question.difficulty))
    }
  }, [question])

  const fetchQuestion = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) return

      const resp = await axios.get(
        `${BASE_URL}/questions/${id}`,
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      )

      const q: Question = resp.data
      setQuestion(q)
      setAnswers(Array(q.blanks_count).fill(""))
      setResults(null)

      navigation.setOptions({
        title: q.title,
      })
    } catch (e) {
      console.log("Could not load the question", e)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (value: string, index: number) => {
    const updated = [...answers]
    updated[index] = value
    setAnswers(updated)
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) return

      const payload = {
        answers: answers.map((a) =>
          a.trim() === "" ? null : Number(a)
        ),
      }

      const resp = await axios.post(
        `${BASE_URL}/questions/${id}/answer`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      )

      setResults(resp.data.results)
    } catch (e) {
      console.log("Submit failed", e)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500 text-base">
          Loading question…
        </Text>
      </View>
    )
  }

  if (!question) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500 text-base">
          Question not found
        </Text>
      </View>
    )
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "white" }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 120,
      }}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="px-5 pt-6">

        {/* Title */}
        <Text className="text-2xl font-bold text-black mb-3">
          {question.title}
        </Text>

        {/* Metadata */}
        <View className="flex-row items-center mb-6">
          <View
            className={
              "px-3 py-1 rounded-full mr-3 " +
              difficultyColors.bg
            }
          >
            <Text
              className={
                "text-xs font-semibold " +
                difficultyColors.text
              }
            >
              {question.difficulty}
            </Text>
          </View>

          <Text className="text-sm text-gray-500">
            {question.blanks_count} blank
            {question.blanks_count > 1 ? "s" : ""}
          </Text>
        </View>

        {/* Question Body */}
        <View className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8">
          <MathJaxView content={question.body} />
        </View>

        {/* Answers */}
        <Text className="text-lg font-semibold text-black mb-4">
          Your Answer{question.blanks_count > 1 ? "s" : ""}
        </Text>

        {answers.map((value, index) => {
          const result = results?.[index]

          return (
            <View key={index} className="mb-5">
              <Text className="text-sm text-gray-600 mb-1">
                Blank {index + 1}
              </Text>

              <TextInput
                value={value}
                onChangeText={(text) =>
                  handleAnswerChange(text, index)
                }
                editable={!submitting}
                placeholder="Enter your answer"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                className={`border rounded-lg px-4 py-3 text-black ${
                  result
                    ? result.is_correct
                      ? "border-green-500"
                      : "border-red-500"
                    : "border-gray-300"
                }`}
              />

              {result && !result.is_correct && (
                <Text className="mt-2 text-sm text-red-600">
                  Your answer:{" "}
                  {result.submitted === null
                    ? "—"
                    : result.submitted}{" "}
                  is wrong buddy 😭
                </Text>
              )}

              {result && result.is_correct && (
                <Text className="mt-2 text-sm text-green-600 font-medium">
                  ✓ Dam Buddy You Nailed It ! 😎
                </Text>
              )}
            </View>
          )
        })}

        {/* Submit Button */}
        <View className="mt-6 mb-10">
          <Pressable
            disabled={submitting}
            onPress={handleSubmit}
            className={`rounded-xl py-4 items-center ${
              submitting ? "bg-violet-300" : "bg-[#36093D]"
            }`}
          >
            <Text className="text-white font-semibold text-base">
              {submitting ? "Submitting..." : "Submit Answer"}
            </Text>
          </Pressable>
        </View>

      </View>
    </KeyboardAwareScrollView>
  )
}
