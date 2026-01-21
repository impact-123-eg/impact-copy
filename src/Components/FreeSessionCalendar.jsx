// components/FreeSessionCalendar.jsx
import React, { useState } from "react";
import { useTranslation } from "../../node_modules/react-i18next";
import { useGetAvailableSlotsForUser } from "@/hooks/Actions/free-sessions/useFreeSessionBookingCruds";

const FreeSessionCalendar = ({ onSlotSelect }) => {
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch upcoming available slots (next 14 days)
  const {
    data: upcomingSlotsRes,
    isLoading,
    error,
  } = useGetAvailableSlotsForUser();

  const upcomingSlots = upcomingSlotsRes?.data?.data || [];

  // Generate dates for the next 14 days, starting 2 days from today
  const generateDates = () => {
    const dates = [];
    const base = new Date();
    base.setDate(base.getDate() + 2); // skip today and tomorrow

    for (let i = 0; i < 14; i++) {
      const date = new Date(base);
      date.setDate(base.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const dates = generateDates();

  // Format a date as YYYY-MM-DD in LOCAL time (avoid UTC shifts)
  const formatLocalYMD = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const getSlotsForDate = (date) => {
    if (!upcomingSlots) return [];

    // Create date at start of day in local timezone
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);

    // Format date as YYYY-MM-DD
    const dateString =
      localDate.getFullYear() +
      "-" +
      String(localDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(localDate.getDate()).padStart(2, "0");

    return upcomingSlots?.find((day) => day.date === dateString)?.slots || [];
  };

  const localeWithLatn = i18n.language === "ar" ? "ar-EG-u-nu-latn" : "en-US";

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(localeWithLatn, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date for display
  const formatDisplayDate = (date) => {
    return date.toLocaleDateString(localeWithLatn, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get short weekday names based on language
  const getShortWeekday = (date) => {
    return date.toLocaleDateString(localeWithLatn, {
      weekday: "short",
    });
  };

  // Get short month names based on language
  const getShortMonth = (date) => {
    return date.toLocaleDateString(localeWithLatn, {
      month: "short",
    });
  };

  // RTL support
  const isRTL = i18n.language === "ar";
  const textDirection = isRTL ? "rtl" : "ltr";
  const textAlignment = isRTL ? "text-right" : "text-left";

  if (isLoading) {
    return (
      <div className="text-center py-8" dir={textDirection}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--Yellow)] mx-auto"></div>
        <p className="mt-2 text-[var(--SubText)]">{t("loadingSlots")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500" dir={textDirection}>
        {t("failedToLoadSlots")}
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={textDirection}>
      {/* Calendar Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {dates.map((date, index) => {
          const dateString = formatLocalYMD(date);
          const slots = getSlotsForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();
          const isSelected = selectedDate === dateString;

          return (
            <div
              key={dateString}
              onClick={() => slots.length > 0 && setSelectedDate(dateString)}
              className={`p-3 sm:p-4 border rounded-lg transition-all ${slots.length > 0
                  ? "cursor-pointer hover:border-[var(--Yellow)] hover:shadow-sm"
                  : "cursor-not-allowed opacity-50"
                } ${isSelected
                  ? "border-[var(--Yellow)] bg-yellow-50 ring-2 ring-[var(--Yellow)] ring-opacity-50"
                  : "border-[var(--Input)]"
                }`}
            >
              {/* Date Header */}
              <div className={`text-center mb-2 ${textAlignment}`}>
                <div
                  className={`text-xs sm:text-sm font-medium ${isToday ? "text-[var(--Yellow)]" : "text-[var(--Main)]"
                    }`}
                >
                  {getShortWeekday(date)}
                </div>
                <div className="text-base sm:text-lg font-bold text-[var(--Main)]">
                  {date.getDate().toLocaleString("en-US")}
                </div>
                <div className="text-xs text-[var(--SubText)]">
                  {getShortMonth(date)}
                </div>
              </div>

              {/* Slots Count */}
              {slots.length > 0 && (
                <div className={`text-center ${textAlignment}`}>
                  <div className="text-xs text-[var(--SubText)]">
                    {slots.length.toLocaleString("en-US")}{" "}
                    {t("timeSlotForm.one", { count: slots.length })}
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    {t("available")}
                  </div>
                </div>
              )}

              {slots.length === 0 && (
                <div
                  className={`text-center text-xs text-[var(--SubText)] ${textAlignment}`}
                >
                  {t("noSlots")}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Date Slots */}
      {selectedDate && (
        <div className="bg-[var(--Light)] p-4 sm:p-6 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
            <h3
              className={`font-bold text-lg text-[var(--Main)] ${textAlignment}`}
            >
              {t("availableSlotsFor")}{" "}
              {formatDisplayDate(new Date(selectedDate))}
            </h3>
            {/* <button
              onClick={() => setSelectedDate(null)}
              className={`text-sm text-[var(--SubText)] hover:text-[var(--Main)] transition-colors ${
                isRTL ? "sm:self-start" : "sm:self-end"
              }`}
            >
              {t("changeSlot")}
            </button> */}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {(() => {
              const selectedDay = upcomingSlots?.find(
                (day) => day.date === selectedDate
              );
              const slots = selectedDay?.slots || [];

              if (slots.length === 0) {
                return (
                  <div
                    className={`col-span-full text-center py-4 text-[var(--SubText)] ${textAlignment}`}
                  >
                    {t("noSlotsForDate")}
                  </div>
                );
              }

              return slots.map((slot) => (
                <div
                  key={slot._id}
                  onClick={() => onSlotSelect(slot)}
                  className="p-3 sm:p-4 bg-white border border-[var(--Input)] rounded-lg cursor-pointer hover:border-[var(--Yellow)] hover:shadow-sm transition-all"
                >
                  <div
                    className={`font-medium text-[var(--Main)] ${textAlignment}`}
                  >
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </div>
                  {/* {slot.availableGroupsCount && (
                    <div
                      className={`text-sm text-[var(--SubText)] mt-1 ${textAlignment}`}
                    >
                      {slot.availableGroupsCount}{" "}
                      {t("group", { count: slot.availableGroupsCount })}{" "}
                      {t("available")}
                    </div>
                  )} */}
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {/* Mobile Navigation Help Text */}
      <div
        className={`text-center text-sm text-[var(--SubText)] md:hidden ${textAlignment}`}
      >
        {t("scrollHorizontalHint")}
      </div>
    </div>
  );
};

export default FreeSessionCalendar;
