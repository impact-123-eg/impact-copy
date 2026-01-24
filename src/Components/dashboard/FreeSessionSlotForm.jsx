import formatDateForAPI from "@/utilities/formatDateForApi";
import React, { useState, useEffect } from "react";
import { useGetUsers } from "@/hooks/Actions/users/useCurdsUsers";

const FreeSessionSlotForm = ({ date, onSubmit, onCancel }) => {
  const { data: instructorsData } = useGetUsers({ role: "instructor" });
  const teachersList = instructorsData?.data?.data || [];

  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    maxGroups: 1,
    maxParticipantsPerGroup: 3,
  });

  const [teachers, setTeachers] = useState([""]);
  const [instructorIds, setInstructorIds] = useState([""]); // New state for IDs

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate times
    if (formData.startTime >= formData.endTime) {
      alert("End time must be after start time");
      return;
    }

    // Parse the date string (e.g., "Fri, 13/10/2023")
    const [, datePart] = date.split(", ");
    const [day, month, year] = datePart.split("/");

    // Create date objects with the correct format
    const combinedStartTime = new Date(
      `${year}-${month}-${day}T${formData.startTime}`
    );
    const combinedEndTime = new Date(
      `${year}-${month}-${day}T${formData.endTime}`
    );

    const submissionData = {
      ...formData,
      startTime: combinedStartTime,
      endTime: combinedEndTime,
      teachers: teachers.slice(0, Number(formData.maxGroups)),
      instructorIds: instructorIds.slice(0, Number(formData.maxGroups)),
    };

    onSubmit(submissionData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "maxGroups") {
      const count = Math.max(1, Number(e.target.value) || 1);
      setTeachers((prev) => {
        const next = [...prev];
        if (next.length < count) {
          while (next.length < count) next.push("");
        } else if (next.length > count) {
          next.length = count;
        }
        return next;
      });
      setInstructorIds((prev) => {
        const next = [...prev];
        if (next.length < count) {
          while (next.length < count) next.push("");
        } else if (next.length > count) {
          next.length = count;
        }
        return next;
      });
    }
  };

  const handleTeacherChange = (index, value) => {
    const selectedInstructor = teachersList.find(t => t._id === value);
    setTeachers((prev) => {
      const next = [...prev];
      next[index] = selectedInstructor ? selectedInstructor.name : "";
      return next;
    });
    setInstructorIds((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md">
        <h2 className="font-bold text-lg text-[var(--Main)] mb-4">
          Create Time Slot for {date}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-[var(--SubText)] mb-1">
              Start Time
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="w-full p-2 border border-[var(--Input)] rounded-lg focus:ring-2 focus:ring-[var(--Yellow)]"
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-[var(--SubText)] mb-1">
              End Time
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="w-full p-2 border border-[var(--Input)] rounded-lg focus:ring-2 focus:ring-[var(--Yellow)]"
            />
          </div>

          {/* Number of Groups */}
          <div>
            <label className="block text-sm font-medium text-[var(--SubText)] mb-1">
              Number of Groups
            </label>
            <input
              type="number"
              name="maxGroups"
              min="1"
              max="10"
              value={formData.maxGroups}
              onChange={handleChange}
              required
              className="w-full p-2 border border-[var(--Input)] rounded-lg focus:ring-2 focus:ring-[var(--Yellow)]"
            />
          </div>

          {/* Teachers per Group */}
          <div>
            <label className="block text-sm font-medium text-[var(--SubText)] mb-2">
              Assign Teacher for Each Group
            </label>
            <div className="space-y-2">
              {Array.from({ length: Number(formData.maxGroups) || 1 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-24 text-sm text-[var(--SubText)]">Group {i + 1}</span>
                  <select
                    value={instructorIds[i] || ""}
                    onChange={(e) => handleTeacherChange(i, e.target.value)}
                    className="flex-1 p-2 border border-[var(--Input)] rounded-lg focus:ring-2 focus:ring-[var(--Yellow)]"
                  >
                    <option value="">Select teacher</option>
                    {teachersList.map((t) => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Participants per Group */}
          <div>
            <label className="block text-sm font-medium text-[var(--SubText)] mb-1">
              Participants per Group
            </label>
            <input
              type="number"
              name="maxParticipantsPerGroup"
              min="1"
              max="50"
              value={formData.maxParticipantsPerGroup}
              onChange={handleChange}
              required
              className="w-full p-2 border border-[var(--Input)] rounded-lg focus:ring-2 focus:ring-[var(--Yellow)]"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 border border-[var(--Input)] text-[var(--SubText)] rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-[var(--Yellow)] text-white rounded-lg hover:bg-opacity-90"
            >
              Create Slot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FreeSessionSlotForm;
