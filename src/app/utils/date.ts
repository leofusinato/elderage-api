export const getLocaledDate = (date: Date) => {
  date.setHours(date.getHours() - 3);
  return date;
};
