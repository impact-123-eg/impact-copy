import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/Logo White 1.png'
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { IoMdMail } from 'react-icons/io'

const Footer = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  return (
    <footer className={`grid grid-cols-1 lg:grid-cols-2 p-10 lg:p-20 lg:px-40 text-white bg-gradient-to-r from-[var(--GradBg)] to-[var(--Main)] mt-12 ${i18n.language === 'ar' ? 'rtl' : ''}`}>
      <section data-aos="fade-right" data-aos-duration="1000" className='space-y-6'>
        <img src={logo} className='w-40 lg:w-60' alt="Logo" />

        <h1 className='font-bold text-2xl'>{t('AboutUs')}</h1>

        <p className='md:text-md'>{t('footerDescription')}</p>
      </section>

      <article data-aos="fade-left" data-aos-duration="1000" className='flex justify-evenly space-x-10 lg:space-x-15 space-y-5 lg:space-y-0 flex-row mt-10 lg:mt-0'>
        <section className='text-center space-y-4'>
          <h1 className='underline font-bold text-xl'>{t('quickLinks')}</h1>

          <ul className='space-y-2 md:space-y-4 text-sm md:text-lg'>
            <li><Link onClick={() => window.scroll(0, 0)} to="/">{t('Home')}</Link></li>
            <li><Link onClick={() => window.scroll(0, 0)} to="/courses">{t('Courses')}</Link></li>
            <li><Link onClick={() => window.scroll(0, 0)} to="/about">{t('AboutUs')}</Link></li>
          </ul>
        </section>

        <section className='text-center space-y-6'>
          <h1 className='underline font-bold text-xl'>{t('followUs')}</h1>

          <ul className='flex justify-center space-x-3 lg:space-x-6 text-xl md:text-2xl'>
            <Link className='lg:ml-6' to="https://www.instagram.com/_impactacademy"><FaInstagram /></Link>
            <Link to="https://www.facebook.com/Impactacademy25"><FaFacebook /></Link>
            <Link to="https://www.tiktok.com/@impactacademy1"><FaTiktok /></Link>
            <a href="mailto:impactacademy.25@gmail.com"><IoMdMail /></a>
          </ul>

          <div className='text-center space-y-3 lg:space-y-6'>
            <h1 className='underline font-bold text-xl'>{t('contactUs')}</h1>
            <div className='flex gap-x-2 items-center justify-center text-lg md:text-xl my-2'>
              <FaWhatsapp className='' />
              <a href='tel:+201091085271' target='_blank'>01091085271</a>
            </div>
   
          </div>
        </section>
      </article>

      <article data-aos="fade-right" data-aos-duration="1000" className='space-y-4 mt-12 text-md'>
        <div className=' cursor-pointer'>
          <span onClick={()=> navigate("/privacy-policy")} className='border-b-2'>{t('privacyPolicy')}</span> |
          <span onClick={()=> navigate("/refund-policy")} className='border-b-2'>{t('contentPolicy')}</span> |
          <span onClick={()=> navigate("/terms-of-use")} className='border-b-2'>{t('termsOfUse')}</span>
        </div>
        <p className='my-3'>{t('designedBy')} <a href='https://ABSai.dev' target='_blank' className=' underline'> ABSai.dev</a></p>
        <p>{t('allRightsReserved')}</p>
      </article>
    </footer>
  )
}

export default Footer