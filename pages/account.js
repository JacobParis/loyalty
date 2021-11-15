import { supabase } from "../utils/supabaseClient"
import Account from "../components/Account"
import Link from "next/link"

import { QueryClient, QueryClientProvider } from "react-query"

const queryClient = new QueryClient()

function PageWidth({ children }) {
  return <div className="max-w-3xl mx-auto">{children}</div>
}
import { useAuth } from "../components/useAuth"
import TopBar from "../components/TopBar"

export default function Home({ session: defaultSession }) {
  const session = useAuth(defaultSession)

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <div className="py-2">
          <div className="py-2">
            <PageWidth>
              <TopBar />
            </PageWidth>
          </div>
        </div>

        <header className="border-t border-b py-8">
          <PageWidth>
            <h1 className="text-5xl tracking-tight font-bold text-gray-900 mb-2">
              Account
            </h1>
            <h2 className="tracking-wide  text-gray-600">Manage account</h2>
          </PageWidth>
        </header>

        <main className="py-8">
          <PageWidth>
            {session && session.user ? (
              <Account key={session.user.id} session={session} />
            ) : null}
          </PageWidth>
        </main>
      </div>
    </QueryClientProvider>
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
