import { OpenAIResponse } from "./Message";
import * as CryptoJS from "crypto-js";

export const callOpenAIRequest = (
  prompt: string,
  maxTokens: number,
  temperature: number
): Promise<OpenAIResponse> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        type: "openai",
        prompt: prompt,
        maxTokens: maxTokens,
        temperature: temperature,
      },
      (response: OpenAIResponse) => {
        resolve(response);
      }
    );
  });
};

export const calculateMD5 = (text: string): string => {
  return CryptoJS.MD5(text).toString();
};

export const loadData = async <T>(
  key: string,
  expireMillis: number,
  loadFunction: () => Promise<T>
): Promise<T> => {
  const c = await chrome.storage.local.get(key).then((c) => c[key]);
  if (c && c.expire > Date.now()) {
    console.debug(`use cache: ${key}`);
    return c.data as T;
  }
  console.debug(`fetch data: ${key}`);
  const cd = await loadFunction();
  chrome.storage.local.set({
    [key]: {
      data: cd,
      expire: Date.now() + expireMillis,
    },
  });
  return cd;
};
