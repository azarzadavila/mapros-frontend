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

let seq_num = 0;

export function sync(leanFile) {
  seq_num += 1;
  return axios.post(ROOT_URL + "lean/sync/", {
    txt: leanFile.txt,
    seq_num: seq_num,
  });
}

export function stateAt(leanFile, line, col) {
  seq_num += 1;
  return axios.post(ROOT_URL + "lean/state/", {
    txt: leanFile.txt,
    line: line,
    col: col,
    seq_num: seq_num,
  });
}

export function start() {
  return axios.post(ROOT_URL + "lean/start/");
}

export function end() {
  return axios.post(ROOT_URL + "lean/end/");
}
