import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { ImageUploader } from './ImageUploader'
import { createProject, updateProject } from '../../hooks/useProjects'
import { uploadMultipleFiles } from '../../lib/storage'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

export function ProjectForm({ project = null }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    industry: '',
    liveWebsiteLink: '',
    sdWorkLink: '',
  })
  const [images, setImages] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        type: project.type || '',
        industry: project.industry || '',
        liveWebsiteLink: project.liveWebsiteLink || '',
        sdWorkLink: project.sdWorkLink || '',
      })
      setExistingImages(project.slides || [])
      setImages([]) // Reset new images
    } else {
      setExistingImages([])
      setImages([])
    }
  }, [project])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required'
    }

    const totalImages = existingImages.length + images.length
    if (totalImages === 0) {
      newErrors.images = 'At least 1 image is required'
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
      let imageUrls = [...existingImages]

      // Upload new images if any
      if (images.length > 0) {
        const projectId = project?.id || `temp-${Date.now()}`
        const basePath = `projects/${projectId}`
        const newUrls = await uploadMultipleFiles(images, basePath)
        imageUrls = [...existingImages, ...newUrls]
      }

      const projectData = {
        name: formData.name.trim(),
        slides: imageUrls,
        type: formData.type.trim() || null,
        industry: formData.industry.trim() || null,
        liveWebsiteLink: formData.liveWebsiteLink.trim() || null,
        sdWorkLink: formData.sdWorkLink.trim() || null,
      }

      if (project) {
        // Update existing project
        await updateProject(project.id, projectData)
        toast.success('Project updated successfully')
      } else {
        // Create new project
        await createProject(projectData)
        toast.success('Project created successfully')
      }

      navigate('/admin/projects')
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error('Failed to save project. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Project Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="e.g., BMW Campaign"
        required
        error={errors.name}
      />

      <ImageUploader
        images={images}
        existingImages={existingImages}
        onChange={(newFiles) => {
          setImages(newFiles)
        }}
        onExistingImagesChange={setExistingImages}
        error={errors.images}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="e.g., Web Design"
        />

        <Input
          label="Industry"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          placeholder="e.g., Automotive"
        />
      </div>

      <Input
        label="Live Website Link"
        name="liveWebsiteLink"
        type="url"
        value={formData.liveWebsiteLink}
        onChange={handleChange}
        placeholder="https://..."
      />

      <Input
        label="SD Work Link"
        name="sdWorkLink"
        type="url"
        value={formData.sdWorkLink}
        onChange={handleChange}
        placeholder="https://..."
      />

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
            project ? 'Update Project' : 'Create Project'
          )}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/admin/projects')}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

