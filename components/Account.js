import { useMutation, useQuery } from "react-query"
import { supabase } from "../utils/supabaseClient"
import Avatar from "./Avatar"
import InputGroup from "./InputGroup"

export default function Account({ session }) {
  const user = supabase.auth.user()

  const [data, updateProfileMutation] = useAccount(user)

  return (
    <div>
      <section className="mb-8">
        <h3 className="mb-2 text-2xl font-semibold"> Profile </h3>

        <p className="max-w-2xl mb-4 text-base text-gray-500">
          The following information will be used to set up Git configuration.
        </p>

        {data ? (
          <form
            onSubmit={(event) => {
              const form = new FormData(event.target)

              updateProfileMutation.mutate({
                username: form.get("username"),
                website: form.get("website"),
              })
            }}
          >
            <InputGroup
              label="Name"
              name="username"
              className="mb-4"
              defaultValue={data.username || ""}
            />

            <InputGroup
              label="Email"
              type="email"
              className="mb-4"
              defaultValue={session.user.email}
              disabled={true}
            />

            <InputGroup
              label="Website"
              name="website"
              className="mb-4"
              type="url"
              defaultValue={data.website || ""}
            />

            <div className="mb-4">
              <button
                className={`border px-4 py-2 cursor-pointer rounded-md border-gray-300  ${
                  isLoading
                    ? "bg-gray-100 text-gray-500"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                } `}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Loading…" : "Update profile"}
              </button>
            </div>
          </form>
        ) : null}
      </section>

      <section className="mb-8">
        <h3 className="mb-2 text-2xl font-semibold"> Avatar </h3>

        <div className="mb-4">
          {data ? (
            <Avatar
              className="rounded-md"
              name="avatar"
              url={data.avatar_url}
              size={150}
            />
          ) : null}
        </div>
      </section>
    </div>
  )
}

function useAccount(user) {
  const { data, isLoading } = useQuery(["account"], async () => {
    let { data, error, status } = await supabase
      .from("accounts")
      .select(`username, website, avatar_url`)
      .eq("id", user.id)
      .single()

    if (error && status !== 406) {
      throw error
    }

    return data
  })

  const updateProfileMutation = useMutation(
    async ({ username, website } = {}) => {
      const user = supabase.auth.user()

      const updates = {
        id: user.id,
        username,
        website,
        updated_at: new Date(),
      }

      let { error } = await supabase.from("accounts").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      })

      if (error) {
        throw error
      }
    }
  )

  return [data, updateProfileMutation]
}
