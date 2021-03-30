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
    frontend_url:
      window.location.protocol +
      "//" +
      window.location.hostname +
      ":" +
      window.location.port +
      "/confirm_account",
  });
}

export function authenticate(username, password) {
  return axios.post(ROOT_URL + "auth/", {
    username: username,
    password: password,
  });
}

export function confirmAccount(tokenURL) {
  return axios.get(ROOT_URL + "confirm_account/" + tokenURL);
}

export function checkReset(tokenURL) {
  return axios.get(ROOT_URL + "check_reset/" + tokenURL);
}

export function resetPassword(tokenURL, password) {
  return axios.post(ROOT_URL + "reset_password/" + tokenURL, {
    password: password,
  });
}

export function askReset(email) {
  return axios.post(ROOT_URL + "ask_reset/", {
    email: email,
    frontend_url:
      window.location.protocol +
      "//" +
      window.location.hostname +
      ":" +
      window.location.port +
      "/reset_password",
  });
}
