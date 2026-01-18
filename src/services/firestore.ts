// filepath: /Users/jonathanruneke/Documents/projects/snake-jokes/src/services/firestore.ts
import { db } from '../firebase/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import type { Joke, UserData } from '../types/types';

export async function addDocument(collectionName: string, data: any) {
  const colRef = collection(db, collectionName);
  const docRef = doc(colRef);
  await setDoc(docRef, data);
  return docRef.id;
}

// Example: Get a document by ID
export async function getDocument(collectionName: string, docId: string) {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

// Example: Update a document
export async function updateDocument(collectionName: string, docId: string, data: any) {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, data);
}

// Example: Delete a document
export async function deleteDocument(collectionName: string, docId: string) {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
}


export async function getApprovedJokes() {  
  const docRef = doc(db, 'jokes', 'approved-jokes')
  const docSnap = await getDoc(docRef)
  const data = docSnap.exists() ? docSnap.data() : null

  if(data) {
    const userData = await getUsers()
    const jokes = Object.keys(data).map((timestamp) => {
      const approved = data[timestamp]['approved_by'].map((uid: string) => userData.get(uid)) as UserData[]
      
      data[timestamp]['approved_by'] = approved
      
      return {
        created: Number.parseInt(timestamp),
        joke: data[timestamp] as Joke
      }
    })

    return jokes
  }

  return null
}

export async function getUsers() {
  const colRef = collection(db, 'user-data')
  const docRefs = await getDocs(colRef)
  const users = new Map<string, UserData>()
  docRefs.docs.forEach(doc => {
    users.set(doc.id, doc.data() as UserData)
  })
  return users
}