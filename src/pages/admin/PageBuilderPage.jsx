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
        toast.success('Presentation updated successfully')
      } else {
        await createPage(pageData)
        toast.success('Presentation created successfully')
      }
      navigate('/admin')
    } catch (error) {
      console.error('Error saving presentation:', error)
      toast.error('Failed to save presentation. Please try again.')
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
            onClick={() => navigate('/admin')}
            className="text-white/60 hover:text-white"
          >
            ← Back to Presentations
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
            {id ? 'Edit Presentation' : 'New Presentation'}
          </h1>
          <p className="text-white/60">
            {id ? 'Update presentation content and settings' : 'Start creating a presentation'}
          </p>
        </div>

        <div className="max-w-4xl">
          <PageBuilder
            page={page}
            onSave={handleSave}
            onCancel={() => navigate('/admin')}
          />
        </div>
      </div>
    </AdminLayout>
  )
}

