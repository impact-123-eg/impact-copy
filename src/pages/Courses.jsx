import React, { useEffect } from "react";
import { useGetAllcategories } from "@/hooks/Actions/categories/useCategoryCruds";
import Course from "../Components/Course";
import { useI18n } from "../hooks/useI18n";
import SEO from "../Components/SEO";

function Courses() {
  const { t, initialize, loading } = useI18n();
  const { data: catData } = useGetAllcategories();
  const categories = catData?.data || [];

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--Yellow)]"></div>
      </div>
    );
  }

  return (
    <section className="px-10 md:px-20 lg:px-60 py-16 flex flex-col items-center">
      <SEO
        title={t("courses", "ourcorses", "Our Courses")}
        description="Browse our wide range of English courses designed for all levels. From beginners to advanced learners, we have the right course for you."
      />
      <h1 data-aos="fade-up" className="font-bold text-3xl md:text-5xl py-5 mb-12 text-center">
        {t("courses", "ourcorses", "Our Courses")}
      </h1>

      <article
        data-aos="fade-up"
        data-aos-delay="1000"
        className="flex flex-wrap justify-center gap-8 w-full max-w-7xl"
      >
        {categories.map((cat) => (
          <Course key={cat._id} category={cat} />
        ))}
      </article>
    </section>
  );
}

export default Courses;
