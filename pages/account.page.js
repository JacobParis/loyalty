import { supabase } from "./supabaseClient"
import { Account } from "./Account"
import { Avatar } from "./Avatar"
import { PageWidth } from "./PageWidth"

import { useAuth } from "./useAuth"
import { TopBar } from "./TopBar"

export default function Home({ session: defaultSession }) {
  const session = useAuth(defaultSession)

  return (
    <div>
      <div className="py-2">
        <div className="py-2">
          <PageWidth>
            <TopBar />
          </PageWidth>
        </div>
      </div>

      <header className="py-8 border-t border-b">
        <PageWidth>
          <h1 className="mb-2 text-5xl font-bold tracking-tight text-gray-900">
            Account
          </h1>
          <h2 className="tracking-wide text-gray-600">Manage account</h2>
        </PageWidth>
      </header>

      <main className="py-8">
        {session && session.user ? (
          <PageWidth>
            <Account key={session.user.id} session={session} />
            <Avatar className="rounded-md" size={150} />
          </PageWidth>
        ) : null}
      </main>
    </div>
  )
}

export async function getServerSideProps({ req }) {
  try {
    const session = await supabase.auth.api.getUserByCookie(req)

    if (!session.user) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      }
    }

    return {
      props: {
        session,
      },
    }
  } catch (err) {
    console.error(err)
    throw new Error("Unsupported error")
  }
}
