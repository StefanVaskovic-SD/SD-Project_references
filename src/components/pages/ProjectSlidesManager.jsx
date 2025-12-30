import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '../ui/Button'

function SlideItem({ slide, index, isSelected, onToggle }) {
  return (
    <div
      className={`
        flex items-center gap-3 p-3 border rounded-lg
        ${isSelected 
          ? 'border-white/40 bg-white/10' 
          : 'border-white/10 bg-white/5 opacity-50'
        }
      `}
    >
      <div className="flex-1 flex items-center gap-3">
        <img
          src={slide}
          alt={`Slide ${index + 1}`}
          className="w-16 h-16 object-cover rounded border border-white/10"
        />
        <span className="text-white/80 text-sm">Slide {index + 1}</span>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onToggle()
        }}
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded transition-colors"
        title={isSelected ? 'Hide slide' : 'Show slide'}
      >
        {isSelected ? (
          <Eye className="w-4 h-4" />
        ) : (
          <EyeOff className="w-4 h-4" />
        )}
      </button>
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

  const handleSave = (e) => {
    e?.preventDefault()
    e?.stopPropagation()
    if (onSave) {
      onSave(selectedSlideUrls)
    }
    onClose()
  }

  if (!isOpen || !project) return null

  const selectedSlidesList = allSlides.filter(slide => selectedSlideUrls.includes(slide))
  const unselectedSlidesList = allSlides.filter(slide => !selectedSlideUrls.includes(slide))

  const handleModalClick = (e) => {
    e.stopPropagation()
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      onDragOver={(e) => e.preventDefault()}
    >
      <div 
        className="bg-black border border-white/20 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={handleModalClick}
        onDragOver={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white mb-2">
            Manage Slides: {project.name}
          </h2>
          <p className="text-white/60 text-sm">
            Select slides to include. Hidden slides won't appear in the presentation.
          </p>
        </div>

        {/* Content */}
        <div 
          className="flex-1 overflow-y-auto p-6 space-y-4"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
        >
          {/* Selected Slides */}
          {selectedSlidesList.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-white mb-3">
                Selected Slides ({selectedSlidesList.length})
              </h3>
              <div 
                className="space-y-2"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
              >
                {selectedSlidesList.map((slide, index) => (
                  <SlideItem
                    key={slide}
                    slide={slide}
                    index={index}
                    isSelected={true}
                    onToggle={() => handleToggleSlide(slide)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Unselected Slides */}
          {unselectedSlidesList.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-white mb-3">
                Hidden Slides ({unselectedSlidesList.length})
              </h3>
              <div 
                className="space-y-2"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
              >
                {unselectedSlidesList.map((slide, index) => (
                  <SlideItem
                    key={slide}
                    slide={slide}
                    index={allSlides.indexOf(slide)}
                    isSelected={false}
                    onToggle={() => handleToggleSlide(slide)}
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
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} type="button">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

