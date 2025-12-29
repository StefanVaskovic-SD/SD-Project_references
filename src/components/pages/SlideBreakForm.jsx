import { useState, useEffect } from 'react'
import { Input } from '../ui/Input'
import { X } from 'lucide-react'
import { Button } from '../ui/Button'

export function SlideBreakForm({ 
  title: initialTitle = '', 
  text: initialText = '', 
  onSave, 
  onCancel,
  isEditing = false 
}) {
  const [title, setTitle] = useState(initialTitle)
  const [text, setText] = useState(initialText)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setTitle(initialTitle)
    setText(initialText)
  }, [initialTitle, initialText])

  const handleSave = () => {
    const newErrors = {}
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      onSave({ title: title.trim(), text: text.trim() })
    }
  }

  return (
    <div className="border border-white/20 rounded-lg p-4 bg-white/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-white">Slide Break</h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (errors.title) setErrors((prev) => ({ ...prev, title: '' }))
          }}
          placeholder="e.g., Audi Projects"
          required
          error={errors.title}
        />

        <div>
          <label className="block text-sm font-medium mb-2 text-white">
            Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., Our collaborative work with Audi"
            rows={3}
            className="w-full px-4 py-2 bg-transparent border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors resize-none"
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="primary"
            onClick={handleSave}
            className="flex-1"
          >
            {isEditing ? 'Update' : 'Add'} Slide Break
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

