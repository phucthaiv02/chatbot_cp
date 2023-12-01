import { Configuration } from "openai";
import dotenv from "dotenv"
dotenv.config()


console.log(process.env.OPEN_AI_SECRET)

export const configureOpenAI = () => {
  const config = new Configuration({
    apiKey: process.env.OPEN_AI_SECRET,
    organization: process.env.OPENAI_ORAGANIZATION_ID,
  });
  return config;
};
