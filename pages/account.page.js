import { supabase } from "./supabaseClient"
import { Account } from "./Account"
import { Avatar } from "./Avatar"
import { PageWidth } from "./PageWidth"

export default function Home({ user }) {
  return (
    <div>
      <header className="py-8 border-t border-b">
        <PageWidth>
          <h1 className="mb-2 text-5xl font-bold tracking-tight text-gray-900">
            Account
          </h1>
          <h2 className="tracking-wide text-gray-600">Manage account</h2>
        </PageWidth>
      </header>

      <main className="py-8">
        {user ? (
          <PageWidth>
            <Account key={user.id} />
            <Avatar className="rounded-md" size={150} />
          </PageWidth>
        ) : null}
      </main>
    </div>
  )
}

export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req)

  if (!user) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  return { props: { user } }
}
