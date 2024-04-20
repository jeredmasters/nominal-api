import { ERROR_TYPE, InternalError } from "../domain/error";

export const dayString = (date: Date = new Date()) => {
  const day = date.getDate();
  if (day === 0) {
    throw new InternalError({
      code: "bad_date",
      func: "dayString",
      context: date.toString(),
      meta: date,
      type: ERROR_TYPE.NOT_FOUND
    });
  }
  return `${monthString(date)}-${day < 10 ? "0" : ""}${day}`;
};

export const monthString = (date: Date) => {
  let month = (date.getMonth() + 1).toString();
  if (month.length === 1) {
    month = "0" + month;
  }
  const year = date.getFullYear();
  return `${year}-${month}`;
};


export const monthFromDayStr = (dayStr: string) => {
  return dayStr.substring(0, 7)
}