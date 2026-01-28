import { useEffect, useState } from "react";
import { HiMiniAdjustmentsHorizontal } from "react-icons/hi2";
import emailjs from "emailjs-com";
import Swal from "sweetalert2";

import {
  db,
  collection,
  doc,
  addDoc,
  deleteDoc,
} from "../../data/firebaseConfig";
import { query, getDocs, orderBy } from "firebase/firestore";
import { Modal } from "react-responsive-modal";
import { Datepicker } from "flowbite-react";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [time, setTime] = useState("12:00");
  const [date, setDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [sorted, setSorted] = useState(null);

  const [filterOption, setFilterOption] = useState(null);
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        let q = query(
          collection(db, "Requests"),
          orderBy("createdAt", "desc") // Sorts from oldest to newest
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          alert("No Requests found");
        } else {
          const req = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRequests(req);
        }
      } catch (e) {
        console.error("Error fetching Requests: ", e);
      }
    };

    fetchRequests();
  }, []);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      (req.name
        ? req.name.toLowerCase().includes(searchQuery.toLowerCase())
        : req.Name
        ? req.Name.toLowerCase().includes(searchQuery.toLowerCase())
        : false) ||
      (req.phoneNumber
        ? req.phoneNumber.includes(searchQuery)
        : req.phone
        ? req.phone.includes(searchQuery)
        : false) ||
      (req.email
        ? req.email.toLowerCase().includes(searchQuery.toLowerCase())
        : req.Email
        ? req.Email.toLowerCase().includes(searchQuery.toLowerCase())
        : false);

    const matchesFilter = filterOption ? req.option === filterOption : true;

    return matchesSearch && matchesFilter;
  });
  const submitData = async () => {
    if (!date || !time || !selectedRequestId) {
      alert("Please select a date and time.");
      return;
    }

    try {
      const selectedRequest = requests.find(
        (req) => req.id === selectedRequestId
      );
      selectedRequest;
      if (!selectedRequest) {
        alert("Invalid request selected.");
        return;
      }

      // Format Date
      const formattedDate = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;
      // Prepare requestData based on option
      let requestData = {
        date: formattedDate,
        time: time,
        name: selectedRequest.Name,
        email: selectedRequest.Email,
        country: selectedRequest.country,
        category: selectedRequest.category || "Unknown",
        option: selectedRequest.option,
        type: selectedRequest.type || "Unknown",
        status: selectedRequest.status === "success" ? true : false,
        test: selectedRequest.test || "N/A",
      };
      if (selectedRequest.option === "course request") {
        requestData = {
          ...requestData,
          courseData: formattedDate,
          phone: selectedRequest.phone,
          courseTime: time,
        };
      } else {
        requestData = {
          ...requestData,
          name: selectedRequest.name,
          email: selectedRequest.email,
          phoneNumber: selectedRequest.phoneNumber,
          country: selectedRequest.country,
        };
      }

      // Email Data
      const formData = {
        title: "impact",
        time: requestData.time,
        name: "Impact",
        email:
          selectedRequest.option === "course request"
            ? selectedRequest.Email
            : selectedRequest.email, // Ensure email is defined
        message: `مرحبًا،

شكرًا لك على حجز الحصة التجريبية في Impact.

يسعدنا إعلامك بأنه قد تم تحديد موعد الحصة الخاصة بك في:

التاريخ: ${requestData.date}
الوقت: ${requestData.time}
نرجو الالتزام بالموعد المحدد، وإذا كانت لديك أي استفسارات أو رغبت في تعديل الموعد، لا تتردد في التواصل معنا.

مع تحيات فريق Impact`,
      };

      // Add to Firestore
      if (selectedRequest.option === "course request") {
        await addDoc(collection(db, "payments"), requestData);
      } else {
        await addDoc(collection(db, selectedRequest.option), requestData);
      }

      // Delete old request
      const requestRef = doc(db, "Requests", selectedRequestId);
      await deleteDoc(requestRef);

      // Update UI
      const updatedRequests = requests.filter(
        (req) => req.id !== selectedRequestId
      );
      setRequests(updatedRequests);

      // Send Email
      emailjs
        .send(
          "service_oxmtvyf", // Your EmailJS Service ID
          "template_xy6rjyc", // Your EmailJS Template ID
          formData,
          "oM6KnmiLSogyaWtiD" // Your EmailJS Public Key
        )
        .then(
          (response) => {
            "Email sent!", response;
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Email sent successfully!",
              timer: 1000,
              showConfirmButton: false,
            });
          },
          (error) => {
            console.error("Failed to send email", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to send email.",
              timer: 1000,
              showConfirmButton: false,
            });
          }
        );

      // Close modal & reset scroll
      setOpenModal(false);
      window.scrollTo(0, 0);
    } catch (e) {
      console.error("Error processing request: ", e);
      alert("Failed to process the request.");
    }
  };

  return (
    <main className="space-y-10">
      <h1 className="font-bold text-2xl">Students Requests</h1>

      <section className="flex items-center justify-start space-x-8">
        <form className="inline-block w-[40%] bg-[var(--Light)]/95 p-2 rounded-xl">
          <div className=" flex relative">
            <input
              type="search"
              placeholder="Search by name, phone , email"
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
          {isOpen && (
            <div className="absolute -right-20 mt-2 w-fit rounded-lg border-2 border-[var(--Yellow)] shadow-lg bg-[var(--Input)]">
              <div className="w-full">
                <button
                  onClick={() => setFilterOption("Free Session")}
                  className="w-full px-4 py-2 text-[var(--SubText)] hover:bg-[var(--Yellow)]/50"
                >
                  Free Session
                </button>
                <hr />
                <button
                  onClick={() => setFilterOption("Free Test")}
                  className="w-full px-4 py-2 text-[var(--SubText)] hover:bg-[var(--Yellow)]/50"
                >
                  Free Test
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
          )}
        </div>
      </section>

      <section className="overflow-hidden border-2 border-[#347792] rounded-xl">
        {filteredRequests.length > 0 ? (
          <table className="w-full text-center table-auto">
            <thead className="bg-[var(--Light)] text-[var(--SubText)] text-xl">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Country</th>
                <th className="p-4">Option</th>
                <th className="p-4">Status</th>
                <th className="p-4">Response</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests
                .filter((req) => req.status !== "pending") // ❌ Remove "pending" requests
                .map((req) => (
                  <tr key={req.id} className="hover:bg-gray-100">
                    <td className="p-4">{req.name || req.Name}</td>
                    <td className="p-4">{req.email || req.Email}</td>
                    <td className="p-4">{req.phoneNumber || req.phone}</td>
                    <td className="p-4">{req.country}</td>
                    <td className="p-4">{req.option}</td>
                    <td className="p-4">
                      {req.option === "Free Test" ||
                      req.option === "Free Session"
                        ? "not paid"
                        : req.status}
                    </td>
                    <td className="p-4">
                      <button
                        className="underline text-[var(--Yellow)]"
                        onClick={() => {
                          setSelectedRequestId(req.id);
                          setOpenModal(true);
                        }}
                      >
                        Select Date
                      </button>
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

export default Requests;
