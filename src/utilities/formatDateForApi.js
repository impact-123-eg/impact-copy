const formatDateForAPI = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
export default formatDateForAPI;

export const formatDate = (date) => {
  return date?.toLocaleDateString("en-UK", {
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};
