import { PageWidth } from "./PageWidth"
import { TopBar } from "./TopBar"

export default function Home() {
  return (
    <div>
      <div className="py-2">
        <PageWidth>
          <TopBar />
        </PageWidth>
      </div>

      <header className="py-8 border-t border-b">
        <PageWidth>
          <h1 className="mb-2 text-5xl font-bold tracking-tight text-gray-900">
            Home
          </h1>
          <h2 className="tracking-wide text-gray-600">Manage account</h2>
        </PageWidth>
      </header>
    </div>
  )
}
