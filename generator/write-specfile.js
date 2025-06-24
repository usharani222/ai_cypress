import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Proper __dirname equivalent for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load testcases.json
const outputDir = path.join(__dirname, '../output');
const testcasesPath = path.join(outputDir, 'testcases.json');

if (!fs.existsSync(testcasesPath)) {
  console.error('❌ testcases.json not found in output directory.');
  process.exit(1);
}

const testcasesData = JSON.parse(fs.readFileSync(testcasesPath, 'utf8'));
let testCode = testcasesData.testcases;

// Remove code fences if present
testCode = testCode.replace(/```javascript\s*/g, '');
testCode = testCode.replace(/```/g, '');

// Write to Cypress spec file
const specDir = path.join(__dirname, '../cypress/e2e');
if (!fs.existsSync(specDir)) {
  fs.mkdirSync(specDir, { recursive: true });
}

const specFilePath = path.join(specDir, 'ai-generated.cy.js');
fs.writeFileSync(specFilePath, testCode);

console.log(`✅ Cypress test spec generated at ${specFilePath}`);
