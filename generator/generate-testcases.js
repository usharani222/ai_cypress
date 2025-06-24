import fs from 'fs';
import path from 'path';
import cohere from 'cohere-ai';
import { COHERE_API_KEY } from '../config.js';
import { fileURLToPath } from 'url';

// Proper __dirname equivalent for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure output directory exists
const outputDir = path.join(__dirname, '../output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Load classified elements
const classifiedPath = path.join(outputDir, 'classified.json');
if (!fs.existsSync(classifiedPath)) {
  console.error('❌ classified.json not found in output directory.');
  process.exit(1);
}
const classifiedData = JSON.parse(fs.readFileSync(classifiedPath, 'utf8'));

// Set up Cohere API
cohere.init(COHERE_API_KEY);

// Prepare prompt for generating Cypress test code
const prompt = `
Given this classification of web page elements:
${JSON.stringify(classifiedData, null, 2)}

Generate Cypress E2E JavaScript test code using the Cypress framework for these elements.
- Use cy.visit(), cy.get(), cy.contains(), cy.click(), etc.
- Create a 'describe' block for the suite, and 'it' blocks for each test.
- Include both functional and negative test cases wherever applicable.
- Return only valid JavaScript Cypress test code.
- Do not include comments or explanations, just code.
`;

// Call Cohere API and write testcases.json
const run = async () => {
  try {
    const response = await cohere.generate({
      model: 'command-r-plus',
      prompt: prompt,
      max_tokens: 1500,
      temperature: 0.7,
    });

    if (!response.body.generations || !response.body.generations[0]) {
      throw new Error('No generations returned from Cohere');
    }

    const testcases = response.body.generations[0].text.trim();
    fs.writeFileSync(path.join(outputDir, 'testcases.json'), JSON.stringify({ testcases }, null, 2));

    console.log('✅ Test cases generated successfully and saved to output/testcases.json!');
  } catch (error) {
    console.error('❌ Error generating test cases:', error);
  }
};

run();
