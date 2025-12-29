import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X, FolderKanban, FileText } from 'lucide-react'
import { Button } from '../ui/Button'

export function ContentItem({ 
  item, 
  index, 
  project = null, 
  onDelete, 
  onEdit 
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
          {...attributes}
          {...listeners}
          className="mt-1 p-1 text-white/60 hover:text-white cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="flex-1">
          {item.type === 'project' ? (
            <div className="flex items-center gap-4">
              <FolderKanban className="w-5 h-5 text-white/60" />
              <div className="flex-1">
                {project ? (
                  <>
                    <h4 className="font-medium text-white mb-1">{project.name}</h4>
                    <div className="flex gap-4 text-sm text-white/60">
                      {project.type && <span>{project.type}</span>}
                      {project.industry && <span>{project.industry}</span>}
                    </div>
                    {project.slides && project.slides.length > 0 && (
                      <div className="mt-2 flex gap-2">
                        {project.slides.slice(0, 3).map((slide, idx) => (
                          <img
                            key={idx}
                            src={slide}
                            alt={`${project.name} slide ${idx + 1}`}
                            className="w-16 h-16 object-cover rounded border border-white/10"
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-white/60">Loading project...</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <FileText className="w-5 h-5 text-white/60" />
              <div className="flex-1">
                <h4 className="font-medium text-white mb-1">{item.title || 'Untitled Break'}</h4>
                {item.text && (
                  <p className="text-white/60 text-sm">{item.text}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
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

