import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import bg from "../assets/bgcourses-Photoroom.png";

function Course(props) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const AR = i18n.language === "ar";
  const category = props.category;

  return (
    <article
      className="text-center text-white space-y-10  bg-[#0d5cae]/90 rounded-3xl py-4 px-3 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0d5cae]/90 h-full z-10"></div>

      {/* Content */}
      <div className="relative z-20 space-y-10">
        <h1 className="text-3xl text-[#f5d019] font-bold">
          {AR ? category?.ar.title : category?.en.title}
        </h1>
        <h3 className="text-2xl font-bold">
          {t(`categories.sessionType.${category?.sessionType}`)}
        </h3>

        <div className="space-y-8 text-md lg:text-xl">
          <p>
            {category?.hoursPerSession}{" "}
            {t(
              category?.hoursPerSession <= (AR ? 2 : 1) ||
                (category?.hoursPerSession > 10 && AR)
                ? "categories.hoursPerSession.one"
                : "categories.hoursPerSession.more"
            )}
          </p>
          <p>
            {category?.sessionsPerWeek}{" "}
            {t(
              parseInt(category?.sessionsPerWeek) <= (AR ? 2 : 1)
                ? "categories.sessionsPerWeek.one"
                : "categories.sessionsPerWeek.more"
            )}
          </p>

          <p>{t(`categories.scheduleType.${category?.scheduleType}`)}</p>
        </div>

        <button
          onClick={() => {
            navigate(`/courses/${category._id}`);
            window.scroll(0, 0);
          }}
          className="bg-white p-3 my-2 text-black rounded-3xl w-full"
        >
          {t("categories.moreDetails")}
        </button>
      </div>
    </article>
  );
}

export default Course;
