import { Text, View, TouchableOpacity } from "react-native";
import { useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { authContext } from "@/contexts/AuthContext";



function ContestsScreen() {
    
  const auth = useContext(authContext);

  useEffect(() => {
    console.log(auth.user)
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
  
      <Text className="mt-4">
        Get ready for awesome contests at Eigens !!
      </Text>
      
    </View>
  );
}




export default ContestsScreen