import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: '5s', target: 5 },
    { duration: '10s', target: 5 },
    { duration: '5s', target: 0 },
  ],
};

export default function () {
  let res = http.get(`http://localhost:8080/dispatch?customer=123`);
  check(res, {"status is 200": (res) => res.status === 200});
  sleep(1);
}