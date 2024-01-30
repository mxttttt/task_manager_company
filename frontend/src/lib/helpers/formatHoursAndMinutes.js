const formatHoursAndMinutes = (hours, minutes) => {
  if (typeof hours === "object") {
    hours = hours.hours;
    minutes = hours.minutes;
  }

  if (hours === 0 && minutes === 0) {
    return "0 heure";
  } else if (hours === 0) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  } else if (minutes === 0) {
    return `${hours} heure${hours !== 1 ? "s" : ""}`;
  } else {
    return `${hours} heure${hours !== 1 ? "s" : ""} et ${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }
};

export default formatHoursAndMinutes;
