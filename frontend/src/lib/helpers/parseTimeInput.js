const parseTimeInput = (input) => {
  const regex = /(\d+)h(\d+)/;
  const match = regex.exec(input);

  if (match) {
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    return hours + minutes / 60;
  } else {
    return parseFloat(input);
  }
};

export default parseTimeInput;
