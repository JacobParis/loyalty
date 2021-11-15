import { useState, useEffect } from "react"
import { supabase } from "../utils/supabaseClient"
export function useAuth(defaultSession) {
  const [session, setSession] = useState(defaultSession)

  useEffect(() => {
    setSession(supabase.auth.session())

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)

        fetch("/api/auth", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ event, session }),
        }).then((res) => res.json())
      }
    )

    return () => {
      authListener.unsubscribe()
    }
  }, [])

  return session
}
