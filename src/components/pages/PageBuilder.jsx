import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { ContentItem } from './ContentItem'
import { ProjectSelector } from './ProjectSelector'
import { SlideBreakForm } from './SlideBreakForm'
import { ProjectSlidesManager } from './ProjectSlidesManager'
import { useProjects } from '../../hooks/useProjects'
import { Plus, Loader2 } from 'lucide-react'

export function PageBuilder({ page = null, onSave, onCancel }) {
  const { projects } = useProjects()
  const [pageName, setPageName] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState([])
  const [errors, setErrors] = useState({})
  const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState(false)
  const [isSlideBreakFormOpen, setIsSlideBreakFormOpen] = useState(false)
  const [editingSlideBreak, setEditingSlideBreak] = useState(null)
  const [editingProjectSlides, setEditingProjectSlides] = useState(null)
  const [loading, setLoading] = useState(false)
  
  // Start slide settings
  const [startSlideVideoUrl, setStartSlideVideoUrl] = useState('https://customer-7ahfkoeo2pbpo29s.cloudflarestream.com/b28021ef74c9a19e977887d1517205ca/manifest/video.m3u8')
  const [startSlideTitle, setStartSlideTitle] = useState('Portfolio')
  const [startSlideFontWeight, setStartSlideFontWeight] = useState('500')
  const [startSlideFontSize, setStartSlideFontSize] = useState('8xl')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (page) {
      setPageName(page.name || '')
      setSlug(page.slug || '')
      // Initialize selectedSlides for projects that don't have it
      const contentWithSlides = (page.content || []).map(item => {
        if (item.type === 'project' && !item.selectedSlides) {
          // For existing projects without selectedSlides, we'll set it when we have project data
          return item
        }
        return item
      })
      setContent(contentWithSlides)
      
      // Load start slide settings
      if (page.startSlide) {
        setStartSlideVideoUrl(page.startSlide.videoUrl || 'https://customer-7ahfkoeo2pbpo29s.cloudflarestream.com/b28021ef74c9a19e977887d1517205ca/manifest/video.m3u8')
        setStartSlideTitle(page.startSlide.title || 'Portfolio')
        setStartSlideFontWeight(page.startSlide.fontWeight || '500')
        setStartSlideFontSize(page.startSlide.fontSize || '8xl')
      }
    }
  }, [page])

  // Auto-generate slug from page name (only for new pages)
  useEffect(() => {
    if (!page && pageName) {
      const generatedSlug = pageName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
      setSlug(generatedSlug)
    }
  }, [pageName, page])

  const getProjectById = (projectId) => {
    return projects.find((p) => p.id === projectId)
  }

  const handleAddProject = (project) => {
    const newItem = {
      id: `project-${Date.now()}`,
      type: 'project',
      projectId: project.id,
      order: content.length,
      selectedSlides: project.slides || [], // Default: all slides selected
    }
    setContent([...content, newItem])
  }

  const handleAddSlideBreak = (data) => {
    if (editingSlideBreak !== null) {
      // Update existing slide break
      setContent((prev) =>
        prev.map((item, idx) =>
          idx === editingSlideBreak
            ? { ...item, title: data.title, text: data.text }
            : item
        )
      )
      setEditingSlideBreak(null)
    } else {
      // Add new slide break
      const newItem = {
        id: `break-${Date.now()}`,
        type: 'slideBreak',
        title: data.title,
        text: data.text,
        order: content.length,
      }
      setContent([...content, newItem])
    }
    setIsSlideBreakFormOpen(false)
  }

  const handleDeleteItem = (id) => {
    setContent((prev) => {
      const filtered = prev.filter((item) => item.id !== id)
      // Reorder items
      return filtered.map((item, index) => ({ ...item, order: index }))
    })
  }

  const handleEditSlideBreak = (item) => {
    const index = content.findIndex((c) => c.id === item.id)
    setEditingSlideBreak(index)
    setIsSlideBreakFormOpen(true)
  }

  const handleEditProjectSlides = (item) => {
    setEditingProjectSlides(item)
  }

  const handleSaveProjectSlides = (selectedSlides) => {
    if (!editingProjectSlides) return

    setContent((prev) =>
      prev.map((item) =>
        item.id === editingProjectSlides.id
          ? { ...item, selectedSlides }
          : item
      )
    )
    setEditingProjectSlides(null)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setContent((items) => {
        const oldIndex = items.findIndex((item) => (item.id || items.indexOf(item)) === active.id)
        const newIndex = items.findIndex((item) => (item.id || items.indexOf(item)) === over.id)
        if (oldIndex === -1 || newIndex === -1) return items
        const newItems = arrayMove(items, oldIndex, newIndex)
        // Update order
        return newItems.map((item, index) => ({ ...item, order: index }))
      })
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!pageName.trim()) {
      newErrors.pageName = 'Page name is required'
    }

    if (!slug.trim()) {
      newErrors.slug = 'URL slug is required'
    } else if (!/^[a-z0-9-]+$/.test(slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
    }

    if (content.length === 0) {
      newErrors.content = 'At least one content item is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setLoading(true)
    try {
      await onSave({
        name: pageName.trim(),
        slug: slug.trim(),
        content: content.map((item, index) => ({
          ...item,
          order: index,
        })),
        startSlide: {
          videoUrl: startSlideVideoUrl.trim(),
          title: startSlideTitle.trim(),
          fontWeight: startSlideFontWeight,
          fontSize: startSlideFontSize,
        },
      })
    } catch (error) {
      console.error('Error saving page:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6" onDragOver={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Presentation name"
            value={pageName}
            onChange={(e) => {
              setPageName(e.target.value)
              if (errors.pageName) setErrors((prev) => ({ ...prev, pageName: '' }))
            }}
            placeholder="Real estate all projects"
            required
            error={errors.pageName}
          />
          <div className="mt-2 p-3 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-sm text-white/80 leading-relaxed">
              Use name of the client or general name (for ex. Real estate all projects)
            </p>
          </div>
        </div>

        <div>
          <Input
            label="URL Slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              if (errors.slug) setErrors((prev) => ({ ...prev, slug: '' }))
            }}
            placeholder="real-estate-portfolio"
            required
            error={errors.slug}
          />
          <div className="mt-2 p-3 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-sm text-white/80 leading-relaxed">
              Use something unique &lt;client name&gt;-real-estate-portfolio
            </p>
          </div>
        </div>
      </div>

      {slug && (
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
          <p className="text-sm text-white/60 mb-1">Preview URL:</p>
          <p className="text-white font-mono text-sm">
            /studio-direction-selected-projects/{slug}
          </p>
        </div>
      )}

      {/* Start Slide Settings */}
      <div className="space-y-4 p-6 bg-white/5 border border-white/10 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-4">Start Slide Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Video URL"
            value={startSlideVideoUrl}
            onChange={(e) => setStartSlideVideoUrl(e.target.value)}
            placeholder="https://..."
            helpText="HLS video URL for the opening slide"
          />

          <Input
            label="Title"
            value={startSlideTitle}
            onChange={(e) => setStartSlideTitle(e.target.value)}
            placeholder="Portfolio"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Font Weight"
            value={startSlideFontWeight}
            onChange={(e) => setStartSlideFontWeight(e.target.value)}
            options={[
              { value: '400', label: 'Regular (400)' },
              { value: '500', label: 'Medium (500)' },
              { value: '600', label: 'Semi Bold (600)' },
              { value: '700', label: 'Bold (700)' },
            ]}
          />

          <Select
            label="Font Size"
            value={startSlideFontSize}
            onChange={(e) => setStartSlideFontSize(e.target.value)}
            options={[
              { value: '6xl', label: '6xl' },
              { value: '7xl', label: '7xl' },
              { value: '8xl', label: '8xl' },
              { value: '9xl', label: '9xl' },
            ]}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-white">
            Content <span className="text-white/60">*</span>
          </label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsProjectSelectorOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              Add Project
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingSlideBreak(null)
                setIsSlideBreakFormOpen(true)
              }}
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              Add Slide Break
            </Button>
          </div>
        </div>

        <div className="mb-4 p-4 bg-white/5 border border-white/10 rounded-lg">
          <ul className="text-sm text-white/80 leading-relaxed space-y-2 list-disc list-inside">
            <li>Follow the structure when creating new presentation: Opening slide, Break slide if there will be more than one category (for ex. product and website & brand).</li>
            <li>Add as much projects you'd like to showcase; select slides for each project.</li>
            <li>Click Save to generate the link (it can be updated afterwards on the edit icon in the list of presentations)</li>
          </ul>
        </div>

        {errors.content && (
          <p className="text-sm text-red-500 mb-2">{errors.content}</p>
        )}

        {content.length === 0 ? (
          <div className="border border-dashed border-white/20 rounded-lg p-12 text-center">
            <p className="text-white/60 mb-4">No content items yet</p>
            <p className="text-white/40 text-sm">
              Add a project or slide break to get started
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={content.map((item, idx) => item.id || idx)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {content.map((item, index) => (
                  <ContentItem
                    key={item.id || index}
                    item={item}
                    index={index}
                    project={item.type === 'project' ? getProjectById(item.projectId) : null}
                    onDelete={handleDeleteItem}
                    onEdit={item.type === 'slideBreak' ? handleEditSlideBreak : null}
                    onEditSlides={item.type === 'project' ? handleEditProjectSlides : null}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="flex-1 md:flex-initial"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
              Saving...
            </>
          ) : (
            'Save'
          )}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>

      <ProjectSelector
        isOpen={isProjectSelectorOpen}
        onClose={() => setIsProjectSelectorOpen(false)}
        onSelect={handleAddProject}
        excludeIds={content
          .filter((item) => item.type === 'project')
          .map((item) => item.projectId)}
      />

      {isSlideBreakFormOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-black border border-white/20 rounded-lg max-w-2xl w-full p-6">
            <SlideBreakForm
              title={editingSlideBreak !== null ? content[editingSlideBreak]?.title : ''}
              text={editingSlideBreak !== null ? content[editingSlideBreak]?.text : ''}
              onSave={handleAddSlideBreak}
              onCancel={() => {
                setIsSlideBreakFormOpen(false)
                setEditingSlideBreak(null)
              }}
              isEditing={editingSlideBreak !== null}
            />
          </div>
        </div>
      )}

    </form>

    {editingProjectSlides && (
      <ProjectSlidesManager
        isOpen={!!editingProjectSlides}
        onClose={() => setEditingProjectSlides(null)}
        project={getProjectById(editingProjectSlides.projectId)}
        selectedSlides={editingProjectSlides.selectedSlides}
        onSave={handleSaveProjectSlides}
      />
    )}
  </>
  )
}

