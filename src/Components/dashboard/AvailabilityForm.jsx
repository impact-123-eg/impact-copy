import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  slots: Yup.array()
    .of(
      Yup.object({
        start: Yup.string().required("Start time is required"),
        end: Yup.string()
          .required("End time is required")
          .test(
            "is-after-start",
            "End time must be after start time",
            function (value) {
              const { start } = this.parent;
              return !start || !value || value > start;
            }
          ),
        groups: Yup.array()
          .of(
            Yup.object({
              level: Yup.string()
                .oneOf(
                  ["Starter", "Beginner", "Intermediate", "Advanced"],
                  "Please select a valid level"
                )
                .required("Level is required"),
              instructor: Yup.string().optional(),
            })
          )
          .min(1, "At least one group is required"),
      })
    )
    .min(1, "At least one time slot is required"),
});

// Generate time options in 30-minute intervals
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      options.push(timeString);
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

const AvailabilityForm = ({ date, day, onSubmit, onCancel }) => {
  const formik = useFormik({
    initialValues: {
      slots: [
        {
          start: "09:00",
          end: "10:00",
          groups: [{ level: "", instructor: "" }],
        },
      ],
    },
    validationSchema,
    onSubmit: (values) => {
      const availabilityData = {
        date,
        day,
        slots: values.slots.map((slot) => ({
          start: slot.start,
          end: slot.end,
          groups: slot.groups.map((group) => ({
            level: group.level,
            instructor: group.instructor || undefined,
          })),
        })),
      };
      onSubmit(availabilityData);
    },
  });

  const addSlot = () => {
    const lastSlot = formik.values.slots[formik.values.slots.length - 1];
    const newEndTime = lastSlot ? lastSlot.end : "10:00";
    const newStartTime = incrementTime(newEndTime, 30); // Start next slot 30 mins after previous ends

    const newSlots = [
      ...formik.values.slots,
      {
        start: newStartTime,
        end: incrementTime(newStartTime, 60),
        groups: [{ level: "", instructor: "" }],
      },
    ];
    formik.setFieldValue("slots", newSlots);
  };

  const removeSlot = (index) => {
    if (formik.values.slots.length <= 1) return;
    const newSlots = formik.values.slots.filter((_, i) => i !== index);
    formik.setFieldValue("slots", newSlots);
  };

  const addGroup = (slotIndex) => {
    const newSlots = [...formik.values.slots];
    newSlots[slotIndex].groups.push({ level: "", instructor: "" });
    formik.setFieldValue("slots", newSlots);
  };

  const removeGroup = (slotIndex, groupIndex) => {
    if (formik.values.slots[slotIndex].groups.length <= 1) return;
    const newSlots = [...formik.values.slots];
    newSlots[slotIndex].groups = newSlots[slotIndex].groups.filter(
      (_, i) => i !== groupIndex
    );
    formik.setFieldValue("slots", newSlots);
  };

  const handleSlotChange = (slotIndex, field, value) => {
    const newSlots = [...formik.values.slots];
    newSlots[slotIndex][field] = value;

    // Auto-adjust end time if start time changes and end is before start
    if (field === "start" && newSlots[slotIndex].end <= value) {
      newSlots[slotIndex].end = incrementTime(value, 60);
    }

    formik.setFieldValue("slots", newSlots);
  };

  const handleGroupChange = (slotIndex, groupIndex, field, value) => {
    const newSlots = [...formik.values.slots];
    newSlots[slotIndex].groups[groupIndex][field] = value;
    formik.setFieldValue("slots", newSlots);
  };

  // Helper function to increment time by minutes
  const incrementTime = (timeString, minutesToAdd) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + minutesToAdd;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, "0")}:${newMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-2xl text-[var(--Main)]">
              Create Availability for {date} ({day})
            </h2>
            <button
              onClick={onCancel}
              className="p-2 text-[var(--SubText)] hover:text-[var(--Main)] rounded-full hover:bg-[var(--Light)]"
            >
              ✕
            </button>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {formik.values.slots.map((slot, slotIndex) => (
              <div
                key={slotIndex}
                className="p-4 bg-[var(--Light)] rounded-xl space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg text-[var(--Main)]">
                    Time Slot #{slotIndex + 1}
                  </h3>
                  {formik.values.slots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSlot(slotIndex)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm"
                    >
                      Remove Slot
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {/* Start Time Input */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--Main)] mb-2">
                      Start Time
                    </label>
                    <select
                      value={slot.start}
                      onChange={(e) =>
                        handleSlotChange(slotIndex, "start", e.target.value)
                      }
                      className={`w-full bg-white py-2 px-4 rounded-lg border ${
                        formik.touched.slots &&
                        formik.errors.slots &&
                        formik.errors.slots[slotIndex]?.start
                          ? "border-red-500"
                          : "border-[var(--Input)]"
                      }`}
                    >
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    {formik.touched.slots &&
                    formik.errors.slots &&
                    formik.errors.slots[slotIndex]?.start ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.slots[slotIndex].start}
                      </div>
                    ) : null}
                  </div>

                  {/* End Time Input */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--Main)] mb-2">
                      End Time
                    </label>
                    <select
                      value={slot.end}
                      onChange={(e) =>
                        handleSlotChange(slotIndex, "end", e.target.value)
                      }
                      className={`w-full bg-white py-2 px-4 rounded-lg border ${
                        formik.touched.slots &&
                        formik.errors.slots &&
                        formik.errors.slots[slotIndex]?.end
                          ? "border-red-500"
                          : "border-[var(--Input)]"
                      }`}
                    >
                      {timeOptions
                        .filter((time) => time > slot.start)
                        .map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                    </select>
                    {formik.touched.slots &&
                    formik.errors.slots &&
                    formik.errors.slots[slotIndex]?.end ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.slots[slotIndex].end}
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Groups Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-[var(--Main)]">Groups</h4>
                    <button
                      type="button"
                      onClick={() => addGroup(slotIndex)}
                      className="px-3 py-1 bg-[var(--Yellow)] hover:bg-opacity-90 transition-colors rounded-xl text-sm"
                    >
                      Add Group
                    </button>
                  </div>

                  {slot.groups.map((group, groupIndex) => (
                    <div
                      key={groupIndex}
                      className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 items-start p-3 bg-white rounded-lg"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[var(--Main)] mb-2">
                          Group Level
                        </label>
                        <select
                          value={group.level}
                          onChange={(e) =>
                            handleGroupChange(
                              slotIndex,
                              groupIndex,
                              "level",
                              e.target.value
                            )
                          }
                          className={`w-full bg-[var(--Input)] py-2 px-4 rounded-lg border ${
                            formik.touched.slots &&
                            formik.errors.slots &&
                            formik.errors.slots[slotIndex]?.groups &&
                            formik.errors.slots[slotIndex].groups[groupIndex]
                              ?.level
                              ? "border-red-500"
                              : "border-transparent"
                          }`}
                        >
                          <option value="">Select Level</option>
                          <option value="Starter">Starter</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                        {formik.touched.slots &&
                        formik.errors.slots &&
                        formik.errors.slots[slotIndex]?.groups &&
                        formik.errors.slots[slotIndex].groups[groupIndex]
                          ?.level ? (
                          <div className="text-red-500 text-sm mt-1">
                            {
                              formik.errors.slots[slotIndex].groups[groupIndex]
                                .level
                            }
                          </div>
                        ) : null}
                      </div>

                      <div className="flex items-end space-x-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-[var(--Main)] mb-2">
                            Instructor (Optional)
                          </label>
                          <input
                            type="text"
                            value={group.instructor}
                            onChange={(e) =>
                              handleGroupChange(
                                slotIndex,
                                groupIndex,
                                "instructor",
                                e.target.value
                              )
                            }
                            placeholder="Instructor name"
                            className="w-full bg-[var(--Input)] py-2 px-4 rounded-lg border border-transparent"
                          />
                        </div>

                        {slot.groups.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeGroup(slotIndex, groupIndex)}
                            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {formik.touched.slots &&
                  formik.errors.slots &&
                  formik.errors.slots[slotIndex]?.groups &&
                  typeof formik.errors.slots[slotIndex].groups === "string" ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.slots[slotIndex].groups}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            {formik.touched.slots && typeof formik.errors.slots === "string" ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.slots}
              </div>
            ) : null}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={addSlot}
                className="px-6 py-2 bg-[var(--Light)] text-[var(--Main)] rounded-xl hover:bg-opacity-80 transition-colors order-2 sm:order-1"
              >
                + Add Another Time Slot
              </button>
              <div className="flex gap-4 order-1 sm:order-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-2 border border-[var(--SubText)] text-[var(--SubText)] rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[var(--Yellow)] hover:bg-opacity-90 transition-colors rounded-xl"
                >
                  Save Availability
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityForm;
