const fs = require("fs");
const cohere = require("cohere-ai");

cohere.init("YOUR_REAL_API_KEY");

const dom = JSON.parse(fs.readFileSync("output/dom.json", "utf-8"));

async function classifyPage() {
  for (let element of dom.elements) {
    console.log("Prompt:", `Classify the type of this web element: ${JSON.stringify(element)}. Is it a username input, password field, button, or something else?`);

    const response = await cohere.generate({
      model: "command-r",
      prompt: `Classify the type of this web element: ${JSON.stringify(element)}. Is it a username input, password field, button, or something else?`,
      max_tokens: 50,
      temperature: 0.3
    });

    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response.body && response.body.generations && response.body.generations.length > 0) {
      element.prediction = response.body.generations[0].text.trim();
    } else {
      element.prediction = "Unable to classify";
      console.error("⚠️ No generation returned for element:", element);
    }
  }

  fs.writeFileSync("output/classified.json", JSON.stringify(dom, null, 2));
  console.log("✅ Classification complete. Output written to output/classified.json");
}

classifyPage();
