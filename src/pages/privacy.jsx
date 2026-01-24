import React, { useEffect } from "react";
import { useI18n } from '../hooks/useI18n';

export default function Privacy() {
  const { t, initialize, loading } = useI18n();

  useEffect(() => {
    initialize();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [initialize]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--Yellow)]"></div>
      </div>
    );
  }

  const sections = [
    { title: "TitleOne", sub: "SubOne", body: "BodyOne" },
    { title: "TitleTwo", sub: "SubTwo", body: "BodyTwo" },
    { title: "TitleThree", sub: "SubThree", body: "BodyThree" },
    { title: "TitleFour", sub: "SubFour", body: "BodyFour" },
    { title: "TitleFive", sub: "SubFive", body: "BodyFive" },
    { title: "TitleSix", sub: "SubSix", body: "BodySix" },
    { title: "TitleSeven", sub: "SubSeven", body: "BodySeven" },
    { title: "TitleEight", sub: "SubEight", body: "BodyEight" },
    { title: "TitleNine", sub: null, body: "BodyNine" },
  ];

  return (
    <section className="md:px-40 px-4">
      <h2 className="text-3xl font-bold mb-10 my-4">{t("legal", "PrivacyPolicy", "Privacy Policy")}</h2>
      {sections.map((section, index) => (
        <div key={index} className="my-4">
          <h3>{index + 1}-{t("legal", section.title)}.</h3>
          {section.sub && <h4 className=' my-5'> {t("legal", section.sub)}</h4>}
          <div className=' ml-6' dangerouslySetInnerHTML={{ __html: t("legal", section.body) }} />
        </div>
      ))}
    </section >
  );
}
