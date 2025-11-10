describe('Search and Filter Tests', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/');
    cy.get('#loginEmail').type('admin@test.com');
    cy.get('#loginPassword').type('Admin@123');
    cy.get('#loginForm button[type="submit"]').click();
    cy.url().should('include', '/dashboard.html');
    cy.wait(1000);

    // Create sample tasks for testing
    const tasks = [
      { name: 'High Priority Work Task', priority: 'High', category: 'Work' },
      { name: 'Medium Priority Personal Task', priority: 'Medium', category: 'Personal' },
      { name: 'Low Priority Shopping Task', priority: 'Low', category: 'Shopping' }
    ];

    tasks.forEach((task, index) => {
      cy.get('#taskName').clear().type(task.name);
      cy.get('#taskPriority').select(task.priority);
      cy.get('#taskCategory').select(task.category);
      cy.get('#addTaskForm button[type="submit"]').click();
      cy.wait(500);
    });

    cy.wait(1000);
  });

  describe('Search Functionality', () => {
    it('Should search tasks by name', () => {
      cy.get('#searchInput').type('Work');
      cy.wait(500);
      cy.contains('High Priority Work Task').should('be.visible');
      cy.contains('Personal Task').should('not.exist');
    });

    it('Should search tasks case-insensitively', () => {
      cy.get('#searchInput').type('work');
      cy.wait(500);
      cy.contains('High Priority Work Task').should('be.visible');
    });

    it('Should show no results for invalid search', () => {
      cy.get('#searchInput').type('NonexistentTask12345');
      cy.wait(500);
      cy.get('#emptyState').should('be.visible');
      cy.contains('No tasks found').should('be.visible');
    });

    it('Should clear search and show all tasks', () => {
      cy.get('#searchInput').type('Work');
      cy.wait(500);
      cy.get('#searchInput').clear();
      cy.wait(500);
      cy.contains('High Priority Work Task').should('be.visible');
      cy.contains('Personal Task').should('be.visible');
    });

    it('Should search by partial task name', () => {
      cy.get('#searchInput').type('Priority');
      cy.wait(500);
      cy.get('.task-item').should('have.length.at.least', 2);
    });
  });

  describe('Filter by Status', () => {
    it('Should filter active tasks', () => {
      cy.get('#filterStatus').select('Active');
      cy.wait(500);
      cy.get('.task-item:not(.completed)').should('be.visible');
    });

    it('Should filter completed tasks', () => {
      // Complete one task first
      cy.get('.task-item').first().find('input[type="checkbox"]').check();
      cy.wait(1000);

      cy.get('#filterStatus').select('Completed');
      cy.wait(500);
      cy.get('.task-item.completed').should('be.visible');
    });

    it('Should show all tasks when filter is All', () => {
      cy.get('#filterStatus').select('All');
      cy.wait(500);
      cy.get('.task-item').should('have.length.at.least', 1);
    });
  });

  describe('Filter by Category', () => {
    it('Should filter Work category tasks', () => {
      cy.get('#filterCategory').select('Work');
      cy.wait(500);
      cy.contains('High Priority Work Task').should('be.visible');
      cy.contains('Personal Task').should('not.exist');
      cy.contains('Shopping Task').should('not.exist');
    });

    it('Should filter Personal category tasks', () => {
      cy.get('#filterCategory').select('Personal');
      cy.wait(500);
      cy.contains('Medium Priority Personal Task').should('be.visible');
      cy.contains('Work Task').should('not.exist');
    });

    it('Should filter Shopping category tasks', () => {
      cy.get('#filterCategory').select('Shopping');
      cy.wait(500);
      cy.contains('Low Priority Shopping Task').should('be.visible');
      cy.contains('Work Task').should('not.exist');
      cy.contains('Personal Task').should('not.exist');
    });

    it('Should show all categories when filter is All', () => {
      cy.get('#filterCategory').select('All');
      cy.wait(500);
      cy.contains('Work Task').should('be.visible');
      cy.contains('Personal Task').should('be.visible');
      cy.contains('Shopping Task').should('be.visible');
    });
  });

  describe('Sort Functionality', () => {
    it('Should sort by name (A-Z)', () => {
      cy.get('#sortBy').select('Name (A-Z)');
      cy.wait(500);
      cy.get('.task-item').first().should('contain', 'High');
    });

    it('Should sort by priority', () => {
      cy.get('#sortBy').select('Priority');
      cy.wait(500);
      cy.get('.task-item').first().should('contain', 'High');
    });

    it('Should sort by due date', () => {
      cy.get('#sortBy').select('Due Date');
      cy.wait(500);
      cy.get('.task-item').should('be.visible');
    });

    it('Should sort by date created', () => {
      cy.get('#sortBy').select('Date Created');
      cy.wait(500);
      cy.get('.task-item').should('be.visible');
    });
  });

  describe('Combined Filters', () => {
    it('Should apply search with category filter', () => {
      cy.get('#searchInput').type('Priority');
      cy.get('#filterCategory').select('Work');
      cy.wait(500);
      cy.contains('High Priority Work Task').should('be.visible');
      cy.contains('Personal Task').should('not.exist');
    });

    it('Should apply multiple filters together', () => {
      cy.get('#searchInput').type('Task');
      cy.get('#filterCategory').select('Work');
      cy.get('#filterStatus').select('Active');
      cy.wait(500);
      cy.get('.task-item').should('be.visible');
    });

    it('Should apply filters with sorting', () => {
      cy.get('#filterCategory').select('Work');
      cy.get('#sortBy').select('Priority');
      cy.wait(500);
      cy.contains('High Priority Work Task').should('be.visible');
    });
  });

  describe('Reset Filters', () => {
    it('Should reset all filters to default', () => {
      cy.get('#searchInput').type('Work');
      cy.get('#filterCategory').select('Work');
      cy.get('#filterStatus').select('Completed');
      cy.get('#sortBy').select('Priority');
      
      cy.get('#resetFilters').click();
      cy.wait(500);

      cy.get('#searchInput').should('have.value', '');
      cy.get('#filterCategory').should('have.value', 'All');
      cy.get('#filterStatus').should('have.value', 'All');
      cy.get('#sortBy').should('have.value', 'createdAt');
    });

    it('Should show all tasks after reset', () => {
      cy.get('#filterCategory').select('Work');
      cy.wait(500);
      
      cy.get('#resetFilters').click();
      cy.wait(500);

      cy.get('.task-item').should('have.length.at.least', 3);
    });
  });

  describe('Update Task Count', () => {
    it('Should update showing count with filters', () => {
      cy.get('#filterCategory').select('Work');
      cy.wait(500);
      cy.get('#showingTasks').invoke('text').should('not.equal', '0');
    });

    it('Should show correct count after search', () => {
      cy.get('#searchInput').type('Work');
      cy.wait(500);
      cy.get('#showingTasks').invoke('text').then((count) => {
        expect(parseInt(count)).to.be.at.least(1);
      });
    });
  });
});
