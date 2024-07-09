export const formatTimeStamp = (timestamp) => {
  const year = timestamp.substring(0, 4);
  const month = timestamp.substring(4, 6);
  const day = timestamp.substring(6, 8);
  const hour = timestamp.substring(8, 10);
  const minute = timestamp.substring(10, 12);
  const second = timestamp.substring(12, 14);
  const millisecond = timestamp.substring(15, 18);

  const date = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    second,
    millisecond
  );

  const formattedDate = date.toLocaleString();

  return formattedDate;
};
