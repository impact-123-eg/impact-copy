
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// import {useNavigate } from 'react-router-dom';
const Terms = () => {
  const { t } = useTranslation();
  // const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <section className="md:px-40 px-4">
      <h2 className="text-3xl font-bold mb-10 my-4">{t("useTitle")}</h2>
      <div className=' ml-6' dangerouslySetInnerHTML={{ __html: t("usePolicy") }}/>
        {/* // <p className=' ml-20'>{}</p> */}
    </section >
  );
};

export default Terms;
