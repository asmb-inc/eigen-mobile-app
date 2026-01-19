import { User, UserResponse } from "@supabase/supabase-js";
import { ExpoRoot } from "expo-router";



export interface Question{
    id: number,
    title: string,
    body: string,
    difficulty: string,
    blanks_count: number
}


export interface AnswerResult{
  blank_order: number
  submitted: number | null
  is_correct: boolean
}


export interface Profile{
    id: number, 
    rating: number,
    user_id: string
}


export interface AuthContextInterface{
    user: User | null
    profile: Profile | null
    token: string
    setUser: (user: User | null) => void,
    setProfile: (profile: Profile | null) => void,
    setToken: (token: string) => void,
    
}
