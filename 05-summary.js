import http from "k6/http";
import { check, sleep } from "k6";
import { Trend, Counter } from "k6/metrics";

export const options = {
  stages: [
    { duration: '5s', target: 5 },
    { duration: '10s', target: 5 },
    { duration: '5s', target: 0 },
  ],
};

const IMPORTANT = "everyone";

const myTrend = new Trend('demo_waiting_time');
const myCounter = new Counter('demo_taxis_dispatched')

export function setup (){
  console.log(`hello ${IMPORTANT}`)
}

export default function () {
  let res = http.get(`http://localhost:8080/dispatch?customer=123`);
  check(res, {"status is 200": (res) => res.status === 200});
  myTrend.add(res.timings.waiting);
  myCounter.add(1);
  sleep(1);
}

export function teardown(){
  console.log("bye")
}

export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data),
  }
}