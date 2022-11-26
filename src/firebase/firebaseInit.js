// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged as userChanged,
  // sendEmailVerification,
  signOut,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore/lite'
import { uid } from 'uid'
import devData from '../devdata/data'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAkpN5BimXYQRPL9Hhvq9opiZgWXyCVhq0',
  authDomain: 'invoice-f0723.firebaseapp.com',
  projectId: 'invoice-f0723',
  storageBucket: 'invoice-f0723.appspot.com',
  messagingSenderId: '519892714285',
  appId: '1:519892714285:web:8d83cfacfc6910402fc9a4',
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

const devEnv = true

const getAll = async (colname) => {
  if (devEnv) {
    return devData
  }
  const docsRef = collection(db, colname)
  const docsSnapshot = await getDocs(docsRef)
  const invoices = []
  docsSnapshot.forEach((doc) =>
    invoices.push({
      id: doc.id,
      ...doc.data(),
    })
  )
  return invoices
}

const getOne = async (colname, id) => {
  if (devEnv) {
    return devData.find((x) => x.id === id)
  }
  const docRef = doc(db, colname, id)
  const docSnapshot = await getDoc(docRef)
  return { id: docSnapshot.id, ...docSnapshot.data }
}

const createOne = async (colname, data) => {
  const id = uid()

  if (devEnv) {
    return devData.push({ ...data, id })
  }
  const docRef = doc(db, colname, id)
  const newDocRef = await addDoc(docRef, data)
  const newDoc = await getDoc(newDocRef)
  return newDoc
}

const updateOne = async (colname, id, data) => {
  if (devEnv) {
    const index = devData.findIndex((x) => x.id === id)
    if (index > -1) {
      devData[index] = { ...devData[index], ...data }
      return devData[index]
    }
    return
  }
  const docRef = doc(db, colname, id)
  await updateDoc(docRef, data, { merge: true })
}

const deleteOne = async (colname, id) => {
  if (devEnv) {
    const index = devData.findIndex((x) => x.id === id)
    devData.splice(index, 1)
    return
  }
  const docRef = doc(db, colname, id)
  await deleteDoc(docRef)
}

const createUser = async (email, password, name, role) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    if (userCredentials) {
      const authUser = userCredentials.user
      const userRef = await addDoc(doc(db, 'users', authUser.uid), {
        displayName: authUser.displayName,
        email: authUser.email,
        image: authUser.photoURL,
        phone: authUser.phoneNumber,
        name,
        role,
      })
      const user = await getDoc(userRef)
      return [user, 'User Created Successfully']
    } else {
      return [null, 'Something went wrong!']
    }
  } catch (err) {
    return [null, `${err.code}: ${err.message}`]
  }
}

const signIn = async (email, password) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    if (userCredentials) {
      const authUser = userCredentials.user
      const user = await getDoc(doc(db, 'users', authUser.uid))
      return [user, 'Login Successfully']
    } else {
      return [null, 'Something went wrong!']
    }
  } catch (err) {
    return [null, `${err.code}: ${err.message}`]
  }
}

const exports = {
  createOne,
  getAll,
  getOne,
  deleteOne,
  updateOne,
}

export default exports
