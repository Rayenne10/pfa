import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
await mkdir('../verification', { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:8080/observability');
  await page.getByText('Real-Time Monitoring Dashboard').waitFor();
  await page.getByText('UP', { exact: true }).first().waitFor();
  if (await page.getByText('UP', { exact: true }).count() !== 4) throw new Error('Expected four healthy service cards');
  await page.screenshot({ path: '../verification/dashboard-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: '../verification/dashboard-mobile.png', fullPage: true });
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error('Dashboard overflows the mobile viewport');
  // A failed API must produce an explicit stale/unavailable warning.
  await page.route('**/api/dashboard/**', route => route.abort());
  await page.getByRole('alert').waitFor({ timeout: 15000 });
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('Dashboard rendering, mobile layout and failed-fetch state passed');
} finally { await browser.close(); }
