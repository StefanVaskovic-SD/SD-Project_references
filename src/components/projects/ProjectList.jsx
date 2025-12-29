import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit, Trash2, Plus } from 'lucide-react'
import { Button } from '../ui/Button'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { deleteProject } from '../../hooks/useProjects'
import { deleteFile } from '../../lib/storage'
import toast from 'react-hot-toast'

export function ProjectList({ projects, loading, onRefresh }) {
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, project: null })

  const handleDeleteClick = (project) => {
    setDeleteDialog({ isOpen: true, project })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.project) return

    try {
      // Delete images from storage
      if (deleteDialog.project.slides && deleteDialog.project.slides.length > 0) {
        const deletePromises = deleteDialog.project.slides.map((url) => {
          // Extract path from URL
          const pathMatch = url.match(/projects\/([^/]+)\/(.+)$/)
          if (pathMatch) {
            const [, projectId, fileName] = pathMatch
            return deleteFile(`projects/${projectId}/${fileName}`)
          }
          return Promise.resolve()
        })
        await Promise.all(deletePromises)
      }

      // Delete project from Firestore
      await deleteProject(deleteDialog.project.id)
      toast.success('Project deleted successfully')
      onRefresh()
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project. Please try again.')
    } finally {
      setDeleteDialog({ isOpen: false, project: null })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white/60">Loading projects...</div>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60 mb-4">No projects yet</p>
        <Link to="/admin/projects/new">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2 inline" />
            Create First Project
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Thumbnail</th>
              <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Name</th>
              <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Type</th>
              <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Industry</th>
              <th className="text-right py-3 px-4 text-white/60 font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                className="border-b border-white/10 hover:bg-white/5 transition-colors"
              >
                <td className="py-3 px-4">
                  {project.slides && project.slides.length > 0 ? (
                    <img
                      src={project.slides[0]}
                      alt={project.name}
                      className="w-16 h-16 object-cover rounded border border-white/10"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-white/5 rounded border border-white/10 flex items-center justify-center">
                      <span className="text-white/40 text-xs">No image</span>
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-white">{project.name}</div>
                </td>
                <td className="py-3 px-4 text-white/80">{project.type || '-'}</td>
                <td className="py-3 px-4 text-white/80">{project.industry || '-'}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/admin/projects/${project.id}`}>
                      <button
                        className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded transition-colors"
                        title="Edit project"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(project)}
                      className="p-2 text-white/60 hover:text-red-500 hover:bg-white/5 rounded transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, project: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteDialog.project?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  )
}

