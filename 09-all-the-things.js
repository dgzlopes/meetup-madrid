import http from "k6/http";
import { check, sleep } from "k6";
import { Trend, Counter } from "k6/metrics";
import { SharedArray } from 'k6/data';
import { chromium } from 'k6/experimental/browser';

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
  const browser = chromium.launch({ headless: true });
  const page = browser.newPage();

  try {
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' })
    page.screenshot({ path: `screenshots/${__ITER}.png` });
    check(page, {
      'header': page.locator('h1').textContent() == 'Hot R.O.D.',
    });
  } finally {
    page.close();
    browser.close();
  }

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