#!/usr/bin/env node
// Local visual smoke test: run from repository root with a server at 127.0.0.1:8000.
// CI installs Playwright temporarily; production site has no dependency on it.
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";

fs.mkdirSync("qa-screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
const checks = [
 { path: "/", label: "home-desktop", width: 1440, height: 900 },
 { path: "/", label: "home-tablet", width: 1024, height: 768 },
 { path: "/", label: "home-mobile", width: 390, height: 844 },
 { path: "/", label: "home-small", width: 320, height: 700 },
 { path: "/consulting.html", label: "consulting-desktop", width: 1440, height: 900 },
 { path: "/consulting.html", label: "consulting-mobile", width: 390, height: 844 },
 { path: "/case-study-shorthouse.html", label: "case-study-desktop", width: 1440, height: 900 },
 { path: "/production.html", label: "production-desktop", width: 1440, height: 900 },
 { path: "/production.html", label: "production-mobile", width: 390, height: 844 },
 { path: "/privacy.html", label: "privacy-mobile", width: 390, height: 844 },
 { path: "/engagement.html", label: "engagement-desktop", width: 1440, height: 900 },
 { path: "/engagement.html", label: "engagement-mobile", width: 390, height: 844 }
];
const failures = [];
try {
 for (const item of checks) {
  const page = await browser.newPage({ viewport: { width: item.width, height: item.height }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const response = await page.goto("http://127.0.0.1:8000" + item.path, { waitUntil: "domcontentloaded" });
  if (response?.status() !== 200) failures.push(item.label + ": HTTP " + response?.status());
  await page.locator("img").evaluateAll((imgs) => imgs.forEach((img) => { img.loading = "eager"; }));
  await page.waitForTimeout(450);
  const result = await page.evaluate(() => ({
    viewport: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    mainCount: document.querySelectorAll("main").length,
    h1Count: document.querySelectorAll("h1").length,
    images: Array.from(document.images).map(img => ({ src: img.getAttribute("src"), ok: img.complete && img.naturalWidth > 0 }))
  }));
  if (result.scrollWidth > result.viewport + 2) failures.push(item.label + ": horizontal overflow " + result.scrollWidth + " > " + result.viewport);
  if (result.mainCount !== 1) failures.push(item.label + ": expected one main landmark");
  if (result.h1Count !== 1) failures.push(item.label + ": expected one H1");
  for (const img of result.images) if (!img.ok) failures.push(item.label + ": image not loaded " + img.src);
  await page.screenshot({ path: "qa-screenshots/" + item.label + ".png", fullPage: true });
  // Audit WCAG rules in a separate testing context; bypassing CSP is only
  // for injecting the audit library, not for the functional site test above.
  const auditContext = await browser.newContext({ viewport: { width: item.width, height: item.height }, bypassCSP: true });
  const auditPage = await auditContext.newPage();
  await auditPage.goto("http://127.0.0.1:8000" + item.path, { waitUntil: "domcontentloaded" });
  const audit = await new AxeBuilder({ page: auditPage }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  for (const violation of audit.violations) {
    failures.push(item.label + ": accessibility " + violation.id + " (" + violation.impact + ") at " + violation.nodes.slice(0,2).map(n=>n.target.join(",")).join("; "));
  }
  console.log(item.label, "axe violations:", audit.violations.length);
  await auditContext.close();
  if (item.label === "consulting-desktop") {
    await page.route("https://formsubmit.co/ajax/info@elisoninc.com", async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: '{"success":"true"}' });
    });
    await page.locator("#client-name").fill("Site QA");
    await page.locator("#client-email").fill("qa@example.com");
    await page.locator("#client-message").fill("Test only: simulated form submission, no real message sent.");
    await page.locator("#inquiry-ack").check();
    await page.locator("#inquiry-form button[type=submit]").click();
    try {
      await page.getByRole("status").getByText("Your inquiry was submitted", { exact: false }).waitFor({ timeout: 3500 });
    } catch {
      failures.push("consulting-desktop: simulated inquiry did not show a success message");
    }
  }
  console.log(item.label, JSON.stringify(result));
  await page.close();
 }
} finally {
 await browser.close();
}
if (failures.length) {
 console.error("Visual QA failed:", failures.join("; "));
 process.exitCode = 1;
} else console.log("Visual QA passed across desktop, tablet and mobile.");
