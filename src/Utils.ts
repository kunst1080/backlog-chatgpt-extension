import Config from "./Config";
import * as CryptoJS from "crypto-js";

export const callOpenAIRequest = async (
  prompt: string,
  maxTokens: number,
  temperature: number
): Promise<string> => {
  console.log(`callOpenAIRequest: ${prompt}`);

  const data = {
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: maxTokens,
    temperature: temperature,
  };
  const config = await Config.load();
  console.log("Request to OpenAI API");
  console.log(data);
  const responseBody = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(data),
  }).then((res) => res.text());
  console.log(responseBody);
  return responseBody;
};

export const calculateMD5 = (text: string): string => {
  return CryptoJS.MD5(text).toString();
};

export const loadData = async <T>(
  key: string,
  expireMillis: number,
  loadFunction: () => Promise<T>
): Promise<T> => {
  const c = await chrome.storage.local.get(key)?.then((c) => c[key]);
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

export const triggerChangeEvent = (element: Node): void => {
  const event = new Event("change", { bubbles: true });
  element.dispatchEvent(event);
};

export const escapeHTML = (text: string): string => {
  return text
    .replace(/&/g, "&amp;") // アンパサンド
    .replace(/</g, "&lt;") // 小なり記号
    .replace(/>/g, "&gt;") // 大なり記号
    .replace(/"/g, "&quot;") // 二重引用符
    .replace(/'/g, "&#039;"); // 単引用符
};
