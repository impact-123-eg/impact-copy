// Utility function to format duration
const formatDuration = (weeks) => {
  const weeksNum = parseInt(weeks);

  if (isNaN(weeksNum) || weeksNum <= 0) {
    return "Invalid duration";
  }

  // If duration is divisible by 4, show in months
  if (weeksNum % 4 === 0) {
    const months = weeksNum / 4;
    return `${months} ${months > 1 ? "Months" : "Month"}`;
  }

  // Otherwise show in weeks
  return `${weeksNum} ${weeksNum > 1 ? "Weeks" : "Week"}`;
};

export default formatDuration;
