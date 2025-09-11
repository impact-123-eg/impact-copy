const formatDuration = (weeks, t, ar = false) => {
  const weeksNum = parseInt(weeks);

  if (isNaN(weeksNum) || weeksNum <= 0) {
    return "Invalid duration";
  }

  // If duration is divisible by 4, show in months
  if (weeksNum % 4 === 0) {
    const months = weeksNum / 4;
    return `${months} ${months > (ar ? 2 : 1) ? t("months") : t("month")}`;
  }

  // Otherwise show in weeks
  return `${weeksNum} ${weeksNum > (ar ? 2 : 1) ? t("weeks") : t("week")}`;
};

export default formatDuration;
