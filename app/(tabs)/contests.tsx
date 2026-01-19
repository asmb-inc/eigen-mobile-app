import { Text, View, TouchableOpacity } from "react-native";
import { useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { authContext } from "@/contexts/AuthContext";
import { BASE_URL } from "@/BASE_URL"; 
import axios from "axios";   

    
 
function ContestsScreen() {  
      
  const auth = useContext(authContext);


  const getAndSetToken = async()=>{
     const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (session) {
      const accessToken = session.access_token;
      auth.setToken(accessToken)
      getAndSetProfile()
    }
  }

  const getAndSetProfile = async()=>{
     
      try {
        const resp = await axios.get(BASE_URL + '/auth/profile', { headers: { Authorization: 'Bearer ' + auth.token } })
        console.log(resp.data)
        auth.setProfile(resp.data)
      } catch (e) {
        console.log('could not load the daily question')
        console.log(e)
      }
    
  }

  const getUserDetails =  async()=>{
     const { data } = await supabase.auth.getUser();
     auth.setUser(data.user)
     getAndSetToken()
  }

  useEffect(() => {
    

    // this function is called here because contests is the introductory screen of the app 
    // we may push thi to say /blog when we hve one!!!!
    getUserDetails()
   
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