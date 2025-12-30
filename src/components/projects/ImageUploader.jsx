import { useState, useCallback, useEffect } from 'react'
import { X, GripVertical, Upload } from 'lucide-react'
import { Button } from '../ui/Button'
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

const MAX_IMAGES = 3
const MIN_IMAGES = 1

function SortableImage({ image, index, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group border border-white/20 rounded-lg overflow-hidden bg-black"
    >
      <img
        src={image.preview}
        alt={`Preview ${index + 1}`}
        className="w-full h-48 object-cover"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            {...attributes}
            {...listeners}
            className="p-2 bg-white/10 hover:bg-white/20 rounded text-white cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <GripVertical className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(image.id)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded text-white"
            title="Delete image"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
        {index + 1}
      </div>
    </div>
  )
}

export function ImageUploader({ label, images = [], existingImages = [], onChange, onExistingImagesChange, error }) {
  // Initialize with existing images (URLs) converted to preview format
  const [localImages, setLocalImages] = useState(() => {
    const existing = existingImages.map((url, index) => ({
      id: `existing-${index}`,
      url,
      preview: url,
      isExisting: true,
    }))
    const newFiles = images.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      isExisting: false,
    }))
    return [...existing, ...newFiles]
  })
  const [dragError, setDragError] = useState('')

  // Update localImages when existingImages change (but preserve new files)
  useEffect(() => {
    setLocalImages((prev) => {
      const existing = existingImages.map((url, index) => ({
        id: `existing-${index}`,
        url,
        preview: url,
        isExisting: true,
      }))
      const newFiles = prev.filter((img) => !img.isExisting)
      return [...existing, ...newFiles]
    })
  }, [existingImages])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files)
    setDragError('')

    const newImages = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }))

    const totalImages = localImages.length + newImages.length

    if (totalImages > MAX_IMAGES) {
      setDragError(`Maximum ${MAX_IMAGES} images allowed`)
      return
    }

    const updatedImages = [...localImages, ...newImages]
    setLocalImages(updatedImages)
    // Return only new File objects
    const newFiles = updatedImages.filter((img) => !img.isExisting).map((img) => img.file)
    onChange(newFiles)
  }, [localImages, onChange])

  const handleDelete = useCallback((id) => {
    const imageToDelete = localImages.find((img) => img.id === id)
    const updatedImages = localImages.filter((img) => img.id !== id)
    setLocalImages(updatedImages)
    
    if (imageToDelete?.isExisting && onExistingImagesChange) {
      // Remove from existing images
      const updatedExisting = existingImages.filter((url) => url !== imageToDelete.url)
      onExistingImagesChange(updatedExisting)
    }
    
    // Return only new File objects, not existing URLs
    const newFiles = updatedImages.filter((img) => !img.isExisting && img.file).map((img) => img.file)
    onChange(newFiles)
  }, [localImages, onChange, existingImages, onExistingImagesChange])

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setLocalImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)
        // Only return new File objects, not existing URLs
        const newFiles = newItems.filter((img) => !img.isExisting).map((img) => img.file)
        onChange(newFiles)
        return newItems
      })
    }
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragError('')

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    )

    if (files.length === 0) return

    const newImages = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }))

    const totalImages = localImages.length + newImages.length

    if (totalImages > MAX_IMAGES) {
      setDragError(`Maximum ${MAX_IMAGES} images allowed`)
      return
    }

    const updatedImages = [...localImages, ...newImages]
    setLocalImages(updatedImages)
    // Return only new File objects
    const newFiles = updatedImages.filter((img) => !img.isExisting).map((img) => img.file)
    onChange(newFiles)
  }, [localImages, onChange])

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-white">
          {label}
          <span className="text-white/60 ml-1">*</span>
        </label>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          border-2 border-dashed rounded-lg p-6
          transition-colors
          ${dragError || error
            ? 'border-red-500 bg-red-500/5'
            : 'border-white/20 hover:border-white/40 bg-white/5'
          }
        `}
      >
        {localImages.length === 0 ? (
          <div className="text-center py-8">
            <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 mb-2">
              Drag and drop slides here, or click to select
            </p>
            <p className="text-white/40 text-sm mb-4">
              Upload 1 to 3 slides exported from Figma
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button variant="secondary" as="span" className="cursor-pointer">
                Select slides
              </Button>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={localImages.map((img) => img.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {localImages.map((image, index) => (
                    <SortableImage
                      key={image.id}
                      image={image}
                      index={index}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {localImages.length < MAX_IMAGES && (
              <div className="text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload-more"
                />
                <label htmlFor="image-upload-more">
                  <Button variant="secondary" as="span" className="cursor-pointer">
                    Add More Slides
                  </Button>
                </label>
              </div>
            )}
          </div>
        )}
      </div>

      {(dragError || error) && (
        <p className="mt-2 text-sm text-red-500">{dragError || error}</p>
      )}

      {localImages.length > 0 && (
        <p className="mt-2 text-sm text-white/60">
          {localImages.length} of {MAX_IMAGES} slides {existingImages.length > 0 ? '(including existing)' : ''}
        </p>
      )}
    </div>
  )
}

