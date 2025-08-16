import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, deleteDoc, addDoc, updateDoc, getDocs, getDoc} from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: "AIzaSyC-pzomCDHQjXeKNkYfcSFrDEGNb8ZMIEc",
//   authDomain: "impact-89f6d.firebaseapp.com",
//   projectId: "impact-89f6d",
//   storageBucket: "impact-89f6d.firebasestorage.app",
//   messagingSenderId: "894599026047",
//   appId: "1:894599026047:web:44969cb8fb6205c17eb64a",
//   measurementId: "G-49NYN0F16D"
// };
const firebaseConfig = {
  apiKey: "AIzaSyAIBkSVMgbixhJxebxlQHTWtcH006s-PbE",
  authDomain: "impact-4f302.firebaseapp.com",
  projectId: "impact-4f302",
  storageBucket: "impact-4f302.firebasestorage.app",
  messagingSenderId: "384704495186",
  appId: "1:384704495186:web:2dc6d5a20d75e2bbfae98b"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, deleteDoc, collection, addDoc, updateDoc, getDocs, getDoc};  
