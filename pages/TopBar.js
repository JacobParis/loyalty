import { supabase } from "./supabaseClient"
import Link from "next/link"
import { useAuth } from "./useAuth"

export function TopBar() {
  const session = useAuth(supabase.auth.session())

  return (
    <div className="flex justify-between align-center">
      <Link href="/">Loyalty</Link>

      {session && session.user ? (
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
  )
}
