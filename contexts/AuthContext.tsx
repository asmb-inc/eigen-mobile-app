import { createContext, useState } from "react"
import { AuthContextInterface } from "@/interface"
import { User } from "@supabase/supabase-js"


export const authContext = createContext<AuthContextInterface>({user: null,  setUser: ()=>{} })

const AuthContextWrapper = ({ children }: { children: React.ReactNode })=>{
    const [user, setUser] = useState<User | null>(null)
    return <authContext.Provider value={{user, setUser}}>{children}</authContext.Provider>
}


export default AuthContextWrapper
