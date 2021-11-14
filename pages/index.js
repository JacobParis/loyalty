import { useState, useEffect } from "react"
import { supabase } from "../utils/supabaseClient"
import Auth from "../components/Auth"
import Account from "../components/Account"

function PageWidth({ children }) {
  return <div className="max-w-3xl mx-auto">{children}</div>
}
export default function Home() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div>
      <header className="border-t border-b">
        <PageWidth>
          <h1 className="text-5xl tracking-tight font-bold text-gray-900 mb-2">
            Account
          </h1>
          <h2 className="tracking-wide  text-gray-600 mb-4">Manage account</h2>
        </PageWidth>
      </header>

      {!session ? (
        <div className="px-4 py-2 -mx-4 rounded bg-gray-50">
          <Auth />
        </div>
      ) : (
        <main className="py-8">
          <PageWidth>

            <Account key={session.user.id} session={session} />
          </PageWidth>
        </main>
      )}
    </div>
  )
}
