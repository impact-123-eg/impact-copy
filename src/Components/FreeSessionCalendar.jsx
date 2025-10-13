// components/FreeSessionCalendar.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetAvailableSlotsForUser } from "@/hooks/Actions/free-sessions/useFreeSessionBookingCruds";

const FreeSessionCalendar = ({ onSlotSelect }) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch upcoming available slots (next 14 days)
  const {
    data: upcomingSlotsRes,
    isLoading,
    error,
  } = useGetAvailableSlotsForUser();

  const upcomingSlots = upcomingSlotsRes?.data?.data || [];
  console.log(upcomingSlots);

  // Generate dates for the next 14 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const dates = generateDates();
  console.log(dates);

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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--Yellow)] mx-auto"></div>
        <p className="mt-2 text-[var(--SubText)]">{t("loadingSlots")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {t("failedToLoadSlots")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Grid */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        {dates.map((date, index) => {
          const dateString = date.toISOString().split("T")[0];
          const slots = getSlotsForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();
          const isSelected = selectedDate === dateString;

          return (
            <div
              key={dateString}
              onClick={() => setSelectedDate(dateString)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? "border-[var(--Yellow)] bg-yellow-50 ring-2 ring-[var(--Yellow)] ring-opacity-50"
                  : "border-[var(--Input)] hover:border-[var(--Yellow)]"
              } ${slots.length === 0 ? "opacity-50" : ""}`}
            >
              {/* Date Header */}
              <div className="text-center mb-2">
                <div
                  className={`text-sm font-medium ${
                    isToday ? "text-[var(--Yellow)]" : "text-[var(--Main)]"
                  }`}
                >
                  {date.toLocaleDateString([], { weekday: "short" })}
                </div>
                <div className="text-lg font-bold text-[var(--Main)]">
                  {date.getDate()}
                </div>
                <div className="text-xs text-[var(--SubText)]">
                  {date.toLocaleDateString([], { month: "short" })}
                </div>
              </div>

              {/* Slots Count */}
              {slots.length > 0 && (
                <div className="text-center">
                  <div className="text-xs text-[var(--SubText)]">
                    {slots.length} time slot{slots.length !== 1 ? "s" : ""}
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    Available
                  </div>
                </div>
              )}

              {slots.length === 0 && (
                <div className="text-center text-xs text-[var(--SubText)]">
                  No slots
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Date Slots */}
      {selectedDate && (
        <div className="bg-[var(--Light)] p-6 rounded-lg">
          <h3 className="font-bold text-lg text-[var(--Main)] mb-4">
            Available slots for{" "}
            {new Date(selectedDate).toLocaleDateString([], {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingSlots
              ?.find((day) => day.date === selectedDate)
              ?.slots.map((slot) => (
                <div
                  key={slot._id}
                  onClick={() => onSlotSelect(slot)}
                  className="p-4 bg-white border border-[var(--Input)] rounded-lg cursor-pointer hover:border-[var(--Yellow)] hover:shadow-sm transition-all"
                >
                  <div className="font-medium text-[var(--Main)]">
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </div>
                  {/* <div className="text-sm text-[var(--SubText)] mt-1">
                    {slot.availableGroupsCount} group
                    {slot.availableGroupsCount !== 1 ? "s" : ""} available
                  </div> */}
                </div>
              )) || (
              <div className="text-center py-4 text-[var(--SubText)]">
                No available slots for this date
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeSessionCalendar;
