import { useEffect, useState } from "react";
import { HiMiniAdjustmentsHorizontal } from "react-icons/hi2";
import { db, collection } from "../../data/firebaseConfig";
import { query, getDocs } from "firebase/firestore";
import { Datepicker } from "flowbite-react";

function StudentsBooking() {
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedButton, setSelectedButton] = useState("Free Session");
  const [isOpen, setIsOpen] = useState(false);
  const [sorted, setSorted] = useState(null);
  const [datePic, setDatePic] = useState(new Date());
  const parseTimeString = (timeString) => {
    if (!timeString) return null; // Handle empty cases
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date(); // Use today's date
    date.setHours(hours, minutes, 0, 0); // Set extracted hours & minutes
    return date;
  };
  const parseDateString = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day); // Month is 0-based
  };
  const formatDate = (date) => {
    const day = date?.getDate();
    const month = date?.getMonth() + 1;
    const year = date?.getFullYear();
    return `${day}/${month}/${year}`; // Matches Firestore format
  };
  const formattedDate = formatDate(datePic); // Format the selected date

  const filteredRequests = requests.filter((req) => {
    const cleanedFirestoreDate = req.date?.trim(); // Ensure no extra spaces
    return selectedButton === "Courses"
      ? (req.name &&
          req.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (req.phone && req.phone.includes(searchQuery)) ||
        (req.email && req.email.includes(searchQuery)) ||
        cleanedFirestoreDate === formattedDate // ✅ Filter by selected date
      : (req.name &&
          req.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (req.phoneNumber && req.phoneNumber.includes(searchQuery)) ||
        (req.email && req.email.includes(searchQuery)) ||
        cleanedFirestoreDate === formattedDate; // ✅ Filter by selected date
  });
  const sortedRequests = sorted
    ? [...filteredRequests].sort((a, b) => {
        if (a[sorted] > b[sorted]) return 1;
        if (a[sorted] < b[sorted]) return -1;
        return 0;
      })
    : filteredRequests;

  const buttons = [
    { name: "Courses" },
    { name: "Free Test" },
    { name: "Free Session" },
  ];
  const sortByDateTime = (a, b) => {
    // Combine date and time into a full datetime string
    const parseDateTime = (date, time) => {
      // Assuming date is in format "DD/MM/YYYY" and time is in format "HH:mm"
      const [day, month, year] = date.split("/");
      const [hours, minutes] = time.split(":");

      // Create a Date object
      return new Date(year, month - 1, day, hours, minutes); // month is 0-based in JavaScript
    };

    const dateTimeA = parseDateTime(a.date, a.time);
    const dateTimeB = parseDateTime(b.date, b.time);

    return dateTimeB - dateTimeA; // Sorting in descending order (newest first)
  };
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = query(
          collection(db, selectedButton === "Courses" ? "payments" : selectedButton)
        );
        const querySnapshot = await getDocs(q);

        const req = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((doc) => selectedButton !== "Courses" || doc.status === true); // Only keep successful payments
        
        // Sort the requests by date and time
        const sortedRequests = req.sort(sortByDateTime);
        setRequests(sortedRequests);
      } catch (e) {
        console.error("Error fetching Requests: ", e);
      }
    };

    fetchRequests();
  }, [selectedButton, sorted]);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleButtonClick = (button) => setSelectedButton(button);

  return (
    <main className="space-y-10">
      <h1 className="font-bold text-2xl">Students Bookings</h1>

      <section className="flex items-center justify-start space-x-8">
        <form className="inline-block w-[40%] bg-[var(--Light)]/95 p-2 rounded-xl">
        <div className=" flex relative">
          <input
            type="search"
            placeholder="Search by name , email, phone"
            className="w-[800px]  p-4  border-1 rounded-xl focus:outline-0"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          </div>
        </form>
{/* 
        <div className="relative inline-block text-left">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl p-4 rounded-xl bg-[var(--Yellow)] text-black focus:outline-none"
          >
            <HiMiniAdjustmentsHorizontal />
          </button>
          {isOpen && (
            <div className="absolute -right-20 mt-2 w-fit rounded-lg border-2 border-[var(--Yellow)] shadow-lg bg-[var(--Input)]">
              <div className="w-full">
                   <Datepicker
                                dateFormat="dd/MM/yyyy"
                                minDate={new Date()}
                                inline
                                value={datePic}
                                onChange={(newDate) => setDatePic(newDate)}
                                theme={{
                                  root: {
                                    base: "p-3 h-full w-full focus:outline-none focus:ring-2 focus:ring-[var(--Main)]",
                                  },
                                  popup: {
                                    footer: {
                                      base: "mt-2 flex space-x-2",
                                      button: { today: "bg-[var(--Main)] text-white" },
                                    },
                                  },
                                  views: {
                                    days: {
                                      items: {
                                        item: { selected: "bg-[var(--Yellow)] text-white" },
                                      },
                                    },
                                  },
                                }}
                              />
              </div>
            </div>
          )}
        </div> */}
      </section>

      <h1 className="font-bold text-2xl">{selectedButton}</h1>

      <section className="flex justify-start space-x-14 text-lg">
        {buttons.map((btn) => (
          <button
            key={btn}
            className={`px-12 py-4 rounded-xl ${
              selectedButton !== btn.name
                ? "border-2 border-[var(--Yellow)]"
                : "bg-[var(--Yellow)]"
            }`}
            onClick={() => handleButtonClick(btn.name)}
          >
            {btn.name}
          </button>
        ))}
      </section>

      <section className="overflow-hidden border-2 border-[#347792] rounded-xl">
        {sortedRequests.length > 0 ? (
          selectedButton === "Courses" ? (
            <table className="w-full text-center table-auto">
              <thead className="bg-[var(--Light)] text-[var(--SubText)] text-xl">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-2">Country</th>
                  <th className="p-2">Course Category</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Test</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {sortedRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-100">
                    <td className="p-4">{req.name}</td>
                    <td className="p-4" style={{ whiteSpace: "pre-line", textAlign: "left" }}>
  {req.email.replace("@", "@\n")}
</td>
                    <td className="p-4">{req.phone}</td>
                    <td className="p-4">{req.country}</td>
                    <td className="p-4">{req.category}</td>
                    <td className="p-4">{req.type}</td>
                    <td
                      className={`p-4 ${
                        req.test === false && "text-[var(--Yellow)]"
                      }`}
                    >
                      {req.test === true ? "yes": "no"}
                    </td>
                    <td className="p-4">
                    {req?.courseData
  ? new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(parseDateString(req?.courseData))
  : "N/A"}
                  </td>
                  <td className="p-4">
                  {req?.courseTime
  ? new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(parseTimeString(req?.courseTime))
  : "N/A"}
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-center table-auto">
              <thead className="bg-[var(--Light)] text-[var(--SubText)] text-xl">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Country</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {sortedRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-100">
                    <td className="p-4">{req.name}</td>
                    <td className="p-4">{req.email}</td>
                    <td className="p-4">{req.phoneNumber}</td>
                    <td className="p-4">{req.country}</td>
                    <td className="p-4">{req.date}</td>
                    <td className="p-4">{req.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          <h2 className="py-8 text-4xl font-semibold text-center">
            No {selectedButton} Booked
          </h2>
        )}
      </section>
    </main>
  );
}

export default StudentsBooking;
