import { cookies, ROOT_URL } from "./Constants";

const axios = require("axios").default;

function genHeader() {
  const token = cookies.get("token");
  return { Authorization: "Token " + token };
}

export function checkToken(token) {
  return axios.post(ROOT_URL + "auth/check/", { token: token });
}

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

export function listOwnedTheoremStatements() {
  return axios.get(ROOT_URL + "owned_theorem_statements/", {
    headers: genHeader(),
  });
}

export function getOwnedTheoremStatement(id) {
  return axios.get(ROOT_URL + "owned_theorem_statement/" + id + "/", {
    headers: genHeader(),
  });
}

export function createTheoremStatement(data) {
  return axios.post(ROOT_URL + "owned_theorem_statements/", data, {
    headers: genHeader(),
  });
}

export function updateTheoremStatement(id, data) {
  return axios.put(ROOT_URL + "owned_theorem_statement/" + id + "/", data, {
    headers: genHeader(),
  });
}

export function listUsersNotAssignedStatement(id) {
  return axios.get(ROOT_URL + "list_users_not_theorem_statement/" + id + "/", {
    headers: genHeader(),
  });
}

export function sendStatement(statement_id, users) {
  return axios.post(
    ROOT_URL + "send_statement/",
    { theorem_statement: statement_id, users: users },
    { headers: genHeader() }
  );
}

export function getTheoremProof(id) {
  return axios.get(ROOT_URL + "theorem_proof/" + id + "/", {
    headers: genHeader(),
  });
}
