import * as WebBrowser from 'expo-web-browser'
import { makeRedirectUri } from 'expo-auth-session'
import { supabase } from './supabase'
import { router } from 'expo-router'


export async function signInWithGoogle() {
    const redirectTo = makeRedirectUri({
        scheme: 'eigen',
    })
 
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo,
        },
    })

    if (error) {
        console.error('Google sign-in error:', error)
        return
    }

    if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectTo
        )

        if (result.type === 'success' && result.url) {
            // if (result.type === 'success') {

            //     router.replace('/home')
            // }
        }
    }
}

