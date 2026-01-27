import { createContext, useState } from "react"
import { AuthContextInterface, Profile } from "@/interface"
import { User } from "@supabase/supabase-js"


export const authContext = createContext<AuthContextInterface>({user: null,profile: null,  setUser: ()=>{}, setProfile: ()=>{}, setToken: ()=>{} ,token:"" })

const AuthContextWrapper = ({ children }: { children: React.ReactNode })=>{
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [token, setToken] = useState("")
    return <authContext.Provider value={{user, profile, setUser, setProfile, token, setToken}}>{children}</authContext.Provider>
}


export default AuthContextWrapper
