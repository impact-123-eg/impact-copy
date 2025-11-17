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
import { db, collection } from "../../data/firebaseConfig";
import { query, getDocs, orderBy } from "firebase/firestore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function HomePage() {
  const [freeTest, setFreeTest] = useState([]);
  const [freeSession, setFreeSession] = useState([]);
  const [requests, setRequests] = useState([]);
  const [paid, setPaid] = useState([]);

  const fetchData = async (collectionName, setterFunction) => {
    try {
      // Check if collection is "Requests" and add orderBy
      const q =
        collectionName === "Requests"
          ? query(collection(db, collectionName), orderBy("createdAt", "desc"))
          : query(collection(db, collectionName));

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setterFunction(data);
    } catch (e) {
      console.error(`Error fetching data from ${collectionName}: `, e);
    }
  };
  useEffect(() => {
    fetchData("Free Test", setFreeTest);
    fetchData("Free Session", setFreeSession);
    fetchData("Requests", setRequests);
    fetchData("payments", setPaid);
  }, []);

  const totalMoney = paid
    .filter((payment) => payment?.status === "success") // Only include successful payments
    .reduce((sum, payment) => {
      const moneyValue = Number(payment?.Money); // Ensure Money exists and is a number
      return sum + (isNaN(moneyValue) ? 0 : moneyValue); // Add only valid numbers
    }, 0);

  const monthlyCounts = new Array(12).fill(0);
  paid
    .filter((paid) => paid?.status === "success")
    .forEach((payment) => {
      if (payment.Date) {
        const date = payment.Date.toDate(); // Convert Firestore Timestamp to JavaScript Date
        const month = date.getMonth(); // Get month (0-based index)
        monthlyCounts[month] += 1; // Increment count for that month
      }
    });

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
    { number: freeTest.length, description: "Free Test" },
    { number: freeSession.length, description: "Free Session" },
    {
      number:
        freeTest.length +
        freeSession.length +
        paid.filter((item) => item.status === "success").length,
      description: "Total Student",
    },
    { number: totalMoney + "$", description: "Paid Courses" },
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
              {paid.filter((payment) => payment.status === "success").length}{" "}
              Students
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
        <h1 className="text-xl sm:text-2xl font-bold">
          Recent Students Requests
        </h1>

        <div className="overflow-x-auto border-2 border-[#347792] rounded-xl">
          <table className="w-full text-center table-auto min-w-[800px]">
            <thead className="bg-[var(--Light)] text-[var(--SubText)] text-lg sm:text-xl">
              <tr>
                <th className="p-3 sm:p-4">Name</th>
                <th className="p-3 sm:p-4">Email</th>
                <th className="p-3 sm:p-4">Phone</th>
                <th className="p-3 sm:p-4">Country</th>
                <th className="p-3 sm:p-4">Option</th>
                <th className="p-3 sm:p-4">Response</th>
              </tr>
            </thead>

            <tbody>
              {requests
                .filter((e) => e.status === "success")
                .slice(0, 3)
                .map((req) => (
                  <tr key={req.id} className="hover:bg-gray-100">
                    <td className="p-4">{req.name || req.Name}</td>
                    <td className="p-4">{req.email || req.Email}</td>
                    <td className="p-4">{req.phoneNumber || req.phone}</td>
                    <td className="p-4">{req.country}</td>
                    <td className="p-4">{req.option}</td>
                    <td className="p-4">
                      <Link
                        className="underline text-[var(--Yellow)]"
                        to="/dash/requests"
                        onClick={() => window.scroll(0, 0)}
                      >
                        select date
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex px-3 sm:px-6 py-0.5 justify-end">
          <Link
            to="/dash/requests"
            onClick={() => window.scroll(0, 0)}
            className="underline"
          >
            See more
          </Link>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
