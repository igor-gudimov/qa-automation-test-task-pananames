# qa-automation-test-task-pananames

This is a test automation project that uses Playwright framework and Typescript to test "contacts" and "domains" functionality of https://mcp.pananames-dev.com/ website on chromium, firefox and webkit. 

### Test Case Scenario
1. The contacts.spec.ts is covering creation, editing and deletion of Contacts in your User profile on the platform.
2. The domains.spec.ts is covering search and adding of different SLD/TLD domain items to your shopping cart, and veryfying that their cost is acurrate.

### Instruction on how to install dependencies and run this test script
1. **Git/Node.JS/Docker** 
First, download [Git](https://git-scm.com/downloads) to clone this repo to your local machine.
Then download [Node.JS](https://nodejs.org/en) for running test automation and installing devDependencies.
2. **Clone the Repository** 
   ```
   git clone https://github.com/igor-gudimov/qa-automation-test-task-pananames.git
   ```
3. **Credentials in .env file**
To execute test script successfully you will need to create .env file with this two fields and save it in project root:
   ```
   EMAIL=
   PASSWORD=
   ```
Email and password will be provided separatly.
4. **Install Dependencies**
Navigate to project root directory in command prompt and install the necessary dependencies one by one:
   ```
   npm install
   npx playwright install --with-deps
   ```
5. **Run test script on local machine**
To run all scripts locally, headless, in chromium and into 2 parallel processes, navigate to project root directory in command prompt and run this command:
   ```
   npx playwright test --project chromium
   ```
To see test results of last test run in HTML format - use this command:
   ```
   npx playwright show-report
   ```
If you want to run script with UI or headed - use this command:
   ```
   npx playwright test --ui
   ```
   npx playwright test --headed
   ```
You can run tests in different browsers using this commands
   ```
   npx playwright test --project webkit
   ```
   npx playwright test --project firefox
   ```
   npx playwright test --project chromium
   ```
To run a single test file, pass in the test file name that you want to run.
   ```
   npx playwright test contacts.spec.ts
   ```
To run a test with a specific title, use the -g flag followed by the title of the test.
   ```
   npx playwright test -g "Create new contact"
   ```
You can disable parallelism by allowing just a single worker at any time
   ```
   npx playwright test --workers=1