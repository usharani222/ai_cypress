# AI-Powered Cypress Test Generator

An AI-driven system that automatically generates and runs Cypress E2E test cases for any given website by classifying web elements using Cohere's NLP, Puppeteer-based crawling, and Cypress automation — all containerized using **Podman**.

---

## Features

- **Puppeteer Crawler** — crawls entire websites and extracts links.
- **Element Classifier** — uses Cohere API to predict web element purposes.
- **AI-based Test Case Generator** — generates Cypress test cases dynamically from element classifications.
- **Cypress Runner** — runs generated tests automatically in both headless and headed modes.
- **HTML Reports with Screenshots** — detailed test reports using Mochawesome.
- **Podman-native Containerized** workflow.

---

## Setup Instructions

### Install Dependencies

- **Node.js** `v22+`
- **Podman** `v5+`
- Cohere API Key (for classification)

### Clone the Project

```bash
git clone <repo-url>
cd ai_cypress
```

### Install Node Dependencies

```bash
npm install
```

---

## Podman Container Workflow

### Build the Podman Image

```bash
podman build -t ai-cypress .
```

### Run the Container

```bash
podman run -it --name ai-cypress-container -p 8080:8080 -p 8081:8081 ai-cypress
```

---

## How to Use
---
## Run All Operations Together (Recommended)
Run the following single command inside the container to execute crawl, classify, generate tests, create Cypress specs, run tests, and generate reports:

```bash
node run-all.js "<https://targetwebsite.com>"
```
## Individual Steps (if needed)
### Crawl a Website

```bash
node crawler/crawl-entire-site.js "<https://targetwebsite.com>"
```

This will crawl the site, extract links, and save them in `output/dom.json`.

### Classify Web Elements

```bash
node classifier/classify.js
```

Classifies elements using Cohere and saves to `output/classified.json`.

### Generate Cypress Test Cases

```bash
node generator/generate-testcases.js
```

AI generates Cypress test case JSON.

### Create Cypress Test Spec File

```bash
node generator/write-specfile.js
```

Generates `cypress/e2e/ai-generated.cy.js`.

### Run Cypress Tests

```bash
npx cypress run --headed
```

or

```bash
npx cypress open
```

---

## View Test Reports

After a run, reports are generated at:

```
cypress/reports/index.html
```

Open it in your browser to review test results and screenshots.

## Extract Reports from Container 

```bash

podman cp ai-cypress:/home/appuser/ai_cypress/cypress/reports ./reports
```

---

## Notes

- API keys can be managed via `.env` file (if implemented).
- For pages prompt-based AI test generation supports edge case handling (e.g., invalid logins, timeouts).
- `cy.wait()` is dynamically added to handle slow-loading pages.

---

## License

MIT License

---

## Author

- G Usha Rani 
