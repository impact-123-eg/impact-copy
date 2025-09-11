import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { FaCalendarAlt, FaChartLine, FaClock } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { BsPersonVideo3 } from "react-icons/bs";
import { GiTeacher } from "react-icons/gi";
import Option from "../Components/Option";
import { useGetcategoryById } from "@/hooks/Actions/categories/useCategoryCruds";
import { useGetpackageByCategoryId } from "@/hooks/Actions/packages/usePackageCruds";

function CourseDetails() {
  const { i18n, t } = useTranslation();
  const { id: CategoryId } = useParams();
  const AR = i18n.language === "ar";
  const { data: catData } = useGetcategoryById({ id: CategoryId });
  const category = catData?.data || {};

  const { data: packData } = useGetpackageByCategoryId({
    id: CategoryId,
    enabled: !!CategoryId,
  });
  const packages = packData?.data || [];

  return (
    <main className="px-4 md:px-8 lg:px-12 xl:px-24 2xl:px-60 py-8 space-y-12 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
        {AR ? "تفاصيل الدورة" : "Course Details"}
      </h1>

      <section className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2
          data-aos="fade-left"
          className="text-2xl md:text-3xl font-semibold text-[var(--Yellow)]"
        >
          {AR ? category?.ar?.title : category?.en?.title}
        </h2>
        <p
          data-aos="fade-left"
          data-aos-delay="50"
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
        >
          {AR ? category?.ar?.description : category?.en?.description}
        </p>
      </section>

      <section className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">
          {AR ? "أبرز النقاط في الدورة" : "Course Highlights"}
        </h2>

        <ul className="space-y-5">
          <li data-aos="fade-left" data-aos-delay="100" key="student">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <IoPersonSharp className="text-[var(--Yellow)] text-2xl md:text-3xl flex-shrink-0" />
              <span className="text-base md:text-lg text-gray-700 dark:text-gray-200">
                {category?.studentNo}{" "}
                {t(
                  category?.studentNo <= (AR ? 2 : 1) ? "student" : "students"
                )}
              </span>
            </div>
          </li>
          <li data-aos="fade-left" data-aos-delay="200" key="level-assessment">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <BsPersonVideo3 className="text-[var(--Yellow)] text-2xl md:text-3xl flex-shrink-0" />
              <span className="text-base md:text-lg text-gray-700 dark:text-gray-200">
                {t(`categories.sessionType.${category?.sessionType}`)}
              </span>
            </div>
          </li>
          <li data-aos="fade-left" data-aos-delay="300" key="live-sessions">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <FaCalendarAlt className="text-[var(--Yellow)] text-2xl md:text-3xl flex-shrink-0" />
              <span className="text-base md:text-lg text-gray-700 dark:text-gray-200">
                {category?.sessionsPerWeek}{" "}
                {t(
                  category?.sessionsPerWeek <= (AR ? 2 : 1)
                    ? "session"
                    : "sessions"
                )}{" "}
                {AR ? "في الأسبوع" : "per week"}
              </span>
            </div>
          </li>
          <li
            data-aos="fade-left"
            data-aos-delay="400"
            key="weekly-conversation"
          >
            <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <FaClock className="text-[var(--Yellow)] text-2xl md:text-3xl flex-shrink-0" />
              <span className="text-base md:text-lg text-gray-700 dark:text-gray-200">
                {t(`categories.scheduleType.${category?.scheduleType}`)}
              </span>
            </div>
          </li>
        </ul>
      </section>

      <section className="space-y-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">
          {AR ? "الخيارات" : "Options"}
        </h2>

        <article className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages &&
            packages.map((opt) => <Option key={opt._id} option={opt} />)}
        </article>
      </section>
    </main>
  );
}

export default CourseDetails;
