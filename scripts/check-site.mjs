#!/usr/bin/env node
// Lightweight static quality gate for elisoninc.com. No dependencies or API keys.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pages = ["index.html", "consulting.html", "case-study-devhouse.html", "case-study-shorthouse.html", "privacy.html", "404.html"];
const indexable = pages.filter((p) => p !== "404.html");
const issues = [];
const source = Object.fromEntries(pages.map((name) => [name, fs.readFileSync(path.join(root, name), "utf8")]));
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
function fail(message) { issues.push(message); }
function matches(str, re) { return Array.from(str.matchAll(re), (m) => m[1]); }

for (const [name, html] of Object.entries(source)) {
  const headings = (html.match(/<h1\b/gi) || []).length;
  if (headings !== 1) fail(name + ": expected one H1, found " + headings);
  if (!/<html[^>]*\blang="en"/i.test(html)) fail(name + ": missing document language");
  if (!/<meta name="viewport"/i.test(html)) fail(name + ": missing viewport");
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(name + ": missing page title");
  if (!/<meta name="description"/i.test(html) && name !== "404.html") fail(name + ": missing meta description");
  const idSet = new Set(matches(html, /\bid="([^"]+)"/g));
  const refs = matches(html, /(?:href|src)="([^"]+)"/g);
  for (const url of refs) {
    if (/^(?:https?:|mailto:|tel:|data:)/i.test(url)) continue;
    if (url.startsWith("#")) {
      if (!idSet.has(url.substring(1))) fail(name + ": missing anchor " + url);
      continue;
    }
    const file = url.split(/[?#]/)[0];
    const anchor = url.includes("#") ? url.split("#")[1] : null;
    if (!file || file === "/") continue;
    const absolute = path.join(root, file.replace(/^\//, ""));
    if (!fs.existsSync(absolute)) fail(name + ": missing local asset " + file);
    if (anchor && source[file] && !source[file].includes('id="' + anchor + '"'))
      fail(name + ": missing target " + url);
  }
  if (/<img\b/i.test(html) && /<img(?![^>]*\balt=)[^>]*>/i.test(html))
    fail(name + ": image missing alt attribute");
  if (indexable.includes(name)) {
    if (!html.includes('rel="canonical"')) fail(name + ": missing canonical");
    const loc = name === "index.html" ? "https://elisoninc.com/" : "https://elisoninc.com/" + name;
    if (!sitemap.includes("<loc>" + loc + "</loc>")) fail(name + ": absent from sitemap");
  }
  for (const body of matches(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(body); } catch { fail(name + ": invalid JSON-LD"); }
  }
}
const consult = source["consulting.html"];
if (!consult.includes("formsubmit.co/ajax/info@elisoninc.com")) fail("Lead form endpoint missing");
if (!consult.includes("elison-inc-discovery-call")) fail("Calendly discovery link missing");
if (!consult.includes("buy.stripe.com/4gM00j65Y10DdBye9mcwg03")) fail("Stripe checkout link missing");
if (!source["index.html"].includes('editorial.css')) fail("Editorial stylesheet missing");
if (!consult.includes("interior.css")) fail("Consulting stylesheet missing");
if (!fs.existsSync("assets/shorthouse-b2-still.jpg")) fail("B2 image missing");
if (!fs.existsSync("assets/devhouse-field-workflow.webp")) fail("DevHouse image missing");
if (!fs.existsSync("assets/elison-performance-art.jpg")) fail("ELISON artwork missing");
if (!fs.existsSync("inquiry.js")) fail("Inquiry handler missing");
if (!fs.readFileSync("robots.txt", "utf8").includes("https://elisoninc.com/sitemap.xml")) fail("Robots sitemap reference missing");
if (issues.length) { console.error("Site QA failed:\n" + issues.map(x => " - " + x).join("\n")); process.exitCode = 1; }
else console.log("Site QA passed: " + pages.length + " pages, local links, sitemap, metadata, assets and conversion links.");
