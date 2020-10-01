import { EMPTY_DATE } from "./constants.js";

export const isEmpty = (testDate) => {
  const isEmptyDay = !testDate.day;
  const isEmptyMonth = !testDate.month && testDate.month !== 0;
  const isEmptyYear = !testDate.year;
  return isEmptyDay && isEmptyMonth && isEmptyYear;
};

export const parseDate = (date) => {
  const dateValue = !!date && date.date;
  const dateObject = dateValue || {
    getFullYear: () => date.year,
    getMonth: () => date.month,
    getDate: () => date.day,
  };
  const year = dateObject.getFullYear();
  const month = dateObject.getMonth();
  const day = dateObject.getDate();
  const parsedDate = { day, month, year };
  if (!!dateValue) {
    parsedDate.date = dateValue;
  }
  return parsedDate;
};

export const filterDate = (value) => {
  const { date, year, month, day } = parseDate(value);
  const filteredDate = {};
  if (!!date) {
    filteredDate.date = date;
  }
  if (!!year) {
    filteredDate.year = year;
  }
  if (!!month || month === 0) {
    filteredDate.month = month;
  }
  if (!!day) {
    filteredDate.day = day;
  }
  return filteredDate;
};

export const isEqual = (current, next) => {
  const currentDate = parseDate(current);
  const nextDate = parseDate(next);
  const isEqualDay = currentDate.day === nextDate.day;
  const isEqualMonth = currentDate.month === nextDate.month;
  const isEqualYear = currentDate.year === nextDate.year;
  return isEqualDay && isEqualMonth && isEqualYear;
};

export const getCurrentDate = () => {
  const currentDate = new Date();
  return {
    day: currentDate.getDate(),
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  };
};

export const initializeDate = (date) => {
  if (!date) {
    return { ...EMPTY_DATE };
  }
  const { day, month, year } = date;
  return { day, month, year };
};

export const generateWeekDates = (details) => {
  const { year, month, offset, limit, padding, prefix } = details;
  const weekDates = Array.from({ length: limit }, (_, date) => {
    const day = date + offset;
    return { day, month, year };
  });
  if (!!padding) {
    // return 1 week padded by empty strings
    const padDates = Array.from({ length: padding }, () => ({ ...EMPTY_DATE }));
    return prefix ? [...padDates, ...weekDates] : [...weekDates, ...padDates];
  } else {
    // group by week
    return Array.from({ length: weekDates.length / 7 }, (_, week) =>
      weekDates.slice(week * 7, week * 7 + 7)
    );
  }
};
