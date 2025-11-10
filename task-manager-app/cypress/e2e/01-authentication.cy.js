describe('Authentication Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Login Page', () => {
    it('Should display login page correctly', () => {
      cy.contains('Task Manager').should('be.visible');
      cy.get('#loginForm').should('be.visible');
      cy.get('#loginEmail').should('be.visible');
      cy.get('#loginPassword').should('be.visible');
      cy.get('#loginForm button[type="submit"]').should('contain', 'Login');
    });

    it('Should show validation errors for empty fields', () => {
      cy.get('#loginForm button[type="submit"]').click();
      cy.get('#loginEmail:invalid').should('exist');
      cy.get('#loginPassword:invalid').should('exist');
    });

    it('Should show error for invalid credentials', () => {
      cy.get('#loginEmail').type('invalid@test.com');
      cy.get('#loginPassword').type('wrongpassword');
      cy.get('#loginForm button[type="submit"]').click();
      cy.contains('Invalid email or password').should('be.visible');
    });

    it('Should login successfully with valid admin credentials', () => {
      cy.get('#loginEmail').type('admin@test.com');
      cy.get('#loginPassword').type('Admin@123');
      cy.get('#loginForm button[type="submit"]').click();
      cy.url().should('include', '/dashboard.html');
      cy.contains('Task Manager').should('be.visible');
    });

    it('Should login successfully with valid user credentials', () => {
      cy.get('#loginEmail').type('user@test.com');
      cy.get('#loginPassword').type('User@123');
      cy.get('#loginForm button[type="submit"]').click();
      cy.url().should('include', '/dashboard.html');
    });

    it('Should toggle password visibility', () => {
      cy.get('#loginPassword').should('have.attr', 'type', 'password');
      cy.get('button[data-target="loginPassword"]').click();
      cy.get('#loginPassword').should('have.attr', 'type', 'text');
      cy.get('button[data-target="loginPassword"]').click();
      cy.get('#loginPassword').should('have.attr', 'type', 'password');
    });

    it('Should remember me checkbox work', () => {
      cy.get('#rememberMe').check();
      cy.get('#rememberMe').should('be.checked');
      cy.get('#rememberMe').uncheck();
      cy.get('#rememberMe').should('not.be.checked');
    });
  });

  describe('Registration Page', () => {
    it('Should switch to registration form', () => {
      cy.contains('Register').click();
      cy.get('#registerForm').should('be.visible');
      cy.get('#registerEmail').should('be.visible');
      cy.get('#registerPassword').should('be.visible');
    });

    it('Should register new user successfully', () => {
      cy.contains('Register').click();
      const timestamp = Date.now();
      cy.get('#registerEmail').type(`newuser${timestamp}@test.com`);
      cy.get('#registerPassword').type('NewUser@123');
      cy.get('#registerForm button[type="submit"]').click();
      cy.url().should('include', '/dashboard.html');
    });

    it('Should show error for existing email', () => {
      cy.contains('Register').click();
      cy.get('#registerEmail').type('admin@test.com');
      cy.get('#registerPassword').type('Admin@123');
      cy.get('#registerForm button[type="submit"]').click();
      cy.contains('Email already registered').should('be.visible');
    });

    it('Should validate password strength', () => {
      cy.contains('Register').click();
      cy.get('#registerPassword').type('weak');
      cy.get('.password-strength').should('exist');
    });

    it('Should switch back to login form', () => {
      cy.contains('Register').click();
      cy.get('#registerForm').should('be.visible');
      cy.contains('Login').click();
      cy.get('#loginForm').should('be.visible');
    });
  });
});
