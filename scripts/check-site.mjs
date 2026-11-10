#!/usr/bin/env node
// Lightweight static quality gate for elisoninc.com. No dependencies or API keys.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pages = ["index.html", "consulting.html", "case-study-devhouse.html", "case-study-shorthouse.html", "privacy.html", "production.html", "engagement.html", "404.html"];
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
  if (!html.includes('http-equiv="Content-Security-Policy"')) fail(name + ": missing CSP meta");
  if (!html.includes('name="referrer"')) fail(name + ": missing referrer policy");
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
    if (!html.includes('property="og:image"')) fail(name + ": missing social preview");
    if (!html.includes('name="twitter:image"')) fail(name + ": missing social preview for X");
    if (!html.includes('href="engagement.html"') && name !== "engagement.html") fail(name + ": missing client information link");
    const loc = name === "index.html" ? "https://elisoninc.com/" : "https://elisoninc.com/" + name;
    if (!sitemap.includes("<loc>" + loc + "</loc>")) fail(name + ": absent from sitemap");
  }
  for (const body of matches(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(body); } catch { fail(name + ": invalid JSON-LD"); }
  }
}
const consult = source["consulting.html"];
if (!consult.includes('id="inquiry-ack"') || !consult.includes('required> <span>I understand')) fail("Inquiry acknowledgment control missing");
if (!consult.includes('href="engagement.html"')) fail("Engagement information missing near consulting");
if (!consult.includes("formsubmit.co/ajax/info@elisoninc.com")) fail("Lead form endpoint missing");
if (!consult.includes("elison-inc-discovery-call")) fail("Calendly discovery link missing");
if (!consult.includes("buy.stripe.com/4gM00j65Y10DdBye9mcwg03")) fail("Stripe checkout link missing");
if (!source["index.html"].includes('editorial.css')) fail("Editorial stylesheet missing");
if (!consult.includes("interior.css")) fail("Consulting stylesheet missing");
if (!fs.existsSync("assets/shorthouse-b2-still.jpg")) fail("B2 image missing");
if (!fs.existsSync("assets/devhouse-field-workflow.webp")) fail("DevHouse image missing");
if (!fs.existsSync("assets/elison-performance-art.jpg")) fail("ELISON artwork missing");
if (!fs.existsSync("assets/og/og-production.jpg")) fail("Production OG image missing");
if (!fs.existsSync("inquiry.js")) fail("Inquiry handler missing");
if (source["index.html"].includes("Dreamline")) fail("Superseded Dreamline listing returned to public website");
if (!fs.readFileSync("robots.txt", "utf8").includes("https://elisoninc.com/sitemap.xml")) fail("Robots sitemap reference missing");

// Catch common secret formats and private keys before changes reach the public site.
const secretPatterns = [
  /sk-(?:proj|live|test)-[A-Za-z0-9_-]{16,}/,
  /gh[pous]_[A-Za-z0-9]{20,}/,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/
];
for (const file of [...pages, "inquiry.js", "editorial.css", "interior.css", "styles.css"]) {
  const content = fs.readFileSync(path.join(root, file), "utf8");
  if (secretPatterns.some(re => re.test(content))) fail(file + ": possible credential exposed");
}

if (issues.length) { console.error("Site QA failed:\n" + issues.map(x => " - " + x).join("\n")); process.exitCode = 1; }
else console.log("Site QA passed: " + pages.length + " pages, local links, sitemap, metadata, assets and conversion links.");
