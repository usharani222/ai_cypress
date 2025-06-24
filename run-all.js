import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk'; // for colorful logs

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get URL from command line
const url = process.argv[2];
if (!url) {
  console.error(chalk.red('❌ Please provide a URL as an argument.'));
  process.exit(1);
}

// Command sequence with descriptive log labels
const steps = [
  { command: `node extractor/crawler.js "${url}"`, message: '🌐 Crawling and extracting DOM...' },
  { command: `node classifier/classify.js`, message: '🧠 Classifying DOM elements with Cohere...' },
  { command: `node generator/generate-testcases.js`, message: '📝 Generating Cypress test cases from classified elements...' },
  { command: `node generator/write-specfile.js`, message: '📄 Writing Cypress test spec file...' },
  { command: `npx cypress run`, message: '🚀 Running Cypress E2E tests and generating report...' }
];

// Execute sequentially with logs
function runStepsSequentially(index = 0) {
  if (index >= steps.length) {
    console.log(chalk.green('\n✅ All steps completed successfully!'));
    console.log(chalk.blueBright(`📄 Test Report available at: ${path.join(__dirname, 'cypress/reports/mochawesome.html')}\n`));
    return;
  }

  console.log(chalk.yellowBright(`\n👉 ${steps[index].message}`));
  console.log(chalk.gray(`> ${steps[index].command}`));

  const child = exec(steps[index].command, { cwd: __dirname });

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(chalk.red(`\n❌ Step failed: ${steps[index].command}`));
      process.exit(1);
    }
    runStepsSequentially(index + 1);
  });
}

runStepsSequentially();
