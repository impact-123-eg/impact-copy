import { useState } from "react";
import { useGetBookingMeetLink } from "./useCurdsBooking";

export const useMeetingLink = (bookingId) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const { data: meetLinkRes, refetch } = useGetBookingMeetLink(bookingId);
  const meetLink = meetLinkRes?.data?.data?.meetLink;

  const getMeetingLink = async () => {
    if (!bookingId) return;

    setIsRequesting(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Failed to get meeting link:", error);
    } finally {
      setIsRequesting(false);
    }
  };

  return {
    meetLink,
    isRequesting,
    getMeetingLink,
  };
};
