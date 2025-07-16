Generate a Playwright test script using JavaScript that works with the Playwright MCP server setup.


Context:
We are testing the login flow for the CRM environment at: `http://localhost:3000`

Steps:

1. navigate to home page
2. click on "Criar novo workspace"
3. insert a invalid name (less than 3 caracters or empty)
4. confirm and check if failure notification is shown
5. try again
6. insert a valid name
7. confirm
8. check if succesfull notification is shown

Requirements:

- Save the test under the `tests` folder with the name: `crm-login.spec.js`
- Code must be compatible with `npx playwright test` and MCP server execution.
- Do run steps one by one using the tools provided by the Playwright MCP 
- After all the steps done Execute the test file using headed mode  