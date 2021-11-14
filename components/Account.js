import { useState, useEffect } from "react"
import { supabase } from "../utils/supabaseClient"
import Avatar from "./Avatar"
import { useUID } from "react-uid"

function InputGroup({ label, className, disabled = false, ...props }) {
  const id = useUID()

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1 text-gray-700 font-semibold text-sm block"
      >
        {label}
      </label>
      <input
        id={id}
        className={`block w-56 rounded-md border-gray-300 ${
          disabled ? "bg-gray-100 text-gray-500" : "text-gray-700"
        }`}
        type="text"
        disabled={disabled}
        {...props}
      />
    </div>
  )
}
export default function Account({ session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  useEffect(() => {
    getAccount()
  }, [session])

  async function getAccount() {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      let { data, error, status } = await supabase
        .from("accounts")
        .select(`username, website, avatar_url`)
        .eq("id", user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateAccount({ username, website, avatar_url }) {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from("accounts").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      })

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-2"> Profile </h3>

        <p className="text-base text-gray-500 mb-4 max-w-2xl">
          The following information will be used to set up Git configuration.
        </p>

        <InputGroup
          label="Name"
          className="mb-4"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
        />

        <InputGroup
          label="Email"
          type="email"
          className="mb-4"
          value={session.user.email}
          disabled={true}
        />

        <InputGroup
          label="Website"
          className="mb-4"
          type="url"
          value={website || ""}
          onChange={(e) => setWebsite(e.target.value)}
        />

        <div className="mb-4">
          <button
            className={`border px-4 py-2 cursor-pointer rounded-md border-gray-300  ${
              loading
                ? "bg-gray-100 text-gray-500"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            } `}
            onClick={() => updateAccount({ username, website, avatar_url })}
            disabled={loading}
          >
            {loading ? "Loading ..." : "Update profile"}
          </button>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-2"> Avatar </h3>

        <div className="mb-4">
          <Avatar
            className="rounded-md"
            url={avatar_url}
            size={150}
            onUpload={(url) => {
              setAvatarUrl(url)
              updateAccount({ username, website, avatar_url: url })
            }}
          />
        </div>
      </section>

      <div>
        <button
          className="button block"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
