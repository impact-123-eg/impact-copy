import { useEffect, useState } from "react";
import { db, collection, doc, addDoc, deleteDoc } from "../data/firebaseConfig";
import { query, getDocs, where, orderBy } from "firebase/firestore";
import { Modal } from "react-responsive-modal";
import { Datepicker } from "flowbite-react";
import { HiMiniAdjustmentsHorizontal } from "react-icons/hi2";
import { useGetAllBookings } from "@/hooks/Actions/booking/useBookingCruds";

function Payment() {
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [time, setTime] = useState("12:00");
  const [date, setDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [sorted, setSorted] = useState(null);
  const [filterOption, setFilterOption] = useState(null);

  const { data: bookingData } = useGetAllBookings();
  const payments = bookingData?.data || [];

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const filteredRequests = payments.filter((req) => {
    const matchesSearch =
      req.Name?.toLowerCase().includes(searchQuery) ||
      req.Email?.toLowerCase().includes(searchQuery);

    const matchesFilter = filterOption ? req.status === filterOption : true;

    return matchesSearch && matchesFilter;
  });
  const sortedRequests = sorted
    ? [...filteredRequests].sort((a, b) => {
        if (a[sorted] > b[sorted]) return 1;
        if (a[sorted] < b[sorted]) return -1;
        return 0;
      })
    : filteredRequests;

  const submitData = async () => {
    if (!date || !time || !selectedRequestId) {
      alert("Please select a date and time.");
      return;
    }

    try {
      const selectedRequest = payments.find(
        (req) => req.id === selectedRequestId
      );

      const requestData = {
        name: selectedRequest.name,
        email: selectedRequest.email,
        phoneNumber: selectedRequest.phoneNumber,
        country: selectedRequest.country,
        date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
        time: time,
      };

      await addDoc(collection(db, selectedRequest.option), requestData);

      const requestRef = doc(db, "payments", selectedRequestId);
      await deleteDoc(requestRef);
      const updatedRequests = payments.filter(
        (req) => req.id !== selectedRequestId
      );
      setPayments(updatedRequests);
      setOpenModal(false);
      window.scroll(0, 0);
    } catch (e) {
      console.error("Error processing request: ", e);
      alert("Failed to process the request.");
    }
  };

  return (
    <main className="space-y-10">
      <h1 className="font-bold text-2xl">Payments</h1>

      <section className="flex items-center justify-start space-x-8">
        <form className="inline-block w-[40%] bg-[var(--Light)]/95 p-2 rounded-xl">
          <div className=" flex relative">
            <input
              type="search"
              placeholder="Search by name or email"
              className="w-[800px]  p-4  border-1 rounded-xl focus:outline-0"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </form>

        <div className="relative inline-block text-left">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl p-4 rounded-xl bg-[var(--Yellow)] text-black focus:outline-none"
          >
            <HiMiniAdjustmentsHorizontal />
          </button>
          {/* {isOpen && (
            <div className="absolute -right-20 mt-2 w-fit rounded-lg border-2 border-[var(--Yellow)] shadow-lg bg-[var(--Input)]">
              <div className="w-full">
                <button
                  onClick={() => setFilterOption("success")}
                  className="w-full px-4 py-2 text-[var(--SubText)] hover:bg-[var(--Yellow)]/50"
                >
                  success
                </button>
                <hr />
                <button
                  onClick={() => setFilterOption("pending")}
                  className="w-full px-4 py-2 text-[var(--SubText)] hover:bg-[var(--Yellow)]/50"
                >
                  pending
                </button>
                <hr />
                <button
                  onClick={() => setFilterOption(null)}
                  className="w-full px-4 py-2 text-red-500 hover:bg-red-200"
                >
                  Clear Filter
                </button>
              </div>
            </div>
          )} */}
        </div>
      </section>

      <section className="overflow-hidden border-2 border-[#347792] rounded-xl">
        {sortedRequests.length > 0 ? (
          <table className="w-full text-center table-auto">
            <thead className="bg-[var(--Light)] text-[var(--SubText)] text-xl">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Course Category</th>
                <th className="p-4">Course Option</th>
                <th className="p-4">Course Type</th>
                <th className="p-4">Money</th>
                <th className="p-4">phone</th>
                <th className="p-4">Date</th>
                <th className="p-4">Time</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {sortedRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-100 ">
                  <td className="p-4">{req.Name}</td>
                  <td
                    className="p-4"
                    style={{ whiteSpace: "pre-line", textAlign: "left" }}
                  >
                    {req.Email.replace("@", "@\n")}
                  </td>
                  <td className="p-4">{req.category}</td>
                  <td className="p-4">{req?.Option}</td>
                  <td className="p-4">{req?.type}</td>
                  <td className="p-4">{req?.Money} $</td>
                  <td className="p-4">{req?.phone}</td>
                  <td className="p-4">
                    {req?.Date
                      ? new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }).format(req?.Date.toDate())
                      : "N/A"}
                  </td>
                  <td className="p-4">
                    {req?.Time
                      ? new Intl.DateTimeFormat("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(req?.Time.toDate())
                      : "N/A"}
                  </td>
                  <td
                    className={`${
                      req.status === "success"
                        ? "text-green-600"
                        : "text-yellow-500"
                    }`}
                  >
                    {req.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h2 className="py-8 text-4xl font-semibold text-center">
            No Requests Available
          </h2>
        )}
      </section>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        center
        styles={{
          modal: { borderRadius: "1rem", maxWidth: "42rem", width: "100%" },
        }}
      >
        <h2 className="my-12 text-3xl font-bold">Choose Date & Time</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-center items-start drop-shadow-lg">
            <Datepicker
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              inline
              value={date}
              onChange={(newDate) => setDate(newDate)}
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

          <div className="p-4 drop-shadow-lg flex items-center justify-center">
            <input
              type="time"
              className="border rounded-lg p-3 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-[var(--Main)]"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between my-8">
          <button
            className="px-8 py-2 rounded-xl border-2 border-[var(--Yellow)]"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </button>
          <button
            className="px-8 py-2 rounded-xl bg-[var(--Yellow)]"
            onClick={submitData}
          >
            Submit
          </button>
        </div>
      </Modal>
    </main>
  );
}

export default Payment;
