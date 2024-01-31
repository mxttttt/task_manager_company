const formatHoursAndMinutes = (hours, minutes) => {
  if (typeof hours === "object") {
    hours = hours.hours;
    minutes = hours.minutes;
  } else if (minutes === undefined) {
    minutes = Math.round((hours % 1) * 60);
    hours = Math.floor(hours);
  }

  if (hours === 0 && minutes === 0) {
    return "0 heure";
  } else if (hours === 0) {
    return `${minutes} min`;
  } else if (minutes === 0) {
    return `${hours} h`;
  } else {
    return `${hours} h ${minutes} `;
  }
};

export default formatHoursAndMinutes;
