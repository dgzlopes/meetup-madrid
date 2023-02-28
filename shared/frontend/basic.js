import { chromium } from 'k6/experimental/browser';

export async function LoadAndCheck(headless) {
  const browser = chromium.launch({ headless: headless });
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
