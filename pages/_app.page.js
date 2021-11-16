import "../styles/globals.css"
import { QueryClient, QueryClientProvider } from "react-query"
import { PageWidth } from "./PageWidth"
import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "./supabaseClient"

function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient()

  const [authenticatedState, setAuthenticatedState] =
    useState("not-authenticated")

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        fetch("/api/auth", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ event, session }),
        })

        if (event === "SIGNED_IN") {
          setAuthenticatedState("authenticated")
        }

        if (event === "SIGNED_OUT") {
          setAuthenticatedState("not-authenticated")
        }
      }
    )

    const user = supabase.auth.user()
    if (user) {
      setAuthenticatedState("authenticated")
    }

    return () => {
      authListener.unsubscribe()
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <div className="py-2">
        <div className="py-2">
          <PageWidth>
            <div className="flex justify-between align-center">
              <Link href="/">Loyalty</Link>

              {authenticatedState === "authenticated" ? (
                <div>
                  <span className="inline-block px-2 py-1 mx-1 font-semibold text-gray-700 rounded-md cursor-pointer hover:bg-gray-100">
                    <Link href="/account">Account</Link>
                  </span>

                  <button
                    className="inline-block px-2 py-1 mx-1 font-semibold text-gray-700 rounded-md cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      supabase.auth.signOut()

                      window.location.replace("/login")
                    }}
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <div>
                  <span className="inline-block px-2 py-1 mx-1 font-semibold text-gray-700 rounded-md cursor-pointer hover:bg-gray-100">
                    <Link href="/login">Log in</Link>
                  </span>
                </div>
              )}
            </div>
          </PageWidth>
        </div>
      </div>

      <Component {...pageProps} />
    </QueryClientProvider>
  )
}

export default MyApp
