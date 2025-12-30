import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { ProjectList } from '../../components/projects/ProjectList'
import { Button } from '../../components/ui/Button'
import { useProjects } from '../../hooks/useProjects'
import { Plus } from 'lucide-react'

export function ProjectsPage() {
  const { projects, loading, error } = useProjects()
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
    // Force re-fetch by updating key
    window.location.reload()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
            <p className="text-white/60">Manage SD project portfolio</p>
          </div>
          <Link to="/admin/projects/new">
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2 inline" />
              New Project
            </Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-500">Error loading projects: {error}</p>
          </div>
        )}

        <ProjectList
          projects={projects}
          loading={loading}
          onRefresh={handleRefresh}
        />
      </div>
    </AdminLayout>
  )
}

