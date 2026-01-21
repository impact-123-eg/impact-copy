/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useTranslation } from "../../node_modules/react-i18next";
import { Link } from "react-router-dom";
import bg from "../assets/bgcourses-Photoroom.png";
// import { GlobalContext } from "../context/GlobelContext";
import { FadeLoader } from "react-spinners";
import formatDuration from "@/utilities/formatDuration";

function Option({ option }) {
  const { t, i18n } = useTranslation();
  // const [ip, setIp] = useState(null);
  const [finalPriceBefore, setFinalPriceBefore] = useState(null);
  const [finalPriceAfter, setFinalPriceAfter] = useState(null);
  const [loading, setLoading] = useState(false);
  const AR = i18n.language === "ar";
  // const { setPrice, setRealPrice } = useContext(GlobalContext);

  // import React, { useEffect, useState } from 'react';
  // import axios from 'axios';

  // const ExchangeRateByIP = () => {
  //   const [exchangeRate, setExchangeRate] = useState(null);
  //   const [currency, setCurrency] = useState(null);
  //   const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchExchangeRate = async () => {
  //     try {
  //       // 1. Get the IP address and country information
  //       const ipResponse = await axios.get('https://api.ipify.org?format=json');
  //       const ip = ipResponse.data.ip;

  //       const geoResponse = await axios.get(http://ip-api.com/json/${ip});
  //       const countryCode = geoResponse.data.countryCode;

  //       // 2. Get the exchange rate based on the country code (currency)
  //       const exchangeResponse = await axios.get(https://api.exchangerate-api.com/v4/latest/USD);

  //       // Assuming we are converting from USD to the local currency
  //       const rate = exchangeResponse.data.rates[countryCode];

  //       setCurrency(countryCode);
  //       setExchangeRate(rate);
  //     } catch (err) {
  //       setError('Error fetching data');
  //       console.error(err);
  //     }
  //   };

  //   fetchExchangeRate();
  // }, []);

  // useEffect(() => {
  //   async function fetchIP() {
  //     try {
  //       const response = await fetch("https://api64.ipify.org?format=json");
  //       const data = await response.json();
  //       setIp(data.ip);
  //       console.log(data)
  //     } catch (error) {
  //       console.error("Error fetching IP:", error);
  //     }
  //   }
  //   fetchIP();
  // }, []);
  // useEffect(() => {
  //   if (!ip) return; // Prevent fetch before IP is available
  //   async function fetchCurrency() {
  //     setLoading(true);
  //     try {
  //       const [beforeRes, afterRes] = await Promise.all([
  //         fetch("https://impact-backend-ebon.vercel.app/get-currency", {
  //           method: "POST",
  //           headers: { "Content-type": "application/json" },
  //           body: JSON.stringify({ ip, priceUSD: props.priceBefore }),
  //         }),
  //         fetch("https://impact-backend-ebon.vercel.app/get-currency", {
  //           method: "POST",
  //           headers: { "Content-type": "application/json" },
  //           body: JSON.stringify({ priceUSD: props.priceAfter }),
  //         }),
  //       ]);

  //       const finalDataBefore = await beforeRes.json();
  //       const finalDataAfter = await afterRes.json();

  //       if (finalDataBefore) setFinalPriceBefore(finalDataBefore.finalPrice);
  //       if (finalDataAfter) setFinalPriceAfter(finalDataAfter.finalPrice);
  //     } catch (error) {
  //       console.error("Error fetching currency data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchCurrency();
  // }, [ip, props.priceBefore, props.priceAfter]);
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        // 1. Get the IP address and country information
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        const ip = ipData.ip;
        // https://ipinfo.io/8.8.8.8/json
        // const geoResponse = await fetch(`https://ipinfo.io/${ip}/json`);
        // const geoData = await geoResponse.json();
        // const countryCode = geoData.country;

        const geoResponse = await fetch(`https://ipwho.is/${ip}`);
        const geoData = await geoResponse.json();
        const countryCode = geoData.country_code;

        // 2. Map country to currency code
        const countryToCurrency = {
          AD: "EUR",
          AE: "AED",
          AF: "AFN",
          AG: "XCD",
          AI: "XCD",
          AL: "ALL",
          AM: "AMD",
          AO: "AOA",
          AR: "ARS",
          AS: "USD",
          AT: "EUR",
          AU: "AUD",
          AW: "AWG",
          AX: "SEK",
          AZ: "AZN",
          BA: "BAM",
          BB: "BBD",
          BD: "BDT",
          BE: "EUR",
          BF: "CFA",
          BG: "BGN",
          BH: "BHD",
          BI: "BIF",
          BJ: "CFA",
          BL: "EUR",
          BM: "BMD",
          BN: "BND",
          BO: "BOB",
          BQ: "USD",
          BR: "BRL",
          BS: "BSD",
          BT: "BTN",
          BV: "NOK",
          BW: "BWP",
          BY: "BYN",
          BZ: "BZD",
          CA: "CAD",
          CC: "AUD",
          CD: "CDF",
          CF: "XAF",
          CG: "CDF",
          CH: "CHF",
          CI: "CFA",
          CK: "NZD",
          CL: "CLP",
          CM: "XAF",
          CN: "CNY",
          CO: "COP",
          CR: "CRC",
          CU: "CUP",
          CV: "CVE",
          CW: "ANG",
          CX: "AUD",
          CY: "CYP",
          CZ: "CZK",
          DE: "EUR",
          DJ: "DJF",
          DK: "DKK",
          DM: "DOP",
          DO: "DOM",
          DZ: "DZD",
          EC: "USD",
          EE: "EEK",
          EG: "EGP",
          EH: "MAD",
          ER: "ERN",
          ES: "EUR",
          ET: "ETB",
          FI: "FIN",
          FJ: "FJD",
          FM: "USD",
          FO: "DKK",
          FR: "EUR",
          GA: "GAB",
          GB: "GBP",
          GD: "GDS",
          GE: "GEL",
          GF: "GFR",
          GG: "GEL",
          GH: "GHS",
          GI: "GIP",
          GL: "DKK",
          GM: "BAM",
          GN: "GNF",
          GP: "USD",
          GQ: "GNF",
          GR: "GRD",
          GT: "GTQ",
          GU: "USD",
          GW: "GNF",
          GY: "GYD",
          HK: "HKD",
          HM: "AUD",
          HN: "HNL",
          HR: "HRK",
          HT: "HTG",
          HU: "HUF",
          ID: "IDR",
          IE: "EUR",
          IL: "ILS",
          IM: "GBP",
          IN: "INR",
          IO: "USD",
          IQ: "IQD",
          IR: "IRR",
          IS: "ISK",
          IT: "EUR",
          JE: "GBP",
          JM: "JMD",
          JO: "JOD",
          JP: "JPY",
          KE: "KES",
          KG: "KGS",
          KH: "KHR",
          KI: "AUD",
          KM: "COM",
          KN: "KNA",
          KP: "KPW",
          KR: "KRW",
          KW: "KWD",
          KY: "KYD",
          KZ: "KZT",
          LA: "LAK",
          LB: "LBP",
          LC: "XCD",
          LI: "CHF",
          LK: "LKR",
          LR: "LRD",
          LS: "LSL",
          LT: "LTL",
          LU: "EUR",
          LV: "LVL",
          LY: "LYD",
          MA: "MAD",
          MC: "EUR",
          MD: "MDL",
          ME: "EUR",
          MF: "EUR",
          MG: "MGA",
          MH: "MHT",
          MK: "MKD",
          ML: "CFA",
          MM: "MMK",
          MN: "MNT",
          MO: "MOP",
          MP: "USD",
          MQ: "EUR",
          MR: "MRO",
          MS: "MSD",
          MT: "MTL",
          MU: "MUR",
          MV: "MVR",
          MW: "MWK",
          MX: "MXN",
          MY: "MYR",
          MZ: "MZN",
          NA: "NAD",
          NC: "XPF",
          NE: "NGN",
          NF: "AUD",
          NG: "NGN",
          NI: "NIO",
          NL: "NLG",
          NO: "NOK",
          NP: "NPR",
          NR: "AUD",
          NU: "NZD",
          NZ: "NZD",
          OM: "OMR",
          PA: "PAB",
          PE: "PEN",
          PF: "XPF",
          PG: "PGK",
          PH: "PHP",
          PK: "PKR",
          PL: "PLN",
          PM: "EUR",
          PN: "XPF",
          PR: "USD",
          PT: "PTE",
          PW: "USD",
          PY: "PYG",
          QA: "QAR",
          RE: "EUR",
          RO: "RON",
          RS: "RSD",
          RU: "RUB",
          RW: "RWF",
          SA: "SAR",
          SB: "SBD",
          SC: "SCR",
          SD: "SDG",
          SE: "SEK",
          SG: "SGD",
          SH: "SHP",
          SI: "SIT",
          SJ: "NOK",
          SK: "SKK",
          SL: "SLL",
          SM: "EUR",
          SN: "XOF",
          SO: "SOS",
          SR: "SRD",
          SS: "SSP",
          ST: "STN",
          SV: "SVC",
          SX: "ANG",
          SY: "SYP",
          SZ: "SZL",
          TC: "USD",
          TD: "CDF",
          TF: "EUR",
          TG: "CFA",
          TH: "THB",
          TJ: "TJS",
          TK: "TKA",
          TL: "USD",
          TM: "TMT",
          TN: "TND",
          TO: "TOP",
          TR: "TRY",
          TT: "TTD",
          TV: "AUD",
          TZ: "TZS",
          UA: "UAH",
          UG: "UGX",
          UM: "USD",
          US: "USD",
          UY: "UYU",
          UZ: "UZS",
          VA: "EUR",
          VC: "VCT",
          VE: "VEF",
          VG: "USD",
          VI: "USD",
          VN: "VND",
          VU: "VUV",
          WF: "USD",
          WS: "WST",
          YE: "YER",
          YT: "EUR",
          ZA: "ZAR",
          ZM: "ZMW",
          ZW: "ZWL",
        };

        const currencyCode = countryToCurrency[countryCode] || "USD"; // fallback

        // 3. Get exchange rate
        const exchangeResponse = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const exchangeData = await exchangeResponse.json();
        const rate = exchangeData.rates[currencyCode];
        const formatPrice = (price, rate, currency) => {
          const converted = price * rate;

          return (
            (Number.isInteger(converted)
              ? Math.round(converted)
              : converted.toFixed(2)) + ` ${currency}`
          );
        };

        setFinalPriceAfter(formatPrice(option.priceAfter, rate, currencyCode));
        setFinalPriceBefore(
          formatPrice(option.priceBefore, rate, currencyCode)
        );
        console.log("Currency:", currencyCode);
        console.log("Exchange Rate:", rate);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchExchangeRate();
  }, []);

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
              {option?.levelno} {t(option?.levelno < 2 ? "level" : "levels")}
            </h1>

            <div className="space-y-4">
              {option.priceBefore !== 0 && (
                <h3 className="text-4xl md:text-xl line-through text-gray-200">
                  {loading
                    ? "Loading..."
                    : Number(option.priceBefore) > 0
                      ? finalPriceBefore || `${option.priceBefore} USD`
                      : null}
                </h3>
              )}
              <h3 className="text-4xl md:text-4xl font-bold">
                {loading
                  ? "Loading..."
                  : finalPriceAfter || option.priceAfter + " USD"}
              </h3>
            </div>

            <div className="space-y-6 text-2xl">
              <h1>
                {option?.sessionNo}{" "}
                {t(option?.sessionNo < (AR ? 2 : 1) ? "session" : "sessions")}
              </h1>
              <p>{formatDuration(option?.duration, t, AR)}</p>
              <p>
                {option?.sessionPerWeek}{" "}
                {t(option?.sessionPerWeek < 2 ? "session" : "sessions")}
              </p>
              <p>
                {" "}
                {option?.hours}{" "}
                {t(
                  option?.hours <= (AR ? 2 : 1)
                    ? "categories.hoursPerSession.one"
                    : "categories.hoursPerSession.more"
                )}
              </p>
              <p>{t(`categories.scheduleType.${option?.scheduleType}`)}</p>
            </div>

            <Link
              to={`/ApplicationForm/${props.id}`}
              // onClick={() => {
              //   window.scroll(0, 0),
              //     localStorage.setItem("pricereal", props.priceAfter),
              //     finalPriceAfter
              //       ? localStorage.setItem("price", finalPriceAfter)
              //       : null;
              //   localStorage.setItem("level", props.Name),
              //     localStorage.setItem("id", props.id);
              //   localStorage.setItem("levelAr", props.NameAr);
              // }}
              // state={{
              //   number: props.number,
              //   courseCategory: props.courseCategory,
              //   option: props.option,
              //   levelno: props.Name,
              //   NameAr: props.NameAr,
              //   priceAfter: finalPriceAfter || props.priceAfter,
              //   priceBefore: finalPriceBefore || props.priceBefore,
              //   duration: props.duration,
              //   totalTime: props.TotalTimeNo,
              //   SessionNoAr: props.SessionNoAr,
              //   SessionNo: props.SessionNo,
              //   sessionPerWeek: props.SessionPerWeek,
              //   sessionPerWeekAr: props.SessionPerWeekAr,
              //   Hours: props.Hours,
              //   HoursAr: props.HoursAr,
              //   scheduleType: props.ScheduleType,
              //   ScheduleTypeAr: props.ScheduleTypeAr,
              //   TotalTimeUnit: props.TotalTimeUnit,
              //   TotalTimeUnitAr: props.TotalTimeUnitAr,
              // }}
              className={`bg-white p-3 text-black  rounded-3xl w-full block`}
            >
              {t("enrll")}
            </Link>
          </div>
        </article>
      )}
    </>
  );
}

// export default Option;
