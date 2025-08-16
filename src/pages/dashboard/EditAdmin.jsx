import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { db, collection, doc, updateDoc } from '../../data/firebaseConfig';
import { query, where, getDocs } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Modal } from 'react-responsive-modal';

function EditAdmin() {
 const location = useLocation();
 const navigate = useNavigate();

 const [showPassword, setShowPassword] = useState(false);
 const [openSuccessModal, setOpenSuccessModal] = useState(false);
 const [formData, setFormData] = useState({ Name: '', Email: '', Phone: '', Password: '', Previlige: 'Admin' });

 useEffect(() => {
  if (location.state && location.state.adminDetails) {
   setFormData(location.state.adminDetails);
  } else {
   navigate('/dash/settings');
  }
 }, [location.state, navigate]);

 const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevState) => ({ ...prevState, [name]: value }));
 };

 const checkIfExists = async () => {
  const q1 = query(collection(db, 'Admins'), where('Name', '==', formData.Name));
  const q2 = query(collection(db, 'Admins'), where('Phone', '==', formData.Phone));
  const q3 = query(collection(db, 'Admins'), where('Email', '==', formData.Email));

  const [querySnapshot1, querySnapshot2, querySnapshot3] = await Promise.all([
   getDocs(q1),
   getDocs(q2),
   getDocs(q3),
  ]);

  if (
   (!querySnapshot1.empty && querySnapshot1.docs[0].id !== location.state.adminDetails.id) ||
   (!querySnapshot2.empty && querySnapshot2.docs[0].id !== location.state.adminDetails.id) ||
   (!querySnapshot3.empty && querySnapshot3.docs[0].id !== location.state.adminDetails.id)
  ) {
   Swal.fire({
    icon: 'error',
    title: 'Conflict',
    text: 'An admin with this Name, Email, or Phone already exists.',
    timer: 1500,
    showConfirmButton: false
   });
   return true;
  }
  return false;
 };

 const handleUpdate = async (e) => {
  e.preventDefault();

  if (!formData.Name || !formData.Email || !formData.Phone || !formData.Password || !formData.Previlige) {
   Swal.fire({ icon: 'error', title: 'Error', text: 'Please Fill All Fields', timer: 1000, showConfirmButton: false });
   return;
  }

  const conflict = await checkIfExists();
  if (conflict) return;

  try {
   const adminRef = doc(db, 'Admins', location.state.adminDetails.id);

   await updateDoc(adminRef, {
    Name: formData.Name,
    Email: formData.Email,
    Phone: formData.Phone,
    Password: formData.Password,
    Previlige: formData.Previlige,
   });

   setOpenSuccessModal(true);
   setTimeout(() => {
    navigate('/dash/settings');
    setOpenSuccessModal(false);
   }, 2000);


   window.scroll(0, 0);
  } catch (error) {
   console.error('Error updating admin: ', error);
   Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong. Please try again.', timer: 1000, showConfirmButton: false });
  }
 };

 return (
  <main className="space-y-10">
   <h1 className="font-bold text-2xl">Settings</h1>

   <section className="space-y-6">
    <h2 className="font-semibold text-xl">Update Admin Details</h2>

    <form onSubmit={handleUpdate} className="space-y-4 border-2 rounded-3xl p-10">

     <article className="space-y-3">
      <div className="space-y-4">
       <h4 className="font-semibold text-lg">Name</h4>
       <input onChange={handleChange} required name="Name" value={formData.Name} placeholder="Ahmed Ali" type="text" className="py-2 px-4 w-full rounded-lg bg-[var(--Input)]" />
      </div>

      <div className="space-y-4">
       <h4 className="font-semibold text-lg">Phone</h4>
       <input onChange={handleChange} required name="Phone" value={formData.Phone} placeholder="0123456789" type="tel" className="py-2 px-4 w-full rounded-lg bg-[var(--Input)]" />
      </div>

      <div className="space-y-4">
       <h4 className="font-semibold text-lg">Email</h4>
       <input onChange={handleChange} required name="Email" value={formData.Email} placeholder="1234@gmail.com" type="email" className="py-2 px-4 w-full rounded-lg bg-[var(--Input)]" />
      </div>

      <div className="relative space-y-4">
       <h4 className="font-semibold text-lg">Password</h4>

       <input onChange={handleChange} required name="Password" value={formData.Password} placeholder="********" type={showPassword ? "text" : "password"} className="py-2 px-4 w-full rounded-lg bg-[var(--Input)]" />

       <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform translate-y-1/2 text-gray-500">
        {showPassword ? <FaEye /> : <FaEyeSlash />}
       </button>
      </div>
      <div className="space-y-4">
       <h4 className="font-semibold text-lg">Previlige</h4>
       <select required disabled name="Previlige" value={formData.Previlige} onChange={handleChange} className="py-2 px-4 w-full rounded-lg bg-[var(--Input)]">
        <option value="Admin">Admin</option>
       </select>
      </div>
     </article>
    </form>

    <article className="flex justify-between items-center text-xl">
     <button onClick={() => navigate('/dash/settings')} className="py-3 px-20 text-xl rounded-2xl border-2 border-[var(--Yellow)]" >
      Cancel
     </button>
     <button onClick={handleUpdate} className="py-3 px-20 text-xl rounded-2xl bg-[var(--Yellow)]">
      Save
     </button>
    </article>
   </section>

   {/* Success Modal */}
   <Modal open={openSuccessModal} onClose={() => setOpenSuccessModal(false)} center classNames={{ modal: "rounded-2xl",closeIcon: "bg-[var(--Yellow)]  rounded-lg text-white" }}>
    <h2 className="my-12">Successfully Edited</h2>
   </Modal>
  </main>
 );
}

export default EditAdmin;
