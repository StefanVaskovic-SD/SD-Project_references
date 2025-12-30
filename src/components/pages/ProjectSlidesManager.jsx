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
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X, Eye, EyeOff } from 'lucide-react'
import { Button } from '../ui/Button'

function SortableSlideItem({ slide, index, isSelected, onToggle, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-3 p-3 border rounded-lg
        ${isSelected 
          ? 'border-white/40 bg-white/10' 
          : 'border-white/10 bg-white/5 opacity-50'
        }
      `}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 text-white/60 hover:text-white cursor-grab active:cursor-grabbing"
        title="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex-1 flex items-center gap-3">
        <img
          src={slide}
          alt={`Slide ${index + 1}`}
          className="w-16 h-16 object-cover rounded border border-white/10"
        />
        <span className="text-white/80 text-sm">Slide {index + 1}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggle}
          className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded transition-colors"
          title={isSelected ? 'Hide slide' : 'Show slide'}
        >
          {isSelected ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </button>
        {!isSelected && (
          <button
            onClick={onDelete}
            className="p-2 text-white/60 hover:text-red-500 hover:bg-white/5 rounded transition-colors"
            title="Remove slide"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export function ProjectSlidesManager({ 
  isOpen, 
  onClose, 
  project, 
  selectedSlides = null,
  onSave 
}) {
  const [allSlides, setAllSlides] = useState([])
  const [selectedSlideUrls, setSelectedSlideUrls] = useState([])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (project && project.slides) {
      setAllSlides(project.slides)
      // If selectedSlides exists, use it, otherwise select all slides
      if (selectedSlides && selectedSlides.length > 0) {
        setSelectedSlideUrls(selectedSlides)
      } else {
        setSelectedSlideUrls(project.slides)
      }
    }
  }, [project, selectedSlides])

  const handleToggleSlide = (slideUrl) => {
    if (selectedSlideUrls.includes(slideUrl)) {
      // Remove from selected
      setSelectedSlideUrls(prev => prev.filter(url => url !== slideUrl))
    } else {
      // Add to selected
      setSelectedSlideUrls(prev => [...prev, slideUrl])
    }
  }

  const handleDeleteSlide = (slideUrl) => {
    setAllSlides(prev => prev.filter(url => url !== slideUrl))
    setSelectedSlideUrls(prev => prev.filter(url => url !== slideUrl))
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setSelectedSlideUrls((items) => {
        const oldIndex = items.findIndex((url) => url === active.id)
        const newIndex = items.findIndex((url) => url === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSave = () => {
    if (onSave) {
      onSave(selectedSlideUrls)
    }
    onClose()
  }

  const handleSelectAll = () => {
    setSelectedSlideUrls([...allSlides])
  }

  const handleDeselectAll = () => {
    setSelectedSlideUrls([])
  }

  if (!isOpen || !project) return null

  const selectedSlidesList = allSlides.filter(slide => selectedSlideUrls.includes(slide))
  const unselectedSlidesList = allSlides.filter(slide => !selectedSlideUrls.includes(slide))

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-white/20 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white mb-2">
            Manage Slides: {project.name}
          </h2>
          <p className="text-white/60 text-sm">
            Select slides to include and reorder them. Hidden slides won't appear in the presentation.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Selected Slides */}
          {selectedSlidesList.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-white">
                  Selected Slides ({selectedSlidesList.length})
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleSelectAll}
                    className="text-sm"
                  >
                    Select All
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleDeselectAll}
                    className="text-sm"
                  >
                    Deselect All
                  </Button>
                </div>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={selectedSlidesList}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {selectedSlidesList.map((slide, index) => (
                      <SortableSlideItem
                        key={slide}
                        slide={slide}
                        index={index}
                        isSelected={true}
                        onToggle={() => handleToggleSlide(slide)}
                        onDelete={() => handleDeleteSlide(slide)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {/* Unselected Slides */}
          {unselectedSlidesList.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-white mb-3">
                Hidden Slides ({unselectedSlidesList.length})
              </h3>
              <div className="space-y-2">
                {unselectedSlidesList.map((slide, index) => (
                  <SortableSlideItem
                    key={slide}
                    slide={slide}
                    index={allSlides.indexOf(slide)}
                    isSelected={false}
                    onToggle={() => handleToggleSlide(slide)}
                    onDelete={() => handleDeleteSlide(slide)}
                  />
                ))}
              </div>
            </div>
          )}

          {allSlides.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60">No slides available for this project.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

