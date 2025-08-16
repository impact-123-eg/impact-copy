import React, { useState, useEffect } from 'react';
import AdminProfile from '../../Components/dashboard/AdminProfile';
import OtherAdmin from '../../Components/dashboard/OtherAdmin';
import { db, collection, doc, deleteDoc } from '../../data/firebaseConfig';
import { query, where, getDocs } from 'firebase/firestore';
import { useAdmin } from '../../AdminContext';
import { Link, Navigate } from 'react-router-dom';

function Settings() {
 const [otherAdmins, setOtherAdmins] = useState([]);
 const { admin } = useAdmin();

 useEffect(() => {
  const fetchOtherAdmins = async () => {
   try {
    const q = query(collection(db, 'Admins'), where('Email', '!=', admin.Email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
     alert('No other admins found');
    } else {
     const adminData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
     setOtherAdmins(adminData);
    }
   } catch (e) {
    console.error('Error fetching other admins: ', e);
   }
  };

  fetchOtherAdmins();
 }, []);

 const handleDelete = async (adminId) => {
  try {
   const docRef = doc(db, 'Admins', adminId);
   await deleteDoc(docRef);

   setOtherAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== adminId));
  } catch (e) {
   console.error('Error deleting admin: ', e);
   alert('Failed to delete admin');
  }
 };

 if (!admin) {
  return <Navigate to="/dash/login" />
 }
 
 return (
  <main className="space-y-10">
   <h1 className="font-bold text-2xl">Settings</h1>

   <section className="space-y-4">
    <h3 className="font-bold text-xl">Profile</h3>
    <AdminProfile />
   </section>

   <section className="space-y-4">
    <article className="flex justify-between items-center">
     <h3 className="font-bold text-xl">Other Admins</h3>
     <Link onClick={() => window.scroll(0, 0)} to="/dash/settings/AddNew" type="submit" className="p-3 rounded-xl bg-[var(--Yellow)]">
      Add New Admin
     </Link>
    </article>

    {otherAdmins.map((admin) => (
     <OtherAdmin key={admin.id} info={admin} onDelete={handleDelete} />
    ))}
   </section>
  </main>
 );
}

export default Settings;
