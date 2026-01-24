import { useNavigate } from "react-router-dom";
import { useI18n } from "../hooks/useI18n";
import bg from "../assets/bgcourses-Photoroom.png";

function Course(props) {
  const { t, currentLocale, localizePath } = useI18n();
  const navigate = useNavigate();
  const AR = currentLocale === "ar";
  const category = props.category;

  return (
    <article
      className="text-center text-white space-y-10 bg-[#0d5cae]/90 rounded-3xl py-4 px-3 relative overflow-hidden w-full md:w-80 flex-shrink-0"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-[#0d5cae]/90 h-full z-10"></div>

      <div className="relative z-20 space-y-10">
        <h1 className="text-3xl text-[#f5d019] font-bold">
          {AR ? category?.ar.title : category?.en.title}
        </h1>
        <h3 className="text-2xl font-bold">
          {t("courses", category?.sessionType, category?.sessionType)}
        </h3>

        <div className="space-y-8 text-md lg:text-xl">
          <p>
            {category?.hoursPerSession}{" "}
            {t("courses", "hours", "Hours")}
          </p>
          <p>
            {category?.sessionsPerWeek}{" "}
            {t("courses", "sessionsPerWeek", "Sessions per week")}
          </p>

          <p>{t("courses", category?.scheduleType, category?.scheduleType)}</p>
        </div>

        <button
          onClick={() => {
            navigate(localizePath(`/courses/${category._id}`));
            window.scroll(0, 0);
          }}
          className="bg-white p-3 my-2 text-black rounded-3xl w-full"
        >
          {t("courses", "moreDetails", "More Details")}
        </button>
      </div>
    </article>
  );
}


export default Course;
