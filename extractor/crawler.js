// extractor/crawler.js
const puppeteer = require("puppeteer");
const fs = require("fs");

async function extractDOM(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const elements = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("input, button, a")).map(el => ({
      tag: el.tagName,
      type: el.type || "",
      name: el.name || "",
      id: el.id || "",
      text: el.innerText || "",
      placeholder: el.placeholder || "",
      class: el.className || ""
    }));
  });

  fs.writeFileSync("output/dom.json", JSON.stringify({ url, elements }, null, 2));
  console.log("✅ DOM extracted. Output written to output/dom.json");

  await browser.close();
}

extractDOM(process.argv[2]);
