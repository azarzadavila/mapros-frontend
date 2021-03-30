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

export function createAccount(first_name, last_name, email, password) {
  return axios.post(ROOT_URL + "create_account/", {
    first_name: first_name,
    last_name: last_name,
    email: email,
    password: password,
  });
}
