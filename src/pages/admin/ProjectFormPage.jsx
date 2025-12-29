import { useParams, useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { ProjectForm } from '../../components/projects/ProjectForm'
import { useProject } from '../../hooks/useProjects'
import { Loader2 } from 'lucide-react'

export function ProjectFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { project, loading, error } = useProject(id)

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-500">{error}</p>
          </div>
          <button
            onClick={() => navigate('/admin/projects')}
            className="text-white/60 hover:text-white"
          >
            ← Back to Projects
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {id ? 'Edit Project' : 'New Project'}
          </h1>
          <p className="text-white/60">
            {id ? 'Update project details' : 'Create a new project'}
          </p>
        </div>

        <div className="max-w-3xl">
          <ProjectForm project={project} />
        </div>
      </div>
    </AdminLayout>
  )
}

