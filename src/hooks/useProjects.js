// Custom hook for managing projects in Firestore
import { useState, useEffect } from 'react'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

/**
 * Get all projects
 */
export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)
        const projectsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setProjects(projectsData)
        setError(null)
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return { projects, loading, error }
}

/**
 * Get a single project by ID
 */
export function useProject(id) {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetchProject = async () => {
      try {
        setLoading(true)
        const docRef = doc(db, 'projects', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() })
        } else {
          setError('Project not found')
        }
        setError(null)
      } catch (err) {
        console.error('Error fetching project:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  return { project, loading, error }
}

/**
 * Create a new project
 */
export async function createProject(projectData) {
  try {
    const projectWithTimestamps = {
      ...projectData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    const docRef = await addDoc(collection(db, 'projects'), projectWithTimestamps)
    return docRef.id
  } catch (error) {
    console.error('Error creating project:', error)
    throw error
  }
}

/**
 * Update an existing project
 */
export async function updateProject(id, projectData) {
  try {
    const projectRef = doc(db, 'projects', id)
    await updateDoc(projectRef, {
      ...projectData,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating project:', error)
    throw error
  }
}

/**
 * Delete a project
 */
export async function deleteProject(id) {
  try {
    await deleteDoc(doc(db, 'projects', id))
  } catch (error) {
    console.error('Error deleting project:', error)
    throw error
  }
}

