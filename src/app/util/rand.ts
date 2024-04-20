import { v4 } from "uuid";

export const uuidv4 = () => v4();

export const randInt = (min: number = 0, max: number = 100) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const randStr = (length: number = 10) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(randInt(charactersLength));
  }
  return result;
};

export const sleep = <T = any>(ms: number, v?: T) => {
  return new Promise<T | undefined>((res) => setTimeout(() => res(v), ms));
};
