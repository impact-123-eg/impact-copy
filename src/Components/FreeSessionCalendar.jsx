// components/FreeSessionCalendar.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetAvailableSlotsForUser } from "@/hooks/Actions/free-sessions/useFreeSessionBookingCruds";
import { Calendar } from "@/Components/ui/calendar";
import { addDays, format, isSameDay } from "date-fns";
import { ar, enUS } from "date-fns/locale";

const FreeSessionCalendar = ({
  onSlotSelect,
  onDateSelect,
  externalDate,
  setExternalDate,
  isAdmin = false,
  showSlots = true
}) => {
  const { t, i18n } = useTranslation();
  const [internalDate, setInternalDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const date = externalDate !== undefined ? externalDate : internalDate;
  const setDate = (d) => {
    if (setExternalDate) setExternalDate(d);
    else setInternalDate(d);
    if (onDateSelect) onDateSelect(d);
    setSelectedSlot(null); // Reset selected slot when date changes
  };

  // Fetch upcoming available slots (next 14 days)
  const {
    data: upcomingSlotsRes,
    isLoading,
    error,
  } = useGetAvailableSlotsForUser();

  const upcomingSlots = upcomingSlotsRes?.data?.data || [];

  // Parse slots to identify days with availability
  const availableDates = upcomingSlots
    .filter((day) => day.slots && day.slots.length > 0)
    .map((day) => new Date(day.date));

  // Determine selectable range (Only for non-admins)
  const today = new Date();
  const maxDate = addDays(today, 14);

  const isDayDisabled = (d) => {
    if (isAdmin) return false; // Admin can select any date
    // Disable past dates, today (if desired?), and dates beyond 14 days
    if (d < new Date().setHours(0, 0, 0, 0)) return true;
    if (d > maxDate) return true;
    return false;
  };

  const hasSlots = (d) => {
    return availableDates.some((avail) => isSameDay(avail, d));
  };

  const getSlotsForDate = (d) => {
    if (!d) return [];
    const dateStr = format(d, "yyyy-MM-dd");
    return upcomingSlots.find((day) => day.date === dateStr)?.slots || [];
  };

  const selectedSlots = getSlotsForDate(date);
  const isRTL = i18n.language === "ar";
  const dateFnsLocale = isRTL ? ar : enUS;

  // Formatting helpers
  const formatTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString(isRTL ? "ar-EG" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading && !isAdmin) { // Admin might not want to wait for "user" availability slots
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--Yellow)]"></div>
      </div>
    );
  }

  // if (error && !isAdmin) return <div className="text-red-500 text-center">{t("failedToLoadSlots")}</div>;

  return (
    <div className={`flex flex-col ${showSlots ? "md:flex-row" : ""} gap-8 items-start justify-center`}>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <Calendar
          size="lg"
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={isDayDisabled}
          locale={dateFnsLocale}
          dir={isRTL ? "rtl" : "ltr"}
          className="rounded-md border"
          modifiers={{ hasSlots: (d) => hasSlots(d) }}
          modifiersClassNames={{
            hasSlots: "font-bold text-[var(--Main)] underline decoration-[var(--Yellow)] decoration-2 underline-offset-4"
          }}
          footer={
            !isAdmin && (
              <div className="mt-4 text-xs text-gray-500 text-center">
                * {t("daysMarkedHaveSlots", { defaultValue: "Underlined days have available slots" })}
              </div>
            )
          }
        />
      </div>

      {showSlots && (
        <div className="flex-1 w-full max-w-md">
          {date ? (
            <div>
              <h3 className="font-bold text-lg mb-4 text-[var(--Main)]">
                {format(date, "EEEE, MMMM do", { locale: dateFnsLocale })}
              </h3>
              {selectedSlots.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {selectedSlots.map(slot => (
                    <button
                      key={slot._id}
                      onClick={() => {
                        setSelectedSlot(slot);
                        if (onSlotSelect) onSlotSelect(slot);
                      }}
                      className={`p-3 rounded-lg border transition-all text-sm font-medium
                             ${selectedSlot?._id === slot._id
                          ? "bg-[var(--Main)] text-white border-[var(--Main)]"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[var(--Yellow)] hover:bg-yellow-50"
                        }
                          `}
                    >
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-500 italic">
                  {t("noSlotsForDate")}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-gray-400 border-2 border-dashed rounded-xl">
              {t("selectDateFirst", { defaultValue: "Please select a date from the calendar" })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export default FreeSessionCalendar;
