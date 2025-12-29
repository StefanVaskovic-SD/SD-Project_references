// Custom hook for managing pages in Firestore
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
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

/**
 * Get all pages
 */
export function usePages() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true)
        const q = query(collection(db, 'pages'), orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)
        const pagesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setPages(pagesData)
        setError(null)
      } catch (err) {
        console.error('Error fetching pages:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPages()
  }, [])

  return { pages, loading, error }
}

/**
 * Get a single page by ID
 */
export function usePage(id) {
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetchPage = async () => {
      try {
        setLoading(true)
        const docRef = doc(db, 'pages', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setPage({ id: docSnap.id, ...docSnap.data() })
        } else {
          setError('Page not found')
        }
        setError(null)
      } catch (err) {
        console.error('Error fetching page:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [id])

  return { page, loading, error }
}

/**
 * Get a page by slug (for public presentation)
 */
export function usePageBySlug(slug) {
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    const fetchPage = async () => {
      try {
        setLoading(true)
        const q = query(collection(db, 'pages'), where('slug', '==', slug))
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0]
          setPage({ id: doc.id, ...doc.data() })
        } else {
          setError('Page not found')
        }
        setError(null)
      } catch (err) {
        console.error('Error fetching page by slug:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [slug])

  return { page, loading, error }
}

/**
 * Create a new page
 */
export async function createPage(pageData) {
  try {
    const pageWithTimestamps = {
      ...pageData,
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    const docRef = await addDoc(collection(db, 'pages'), pageWithTimestamps)
    return docRef.id
  } catch (error) {
    console.error('Error creating page:', error)
    throw error
  }
}

/**
 * Update an existing page
 */
export async function updatePage(id, pageData) {
  try {
    const pageRef = doc(db, 'pages', id)
    await updateDoc(pageRef, {
      ...pageData,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating page:', error)
    throw error
  }
}

/**
 * Delete a page
 */
export async function deletePage(id) {
  try {
    await deleteDoc(doc(db, 'pages', id))
  } catch (error) {
    console.error('Error deleting page:', error)
    throw error
  }
}

