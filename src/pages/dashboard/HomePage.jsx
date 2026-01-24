import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Link, useLocation } from "react-router-dom";
import useDashboardStats from "@/hooks/Actions/dashboard/useDashboardStats";
import { useGetAllFreeSessionBookings } from "@/hooks/Actions/free-sessions/useFreeSessionBookingCruds";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function HomePage() {
  const { data: statsResp, isPending: statsLoading } = useDashboardStats();
  const stats = statsResp?.data?.data || statsResp || null;

  // Load recent free session bookings for the Requests section
  const { data: bookingsResp } = useGetAllFreeSessionBookings();
  // Server returns { data: [...], ... }
  // We just take the first 5
  const bookings = (bookingsResp?.data?.data || []).slice(0, 5);

  const monthlyCounts = stats?.payments?.monthlyCounts || new Array(12).fill(0);

  const renderSlot = (b) => {
    const slot = b?.freeSessionSlotId || b?.freeSessionSlot;
    if (slot && typeof slot === "object") {
      const hasISO =
        typeof slot.startTime === "string" && typeof slot.endTime === "string";
      if (hasISO) {
        const start = new Date(slot.startTime);
        const end = new Date(slot.endTime);
        const dateStr = start.toLocaleDateString("en-UK", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        const startTimeStr = start.toLocaleTimeString("en-UK", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const endTimeStr = end.toLocaleTimeString("en-UK", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <>
            <div className="text-sm">{dateStr}</div>
            <div className="text-xs text-[var(--SubText)]">
              {startTimeStr} - {endTimeStr}
            </div>
          </>
        );
      }
      const dateStr = slot.date
        ? new Date(slot.date).toLocaleDateString("en-UK")
        : "N/A";
      const timeStr =
        slot.startTime && slot.endTime
          ? `${slot.startTime} - ${slot.endTime}`
          : "";
      return (
        <>
          <div className="text-sm">{dateStr}</div>
          <div className="text-xs text-[var(--SubText)]">{timeStr}</div>
        </>
      );
    }
    if (typeof slot === "string") {
      return <div className="text-sm">Slot #{slot.slice(-6)}</div>;
    }
    return <div className="text-sm">N/A</div>;
  };

  const dataChart = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    datasets: [
      {
        data: monthlyCounts, // Use dynamically counted data
        borderRadius: 50,
        borderWidth: 0,
        backgroundColor: "#F5D019",
        barThickness: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { beginAtZero: false, grid: { display: false } },
      y: { beginAtZero: false, grid: { display: false } },
    },
  };
  const details = [
    { number: stats?.freeTests ?? 0, description: "Free Test" },
    { number: stats?.freeSessions ?? 0, description: "Free Session" },
    {
      number: stats?.payments?.count ?? 0,
      description: "Enrolled Students",
    },
    {
      number: (stats?.payments?.totalAmount ?? 0).toFixed(2) + " £",
      description: "Paid Courses",
    },
  ];

  const date = new Date();
  const year = date.getFullYear();
  return (
    <main className="w-full space-y-10 p-4 sm:p-0">
      {/* Dashboard Insights Section */}
      <section className="bg-[var(--Main)] text-white p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-3 gap-6 rounded-2xl">
        <article className="space-y-5 col-span-1">
          <h1 className="text-xl sm:text-2xl font-bold">Dashboard Insights</h1>
          <p style={{ textAlign: "justify" }} className="text-sm">
            Track the number of students who have taken free placement tests,
            attended free sessions, and enrolled in paid courses.
          </p>
        </article>

        <article className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:ps-4 col-span-1 sm:col-span-2">
          {details.map((item, index) => (
            <div
              key={index}
              className="bg-[var(--Light)]/50 text-center p-4 sm:p-5 rounded-2xl space-y-2"
            >
              <h1 className="text-2xl sm:text-4xl text-[var(--Yellow)] font-bold">
                {item.number}
              </h1>
              <p className="text-sm sm:text-md">{item.description}</p>
            </div>
          ))}
        </article>
      </section>

      {/* Monthly Enrollment Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:space-x-10 rounded-2xl p-6 sm:p-10 border-2 border-[var(--SubTextBorder)]/50">
        <article className="space-y-6 sm:space-y-8 flex flex-col h-full">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Monthly Enrollment Trends
          </h1>
          <p style={{ textAlign: "justify" }} className="text-sm sm:text-base">
            Analyze student enrollment patterns throughout the year with a clear
            visual representation. This chart helps track growth, identify peak
            registration periods, and make data-driven decisions for future
            course offerings.
          </p>

          <div className="mt-auto justify-self-end space-y-2">
            <h1 className="text-2xl sm:text-3xl text-[var(--Yellow)] font-bold">
              {stats?.payments?.count ?? 0} Students
            </h1>
            <p>{year}</p>
          </div>
        </article>

        <article className="w-full">
          <div style={{ height: "250px", sm: { height: "350px" } }}>
            <Bar data={dataChart} options={options} />
          </div>
        </article>
      </section>

      {/* Recent Students Requests Section */}
      <section className="space-y-6 sm:space-y-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">
            Recent Student Bookings
          </h1>
          <Link
            to="/dash/booking"
            aria-label="See more free session bookings"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--Yellow)] text-black font-medium hover:opacity-90 transition"
          >
            See more <span aria-hidden>→</span>
          </Link>
        </div>
        <section className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--Light)]">
                <tr className="text-left text-[var(--SubText)]">
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Slot</th>
                  <th className="p-4 font-medium">Instructor</th>
                  <th className="p-4 font-medium">Sales Agent</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--Light)]">
                {bookings.length > 0 ? (
                  bookings.map((b) => (
                    <tr
                      key={b._id}
                      className="hover:bg-[var(--Light)]/40 text-sm"
                    >
                      <td className="p-4">
                        <div className="font-semibold text-[var(--Main)]">
                          <Link
                            to={`/dash/booking/${b._id}`}
                            className="hover:underline"
                          >
                            {b?.name || "N/A"}
                          </Link>
                        </div>
                        <div className="text-xs text-[var(--SubText)]">
                          {b?.country} ({b?.age})
                        </div>
                      </td>
                      <td className="p-4">
                        <div>{b?.email || "N/A"}</div>
                        <div className="text-xs text-[var(--SubText)]">
                          {b?.phoneNumber || "N/A"}
                        </div>
                      </td>
                      <td className="p-4 min-w-[12rem]">{renderSlot(b)}</td>
                      <td className="p-4 font-medium text-[var(--Main)]">
                        {b?.freeSessionGroupId?.teacher || "N/A"}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-[var(--Main)]">
                          {b?.salesAgentId?.name || "N/A"}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--Input)]">
                          {b?.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-[var(--SubText)]">
                      No recent bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}

export default HomePage;
