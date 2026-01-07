import { User, UserResponse } from "@supabase/supabase-js";

export interface AuthContextInterface{
    user: User | null
    setUser: (user: User | null) => void
}