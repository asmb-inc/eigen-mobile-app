import { authContext } from "@/contexts/AuthContext"
import { useContext, useEffect, useState } from "react"
import { Text, View, TouchableOpacity, FlatList } from "react-native"
import { StatusBar } from "expo-status-bar"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { supabase } from "@/lib/supabase"
import axios from "axios"
import { BASE_URL } from "@/BASE_URL"

const AccountScreen = ()=>{
    const auth = useContext(authContext)
    const [streak, setStreak] = useState<number>(500)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        auth.setUser(null)
    }    

    const fetchStreak = async()=>{
        try{
            const resp = await axios.get(BASE_URL+'/profile/streak', {headers:{Authorization: 'Bearer '+ auth.token}})
            setStreak(resp.data)
        }catch(e){
            console.log(e)
        }
    }

    useEffect(()=>{
        fetchStreak()
    },[])

    const menuItems = [
        { id: 'logout', title: 'Logout', onPress: handleLogout }
    ]

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="p-4">
                <View className="flex-row items-center mb-8">
                    <Ionicons name="person-circle" size={60} color="#666" />
                    <View className="ml-4">
                        <Text className="text-xl font-semibold">{auth.user?.user_metadata.full_name}</Text>
                        <Text className="text-xs font-semibold">Rating: {auth.profile?.rating}</Text>
                        <Text className="text-xs font-semibold">Current Streak: {streak}</Text>
                        <View className="mt-1 px-2 py-1 rounded self-start" style={{ backgroundColor: '#7C3AED' }}>
                            
                            <Text className="text-xs text-white">Sorcerer</Text>
                        </View>
                    </View>
                </View>      
                <FlatList
                    data={menuItems}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={item.onPress} className="p-4 border-b border-gray-200">
                            <Text className="text-lg">{item.title}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </SafeAreaView>
    )
}

export default AccountScreen