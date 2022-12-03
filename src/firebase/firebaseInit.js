// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // onAuthStateChanged as userChanged,
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
  // setDoc,
} from 'firebase/firestore/lite'
import { uid } from 'uid'
import devData, { users } from '../devdata/data'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Import the functions you need from the SDKs you need

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBix4GzK8CO32eopHyjnosCM-DRrAzAG5U',
  authDomain: 'alfikra-invoice.firebaseapp.com',
  projectId: 'alfikra-invoice',
  storageBucket: 'alfikra-invoice.appspot.com',
  messagingSenderId: '662471360909',
  appId: '1:662471360909:web:9baa067776c1b42b90bdc4',
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

const devEnv = true

const getAll = async (colname) => {
  if (devEnv) {
    switch (colname) {
      case 'invoices':
        return devData
      case 'users':
        return users
      default:
        return []
    }
  }
  const docsRef = collection(db, colname)
  const docsSnapshot = await getDocs(docsRef)
  const invoices = []
  docsSnapshot.forEach((doc) =>
    invoices.push({
      ...doc.data(),
      id: doc.id,
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
  if (devEnv) {
    const newDoc = { ...data, id: uid() }
    // devData.push(newDoc)
    return newDoc
  }
  const colRef = collection(db, colname)
  const newDocRef = await addDoc(colRef, data)
  const newDoc = await getDoc(newDocRef)
  return { ...newDoc.data(), id: newDoc.id }
}

const updateOne = async (colname, data) => {
  if (devEnv) {
    const index = devData.findIndex((x) => x.id === data.id)
    if (index > -1) {
      devData[index] = { ...devData[index], ...data }
      return devData[index]
    }
    return
  }
  const docRef = doc(db, colname, data.id)
  await updateDoc(docRef, data, { merge: true })
  const updated = await getDoc(docRef)
  return updated
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
  if (devEnv) {
    const newUser = {
      id: uid(),
      email,
      name,
      password,
      role,
    }
    users.push(newUser)
    return [newUser, 'User Created Successfully']
  }
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

/**
 * Login a user
 * @param {String} email
 * @param {String} password
 * @returns {User} signed in user
 */

const signIn = async (email, password) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    console.log(userCredentials)
    if (userCredentials) {
      const authUser = userCredentials.user
      console.log(authUser.uid)
      const userSnapshot = await getDoc(doc(db, 'users', authUser.uid))
      console.log(userSnapshot.data())

      return [
        { id: userSnapshot.id, ...userSnapshot.data() },
        'Login Successfully',
      ]
    } else {
      return [null, 'Something went wrong!']
    }
  } catch (err) {
    alert(err.code)
    return [null, `${err.code}: ${err.message}`]
  }
}

const logOut = async () => {
  await signOut(auth)
}

const exports = {
  devEnv,
  createOne,
  getAll,
  getOne,
  deleteOne,
  updateOne,
  signIn,
  logOut,
  createUser,
}

export default exports
