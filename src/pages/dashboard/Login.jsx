import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import photo from '../../assets/login.png';
import { db, collection } from '../../data/firebaseConfig';
import { query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../AuthContext';
import Swal from 'sweetalert2';
import { useAdmin } from '../../AdminContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const [formData, setFormData] = useState({ Email: '', Password: '' }),
    [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setAdmin } = useAdmin();
  const location = useLocation();
  
  useEffect(() => {
    document.documentElement.dir = location.pathname.includes('-dash') ? 'ltr' : '';
  }, [location.pathname]);
  

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
      navigate('/dash/');
    }
  }, [setAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Email || !formData.Password) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill all fields',
        timer: 1000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const q = query(
        collection(db, 'Admins'),
        where('Email', '==', formData.Email),
        where('Password', '==', formData.Password)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Invalid Email or Password',
          timer: 1000,
          showConfirmButton: false,
        });
        return;
      } else {
        const adminData = querySnapshot.docs[0].data();

        localStorage.setItem('admin', JSON.stringify(adminData));

        setAdmin(adminData);
        login();
        window.scroll(0, 0);
        navigate('/dash/');
      }
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Please try again.',
        timer: 1000,
        showConfirmButton: false,
      });
      console.error('Error during login: ', e);
    }
  };

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 md:px-40 px-4">
      <section>
        <img src={photo} className="w-full h-full" alt="Login" />
      </section>

      <section className="flex flex-col justify-center items-center py-10 space-y-20 border-2 rounded-2xl border-[var(--SubTextBorder)]">
        <h1 className="font-bold text-5xl">Log in</h1>

        <form onSubmit={handleSubmit} className="space-y-10 w-full px-10">
          <div className="flex flex-col space-y-6">
            <label className="text-xl">Email</label>
            <input name="Email" placeholder="1234@gmail.com" value={formData.Email} onChange={handleChange} type="email" className="py-2 px-4 rounded-lg bg-[var(--Input)]" />
          </div>

          <div className="relative space-y-4">
            <h4 className="font-semibold text-lg">Password</h4>

            <input onChange={handleChange} required name="Password" value={formData.Password} placeholder="********" type={showPassword ? "text" : "password"} className="py-2 px-4 w-full rounded-lg bg-[var(--Input)]" />

            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform translate-y-1/2 text-gray-500">
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          <button type="submit" className="p-4 px-8 text-2xl w-full rounded-2xl bg-[var(--Yellow)]">
            Login
          </button>
        </form>
      </section>

      <p className="pt-10">Designed and Developed by ABSAI.dev</p>
    </main>
  );
}

export default Login;