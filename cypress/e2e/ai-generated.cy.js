describe('GeeksforGeeks.org E2E Tests', () => {
  beforeEach(() => {
    cy.visit('https://www.geeksforgeeks.org');
    cy.wait(2000);
  });

  it('should display the GeeksforGeeks logo', () => {
    cy.get('a.headerMainLogo').should('be.visible');
  });

  it('should have a Sign In button', () => {
    cy.get('button.signinButton').should('be.visible');
    cy.get('button.signinButton').click();
    cy.wait(2000);
    // Add assertions for the expected behavior after clicking Sign In
  });

  it('should display Courses link', () => {
    cy.get('a').contains('Courses').should('be.visible');
    cy.get('a').contains('Courses').click();
    cy.wait(2000);
    // Add assertions for the expected behavior after clicking Courses link
  });

  it('should display DSA to Development link', () => {
    cy.get('a').contains('DSA to Development').should('be.visible');
    cy.get('a').contains('DSA to Development').click();
    cy.wait(2000);
    // Add assertions for the expected behavior after clicking the link
  });

  // Add similar test cases for other links and buttons on the page

  it('should perform a search', () => {
    cy.get('input').type('Data Structures{enter}');
    cy.wait(2000);
    // Add assertions to verify the search results
  });

  it('should select a topic from the dropdown', () => {
    cy.get('button.gfgGoogleTranslate').click();
    cy.get('button').contains('Select Language').click();
    cy.get('button').contains('Hindi').click();
    cy.wait(2000);
    // Add assertions to verify the language change
  });

  // Add more test cases for other interactive elements on the page
});
