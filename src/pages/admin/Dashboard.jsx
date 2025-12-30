import { useState } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { useProjects } from '../../hooks/useProjects'
import { usePages } from '../../hooks/usePages'
import { FolderKanban, FileText, Edit, Trash2, Copy, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { deletePage } from '../../hooks/usePages'
import toast from 'react-hot-toast'

export function Dashboard() {
  const { projects, loading: projectsLoading } = useProjects()
  const { pages, loading: pagesLoading } = usePages()
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, page: null })

  const handleDeleteClick = (page) => {
    setDeleteDialog({ isOpen: true, page })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.page) return

    try {
      await deletePage(deleteDialog.page.id)
      toast.success('Presentation deleted successfully')
    } catch (error) {
      console.error('Error deleting presentation:', error)
      toast.error('Failed to delete presentation. Please try again.')
    } finally {
      setDeleteDialog({ isOpen: false, page: null })
    }
  }

  const handleCopyLink = (slug) => {
    const url = `${window.location.origin}/studio-direction-selected-projects/${slug}`
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard')
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return '-'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Start here</h1>
          <p className="text-white/60">This is a tool used for showcasing projects in our portfolio</p>
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
              New Presentation
            </Button>
          </Link>
        </div>

        {/* Presentations List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Presentations</h2>
          
          {pagesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-white/60">Loading presentations...</div>
            </div>
          ) : pages && pages.length === 0 ? (
            <div className="text-center py-12 border border-white/10 rounded-lg">
              <p className="text-white/60 mb-4">No presentations yet</p>
              <Link to="/admin/pages/new">
                <Button variant="primary">
                  Create First Presentation
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Name</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Slug</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Items</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Created</th>
                    <th className="text-right py-3 px-4 text-white/60 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => (
                    <tr
                      key={page.id}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-white">{page.name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <code className="text-white/80 text-sm font-mono">{page.slug}</code>
                      </td>
                      <td className="py-3 px-4 text-white/80">
                        {page.content?.length || 0} items
                      </td>
                      <td className="py-3 px-4 text-white/80 text-sm">
                        {formatDate(page.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleCopyLink(page.slug)}
                            className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded transition-colors"
                            title="Copy link"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <a
                            href={`/studio-direction-selected-projects/${page.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded transition-colors"
                            title="View presentation"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <Link to={`/admin/pages/${page.id}`}>
                            <button
                              className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded transition-colors"
                              title="Edit presentation"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(page)}
                            className="p-2 text-white/60 hover:text-red-500 hover:bg-white/5 rounded transition-colors"
                            title="Delete presentation"
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
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, page: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Presentation"
        message={`Are you sure you want to delete "${deleteDialog.page?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </AdminLayout>
  )
}

