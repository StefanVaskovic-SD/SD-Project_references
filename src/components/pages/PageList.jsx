import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit, Trash2, Copy, ExternalLink } from 'lucide-react'
import { Button } from '../ui/Button'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { deletePage } from '../../hooks/usePages'
import toast from 'react-hot-toast'

export function PageList({ pages, loading, onRefresh }) {
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, page: null })
  const [copiedSlug, setCopiedSlug] = useState(null)

  const handleDeleteClick = (page) => {
    setDeleteDialog({ isOpen: true, page })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.page) return

    try {
      await deletePage(deleteDialog.page.id)
      toast.success('Presentation deleted successfully')
      onRefresh()
    } catch (error) {
      console.error('Error deleting page:', error)
      toast.error('Failed to delete presentation. Please try again.')
    } finally {
      setDeleteDialog({ isOpen: false, page: null })
    }
  }

  const handleCopyLink = (slug) => {
    const url = `${window.location.origin}/studio-direction-selected-projects/${slug}`
    navigator.clipboard.writeText(url)
    setCopiedSlug(slug)
    toast.success('Link copied to clipboard')
    setTimeout(() => setCopiedSlug(null), 2000)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white/60">Loading presentations...</div>
      </div>
    )
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60 mb-4">No presentations yet</p>
        <Link to="/admin/pages/new">
          <Button variant="primary">
            Create First Presentation
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
              <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Name</th>
              <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Slug</th>
              <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Projects</th>
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
                  {page.content?.filter(item => item.type === 'project').length || 0} {page.content?.filter(item => item.type === 'project').length === 1 ? 'project' : 'projects'}
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
    </>
  )
}

