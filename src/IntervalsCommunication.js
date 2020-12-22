import { ROOT_URL } from "./Constants";
const axios = require("axios").default;

export function askQuestion(premises, question) {
  return axios.post(ROOT_URL + "intervals/ask/", {
    premises: premises,
    question: question,
  });
}
