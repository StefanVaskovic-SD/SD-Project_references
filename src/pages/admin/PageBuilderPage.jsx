import { useParams, useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { PageBuilder } from '../../components/pages/PageBuilder'
import { usePage } from '../../hooks/usePages'
import { createPage, updatePage } from '../../hooks/usePages'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function PageBuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { page, loading, error } = usePage(id)

  const handleSave = async (pageData) => {
    try {
      if (id) {
        await updatePage(id, pageData)
        toast.success('Page updated successfully')
      } else {
        await createPage(pageData)
        toast.success('Page created successfully')
      }
      navigate('/admin/pages')
    } catch (error) {
      console.error('Error saving page:', error)
      toast.error('Failed to save page. Please try again.')
      throw error
    }
  }

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
            onClick={() => navigate('/admin/pages')}
            className="text-white/60 hover:text-white"
          >
            ← Back to Pages
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
            {id ? 'Edit Page' : 'New Page'}
          </h1>
          <p className="text-white/60">
            {id ? 'Update page content and settings' : 'Create a new presentation page'}
          </p>
        </div>

        <div className="max-w-4xl">
          <PageBuilder
            page={page}
            onSave={handleSave}
            onCancel={() => navigate('/admin/pages')}
          />
        </div>
      </div>
    </AdminLayout>
  )
}

