export type Message = {
  type: "none";
};

export type OpenAIMessage = {
  type: "openai";
  prompt: string;
  maxTokens: number;
  temperature: number;
};

export type OpenAIResponse = {
  body: string;
};
