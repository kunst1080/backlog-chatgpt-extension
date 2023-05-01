import Config from "./Config";
import { Message, OpenAIMessage, OpenAIResponse } from "./Message";

chrome.runtime.onMessage.addListener(
  (
    message: Message | OpenAIMessage,
    _: any,
    callback: (response: OpenAIResponse) => void
  ) => {
    if (message.type == "openai") {
      openaiRequest(message, callback);
    }
    return true;
  }
);

const openaiRequest = async (
  message: OpenAIMessage,
  callback: (response: OpenAIResponse) => void
): Promise<void> => {
  const data = {
    model: "text-davinci-003",
    prompt: message.prompt,
    max_tokens: message.maxTokens,
    temperature: message.temperature,
  };
  const config = await Config.load();
  console.log("Request to OpenAI API");
  console.log(data);
  fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.text())
    .then((body) => {
      console.log(body);
      callback({
        body: body,
      });
    });
};
