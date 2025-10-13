import React, { useState } from "react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  useAddAvailability,
  useGetAllAvailabilities,
} from "@/hooks/Actions/availabilities/useAvailabilityCruds";
import AvailabilityForm from "@/Components/dashboard/AvailabilityForm";
import AvailabilityList from "@/Components/dashboard/AvailabilityList";

const Availability = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [availabilityData, setAvailabilityData] = useState([]);

  // Use your custom hook for data fetching
  const {
    data: fetchedAvailabilities,
    isLoading,
    refetch,
  } = useGetAllAvailabilities();
  const { mutate: mutateAddAvailability, isPending: isAdding } =
    useAddAvailability();

  const availabilities = fetchedAvailabilities?.data || [];

  const handleDateChange = (date) => {
    setSelectedDate(() => date);
    setAvailabilityData(() => {
      return (
        availabilities.filter((item) => item?.date === formatDate(date))[0] ||
        {}
      );
    });
  };

  const handleCreateAvailability = (data) => {
    mutateAddAvailability(
      { data: data },
      {
        onSuccess: () => {
          setShowForm(false);
          refetch();
        },
      }
    );
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const getDayName = (date) => {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  return (
    <main className="space-y-6 max-w-6xl mx-auto p-6">
      <h1 className="font-bold text-2xl text-[var(--Main)]">
        Manage Availability
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-6">
          <h2 className="font-medium text-lg text-[var(--Main)]">
            Select Date
          </h2>

          <div className="flex justify-center">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              minDate={new Date()}
              className="rounded-xl border border-[var(--Input)]"
            />
          </div>

          <button
            onClick={() => setShowForm(true)}
            disabled={isLoading}
            className="w-full py-2 bg-[var(--Yellow)] hover:bg-opacity-90 transition-colors rounded-xl disabled:opacity-50"
          >
            Set Availability for {selectedDate.toDateString()}
          </button>
        </div>

        {/* Availability List Section */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-medium text-lg text-[var(--Main)] mb-4">
            Existing Availability for
            <span className="font-medium text-base text-[var(--SubText)] ml-2">
              "
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              "
            </span>
          </h2>
          {isLoading ? (
            <div className="text-center py-4 text-[var(--SubText)]">
              Loading availability...
            </div>
          ) : (
            <AvailabilityList availability={availabilityData} />
          )}
        </div>
      </div>

      {showForm && (
        <AvailabilityForm
          date={formatDate(selectedDate)}
          day={getDayName(selectedDate)}
          onSubmit={handleCreateAvailability}
          onCancel={() => setShowForm(false)}
        />
      )}
    </main>
  );
};

export default Availability;
