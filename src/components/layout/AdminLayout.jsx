import { Sidebar } from './Sidebar'

export function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <main className="lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

