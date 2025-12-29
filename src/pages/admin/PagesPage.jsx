import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { PageList } from '../../components/pages/PageList'
import { Button } from '../../components/ui/Button'
import { usePages } from '../../hooks/usePages'
import { Plus } from 'lucide-react'

export function PagesPage() {
  const { pages, loading, error } = usePages()
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
    window.location.reload()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Pages</h1>
            <p className="text-white/60">Manage presentation pages</p>
          </div>
          <Link to="/admin/pages/new">
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2 inline" />
              New Page
            </Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-500">Error loading pages: {error}</p>
          </div>
        )}

        <PageList
          pages={pages}
          loading={loading}
          onRefresh={handleRefresh}
        />
      </div>
    </AdminLayout>
  )
}

