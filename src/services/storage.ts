import { storage } from '../firebase/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const JOKE_IMAGES_BUCKET = 'joke-images';

export const uploadImage = async (file: File, fileName?: string): Promise<string> => {
  try {
    console.log('Uploading image...')
    const finalFileName = fileName || `${Date.now()}_${file.name}`
    const fileRef = ref(storage, `${JOKE_IMAGES_BUCKET}/${finalFileName}`)
    await uploadBytes(fileRef, file)
    const downloadURL = await getDownloadURL(fileRef)
    console.log('Uploaded at: ', downloadURL)
    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Failed to upload image')
  }
}

export const deleteImage = async (fileName: string): Promise<void> => {
  try {
    const fileRef = ref(storage, `${JOKE_IMAGES_BUCKET}/${fileName}`)
    await deleteObject(fileRef)
  } catch (error) {
    console.error('Error deleting image:', error)
    throw new Error('Failed to delete image')
  }
}

export const getFileNameFromURL = (downloadURL: string): string => {
  try {
    const url = new URL(downloadURL)
    const pathParts = url.pathname.split('%2F')
    return pathParts[pathParts.length - 1].split('?')[0]
  } catch (error) {
    console.error('Error parsing URL:', error)
    return ''
  }
}
