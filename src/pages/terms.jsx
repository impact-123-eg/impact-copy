import { useEffect } from "react";
import { useI18n } from '../hooks/useI18n';

const Terms = () => {
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

  return (
    <section className="md:px-40 px-4">
      <h2 className="text-3xl font-bold mb-10 my-4">{t("legal", "useTitle", "Terms of Use")}</h2>
      <div className=' ml-6' dangerouslySetInnerHTML={{ __html: t("legal", "usePolicy") }} />
    </section >
  );
};

export default Terms;
