import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import bg from "../assets/bgcourses-Photoroom.png";

function Course(props) {
  const { t } = useTranslation(),
    navigate = useNavigate();

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
        <h1 className="text-3xl text-[#f5d019] font-bold">{props.title}</h1>
        <h3 className="text-2xl font-bold">{t("liveSession.title")}</h3>

        <div className="space-y-8 text-md lg:text-xl">
          <p> {t(
              props.selectedCourse === "Private"
                ? "liveSession.alone"
                : "liveSession.duration"
            )}</p>
          <p>
            {t(
              props.selectedCourse === "Group"
                ? "liveSession.Group"
                : "liveSession.sessionsPerWeek"
            )}
          </p>

          <p>{t(props.selectedCourse === "Group"
                ? "liveSession.schedule":
                "liveSession.avalible")}</p>
        </div>

        <button
          onClick={() => {
            navigate(`/courses/${props.direc}`);
            window.scroll(0, 0);
          }}
          className="bg-white p-3 my-2 text-black rounded-3xl w-full"
        >
          {t("liveSession.moreDetails")}
        </button>
      </div>
    </article>
  );
}

export default Course;
