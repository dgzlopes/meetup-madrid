import http from "k6/http";
import { check, sleep } from "k6";
import { Trend, Counter } from "k6/metrics";
import { SharedArray } from 'k6/data';
import { LoadAndCheck } from "./shared/frontend/basic.js";

export const options = {
  scenarios: {
    smokeDispatch: {
      exec: "dispatch",
      executor: "constant-vus",
      vus: 1,
      duration: "10s",
    },
    stressDispatch: {
      exec: "dispatch",
      executor: "ramping-vus",
      stages: [
        { duration: "20s", target: 20 },
        { duration: "10s", target: 0 },
      ],
      gracefulRampDown: "5s",
      startTime: "10s",
    },
    browser: {
      exec: "browser",
      executor: "constant-vus",
      vus: 1,
      duration: "40s"
    }
  },
};

const IMPORTANT = "everyone";

const myTrend = new Trend('demo_waiting_time');
const myCounter = new Counter('demo_taxis_dispatched')

const customers = new SharedArray('all my customers', function () {
  return JSON.parse(open('./customers.json')).customers;
});


export function setup (){
  console.log(`hello ${IMPORTANT}`)
}

export function dispatch() {
  const customer = customers[Math.floor(Math.random() * customers.length)];
  console.log(`Dispatching new taxi for customer ${customer}`);
  let res = http.get(`http://localhost:8080/dispatch?customer=${customer}`);
  check(res, {"status is 200": (res) => res.status === 200});
  myTrend.add(res.timings.waiting);
  myCounter.add(1);
  sleep(1);
}

export async function browser() {
  await LoadAndCheck(true);
}

export function teardown(){
  console.log("bye")
}

export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data),
  }
}