export const EMPTY_DATE = {
  day: "",
  month: "",
  year: "",
};

export const START_ON_SUNDAY = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];
export const START_ON_MONDAY = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

export const YEAR = "YYYY";
export const YEAR_MONTH = "YYYY/MM";
export const YEAR_MONTH_DAY = "YYYY/MM/DD";

const now = new Date();
export const NOW = {
  day: now.getDate(),
  month: now.getMonth(),
  year: now.getFullYear(),
};
