import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useGetAllFreeTests,
  useUpdateLevelForFreeTest,
} from "@/hooks/Actions/free-tests/useFreeTestsCruds";

import InlineSelect from "@/Components/ui/InlineSelect";
import { useAuth } from "@/context/AuthContext";

function StudentsFreeTests() {
  const { user } = useAuth();
  const isSales = user?.role === "sales";
  const isTeamLeader = user?.role === "team_leader";
  const [searchQuery, setSearchQuery] = useState("");
  const [completedFilter, setCompletedFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: testsResponse, isPending } = useGetAllFreeTests();
  const tests = testsResponse?.data?.data || testsResponse || [];

  const { mutate: updateLevel, isPending: isUpdatingLevel } =
    useUpdateLevelForFreeTest();

  const [levelById, setLevelById] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  useEffect(() => {
    if (!isUpdatingLevel) setUpdatingId(null);
  }, [isUpdatingLevel]);
  const levelOptions = [
    "Starter",
    "Basic 1",
    "Basic 2",
    "Level 1",
    "Level 2",
    "Level 3",
    "Level 4",
    "Level 5",
    "Level 6",
    "Level 7",
    "Level 8",
    "Level 9",
  ];

  const handleSearchChange = (e) =>
    setSearchQuery(e.target.value.toLowerCase());

  const allLevels = useMemo(() => {
    const setLevels = new Set(
      (tests || []).map((t) => t.level).filter(Boolean)
    );
    return Array.from(setLevels);
  }, [tests]);

  const getCompletedCount = (value) =>
    tests.filter((t) => Boolean(t.completed) === value).length;

  const filteredTests = (tests || []).filter((t) => {
    const matchesSearch =
      t?.name?.toLowerCase().includes(searchQuery) ||
      t?.email?.toLowerCase().includes(searchQuery) ||
      t?.phoneNumber?.includes(searchQuery);

    const matchesCompleted =
      completedFilter === ""
        ? true
        : String(Boolean(t?.completed)) === completedFilter;

    const matchesLevel = levelFilter ? t?.level === levelFilter : true;

    const createdAt = t?.createdAt ? new Date(t.createdAt) : null;
    const inDateRange = (() => {
      if (!startDate && !endDate) return true;
      if (!createdAt) return false;
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start && createdAt < start) return false;
      if (end) {
        const endOfDay = new Date(end);
        endOfDay.setHours(23, 59, 59, 999);
        if (createdAt > endOfDay) return false;
      }
      return true;
    })();

    return matchesSearch && matchesCompleted && matchesLevel && inDateRange;
  });

  return (
    <main className="space-y-6 max-w-7xl mx-auto">
      <h1 className="font-bold text-2xl text-[var(--Main)]">Free Tests</h1>

      <section className="bg-white p-6 rounded-2xl shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="search"
                placeholder="Search by name, email, or phone"
                className="w-full bg-[var(--Input)] py-3 px-4 pr-10 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <span className="absolute right-3 top-3 text-[var(--SubText)]">
                🔍
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Completed
            </label>
            <InlineSelect
              value={completedFilter}
              onChange={setCompletedFilter}
              options={[
                { value: "", label: `All (${tests.length})` },
                { value: "true", label: `Completed (${getCompletedCount(true)})` },
                { value: "false", label: `In Progress (${getCompletedCount(false)})` },
              ]}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Level
            </label>
            <InlineSelect
              value={levelFilter}
              onChange={setLevelFilter}
              options={[
                { value: "", label: `All Levels (${tests.length})` },
                ...allLevels.map((lvl) => ({ value: lvl, label: lvl })),
              ]}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow overflow-hidden">
        {isPending ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--Yellow)] mx-auto"></div>
            <p className="mt-4 text-[var(--SubText)]">Loading tests...</p>
          </div>
        ) : filteredTests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--Light)]">
                <tr className="text-left text-[var(--SubText)]">
                  <th className="p-4 font-medium">Student</th>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Country</th>
                  <th className="p-4 font-medium">Level</th>
                  <th className="p-4 font-medium">Score</th>
                  <th className="p-4 font-medium">Completed</th>
                  <th className="p-4 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--Light)]">
                {filteredTests.map((t) => (
                  <tr key={t._id} className="hover:bg-[var(--Light)]/40">
                    <td className="p-4">
                      <div className="font-semibold text-[var(--Main)]">
                        {t?.name || "N/A"}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{t?.email || "N/A"}</div>
                      <div className="text-sm">{t?.phoneNumber || "N/A"}</div>
                    </td>
                    <td className="p-4">{t?.country || "N/A"}</td>
                    <td className="p-4 min-w-[180px]">
                      <InlineSelect
                        options={levelOptions}
                        value={
                          levelById?.[t._id] ??
                          t?.level ??
                          t?.currentLevel ??
                          "Starter"
                        }
                        onChange={(val) => {
                          setUpdatingId(t._id);
                          setLevelById((prev) => ({
                            ...prev,
                            [t._id]: val,
                          }));
                          updateLevel({
                            id: t._id,
                            level: val,
                          });
                        }}
                        isLoading={updatingId === t._id && isUpdatingLevel}
                        className="min-w-[150px]"
                        nonInteractive={isSales}
                      />
                    </td>
                    <td className="p-4">
                      {typeof t?.score === "number" ? t.score : "-"}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--Input)]">
                        {t?.completed ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="p-4">
                      {t?.createdAt
                        ? new Date(t.createdAt).toLocaleString("en-UK")
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-[var(--Main)] mb-2">
              No Tests Found
            </h2>
            <p className="text-[var(--SubText)]">
              Try adjusting filters or date range
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default StudentsFreeTests;
