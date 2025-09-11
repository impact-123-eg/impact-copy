import Course from "../Components/Course";
import { useTranslation } from "react-i18next";
import { useGetAllcategories } from "@/hooks/Actions/categories/useCategoryCruds";

function Courses() {
  const { t } = useTranslation();
  const { data: catData } = useGetAllcategories();
  const categories = catData?.data || [];

  return (
    <section className="px-10 md:px-60">
      <h1 data-aos="fade-up" className="font-bold text-3xl py-5 mb-8">
        {t("ourcorses")}
      </h1>

      <article
        data-aos="fade-up"
        data-aos-delay="1000"
        className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6"
      >
        {categories.map((cat) => (
          <Course key={cat._id} category={cat} />
        ))}
        {/* <Course
          direc="IELTS"
          title={t("courses.ielts")}
          selectedCourse="IELTS"
        />
        <Course
          direc="Group"
          title={t("courses.group")}
          selectedCourse="Group"
        />
        <Course
          direc="Private"
          title={t("courses.private")}
          selectedCourse="Private"
        /> */}
      </article>
    </section>
  );
}

export default Courses;
