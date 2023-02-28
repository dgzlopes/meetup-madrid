import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: '5s', target: 5 },
    { duration: '10s', target: 5 },
    { duration: '5s', target: 0 },
  ],
};

const IMPORTANT = "everyone"

export function setup (){
  console.log(`hello ${IMPORTANT}`)
}

export default function () {
  let res = http.get(`http://localhost:8080/dispatch?customer=123`);
  check(res, {"status is 200": (res) => res.status === 200});
  sleep(1);
}

export function teardown(){
  console.log("bye")
}