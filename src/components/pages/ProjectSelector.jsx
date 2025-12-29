import { useState } from 'react'
import { useProjects } from '../../hooks/useProjects'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Search, Loader2 } from 'lucide-react'

export function ProjectSelector({ isOpen, onClose, onSelect, excludeIds = [] }) {
  const { projects, loading } = useProjects()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase())
    const notExcluded = !excludeIds.includes(project.id)
    return matchesSearch && notExcluded
  })

  const handleSelect = (project) => {
    onSelect(project)
    onClose()
    setSearchTerm('')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose()
        setSearchTerm('')
      }}
      title="Select Project"
    >
      <div className="space-y-4">
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60">
              {searchTerm ? 'No projects found matching your search' : 'No projects available'}
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
            {filteredProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleSelect(project)}
                className="w-full p-4 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/5 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  {project.slides && project.slides.length > 0 ? (
                    <img
                      src={project.slides[0]}
                      alt={project.name}
                      className="w-16 h-16 object-cover rounded border border-white/10"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-white/5 rounded border border-white/10 flex items-center justify-center">
                      <span className="text-white/40 text-xs">No image</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-1">{project.name}</h3>
                    <div className="flex gap-4 text-sm text-white/60">
                      {project.type && <span>{project.type}</span>}
                      {project.industry && <span>{project.industry}</span>}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}

