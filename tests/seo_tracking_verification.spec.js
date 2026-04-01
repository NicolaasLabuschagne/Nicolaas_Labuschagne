
const { test, expect } = require('@playwright/test');
const path = require('path');

test('Verify SEO meta tags', async ({ page }) => {
  // Load the local index.html file
  const filePath = `file://${path.resolve(__dirname, '../index.html')}`;
  await page.goto(filePath);

  // Check standard meta tags
  const description = await page.getAttribute('meta[name="description"]', 'content');
  expect(description).toContain('Nicolaas Labuschagne');
  expect(description).toContain('Systems Architect');

  const keywords = await page.getAttribute('meta[name="keywords"]', 'content');
  expect(keywords).toContain('Nicolaas Labuschagne');
  expect(keywords).toContain('Full Stack Developer');

  // Check Open Graph tags
  expect(await page.getAttribute('meta[property="og:title"]', 'content')).toBe('Nicolaas Labuschagne | Systems Architect & Full Stack Developer');
  expect(await page.getAttribute('meta[property="og:type"]', 'content')).toBe('website');

  // Check Twitter tags
  expect(await page.getAttribute('meta[property="twitter:card"]', 'content')).toBe('summary_large_image');
  expect(await page.getAttribute('meta[property="twitter:title"]', 'content')).toBe('Nicolaas Labuschagne | Systems Architect & Full Stack Developer');
});

test('Verify default theme is Fun', async ({ page }) => {
  const filePath = `file://${path.resolve(__dirname, '../index.html')}`;
  await page.goto(filePath);

  const bodyClass = await page.getAttribute('body', 'class');
  expect(bodyClass).toContain('theme-fun');
});

test('Verify click tracking listener presence', async ({ page }) => {
  const filePath = `file://${path.resolve(__dirname, '../index.html')}`;
  await page.goto(filePath);

  // We can check if gtag was called by mocking it
  await page.evaluate(() => {
    window.gtagHistory = [];
    window.gtag = (...args) => {
      window.gtagHistory.push(args);
    };
  });

  // Click on something specific to avoid overlap
  await page.click('h1');

  // Check if raw_click event was logged
  const history = await page.evaluate(() => window.gtagHistory);
  const rawClickEvent = history.find(args => args[0] === 'event' && args[1] === 'raw_click');
  expect(rawClickEvent).toBeDefined();
  // It might click on a SPAN inside H1
  expect(['H1', 'SPAN']).toContain(rawClickEvent[2].tag);
});
