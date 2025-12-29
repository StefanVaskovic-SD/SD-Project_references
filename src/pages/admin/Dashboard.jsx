import { AdminLayout } from '../../components/layout/AdminLayout'
import { useProjects } from '../../hooks/useProjects'
import { usePages } from '../../hooks/usePages'
import { FolderKanban, FileText, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

export function Dashboard() {
  const { projects, loading: projectsLoading } = useProjects()
  const { pages, loading: pagesLoading } = usePages()

  const stats = [
    {
      label: 'Total Projects',
      value: projects?.length || 0,
      icon: FolderKanban,
      link: '/admin/projects',
    },
    {
      label: 'Total Pages',
      value: pages?.length || 0,
      icon: FileText,
      link: '/admin/pages',
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-white/60">Welcome to Studio Direction admin panel</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            const isLoading = stat.label === 'Total Projects' ? projectsLoading : pagesLoading

            return (
              <Link
                key={stat.label}
                to={stat.link}
                className="block p-6 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm mb-1">{stat.label}</p>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                        <span className="text-2xl font-bold text-white">Loading...</span>
                      </div>
                    ) : (
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    )}
                  </div>
                  <Icon className="w-12 h-12 text-white/20" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/admin/projects/new">
            <Button variant="primary" className="w-full flex items-center justify-center">
              <FolderKanban className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </Link>
          <Link to="/admin/pages/new">
            <Button variant="primary" className="w-full flex items-center justify-center">
              <FileText className="w-4 h-4 mr-2" />
              New Page
            </Button>
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}

