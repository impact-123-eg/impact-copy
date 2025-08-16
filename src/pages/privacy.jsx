
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// import {useNavigate } from 'react-router-dom';
export default function Privacy() {
    const { t } = useTranslation();
    // const navigate = useNavigate();
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
  
    return (
      <section className="md:px-40 px-4">
        <h2 className="text-3xl font-bold mb-10 my-4">{t("PrivacyPolicy")}</h2>
          <h3>1-{t("TitleOne")}.</h3>
          <h4 className=' my-5'> {t("SubOne")}</h4>
          <div className=' ml-6' dangerouslySetInnerHTML={{ __html: t("BodyOne") }}/>
          <div className=' my-4'>
          <h3>2-{t("TitleTwo")}.</h3>
          <h4 className=' my-5'> {t("SubTwo")}</h4>
          <div className=' ml-6' dangerouslySetInnerHTML={{ __html: t("BodyTwo") }}/>
          </div>
          <div className=' my-4'>
          <h3>3-{t("TitleThree")}.</h3>
          <h4 className=' my-5'> {t("SubThree")}</h4>
          <div className=' ml-6' dangerouslySetInnerHTML={{ __html: t("BodyThree") }}/>
          </div>
          <div className=' my-4'>
          <h3>4-{t("TitleFour")}.</h3>
          <h4 className=' my-5'> {t("SubFour")}</h4>
          <div className=' ml-6' dangerouslySetInnerHTML={{ __html: t("BodyFour") }}/>
          </div>
          <div className=' my-4'>
          <h3>5-{t("TitleFive")}.</h3>
          <h4 className=' my-5'> {t("SubFive")}</h4>
          <div className=' ml-6' dangerouslySetInnerHTML={{ __html: t("BodyFive") }}/>
          </div>
          <div className=' my-4'>
          <h3>6-{t("TitleSix")}.</h3>
          <h4 className=' my-5'> {t("SubSix")}</h4>
          <div className=' ml-6' dangerouslySetInnerHTML={{ __html: t("BodySix") }}/>
          </div>
          <div className=' my-4'>
          <h3>7-{t("TitleSeven")}.</h3>
          <h4 className=' my-5'> {t("SubSeven")}</h4>
          <div className=' ml-6' dangerouslySetInnerHTML={{ __html: t("BodySeven") }}/>
          </div>
          <div className=' my-4'>
          <h3>8-{t("TitleEight")}.</h3>
          <h4 className=' my-5'> {t("SubEight")}</h4>
          <div className=' ml-6' dangerouslySetInnerHTML={{ __html: t("BodyEight") }}/>
          </div>
          <div className=' my-4'>
          <h3>9-{t("TitleNine")}.</h3>
          <div className=' ml-6' dangerouslySetInnerHTML={{ __html: t("BodyNine") }}/>
          </div>
          {/* // <p className=' ml-20'>{}</p> */}
      </section >
    );
}
