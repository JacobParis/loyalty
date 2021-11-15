import { useState } from "react"
import { supabase } from "./supabaseClient"
import { useAuth } from "./useAuth"
import InputGroup from "./InputGroup"

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  useAuth()

  const handleLogin = async (email) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signIn({ email })
      if (error) throw error
      alert("Check your email for the login link!")
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex row flex-center">
      <div className="col-6">
        <p className="mb-4">Sign in via magic link with your email below</p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleLogin(email)
          }}
        >
          <InputGroup
            label="Email"
            type="email"
            className="mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="mb-4">
            <button
              className={`border px-4 py-2 cursor-pointer rounded-md border-gray-300  ${
                loading
                  ? "bg-gray-100 text-gray-500"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              } `}
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading ..." : "Send magic link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
