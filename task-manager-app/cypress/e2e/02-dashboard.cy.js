describe('Dashboard Tests', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/');
    cy.get('#loginEmail').type('admin@test.com');
    cy.get('#loginPassword').type('Admin@123');
    cy.get('#loginForm button[type="submit"]').click();
    cy.url().should('include', '/dashboard.html');
  });

  describe('Dashboard Layout', () => {
    it('Should display dashboard header correctly', () => {
      cy.contains('📝 Task Manager').should('be.visible');
      cy.get('#userEmail').should('contain', 'admin@test.com');
      cy.get('#userRole').should('contain', 'Admin');
      cy.get('#logoutBtn').should('be.visible');
      cy.get('#themeToggle').should('be.visible');
    });

    it('Should display user profile image', () => {
      cy.get('#profileImage').should('be.visible');
      cy.get('#profileImage').should('have.attr', 'src');
    });

    it('Should display search bar', () => {
      cy.get('#searchInput').should('be.visible');
      cy.get('#searchInput').should('have.attr', 'placeholder', '🔍 Search tasks...');
    });

    it('Should display filter controls', () => {
      cy.get('#filterStatus').should('be.visible');
      cy.get('#filterCategory').should('be.visible');
      cy.get('#sortBy').should('be.visible');
      cy.get('#resetFilters').should('be.visible');
    });

    it('Should display add task form', () => {
      cy.get('#addTaskForm').should('be.visible');
      cy.get('#taskName').should('be.visible');
      cy.get('#taskPriority').should('be.visible');
      cy.get('#taskCategory').should('be.visible');
      cy.get('#taskDueDate').should('be.visible');
      cy.get('#taskDescription').should('be.visible');
    });

    it('Should display task statistics', () => {
      cy.get('#totalTasks').should('be.visible');
      cy.get('#activeTasks').should('be.visible');
      cy.get('#completedTasks').should('be.visible');
      cy.get('#showingTasks').should('be.visible');
    });
  });

  describe('Theme Toggle', () => {
    it('Should toggle between light and dark theme', () => {
      cy.get('#themeToggle').click();
      cy.get('html').should('have.attr', 'data-theme', 'dark');
      cy.get('.theme-icon').should('contain', '☀️');
      
      cy.get('#themeToggle').click();
      cy.get('html').should('have.attr', 'data-theme', 'light');
      cy.get('.theme-icon').should('contain', '🌙');
    });

    it('Should persist theme preference', () => {
      cy.get('#themeToggle').click();
      cy.reload();
      cy.get('html').should('have.attr', 'data-theme', 'dark');
    });
  });

  describe('Logout', () => {
    it('Should logout successfully', () => {
      cy.get('#logoutBtn').click();
      cy.url().should('include', '/index.html');
      cy.contains('Task Manager').should('be.visible');
      cy.get('#loginForm').should('be.visible');
    });

    it('Should clear user session on logout', () => {
      cy.get('#logoutBtn').click();
      cy.window().then((win) => {
        expect(win.localStorage.getItem('user')).to.be.null;
      });
    });
  });
});
