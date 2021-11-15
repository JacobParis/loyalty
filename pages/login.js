import { supabase } from "../utils/supabaseClient"
import Auth from "../components/Auth"
import Link from "next/link"

import { QueryClient, QueryClientProvider } from "react-query"

const queryClient = new QueryClient()

function PageWidth({ children }) {
  return <div className="max-w-3xl mx-auto">{children}</div>
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <div className="py-2">
          <PageWidth>
            <div className="flex justify-between align-center">
              <Link href="/">Loyalty</Link>
            </div>
          </PageWidth>
        </div>

        <header className="py-8 border-t border-b">
          <PageWidth>
            <h1 className="mb-2 text-5xl font-bold tracking-tight text-gray-900">
              Log in
            </h1>
            <h2 className="tracking-wide text-gray-600">
              Enter your information to access your Loyalty account
            </h2>
          </PageWidth>
        </header>

        <main className="py-8">
          <PageWidth>
            <Auth />
          </PageWidth>
        </main>
      </div>
    </QueryClientProvider>
  )
}

export async function getServerSideProps({ req }) {
  try {
    const session = await supabase.auth.api.getUserByCookie(req)

    if (session.user) {
      return {
        redirect: {
          destination: "/account",
          permanent: false,
        },
      }
    }

    return {
      props: {},
    }
  } catch (err) {
    console.error(err)
    throw new Error("Unsupported error")
  }
}
