import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
// import { useAddAvailability } from "@/hooks/Actions/availability/useAvailabilityCruds";

const validationSchema = Yup.object({
  date: Yup.date().required("Date is required"),
  day: Yup.string().required("Day is required"),
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
              level: Yup.string().required("Group level is required"),
              users: Yup.array().default([]),
            })
          )
          .min(1, "At least one group is required"),
      })
    )
    .min(1, "At least one time slot is required"),
});

function AddAvailability() {
  const navigate = useNavigate();
  //   const { mutate: addAvailability, isPending } = useAddAvailability();
  const [slotCount, setSlotCount] = useState(1);
  const [groupCounts, setGroupCounts] = useState([1]); // Track groups per slot

  const formik = useFormik({
    initialValues: {
      date: "",
      day: "",
      slots: [
        {
          start: "",
          end: "",
          groups: [{ level: "", users: [] }],
        },
      ],
    },
    validationSchema,
    onSubmit: (values) => {
      // Format the data to match your schema
      const formattedData = {
        date: values.date,
        day: values.day,
        slots: values.slots.map((slot) => ({
          start: slot.start,
          end: slot.end,
          groups: slot.groups.map((group) => ({
            level: group.level,
            users: group.users || [],
          })),
        })),
      };

      //   addAvailability(
      //     { data: formattedData },
      //     {
      //       onSuccess: () => {
      //         navigate("/admin/availability");
      //       },
      //     }
      //   );
    },
  });

  // Add a new time slot
  const addSlot = () => {
    const newSlots = [
      ...formik.values.slots,
      { start: "", end: "", groups: [{ level: "", users: [] }] },
    ];
    formik.setFieldValue("slots", newSlots);
    setSlotCount(slotCount + 1);
    setGroupCounts([...groupCounts, 1]);
  };

  // Remove a time slot
  const removeSlot = (index) => {
    if (formik.values.slots.length <= 1) return;

    const newSlots = formik.values.slots.filter((_, i) => i !== index);
    formik.setFieldValue("slots", newSlots);
    setSlotCount(slotCount - 1);

    const newGroupCounts = [...groupCounts];
    newGroupCounts.splice(index, 1);
    setGroupCounts(newGroupCounts);
  };

  // Add a group to a specific slot
  const addGroup = (slotIndex) => {
    const newSlots = [...formik.values.slots];
    newSlots[slotIndex].groups.push({ level: "", users: [] });
    formik.setFieldValue("slots", newSlots);

    const newGroupCounts = [...groupCounts];
    newGroupCounts[slotIndex] += 1;
    setGroupCounts(newGroupCounts);
  };

  // Remove a group from a specific slot
  const removeGroup = (slotIndex, groupIndex) => {
    if (formik.values.slots[slotIndex].groups.length <= 1) return;

    const newSlots = [...formik.values.slots];
    newSlots[slotIndex].groups = newSlots[slotIndex].groups.filter(
      (_, i) => i !== groupIndex
    );
    formik.setFieldValue("slots", newSlots);

    const newGroupCounts = [...groupCounts];
    newGroupCounts[slotIndex] -= 1;
    setGroupCounts(newGroupCounts);
  };

  // Handle slot time changes
  const handleSlotChange = (slotIndex, field, value) => {
    const newSlots = [...formik.values.slots];
    newSlots[slotIndex][field] = value;
    formik.setFieldValue("slots", newSlots);
  };

  // Handle group level changes
  const handleGroupChange = (slotIndex, groupIndex, value) => {
    const newSlots = [...formik.values.slots];
    newSlots[slotIndex].groups[groupIndex].level = value;
    formik.setFieldValue("slots", newSlots);
  };

  // Update day when date changes
  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    formik.setFieldValue("date", dateValue);

    if (dateValue) {
      const date = new Date(dateValue);
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      formik.setFieldValue("day", days[date.getDay()]);
    } else {
      formik.setFieldValue("day", "");
    }
  };

  return (
    <main className="space-y-6 max-w-4xl mx-auto p-6">
      <h1 className="font-bold text-2xl text-[var(--Main)]">
        Add Availability Slot
      </h1>

      <form
        onSubmit={formik.handleSubmit}
        className="space-y-6 bg-white p-6 rounded-2xl shadow"
      >
        {/* Date Selection */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-[var(--Main)] mb-2"
            >
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              onChange={handleDateChange}
              value={formik.values.date}
              className={`w-full bg-[var(--Input)] py-2 px-4 rounded-lg border ${
                formik.touched.date && formik.errors.date
                  ? "border-red-500"
                  : "border-transparent"
              }`}
            />
            {formik.touched.date && formik.errors.date ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.date}
              </div>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="day"
              className="block text-sm font-medium text-[var(--Main)] mb-2"
            >
              Day
            </label>
            <input
              id="day"
              name="day"
              type="text"
              value={formik.values.day}
              readOnly
              className="w-full bg-[var(--Input)] py-2 px-4 rounded-lg border border-transparent opacity-70"
            />
            {formik.touched.day && formik.errors.day ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.day}
              </div>
            ) : null}
          </div>
        </div>

        {/* Time Slots Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-lg text-[var(--Main)]">
              Time Slots
            </h2>
            <button
              type="button"
              onClick={addSlot}
              className="px-4 py-2 bg-[var(--Yellow)] hover:bg-opacity-90 transition-colors rounded-xl text-sm"
            >
              Add Time Slot
            </button>
          </div>

          {formik.values.slots.map((slot, slotIndex) => (
            <div
              key={slotIndex}
              className="p-4 bg-[var(--Light)] rounded-xl space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-[var(--Main)]">
                  Slot #{slotIndex + 1}
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

              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {/* Start Time Input */}
                <div>
                  <label className="block text-sm font-medium text-[var(--Main)] mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={slot.start}
                    onChange={(e) =>
                      handleSlotChange(slotIndex, "start", e.target.value)
                    }
                    className={`w-full bg-white py-2 px-4 rounded-lg border ${
                      formik.touched.slots &&
                      formik.errors.slots &&
                      formik.errors.slots[slotIndex]?.start
                        ? "border-red-500"
                        : "border-transparent"
                    }`}
                  />
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
                  <input
                    type="time"
                    value={slot.end}
                    onChange={(e) =>
                      handleSlotChange(slotIndex, "end", e.target.value)
                    }
                    className={`w-full bg-white py-2 px-4 rounded-lg border ${
                      formik.touched.slots &&
                      formik.errors.slots &&
                      formik.errors.slots[slotIndex]?.end
                        ? "border-red-500"
                        : "border-transparent"
                    }`}
                  />
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
                    className="grid grid-cols-2 gap-x-8 gap-y-4 items-start p-3 bg-white rounded-lg"
                  >
                    <div>
                      <label className="block text-sm font-medium text-[var(--Main)] mb-2">
                        Group Level
                      </label>
                      <input
                        type="text"
                        value={group.level}
                        onChange={(e) =>
                          handleGroupChange(
                            slotIndex,
                            groupIndex,
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
                        placeholder="e.g., Beginner, Intermediate, Advanced"
                      />
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
                          Users (will be added when booking)
                        </label>
                        <div className="py-2 px-4 bg-[var(--Input)] rounded-lg text-[var(--SubText)]">
                          {group.users.length} users will be added here
                        </div>
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
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-[var(--SubText)] text-[var(--SubText)] rounded-xl hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            // disabled={isPending}
            className="px-6 py-2 bg-[var(--Yellow)] hover:bg-opacity-90 transition-colors rounded-xl disabled:opacity-50"
          >
            {/* {isPending ? "Saving..." : "Save Availability"} */}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddAvailability;
