import { EMPTY_DATE } from "./constants.js";

export const isEmpty = (testDate) => {
  const isEmptyDay = !testDate.day;
  const isEmptyMonth = !testDate.month && testDate.month !== 0;
  const isEmptyYear = !testDate.year;
  return isEmptyDay && isEmptyMonth && isEmptyYear;
};

const parseDate = (date) => {
  const dateObject = (!!date && date.date) || {
    getFullYear: () => date.year,
    getMonth: () => date.month,
    getDate: () => date.day,
  };
  const year = dateObject.getFullYear();
  const month = dateObject.getMonth();
  const day = dateObject.getDate();
  return { day, month, year };
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
    return EMPTY_DATE;
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

export const validateDate = ({ date, year, month, day }) => {
  const hasSelectedDate = !!date;
  const hasYear = !!year;
  const hasMonth = !!month || month === 0;
  const hasDay = !!day;
  const hasFullDate = hasYear && hasMonth && hasDay;
  const hasYearOnly = hasYear && !hasMonth && !hasDay;
  const hasYearAndMonthOnly = hasYear && hasMonth && !hasDay;
  return { hasSelectedDate, hasYearOnly, hasYearAndMonthOnly, hasFullDate };
};

export const parseInput = (selected, allowPartial, inputPattern) => {
  const { date, year, month, day } = selected;
  const hasSelectedDate = !!date;
  const hasYear = !!year;
  const hasMonth = !!month || month === 0;
  const hasDay = !!day;
  const hasFullDate = hasYear && hasMonth && hasDay;
  const hasYearOnly = hasYear && !hasMonth && !hasDay;
  const hasYearAndMonthOnly = hasYear && hasMonth && !hasDay;

  const result = {};

  let selectedDate = date;

  if (!hasSelectedDate) {
    if (hasYearOnly) {
      selectedDate = new Date();
      selectedDate.setFullYear(year);
    } else if (hasYearAndMonthOnly) {
      selectedDate = new Date(year, month);
    } else if (hasFullDate) {
      selectedDate = new Date(year, month, day);
    } else {
      selectedDate = null;
    }
  }

  result.pattern = inputPattern;

  if (allowPartial) {
    result.patternMatcher = "MDY";
    result.patternRegex = "\\d";
    if (hasYearOnly) {
      result.pattern = "YYYY";
    } else if (hasYearAndMonthOnly) {
      result.pattern = "YYYY/MM";
    } else {
      result.pattern = "YYYY/MM/DD";
    }
  }
  result.value = !!selectedDate
    ? moment(selectedDate.getTime()).format(result.pattern)
    : "";

  return result;
};
