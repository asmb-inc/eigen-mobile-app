import { Text, View, TouchableOpacity, FlatList } from "react-native";
import { useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { authContext } from "@/contexts/AuthContext";
import { BASE_URL } from "@/BASE_URL";
import axios from "axios";
import { useRouter } from "expo-router";

function ContestsScreen() {
  const auth = useContext(authContext);
  const router = useRouter();
  const [contests, setContests] = useState<any[]>([]);

  /* ---------------- AUTH BOOTSTRAP ---------------- */

  const getAndSetProfile = async (token: string) => {
    try {
      const resp = await axios.get(
        BASE_URL + "/auth/profile",
        { headers: { Authorization: "Bearer " + token } }
      );
      auth.setProfile(resp.data);
    } catch (e) {
      console.log("profile load failed", e);
    }
  };

  const bootstrapAuth = async () => {
    const { data } = await supabase.auth.getUser();
    auth.setUser(data.user);

    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session) {
      const token = sessionData.session.access_token;
      auth.setToken(token);
      await getAndSetProfile(token);
    }
  };

  /* ---------------- CONTESTS ---------------- */

  const fetchContests = async () => {
    try {
      const resp = await axios.get(BASE_URL + "/contests");
      setContests(resp.data || []);
    } catch (e) {
      console.log("failed to fetch contests", e);
    }
  };

  const handleStart = async (contestId: string) => {
    if (!auth.user) {
      router.push("/login"); // or your auth screen
      return;
    }

    router.push({
      pathname: "/contest/[id]",
      params: { id: contestId },
    });
  };

  useEffect(() => {
    bootstrapAuth();
    fetchContests();
  }, []);

  return (
    <View className="flex-1 px-4 pt-6">
      <Text className="text-xl font-semibold mb-4">
        Get ready for awesome contests at Eigens 🚀
      </Text>

      <FlatList
        data={contests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl p-4 mb-3 shadow">
            <Text className="text-lg font-medium">{item.name}</Text>

            <TouchableOpacity
              className="mt-3 bg-indigo-600 py-2 rounded-lg"
              onPress={() => handleStart(item.id)}
            >
              <Text className="text-white text-center font-semibold">
                Start
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

export default ContestsScreen;
