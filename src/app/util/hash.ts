import { Md5 } from "ts-md5";

export const hashAny = (obj: any): string => {
  switch (typeof obj) {
    case "string":
      return hashString(obj);
    case "object":
      if (Array.isArray(obj)) {
        return hashArray(obj);
      } else {
        return hashObject(obj);
      }
    case "number":
    case "bigint":
      return hashNumber(obj);
    case "boolean":
      return hashBoolean(obj);

    default:
      return "";
  }
};

export const hashString = (str: string) => {
  return Md5.hashStr(str);
};

export const hashNumber = (num: number | BigInt) => {
  return hashString(num.toString());
};

export const hashBoolean = (b: boolean) => {
  return hashString(b.toString());
};

export const hashObject = (obj: any) => {
  const keys = Object.keys(obj);
  return hashArray(keys.map((key) => `${key}:${hashAny(obj[key])}`));
};

export const hashArray = (arr: Array<any>) => {
  return hashString(arr.map(hashAny).join(","));
};
