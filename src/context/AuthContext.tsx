import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from "../lib/supabase"

interface AuthContextType {
    User: User | null
    session: Session | null
    loading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType >({
    User: null,
    session: null,
    loading: true,
    signOut: async () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [User, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session }, error } = await supabase.auth.getSession()
            if (error) {
                console.error('Error fetching session:', error)
                setLoading(false)
                return
            }
            setSession(session)
            setUser(session?.user || null)
            setLoading(false)
        }

        fetchUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session)
            if (event === 'SIGNED_IN') {
                setUser(session?.user || null)
            } else if (event === 'SIGNED_OUT') {
                setUser(null)
                setSession(null)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <AuthContext.Provider value={{ User, session, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}