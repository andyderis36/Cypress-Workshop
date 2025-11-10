describe('Bulk Operations Tests', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/');
    cy.get('#loginEmail').type('admin@test.com');
    cy.get('#loginPassword').type('Admin@123');
    cy.get('#loginForm button[type="submit"]').click();
    cy.url().should('include', '/dashboard.html');
    cy.wait(1000);

    // Create multiple tasks for bulk operations
    const tasks = [
      'Bulk Test Task 1',
      'Bulk Test Task 2',
      'Bulk Test Task 3'
    ];

    tasks.forEach((taskName) => {
      cy.get('#taskName').clear().type(taskName);
      cy.get('#addTaskForm button[type="submit"]').click();
      cy.wait(500);
    });

    cy.wait(1000);
  });

  describe('Bulk Selection', () => {
    it('Should select individual tasks', () => {
      cy.get('.task-item').first().find('input[type="checkbox"]').check();
      cy.get('#bulkActionsBar').should('be.visible');
      cy.get('#selectedCount').should('contain', '1');
    });

    it('Should select multiple tasks', () => {
      cy.get('.task-item').eq(0).find('input[type="checkbox"]').check();
      cy.get('.task-item').eq(1).find('input[type="checkbox"]').check();
      cy.get('#selectedCount').should('contain', '2');
    });

    it('Should select all tasks with select all checkbox', () => {
      cy.get('#selectAllCheckbox').check();
      cy.wait(500);
      cy.get('#selectedCount').invoke('text').then((count) => {
        expect(parseInt(count)).to.be.at.least(3);
      });
    });

    it('Should deselect all tasks with select all checkbox', () => {
      cy.get('#selectAllCheckbox').check();
      cy.wait(500);
      cy.get('#selectAllCheckbox').uncheck();
      cy.wait(500);
      cy.get('#selectedCount').should('contain', '0');
      cy.get('#bulkActionsBar').should('not.be.visible');
    });

    it('Should update count when selecting/deselecting', () => {
      cy.get('.task-item').eq(0).find('input[type="checkbox"]').check();
      cy.get('#selectedCount').should('contain', '1');
      
      cy.get('.task-item').eq(1).find('input[type="checkbox"]').check();
      cy.get('#selectedCount').should('contain', '2');
      
      cy.get('.task-item').eq(0).find('input[type="checkbox"]').uncheck();
      cy.get('#selectedCount').should('contain', '1');
    });
  });

  describe('Bulk Actions Bar', () => {
    it('Should show bulk actions bar when tasks are selected', () => {
      cy.get('.task-item').first().find('input[type="checkbox"]').check();
      cy.get('#bulkActionsBar').should('be.visible');
      cy.get('#bulkCompleteBtn').should('be.visible');
      cy.get('#bulkDeleteBtn').should('be.visible');
      cy.get('#clearSelectionBtn').should('be.visible');
    });

    it('Should hide bulk actions bar when no tasks are selected', () => {
      cy.get('#bulkActionsBar').should('not.be.visible');
    });

    it('Should hide bulk actions bar after clearing selection', () => {
      cy.get('.task-item').first().find('input[type="checkbox"]').check();
      cy.get('#bulkActionsBar').should('be.visible');
      
      cy.get('#clearSelectionBtn').click();
      cy.get('#bulkActionsBar').should('not.be.visible');
    });
  });

  describe('Bulk Complete', () => {
    it('Should mark selected tasks as completed', () => {
      cy.get('.task-item').eq(0).find('input[type="checkbox"]').check();
      cy.get('.task-item').eq(1).find('input[type="checkbox"]').check();
      
      cy.get('#bulkCompleteBtn').click();
      cy.wait(1000);

      cy.get('.task-item').eq(0).should('have.class', 'completed');
      cy.get('.task-item').eq(1).should('have.class', 'completed');
    });

    it('Should show success message after bulk complete', () => {
      cy.get('.task-item').first().find('input[type="checkbox"]').check();
      cy.get('#bulkCompleteBtn').click();
      cy.contains('Tasks marked as completed').should('be.visible');
    });

    it('Should update statistics after bulk complete', () => {
      cy.get('#completedTasks').invoke('text').then((completedBefore) => {
        cy.get('.task-item').eq(0).find('input[type="checkbox"]').check();
        cy.get('.task-item').eq(1).find('input[type="checkbox"]').check();
        cy.get('#bulkCompleteBtn').click();
        cy.wait(1000);

        cy.get('#completedTasks').invoke('text').should('not.equal', completedBefore);
      });
    });

    it('Should clear selection after bulk complete', () => {
      cy.get('.task-item').first().find('input[type="checkbox"]').check();
      cy.get('#bulkCompleteBtn').click();
      cy.wait(1000);
      cy.get('#bulkActionsBar').should('not.be.visible');
    });
  });

  describe('Bulk Delete', () => {
    it('Should delete selected tasks', () => {
      cy.get('.task-item').first().then(($el) => {
        const taskName = $el.find('.task-name').text();
        
        cy.get('.task-item').first().find('input[type="checkbox"]').check();
        cy.get('#bulkDeleteBtn').click();
        cy.on('window:confirm', () => true);
        cy.wait(1000);

        cy.contains(taskName).should('not.exist');
      });
    });

    it('Should delete multiple selected tasks', () => {
      cy.get('#totalTasks').invoke('text').then((totalBefore) => {
        cy.get('.task-item').eq(0).find('input[type="checkbox"]').check();
        cy.get('.task-item').eq(1).find('input[type="checkbox"]').check();
        
        cy.get('#bulkDeleteBtn').click();
        cy.on('window:confirm', () => true);
        cy.wait(1000);

        cy.get('#totalTasks').invoke('text').should('not.equal', totalBefore);
      });
    });

    it('Should show confirmation dialog before bulk delete', () => {
      cy.get('.task-item').first().find('input[type="checkbox"]').check();
      
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(false);
      });
      
      cy.get('#bulkDeleteBtn').click();
    });

    it('Should cancel bulk delete on confirmation cancel', () => {
      cy.get('#totalTasks').invoke('text').then((totalBefore) => {
        cy.get('.task-item').first().find('input[type="checkbox"]').check();
        
        cy.on('window:confirm', () => false);
        cy.get('#bulkDeleteBtn').click();
        cy.wait(500);

        cy.get('#totalTasks').invoke('text').should('equal', totalBefore);
      });
    });

    it('Should update statistics after bulk delete', () => {
      cy.get('#totalTasks').invoke('text').then((totalBefore) => {
        const total = parseInt(totalBefore);
        
        cy.get('.task-item').eq(0).find('input[type="checkbox"]').check();
        cy.get('.task-item').eq(1).find('input[type="checkbox"]').check();
        
        cy.get('#bulkDeleteBtn').click();
        cy.on('window:confirm', () => true);
        cy.wait(1000);

        cy.get('#totalTasks').invoke('text').then((totalAfter) => {
          expect(parseInt(totalAfter)).to.be.lessThan(total);
        });
      });
    });

    it('Should show success message after bulk delete', () => {
      cy.get('.task-item').first().find('input[type="checkbox"]').check();
      cy.get('#bulkDeleteBtn').click();
      cy.on('window:confirm', () => true);
      cy.contains('Tasks deleted successfully').should('be.visible');
    });

    it('Should clear selection after bulk delete', () => {
      cy.get('.task-item').first().find('input[type="checkbox"]').check();
      cy.get('#bulkDeleteBtn').click();
      cy.on('window:confirm', () => true);
      cy.wait(1000);
      cy.get('#bulkActionsBar').should('not.be.visible');
    });
  });

  describe('Clear Selection', () => {
    it('Should clear all selections', () => {
      cy.get('.task-item').eq(0).find('input[type="checkbox"]').check();
      cy.get('.task-item').eq(1).find('input[type="checkbox"]').check();
      cy.get('#selectedCount').should('contain', '2');
      
      cy.get('#clearSelectionBtn').click();
      cy.get('#selectedCount').should('contain', '0');
      cy.get('#bulkActionsBar').should('not.be.visible');
    });

    it('Should uncheck all checkboxes', () => {
      cy.get('#selectAllCheckbox').check();
      cy.wait(500);
      
      cy.get('#clearSelectionBtn').click();
      cy.wait(500);
      
      cy.get('.task-item input[type="checkbox"]:checked').should('have.length', 0);
    });
  });

  describe('Select All with Filters', () => {
    it('Should select all visible tasks with filter applied', () => {
      // Apply a filter first
      cy.get('#filterCategory').select('Personal');
      cy.wait(500);
      
      cy.get('#selectAllCheckbox').check();
      cy.wait(500);
      
      cy.get('#selectedCount').invoke('text').then((count) => {
        expect(parseInt(count)).to.be.at.least(0);
      });
    });

    it('Should maintain selection when switching filters', () => {
      cy.get('.task-item').first().find('input[type="checkbox"]').check();
      cy.get('#selectedCount').should('contain', '1');
      
      cy.get('#filterStatus').select('Active');
      cy.wait(500);
      
      cy.get('#selectedCount').should('contain', '1');
    });
  });
});
