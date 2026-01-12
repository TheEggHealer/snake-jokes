import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth } from '../firebase/firebase'

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}
export async function signUp(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password)
}
export async function signOut() {
  return fbSignOut(auth)
}
export async function sendReset(email: string) {
  return sendPasswordResetEmail(auth, email)
}
export function subscribeAuth(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb)
}