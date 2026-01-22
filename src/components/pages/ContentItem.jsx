import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X } from 'lucide-react'
import { Button } from '../ui/Button'

export function ContentItem({ 
  item, 
  index, 
  project = null, 
  onDelete, 
  onEdit,
  onEditSlides
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id || index })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-white/20 rounded-lg p-4 bg-white/5 hover:bg-white/10 transition-colors"
    >
      <div className="flex items-start gap-4">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="mt-1 p-1 text-white/60 hover:text-white cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="flex-1">
          {item.type === 'project' ? (
            <div className="flex-1">
              {project ? (
                <>
                  <div className="flex items-center gap-1 flex-wrap">
                    <h4 className="font-medium text-white">{project.name}</h4>
                    {project.type && (
                      <>
                        <span className="text-sm text-white/60">,</span>
                        <span className="text-sm text-white/60">{project.type}</span>
                      </>
                    )}
                    {project.industry && (
                      <>
                        <span className="text-sm text-white/60">,</span>
                        <span className="text-sm text-white/60">{project.industry}</span>
                      </>
                    )}
                  </div>
                  {project.slides && project.slides.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-2">
                        {(() => {
                          // Get slides to display - handle both old (URLs) and new (indices) format
                          let slidesToShow = []
                          if (item.selectedSlides && item.selectedSlides.length > 0) {
                            const firstItem = item.selectedSlides[0]
                            if (typeof firstItem === 'string' && firstItem.startsWith('http')) {
                              // Old format: URLs
                              slidesToShow = item.selectedSlides.filter(url => project.slides.includes(url))
                            } else if (typeof firstItem === 'number') {
                              // New format: indices
                              slidesToShow = item.selectedSlides
                                .map(index => project.slides[index])
                                .filter(slide => slide !== undefined)
                            }
                          } else {
                            // No selectedSlides - show all
                            slidesToShow = project.slides
                          }
                          return slidesToShow.slice(0, 3).map((slide, idx) => (
                            <img
                              key={idx}
                              src={slide}
                              alt={`${project.name} slide ${idx + 1}`}
                              className="w-16 h-16 object-cover rounded border border-white/10"
                            />
                          ))
                        })()}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-white/60">Loading project...</p>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center">
              <h4 className="font-medium text-white">
                <span className="text-white/60">Brake slide:</span> {item.title || 'Untitled Break'}
              </h4>
              {item.text && (
                <p className="text-white/60 text-sm ml-2">{item.text}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {item.type === 'project' && onEditSlides && project && (
            <Button
              variant="secondary"
              onClick={() => onEditSlides(item)}
              className="text-sm"
            >
              Manage Slides
            </Button>
          )}
          {item.type === 'slideBreak' && onEdit && (
            <Button
              variant="secondary"
              onClick={() => onEdit(item)}
              className="text-sm"
            >
              Edit
            </Button>
          )}
          <button
            onClick={() => onDelete(item.id || index)}
            className="p-2 text-white/60 hover:text-red-500 hover:bg-white/5 rounded transition-colors"
            title="Remove item"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

