import { ROOT_URL } from "./Constants";

const axios = require("axios").default;

export class LeanFile {
  constructor(lines) {
    this.txt = "";
    for (let i = 0; i < lines.length; i++) {
      this.txt += lines[i];
      this.txt += "\n";
    }
  }
}

export function sync(leanFile) {
  return axios.post(ROOT_URL + "lean/sync/", leanFile);
}

export function stateAt(leanFile, line) {
  return axios.post(ROOT_URL + "lean/state/", {
    txt: leanFile.txt,
    line: line,
  });
}

export function start() {
  return axios.post(ROOT_URL + "lean/start/");
}

export function end() {
  return axios.post(ROOT_URL + "lean/end/");
}
