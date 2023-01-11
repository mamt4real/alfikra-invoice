// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  onAuthStateChanged as userChanged,
  signOut,
} from 'firebase/auth'
import {
  getFirestore,
  increment,
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  setDoc,
} from 'firebase/firestore/lite'
import { uid } from 'uid'
import devData, { engines, users } from '../devdata/data'
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
      case 'engines':
        return engines
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

/**
 * Retrieve invoices within a given date range
 * @param {String | Date} from start date
 * @param {String | Date} to end date
 * @returns {[Object]} list of Invoices
 */

const getDateRangedInvoices = async (from, to) => {
  if (!(from instanceof Date)) from = new Date(from)
  if (!(to instanceof Date)) to = new Date(to)

  if (devEnv) {
    return devData.filter(
      (sale) =>
        sale.invoiceDate.getTime() >= from.getTime() &&
        sale.invoiceDate.getTime() <= to.getTime()
    )
  }

  from.setHours(0, 0, 0, 0)
  to.setHours(23, 59, 59, 0)

  const q = query(
    collection(db, 'invoices'),
    where('invoiceDate', '>=', from),
    where('invoiceDate', '<=', to),
    orderBy('invoiceDate', 'desc')
  )
  const docsSnapshot = await getDocs(q)
  const invoices = []
  docsSnapshot.forEach((doc) =>
    invoices.push({
      ...doc.data(),
      id: doc.id,
    })
  )
  return invoices
}

const getThisYearInvoices = async () => {
  if (devEnv) return devData
  const year = new Date().getFullYear()
  const dayOne = `${year}-01-01`
  const lastDay = `${year}-12-31`
  return getDateRangedInvoices(dayOne, lastDay)
}

const getTodaysSales = async () => {
  const d = new Date().toLocaleString('default', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const params = d.split('/').reverse()
  const today = params.join('-')
  params[2] = parseInt(params[2]) + 1
  params[2] = params[2] > 9 ? params[2] : '0' + params[2]
  const tomorrow = params.join('-')
  return getDateRangedInvoices(today, tomorrow)
}

const getInvoiceByPhone = async (phone) => {
  if (devEnv) {
  }
  const q = query(collection(db, 'invoices'), where('clientPhone', '==', phone))
  const docsSnapshot = await getDocs(q)
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
  return { ...docSnapshot.data(), id: docSnapshot.id }
}

const createOne = async (colname, data) => {
  if (devEnv) {
    const newDoc = { ...data, id: uid() }
    return newDoc
  }
  const colRef = collection(db, colname)
  const newDocRef = await addDoc(colRef, data)
  const newDoc = await getDoc(newDocRef)
  return { ...newDoc.data(), id: newDoc.id }
}

const updateOne = async (colname, docData) => {
  if (devEnv) {
    let data
    switch (colname) {
      case 'invoices':
        data = devData
        break
      case 'engines':
        data = engines
        break
      default:
        data = []
    }
    const index = data.findIndex((x) => x.id === docData.id)
    console.log(index)
    if (index > -1) {
      data[index] = { ...data[index], ...docData }
      return data[index]
    }
    console.log(index)
    return
  }
  const docRef = doc(db, colname, docData.id)
  await updateDoc(docRef, docData, { merge: true })
  const updated = await getDoc(docRef)
  return { id: updated.id, ...updated.data() }
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

const engineExists = async (engineName) => {
  const q = query(collection(db, 'engines'), where('name', '==', engineName))
  const found = await getDoc(q)
  return found.exists()
}

/**
 * Update quantities of engines after an invoice is paid
 * @param {[any]} items list of items bought
 */

const updateQuantities = async (items) => {
  const updates = []

  items.forEach((item) => {
    const q = query(
      collection(db, 'engines'),
      where('name', '==', item.itemName)
    )
    const update = { quantity: increment(-Number(item.qty)) }
    updates.push(updateDoc(q, update))
  })
  await Promise.all(updates)
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
      await setDoc(doc(db, 'users', authUser.uid), {
        displayName: authUser.displayName,
        email: authUser.email,
        image: authUser.photoURL,
        phone: authUser.phoneNumber,
        name,
        role,
      })
      const user = await getOne('users', authUser.uid)
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
    // console.log(userCredentials)
    if (userCredentials) {
      const authUser = userCredentials.user
      // console.log(authUser.uid)
      const userSnapshot = await getDoc(doc(db, 'users', authUser.uid))
      // console.log(userSnapshot.data())

      return [
        {
          id: userSnapshot.id,
          ...userSnapshot.data(),
        },
        'Login Successfully',
      ]
    } else {
      return [null, 'Something went wrong!']
    }
  } catch (err) {
    console.log(err.message)
    return [null, `${err.code}: ${err.message}`]
  }
}

const logOut = async () => {
  await signOut(auth)
}

const updateUserPassword = async (oldpass, newPass, user) => {
  if (devEnv) {
    const current = users.find((u) => u.id === user.id)
    if (current.password !== oldpass) return [null, 'Invalid Passsword']
    current.password = newPass
    return [current, 'Password Changed Successfully']
  }
  try {
    const current = auth.currentUser
    const creadential = EmailAuthProvider.credential(current.email, oldpass)
    const userCredential = await reauthenticateWithCredential(
      current,
      creadential
    )
    if (!userCredential) {
      return [null, 'Invalid Passwsord']
    }
    await updatePassword(current, newPass)
    return [current, 'Password changed successfully']
  } catch (error) {
    console.log(error)
    return [null, error.message?.split('auth/')[1].strip(')')]
  }
}

const exports = {
  devEnv,
  auth,
  updateUserPassword,
  createOne,
  getAll,
  getOne,
  deleteOne,
  updateOne,
  signIn,
  logOut,
  engineExists,
  updateQuantities,
  createUser,
  getThisYearInvoices,
  getTodaysSales,
  getDateRangedInvoices,
  getInvoiceByPhone,
  userChanged,
}

export default exports
