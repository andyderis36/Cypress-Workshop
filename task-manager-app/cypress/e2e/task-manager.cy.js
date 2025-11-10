describe('Task Manager App', () => {
  it('Should load the login page', () => {
    cy.visit('/'); // Mengakses halaman login
    cy.contains('Task Manager').should('be.visible');
    cy.contains('Login').should('be.visible');
  });

  it('Should allow login', () => {
    cy.visit('/'); // Mengakses halaman login (index.html)
    cy.get('#loginEmail').type('admin@test.com');
    cy.get('#loginPassword').type('Admin@123');
    cy.get('#loginForm button[type="submit"]').click();
    cy.url().should('include', '/dashboard.html'); // Verifikasi redirect ke dashboard
  });
});