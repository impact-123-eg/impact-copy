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
              level: Yup.string().required("Group level is required"),
              count: Yup.number()
                .required("Count is required")
                .min(1, "Count must be at least 1")
                .integer("Count must be a whole number"),
            })
          )
          .min(1, "At least one group is required"),
      })
    )
    .min(1, "At least one time slot is required"),
});

const AvailabilityForm = ({ date, day, onSubmit, onCancel }) => {
  const formik = useFormik({
    initialValues: {
      slots: [{ start: "", end: "", groups: [{ level: "", count: 1 }] }],
    },
    validationSchema,
    onSubmit: (values) => {
      // Transform the data to match the backend schema
      const availabilityData = {
        date,
        day,
        slots: values.slots.map((slot) => ({
          start: slot.start,
          end: slot.end,
          groups: slot.groups.map((group) => ({
            level: group.level,
            users: Array(parseInt(group.count) || 1).fill(null), // Create empty slots
          })),
        })),
      };

      onSubmit(availabilityData);
    },
  });

  const addSlot = () => {
    const newSlots = [
      ...formik.values.slots,
      { start: "", end: "", groups: [{ level: "", count: 1 }] },
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
    newSlots[slotIndex].groups.push({ level: "", count: 1 });
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
    formik.setFieldValue("slots", newSlots);
  };

  const handleGroupChange = (slotIndex, groupIndex, field, value) => {
    const newSlots = [...formik.values.slots];
    newSlots[slotIndex].groups[groupIndex][field] = value;
    formik.setFieldValue("slots", newSlots);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <h2 className="font-bold text-2xl text-[var(--Main)]">
            Create Availability for {date} ({day})
          </h2>

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
                            Number of Users
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={group.count}
                            onChange={(e) =>
                              handleGroupChange(
                                slotIndex,
                                groupIndex,
                                "count",
                                e.target.value
                              )
                            }
                            className={`w-full bg-[var(--Input)] py-2 px-4 rounded-lg border ${
                              formik.touched.slots &&
                              formik.errors.slots &&
                              formik.errors.slots[slotIndex]?.groups &&
                              formik.errors.slots[slotIndex].groups[groupIndex]
                                ?.count
                                ? "border-red-500"
                                : "border-transparent"
                            }`}
                          />
                          {formik.touched.slots &&
                          formik.errors.slots &&
                          formik.errors.slots[slotIndex]?.groups &&
                          formik.errors.slots[slotIndex].groups[groupIndex]
                            ?.count ? (
                            <div className="text-red-500 text-sm mt-1">
                              {
                                formik.errors.slots[slotIndex].groups[
                                  groupIndex
                                ].count
                              }
                            </div>
                          ) : null}
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
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-[var(--SubText)] text-[var(--SubText)] rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addSlot}
                className="px-6 py-2 bg-[var(--Light)] text-[var(--Main)] rounded-xl hover:bg-opacity-80 transition-colors"
              >
                Add Another Time Slot
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[var(--Yellow)] hover:bg-opacity-90 transition-colors rounded-xl"
              >
                Save Availability
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityForm;
