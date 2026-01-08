import '../global.css';
import { Stack, useRouter } from 'expo-router';
import { useFonts } from 'expo-font'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser'
import { supabase } from '@/lib/supabase';
import { useContext, useEffect } from 'react';
import * as Linking from 'expo-linking';
import AuthContextWrapper, { authContext } from '@/contexts/AuthContext';

WebBrowser.maybeCompleteAuthSession()

// console.log("AuthProvider =", AuthContextWrapper);
export default function Layout() {
  const router = useRouter()
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {

        router.replace("/contests");

      }
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {



        router.replace("/contests");


      } else {
        router.replace('/')
      }
    })

    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleUrl = async (event: { url: string }) => {
      const { queryParams } = Linking.parse(event.url);
      if (queryParams?.code) {
        await supabase.auth.exchangeCodeForSession(queryParams.code as string);
      }
    };

    const subscription = Linking.addEventListener('url', handleUrl);

    // Handle initial URL if app was opened from link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl({ url });
      }
    });

    return () => subscription?.remove();
  }, []);

  const [fonts] = useFonts({
    "SpaceGrotesk-Bold": require('../assets/fonts/SpaceGrotesk-Bold.ttf'),
    "SpaceGrotesk-Light": require('../assets/fonts/SpaceGrotesk-Light.ttf'),
    "SpaceGrotesk-Medium": require('../assets/fonts/SpaceGrotesk-Medium.ttf'),
    "SpaceGrotesk-Regular": require('../assets/fonts/SpaceGrotesk-Regular.ttf'),
    "SpaceGrotesk-SemiBold": require('../assets/fonts/SpaceGrotesk-Regular.ttf')
  })
  return <SafeAreaProvider>
   
    <AuthContextWrapper > <Stack>

      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />


    </Stack></AuthContextWrapper></SafeAreaProvider>
}
