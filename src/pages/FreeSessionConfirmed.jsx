import { useI18n } from "../hooks/useI18n";

const FreeSessionConfirmed = () => {
  const { t, currentLocale, initialize, loading, localizePath } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const name = searchParams.get("name");

  useEffect(() => {
    initialize();
    window.scrollTo(0, 0);
  }, [initialize]);

  const handleBackToHome = () => {
    navigate(localizePath("/"));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--Yellow)]"></div>
      </div>
    );
  }

  const confirmedMessage = name
    ? t("free-session", "bookingConfirmedFor", "Your free session has been confirmed, {name}!").replace("{name}", name)
    : t("free-session", "bookingConfirmedGeneric", "Your free session has been confirmed!");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-12 h-12 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-green-600 mb-4">
          {t("free-session", "bookingConfirmed", "Booking Confirmed!")}
        </h1>

        <div className="space-y-4 mb-8">
          <p className="text-lg text-[var(--SubText)] leading-relaxed">
            {confirmedMessage}
          </p>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <svg
                className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1 text-start">
                <p className="text-green-800 font-medium">{t("free-session", "allSet", "You're all set!")}</p>
                <p className="text-green-600 text-sm mt-1">
                  {t("free-session", "seeYouAtSession")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-6">
            <h3 className="font-semibold text-blue-800 mb-3 text-start">
              {t("free-session", "whatsNext", "What's Next?")}
            </h3>
            <ul className="text-blue-700 text-sm space-y-2 list-disc list-inside text-start">
              <li>{t("free-session", "joinOnTime")}</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleBackToHome}
            className="px-8 py-3 rounded-2xl bg-green-600 text-white hover:bg-green-700 transition-colors font-medium"
          >
            {t("free-session", "backToHome", "Back to Home")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeSessionConfirmed;
