// Firebase Storage helper functions
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'

/**
 * Upload a file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} path - Storage path (e.g., 'projects/projectId/slide-0.jpg')
 * @returns {Promise<string>} Download URL
 */
export async function uploadFile(file, path) {
  try {
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

/**
 * Delete a file from Firebase Storage
 * @param {string} path - Storage path to delete
 */
export async function deleteFile(path) {
  try {
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

/**
 * Upload multiple files and return their URLs
 * @param {File[]} files - Array of files to upload
 * @param {string} basePath - Base storage path (e.g., 'projects/projectId')
 * @returns {Promise<string[]>} Array of download URLs
 */
export async function uploadMultipleFiles(files, basePath) {
  try {
    const uploadPromises = files.map((file, index) => {
      const fileName = `slide-${index}.${file.name.split('.').pop()}`
      const path = `${basePath}/${fileName}`
      return uploadFile(file, path)
    })
    return await Promise.all(uploadPromises)
  } catch (error) {
    console.error('Error uploading multiple files:', error)
    throw error
  }
}

