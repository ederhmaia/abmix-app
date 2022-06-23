import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import { serverTimestamp } from 'firebase/firestore'
import { initializeAuth } from 'firebase/auth'
import { getReactNativePersistence } from 'firebase/auth/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const config = {
  apiKey: '#',
  authDomain: '#',
  projectId: '#',
  storageBucket: '#',
  messagingSenderId: '#',
  appId: '#'
}

if (firebase.apps.length === 0) {
  const defaultApp = firebase.initializeApp(config)
  initializeAuth(defaultApp)
  //   initializeAuth(defaultApp, {
  //     persistence: getReactNativePersistence(AsyncStorage)
  //   })
} else {
  firebase.app()
}

db = firebase.firestore()
const ServerTimeStamp = serverTimestamp()
export default { firebase, db, ServerTimeStamp }
