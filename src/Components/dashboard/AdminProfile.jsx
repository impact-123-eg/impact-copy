import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAdmin } from '../../AdminContext';

function AdminProfile() {
 const { admin } = useAdmin();
 const [isPasswordVisible, setIsPasswordVisible] = useState(false);

 return (
  <article className='grid grid-cols-3 p-8 gap-x-12 gap-y-6 rounded-3xl bg-[var(--Light)]'>
    <div className='w-full space-y-2'>
     <h4 className='text-md text-[var(--SubText)]'>Name</h4>
     <p className='text-2xl'>{admin.Name}</p>
    </div>
    <div className='w-full space-y-2'>
     <h4 className='text-md text-[var(--SubText)]'>Phone</h4>
     <p className='text-2xl'>{admin.Phone}</p>
    </div>
    <div className='w-full space-y-2'>
     <h4 className='text-md text-[var(--SubText)]'>Previlige</h4>
     <p className='text-2xl'>{admin.Previlige}</p>
    </div>
    <div className='w-full space-y-2'>
     <h4 className='text-md text-[var(--SubText)]'>Email</h4>
     <p className='text-2xl'>{admin.Email}</p>
    </div>
    <div className='w-full space-y-2'>
     <h4 className='text-md text-[var(--SubText)]'>Password</h4>
     <div className="flex space-x-4 items-center">
      <p className='text-2xl'>{isPasswordVisible ? admin.Password : '••••••••'}</p>
      <button onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="text-2xl">
       {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
      </button>
     </div>
    </div>
  </article>
 );
}

export default AdminProfile;
