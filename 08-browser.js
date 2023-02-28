import { chromium } from 'k6/experimental/browser';
import { check } from 'k6';

export default async function () {
  const browser = chromium.launch({ headless: false });
  const page = browser.newPage();

  try {
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' })
    page.screenshot({ path: 'screenshot.png' });
    check(page, {
      'header': page.locator('h1').textContent() == 'Hot R.O.D.',
    });
  } finally {
    page.close();
    browser.close();
  }
}