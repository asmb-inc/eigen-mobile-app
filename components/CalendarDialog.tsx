import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { BASE_URL } from '@/BASE_URL';
import { authContext } from '@/contexts/AuthContext';

interface CalendarDialogProps {
  visible: boolean;
  onClose: () => void;
}

const CalendarDialog: React.FC<CalendarDialogProps> = ({ visible, onClose }) => {
  const auth = useContext(authContext);
  const router = useRouter();

  const handleDayPress = async (day: { dateString: string }) => {
    console.log('selected day', day.dateString);
    try {
      const resp = await axios.post(
        `${BASE_URL}/questions/get-daily-question-by-datestring`,
        { datestring: day.dateString },
        { headers: { Authorization: 'Bearer ' + auth.token } }
      );
      const question_id = resp.data.question_id;
      
      if (question_id) {
        onClose();
        // navigate to the actual route folder (singular 'question')
        router.push(`/question/${question_id}` as any);
      }
    } catch (err) {
    //   console.error('error sending date', err);
    }
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="w-11/12 bg-white rounded-lg p-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold">Daily Questions!</Text>
            <Pressable onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="#333" />
            </Pressable>
          </View>
          {/* calendar component from react-native-calendars */}
          <Calendar
            current={new Date().toISOString().split('T')[0]}
            onDayPress={handleDayPress}
            onMonthChange={month => {
              console.log('month changed', month);
            }}
            hideExtraDays={true}
            theme={{
              arrowColor: '#36093D',
              todayTextColor: '#36093D',
              selectedDayBackgroundColor: '#36093D',
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default CalendarDialog;
