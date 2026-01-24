import { useI18n } from "../hooks/useI18n";
import { Link } from "react-router-dom";
import bg from "../assets/bgcourses-Photoroom.png";
import { FadeLoader } from "react-spinners";
import formatDuration from "@/utilities/formatDuration";
import countryToCurrency from "@/utilities/countryToCurrency";
import useCurrencyExchange from "@/hooks/useCurrencyExchange";
import useClientLocation from "@/hooks/useClientLocation";

function Option({ option, isBooking = false }) {
  const { t, currentLocale, localizePath } = useI18n();
  const AR = currentLocale === "ar";
  const {
    loading: exchangeLoading,
    convert,
  } = useCurrencyExchange("usd");

  // Use the custom hook to get geo data
  const { geoData, loading: locationLoading } = useClientLocation();

  // Determine target currency based on geo data
  const targetCurrency = geoData?.country_code
    ? countryToCurrency[geoData.country_code]?.toLowerCase() || "usd"
    : "usd";

  const convertedPriceBefore = convert(
    option.priceBefore,
    targetCurrency
  )?.toFixed(2);
  const convertedPriceAfter = convert(
    option.priceAfter,
    targetCurrency
  )?.toFixed(2);

  const loading = locationLoading || exchangeLoading;

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center">
          <FadeLoader color="#0d5cae" />
        </div>
      ) : (
        <article
          data-aos="fade-up"
          data-aos-delay="1000"
          data-aos-duration="1500"
          className="text-center text-white space-y-5 bg-[#0d5cae] rounded-3xl py-4 px-3 relative overflow-hidden"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-[#0d5cae]/90 rounded-3xl h-full z-10"></div>

          <div className="relative z-20 space-y-8 mt-4">
            <h1 className="text-xl md:text-3xl text-[var(--Yellow)] font-bold">
              {option?.levelno}{" "}
              {t("courses", option?.levelno <= (AR ? 2 : 1) ? "level" : "levels", option?.levelno <= (AR ? 2 : 1) ? "Level" : "Levels")}
            </h1>

            <div className="space-y-4">
              {option.priceBefore !== 0 && (
                <h3 className="text-4xl md:text-xl line-through text-gray-200">
                  {loading
                    ? "Loading..."
                    : Number(option.priceBefore) > 0
                      ? convertedPriceBefore != null
                        ? `${convertedPriceBefore} ${targetCurrency.toUpperCase()}`
                        : `${option.priceBefore} USD`
                      : null}
                </h3>
              )}
              <h3 className="text-4xl md:text-4xl font-bold">
                {loading
                  ? "Loading..."
                  : convertedPriceAfter != null
                    ? `${convertedPriceAfter} ${targetCurrency.toUpperCase()}`
                    : `${option.priceAfter} USD`}
              </h3>
            </div>

            <div className="space-y-6 text-2xl">
              <h1>
                {option?.sessionNo}{" "}
                {t(
                  "courses",
                  option?.sessionNo <= (AR ? 2 : 1) ||
                    (option?.sessionNo > 10 && AR)
                    ? "session"
                    : "sessions",
                  option?.sessionNo <= (AR ? 2 : 1) ? "Session" : "Sessions"
                )}
              </h1>
              <p>{formatDuration(option?.totalTimeInWeeks, t, AR)}</p>
              <p>
                {typeof option?.sessionPerWeek === "object"
                  ? option.sessionPerWeek.count
                  : option?.sessionPerWeek}{" "}
                {t(
                  "courses",
                  "sessionsPerWeek",
                  "Sessions per week"
                )}
              </p>
              <p>
                {" "}
                {option?.hours}{" "}
                {t(
                  "courses",
                  "hours",
                  "Hours"
                )}
              </p>
              <p>{t("courses", option?.scheduleType, option?.scheduleType)}</p>
            </div>

            {!isBooking && (
              <Link
                to={localizePath(`/ApplicationForm/${targetCurrency}/${option._id}`)}
                onClick={() => {
                  window.scroll(0, 0);
                }}
                className={`bg-white p-3 text-black  rounded-3xl w-full block`}
              >
                {t("courses", "enroll", "Enroll Now")}
              </Link>
            )}
          </div>
        </article>
      )}
    </>
  );
}

export default Option;
