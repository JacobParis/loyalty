import { useRef, useState } from "react"
import { supabase } from "./supabaseClient"
import Image from "next/image"
import { useQuery, useMutation, useQueryClient } from "react-query"

export function Avatar({ className, size }) {
  const [uploading] = useState(false)
  const formRef = useRef()
  const uploadInput = useRef()

  const user = supabase.auth.user()

  const [avatarUrl, updateAvatarMutation] = useAvatar(user)

  return (
    <section className="mb-8">
      <h3 className="mb-2 text-2xl font-semibold"> Avatar </h3>

      <div className="mb-4">
        <div>
          <div className="mb-4">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                className={className}
                width={size}
                height={size}
              />
            ) : null}
          </div>

          <div style={{ width: size }}>
            <form
              ref={formRef}
              onSubmit={(event) => {
                event.preventDefault()
                const form = new FormData(event.target)

                updateAvatarMutation.mutate({
                  file: form.get("file"),
                })
              }}
            >
              <button
                className={`border px-4 py-2 cursor-pointer rounded-md border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                htmlFor="single"
                type="button"
                onClick={() => {
                  uploadInput.current.click()
                }}
              >
                {uploading ? "Uploading ..." : "Change image"}
              </button>

              <input
                ref={uploadInput}
                name="file"
                style={{
                  visibility: "hidden",
                  position: "absolute",
                }}
                type="file"
                id="single"
                accept="image/*"
                onChange={(e) => {
                  formRef.current.requestSubmit()
                }}
                disabled={uploading}
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function useAvatar(user) {
  const queryClient = useQueryClient()

  const { data: avatarUrl } = useQuery(["avatar"], async () => {
    try {
      const {
        data: { avatar_url },
      } = await supabase
        .from("accounts")
        .select(`avatar_url`)
        .eq("id", user.id)
        .single()

      const { data, error } = await supabase.storage
        .from("avatars")
        .download(avatar_url)

      if (error) {
        throw error
      }

      return URL.createObjectURL(data)
    } catch (error) {
      console.log("Error downloading image: ", error.message)
    }
  })

  const updateAvatarMutation = useMutation(
    async ({ file }) => {
      if (!file) {
        throw new Error("You must select an image to upload.")
      }

      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file)

      if (uploadError) {
        throw uploadError
      }

      let { error } = await supabase.from("accounts").upsert(
        {
          id: user.id,
          avatar_url: fileName,
          updated_at: new Date(),
        },
        {
          returning: "minimal", // Don't return the value after inserting
        }
      )

      if (error) {
        throw error
      }
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(["avatar"])
      },
    }
  )

  return [avatarUrl, updateAvatarMutation]
}
