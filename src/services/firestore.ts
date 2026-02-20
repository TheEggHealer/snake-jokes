import { db } from '../firebase/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, deleteField, onSnapshot } from 'firebase/firestore';
import type { Joke, UserData, JokeItem } from '../types/types';

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

export function listenJokes(callback: (jokes: { approved: JokeItem[]; pending: JokeItem[] }) => void) {
  const colRef = collection(db, 'jokes')

  const parse = (data: any): JokeItem[] => {
    if (!data) return []
    return Object.keys(data)
      .map((timestamp) => ({
        created: Number.parseInt(timestamp),
        joke: data[timestamp] as Joke
      }))
      .sort((a, b) => b.created - a.created)
  }

  const unsub = onSnapshot(colRef, (querySnap) => {
    let pendingData: JokeItem[] = []
    let approvedData: JokeItem[] = []

    querySnap.docs.forEach((docSnap) => {
      const id = docSnap.id
      const data = docSnap.data()
      if (id === 'pending-jokes') {
        pendingData = parse(data)
      } else if (id === 'approved-jokes') {
        approvedData = parse(data)
      }
    })

    // send fresh arrays so React receives a new reference
    callback({ approved: approvedData, pending: pendingData })
  })

  return unsub
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

export async function uploadPendingJoke(joke: Joke, timestamp: number) {
  const docRef = doc(db, 'jokes', 'pending-jokes')
  await updateDoc(docRef, {
    [timestamp.toString()]: joke
  })
  console.log('Uploaded joke to pending-jokes.')
}

export async function approveJoke(jokeTimestamp: number, userUid: string, currentApprovedBy: string[]) {
  const updatedApprovedBy = [...currentApprovedBy, userUid]
  
  // Try pending-jokes first
  const pendingDocRef = doc(db, 'jokes', 'pending-jokes')
  const pendingSnap = await getDoc(pendingDocRef)
  
  const jokeKey = jokeTimestamp.toString()
  const jokeData = pendingSnap.data()?.[jokeKey]
  
  if (pendingSnap.exists() && jokeData) {
    // Joke exists in pending-jokes
    const updatedJoke = { ...jokeData, approved_by: updatedApprovedBy }
    
    // Check if joke should be moved to approved-jokes (3 or more approvals)
    if (updatedApprovedBy.length >= 3) {
      // Move to approved-jokes
      const approvedDocRef = doc(db, 'jokes', 'approved-jokes')
      await updateDoc(approvedDocRef, {
        [jokeKey]: updatedJoke
      })
      // Remove from pending-jokes
      await updateDoc(pendingDocRef, {
        [jokeKey]: deleteField()
      })
    } else {
      // Stay in pending-jokes
      await updateDoc(pendingDocRef, {
        [jokeKey]: updatedJoke
      })
    }
  } else {
    // Joke must be in approved-jokes
    const approvedDocRef = doc(db, 'jokes', 'approved-jokes')
    const approvedSnap = await getDoc(approvedDocRef)
    const approvedJokeData = approvedSnap.data()?.[jokeKey]
    
    if(!approvedJokeData) throw {error: 'Could not update joke.'}

    if (approvedSnap.exists() && approvedJokeData) {
      const updatedJoke = { ...approvedJokeData, approved_by: updatedApprovedBy }
      await updateDoc(approvedDocRef, {
        [jokeKey]: updatedJoke
      })
    }
  }
}