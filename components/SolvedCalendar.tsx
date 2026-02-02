import React, { useEffect, useState } from "react"
import { View, Text, Modal, Pressable, ScrollView, ActivityIndicator } from "react-native"
import axios from "axios"
import { supabase } from "@/lib/supabase"
import { BASE_URL } from "@/BASE_URL"
import { subscribe, triggerRefresh } from "@/utils/calendarRefresh"
import { useRouter } from "expo-router"

type DayItem = {
  id: string
  question_id: number
  solved_at: string
  metadata?: any
  question?: { id: number; title: string }
}

function monthRangeFor(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return { start, end }
}

export default function SolvedCalendar({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [heatmap, setHeatmap] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [dayItems, setDayItems] = useState<DayItem[] | null>(null)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const router = useRouter()

  useEffect(() => {
    let unsub: (() => void) | null = null
    unsub = subscribe(() => {
      if (visible) fetchHeatmap()
    })
    if (visible) fetchHeatmap()
    return () => {
      if (unsub) unsub()
    }
  }, [visible, currentMonth])

  const fetchHeatmap = async () => {
    setLoading(true)
    try {
      const { start, end } = monthRangeFor(currentMonth)
      const s = start.toISOString().slice(0, 10)
      const e = end.toISOString().slice(0, 10)

      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return

      const resp = await axios.get(
        `${BASE_URL}/profile/calendar?start=${s}&end=${e}`,
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      )

      // resp.data expected: [{date: 'YYYY-MM-DD', count: N}, ...]
      const map: Record<string, number> = {}
      resp.data.forEach((r: any) => (map[r.date] = r.count))
      setHeatmap(map)
    } catch (e) {
      console.log("Error loading calendar", e)
    } finally {
      setLoading(false)
    }
  }

  const openDay = async (date: string) => {
    setSelectedDate(date)
    setDayItems(null)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return

      const resp = await axios.get(
        `${BASE_URL}/profile/solved/${date}`,
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      )
      setDayItems(resp.data)
    } catch (e) {
      console.log("Could not load day items", e)
    }
  }

  const handleDatePress = async (date: string) => {
    // Try to fetch daily question for the date and navigate to it.
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return

      try {
        const resp = await axios.get(`${BASE_URL}/questions/daily/${date}`, { headers: { Authorization: `Bearer ${session.access_token}` } })
        if (resp.data && resp.data.id) {
          onClose()
          router.push(`/question/${resp.data.id}`)
          return
        }
      } catch (err) {
        // 404 or not found: fall back to opening day's solves
      }

      // fallback: open day modal listing solved items
      openDay(date)
    } catch (e) {
      console.log('error handling date press', e)
    }
  }

  const prevMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const nextMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  const getMonthGrid = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const firstDayIndex = firstDay.getDay() // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const totalCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7
    const cells: (string | null)[] = []
    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - firstDayIndex + 1
      if (i < firstDayIndex || dayNum > daysInMonth) cells.push(null)
      else {
        const d = new Date(year, month, dayNum)
        cells.push(d.toISOString().slice(0, 10))
      }
    }
    return cells
  }

  const renderCalendarGrid = () => {
    const monthName = currentMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' })
    const grid = getMonthGrid(currentMonth)
    const weeks: (string | null)[][] = []
    for (let i = 0; i < grid.length; i += 7) weeks.push(grid.slice(i, i + 7))

    return (
      <View className="px-3">
        <View className="flex-row justify-between items-center py-3">
          <Pressable onPress={prevMonth} className="px-3 py-1">
            <Text className="text-violet-600">Prev</Text>
          </Pressable>
          <Text className="text-lg font-semibold">{monthName}</Text>
          <Pressable onPress={nextMonth} className="px-3 py-1">
            <Text className="text-violet-600">Next</Text>
          </Pressable>
        </View>

        <View className="flex-row">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((w) => (
            <View key={w} style={{ width: `${100/7}%` }} className="items-center">
              <Text className="text-xs text-gray-500">{w}</Text>
            </View>
          ))}
        </View>

        {weeks.map((week, wi) => (
          <View key={wi} className="flex-row">
            {week.map((cell, ci) => {
              if (!cell) return <View key={ci} style={{ width: `${100/7}%` }} className="py-3" />
              const count = heatmap[cell] || 0
              const dayNumber = parseInt(cell.slice(8, 10), 10)
              const isToday = cell === new Date().toISOString().slice(0,10)
              return (
                <Pressable key={ci} onPress={() => handleDatePress(cell)} style={{ width: `${100/7}%` }} className="items-center py-3">
                  <View className={`w-8 h-8 rounded-full items-center justify-center ${isToday ? 'border-2 border-violet-600' : ''}`}>
                    <Text className="text-sm">{dayNumber}</Text>
                  </View>
                  {count > 0 && (
                    <Text className="text-green-600 mt-1">✓</Text>
                  )}
                </Pressable>
              )
            })}
          </View>
        ))}
      </View>
    )
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View className="flex-1 bg-white">
        <View className="flex-row justify-between items-center px-4 py-4 border-b border-gray-200">
          <Text className="text-lg font-semibold">Solved Calendar</Text>
          <Pressable onPress={() => { onClose(); setSelectedDate(null); setDayItems(null) }}>
            <Text className="text-violet-600 font-semibold">Close</Text>
          </Pressable>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator />
          </View>
        ) : (
          <ScrollView>
            {renderCalendarGrid()}

            {selectedDate && (
              <View className="px-4 py-4 border-t border-gray-100">
                <Text className="text-base font-semibold mb-2">Solved on {selectedDate}</Text>
                {dayItems === null ? (
                  <Text className="text-gray-500">Loading…</Text>
                ) : dayItems.length === 0 ? (
                  <Text className="text-gray-500">No solves on this day.</Text>
                ) : (
                  dayItems.map((it) => (
                    <View key={it.id} className="py-2 border-b border-gray-100">
                      <Text className="text-sm font-medium">{it.question?.title || `Question ${it.question_id}`}</Text>
                      <Text className="text-xs text-gray-500">Solved at {new Date(it.solved_at).toLocaleTimeString()}</Text>
                    </View>
                  ))
                )}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </Modal>
  )
}
