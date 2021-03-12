import { ROOT_URL } from "./Constants";

const axios = require("axios").default;

export function askState({ name, hypotheses, goal, proofs }) {
  return axios.post(ROOT_URL + "ask_state/", {
    name: name,
    hypotheses: hypotheses,
    goal: goal,
    proofs: proofs,
  });
}
