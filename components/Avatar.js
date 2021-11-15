import { useEffect, useRef, useState } from "react"
import { supabase } from "../utils/supabaseClient"
import Image from "next/image"
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query"

export default function Avatar({ url, className, size, onUpload }) {
  const [uploading, setUploading] = useState(false)
  const uploadInput = useRef()

  const { data: avatarUrl } = useQuery(["avatar", url], async () => {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(url)
      if (error) {
        throw error
      }

      return URL.createObjectURL(data)
    } catch (error) {
      console.log("Error downloading image: ", error.message)
    }
  })

  const clickUploadInput = () => {
    if (!uploadInput.current) return

    uploadInput.current.click()
  }

  async function uploadAvatar(event) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.")
      }

      const file = event.target.files[0]
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
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
        ) : (
          <div
            className="avatar no-image"
            style={{ height: size, width: size }}
          />
        )}
      </div>
      <div style={{ width: size }}>
        <button
          className={`border px-4 py-2 cursor-pointer rounded-md border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
          htmlFor="single"
          onClick={clickUploadInput}
        >
          {uploading ? "Uploading ..." : "Change image"}
        </button>
        <input
          ref={uploadInput}
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  )
}
