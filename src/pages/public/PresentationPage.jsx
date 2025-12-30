import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { usePageBySlug } from '../../hooks/usePages'
import { FullscreenSlider } from '../../components/presentation/FullscreenSlider'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { Loader2 } from 'lucide-react'

export function PresentationPage() {
  const { slug } = useParams()
  const { page, loading: pageLoading, error: pageError } = usePageBySlug(slug)
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!page || !page.content) {
      setLoading(false)
      return
    }

    const buildSlides = async () => {
      setLoading(true)
      const slidesArray = []

      // Fetch all projects in parallel
      const projectPromises = page.content
        .filter((item) => item.type === 'project' && item.projectId)
        .map(async (item) => {
          try {
            const projectRef = doc(db, 'projects', item.projectId)
            const projectSnap = await getDoc(projectRef)
            if (projectSnap.exists()) {
              return {
                item,
                projectData: { id: projectSnap.id, ...projectSnap.data() },
              }
            }
            return null
          } catch (error) {
            console.error('Error fetching project:', error)
            return null
          }
        })

      const projectResults = await Promise.all(projectPromises)

      // Build slides array maintaining order
      for (const item of page.content) {
        if (item.type === 'project' && item.projectId) {
          const result = projectResults.find((r) => r?.item.projectId === item.projectId)
          if (result?.projectData) {
            const projectData = result.projectData
            // Use selectedSlides if available, otherwise use all slides
            const slidesToUse = item.selectedSlides && item.selectedSlides.length > 0
              ? item.selectedSlides
              : (projectData.slides || [])
            
            // Add each slide from the project as a separate slide
            if (slidesToUse.length > 0) {
              slidesToUse.forEach((slideUrl) => {
                slidesArray.push({
                  type: 'project',
                  imageUrl: slideUrl,
                  projectName: projectData.name,
                  liveWebsiteLink: projectData.liveWebsiteLink || null,
                  liveWebsiteLabel: projectData.liveWebsiteLabel || null,
                  sdWorkLink: projectData.sdWorkLink || null,
                  sdWorkLabel: projectData.sdWorkLabel || null,
                })
              })
            }
          }
        } else if (item.type === 'slideBreak') {
          // Add slide break as a slide
          slidesArray.push({
            type: 'slideBreak',
            title: item.title || '',
            text: item.text || '',
          })
        }
      }

      setSlides(slidesArray)
      setLoading(false)
    }

    buildSlides()
  }, [page])

  if (pageLoading || loading) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading presentation...</p>
        </div>
      </div>
    )
  }

  if (pageError || !page) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
          <p className="text-white/60">
            The presentation page you're looking for doesn't exist.
          </p>
        </div>
      </div>
    )
  }

  if (slides.length === 0) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">No Content</h1>
          <p className="text-white/60">
            This page doesn't have any content yet.
          </p>
        </div>
      </div>
    )
  }

  return <FullscreenSlider slides={slides} />
}
