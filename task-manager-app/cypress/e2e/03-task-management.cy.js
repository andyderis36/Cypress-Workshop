describe('Task Management Tests', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/');
    cy.get('#loginEmail').type('admin@test.com');
    cy.get('#loginPassword').type('Admin@123');
    cy.get('#loginForm button[type="submit"]').click();
    cy.url().should('include', '/dashboard.html');
    cy.wait(1000); // Wait for tasks to load
  });

  describe('Create Task', () => {
    it('Should create a new task with all fields', () => {
      const taskName = `Test Task ${Date.now()}`;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dueDate = tomorrow.toISOString().split('T')[0];

      cy.get('#taskName').type(taskName);
      cy.get('#taskPriority').select('High');
      cy.get('#taskCategory').select('Work');
      cy.get('#taskDueDate').type(dueDate);
      cy.get('#taskDescription').type('This is a test task description');
      cy.get('#addTaskForm button[type="submit"]').click();

      cy.contains('Task created successfully').should('be.visible');
      cy.contains(taskName).should('be.visible');
    });

    it('Should create task with only required fields', () => {
      const taskName = `Minimal Task ${Date.now()}`;
      cy.get('#taskName').type(taskName);
      cy.get('#addTaskForm button[type="submit"]').click();

      cy.contains('Task created successfully').should('be.visible');
      cy.contains(taskName).should('be.visible');
    });

    it('Should show validation error for empty task name', () => {
      cy.get('#addTaskForm button[type="submit"]').click();
      cy.get('#taskName:invalid').should('exist');
    });

    it('Should enforce minimum task name length', () => {
      cy.get('#taskName').type('ab');
      cy.get('#addTaskForm button[type="submit"]').click();
      cy.get('#taskName:invalid').should('exist');
    });

    it('Should create tasks with different priorities', () => {
      const priorities = ['Low', 'Medium', 'High'];
      
      priorities.forEach((priority) => {
        const taskName = `${priority} Priority Task ${Date.now()}`;
        cy.get('#taskName').clear().type(taskName);
        cy.get('#taskPriority').select(priority);
        cy.get('#addTaskForm button[type="submit"]').click();
        cy.wait(500);
        cy.contains(taskName).should('be.visible');
      });
    });

    it('Should create tasks with different categories', () => {
      const categories = ['Work', 'Personal', 'Shopping', 'Others'];
      
      categories.forEach((category) => {
        const taskName = `${category} Task ${Date.now()}`;
        cy.get('#taskName').clear().type(taskName);
        cy.get('#taskCategory').select(category);
        cy.get('#addTaskForm button[type="submit"]').click();
        cy.wait(500);
        cy.contains(taskName).should('be.visible');
      });
    });

    it('Should clear form after task creation', () => {
      const taskName = `Clear Form Task ${Date.now()}`;
      cy.get('#taskName').type(taskName);
      cy.get('#taskDescription').type('Test description');
      cy.get('#addTaskForm button[type="submit"]').click();
      
      cy.wait(1000);
      cy.get('#taskName').should('have.value', '');
      cy.get('#taskDescription').should('have.value', '');
    });
  });

  describe('View and List Tasks', () => {
    it('Should display task list', () => {
      cy.get('#taskList').should('be.visible');
    });

    it('Should show task details', () => {
      // Create a task first
      const taskName = `Detail Task ${Date.now()}`;
      cy.get('#taskName').type(taskName);
      cy.get('#taskDescription').type('Test description');
      cy.get('#addTaskForm button[type="submit"]').click();
      cy.wait(1000);

      cy.contains(taskName).should('be.visible');
      cy.contains('Test description').should('be.visible');
    });

    it('Should display task priority badge', () => {
      const taskName = `Priority Badge Task ${Date.now()}`;
      cy.get('#taskName').type(taskName);
      cy.get('#taskPriority').select('High');
      cy.get('#addTaskForm button[type="submit"]').click();
      cy.wait(1000);

      cy.contains(taskName).parents('.task-item').find('.priority-badge').should('contain', 'High');
    });

    it('Should display task category', () => {
      const taskName = `Category Task ${Date.now()}`;
      cy.get('#taskName').type(taskName);
      cy.get('#taskCategory').select('Work');
      cy.get('#addTaskForm button[type="submit"]').click();
      cy.wait(1000);

      cy.contains(taskName).parents('.task-item').should('contain', 'Work');
    });

    it('Should update task statistics', () => {
      cy.get('#totalTasks').invoke('text').then((totalBefore) => {
        const taskName = `Stats Task ${Date.now()}`;
        cy.get('#taskName').type(taskName);
        cy.get('#addTaskForm button[type="submit"]').click();
        cy.wait(1000);

        cy.get('#totalTasks').invoke('text').should('not.equal', totalBefore);
      });
    });
  });

  describe('Complete Task', () => {
    it('Should mark task as completed', () => {
      // Create a task first
      const taskName = `Complete Task ${Date.now()}`;
      cy.get('#taskName').type(taskName);
      cy.get('#addTaskForm button[type="submit"]').click();
      cy.wait(1000);

      // Mark as completed
      cy.contains(taskName).parents('.task-item').find('input[type="checkbox"]').check();
      cy.wait(500);
      cy.contains(taskName).parents('.task-item').should('have.class', 'completed');
    });

    it('Should unmark completed task', () => {
      // Create and complete a task
      const taskName = `Uncomplete Task ${Date.now()}`;
      cy.get('#taskName').type(taskName);
      cy.get('#addTaskForm button[type="submit"]').click();
      cy.wait(1000);

      cy.contains(taskName).parents('.task-item').find('input[type="checkbox"]').check();
      cy.wait(500);

      // Unmark
      cy.contains(taskName).parents('.task-item').find('input[type="checkbox"]').uncheck();
      cy.wait(500);
      cy.contains(taskName).parents('.task-item').should('not.have.class', 'completed');
    });

    it('Should update statistics when completing task', () => {
      cy.get('#activeTasks').invoke('text').then((activeBefore) => {
        cy.get('#completedTasks').invoke('text').then((completedBefore) => {
          // Create and complete a task
          const taskName = `Stats Complete Task ${Date.now()}`;
          cy.get('#taskName').type(taskName);
          cy.get('#addTaskForm button[type="submit"]').click();
          cy.wait(1000);

          cy.contains(taskName).parents('.task-item').find('input[type="checkbox"]').check();
          cy.wait(1000);

          cy.get('#completedTasks').invoke('text').should('not.equal', completedBefore);
        });
      });
    });
  });

  describe('Edit Task', () => {
    it('Should open edit modal', () => {
      // Create a task first
      const taskName = `Edit Task ${Date.now()}`;
      cy.get('#taskName').type(taskName);
      cy.get('#addTaskForm button[type="submit"]').click();
      cy.wait(1000);

      cy.contains(taskName).parents('.task-item').find('button').contains('Edit').click();
      cy.get('#editTaskModal').should('be.visible');
    });

    it('Should edit task name', () => {
      // Create a task
      const originalName = `Original Task ${Date.now()}`;
      const updatedName = `Updated Task ${Date.now()}`;
      
      cy.get('#taskName').type(originalName);
      cy.get('#addTaskForm button[type="submit"]').click();
      cy.wait(1000);

      // Edit the task
      cy.contains(originalName).parents('.task-item').find('button').contains('Edit').click();
      cy.get('#editTaskName').clear().type(updatedName);
      cy.get('#saveEditBtn').click();
      cy.wait(1000);

      cy.contains(updatedName).should('be.visible');
      cy.contains(originalName).should('not.exist');
    });

    it('Should edit task priority', () => {
      const taskName = `Priority Edit Task ${Date.now()}`;
      
      cy.get('#taskName').type(taskName);
      cy.get('#taskPriority').select('Low');
      cy.get('#addTaskForm button[type="submit"]').click();
      cy.wait(1000);

      cy.contains(taskName).parents('.task-item').find('button').contains('Edit').click();
      cy.get('#editTaskPriority').select('High');
      cy.get('#saveEditBtn').click();
      cy.wait(1000);

      cy.contains(taskName).parents('.task-item').should('contain', 'High');
    });

    it('Should cancel edit', () => {
      const taskName = `Cancel Edit Task ${Date.now()}`;
      
      cy.get('#taskName').type(taskName);
      cy.get('#addTaskForm button[type="submit"]').click();
      cy.wait(1000);

      cy.contains(taskName).parents('.task-item').find('button').contains('Edit').click();
      cy.get('#editTaskName').clear().type('This should not save');
      cy.get('#cancelEditBtn').click();

      cy.contains(taskName).should('be.visible');
      cy.contains('This should not save').should('not.exist');
    });
  });

  describe('Delete Task', () => {
    it('Should delete task', () => {
      const taskName = `Delete Task ${Date.now()}`;
      
      cy.get('#taskName').type(taskName);
      cy.get('#addTaskForm button[type="submit"]').click();
      cy.wait(1000);

      cy.contains(taskName).parents('.task-item').find('button').contains('Delete').click();
      cy.on('window:confirm', () => true);
      cy.wait(1000);

      cy.contains(taskName).should('not.exist');
    });

    it('Should cancel delete on confirmation', () => {
      const taskName = `Cancel Delete Task ${Date.now()}`;
      
      cy.get('#taskName').type(taskName);
      cy.get('#addTaskForm button[type="submit"]').click();
      cy.wait(1000);

      cy.contains(taskName).parents('.task-item').find('button').contains('Delete').click();
      cy.on('window:confirm', () => false);
      cy.wait(500);

      cy.contains(taskName).should('be.visible');
    });

    it('Should update statistics after delete', () => {
      cy.get('#totalTasks').invoke('text').then((totalBefore) => {
        const taskName = `Stats Delete Task ${Date.now()}`;
        
        cy.get('#taskName').type(taskName);
        cy.get('#addTaskForm button[type="submit"]').click();
        cy.wait(1000);

        cy.contains(taskName).parents('.task-item').find('button').contains('Delete').click();
        cy.on('window:confirm', () => true);
        cy.wait(1000);

        cy.get('#totalTasks').invoke('text').should('equal', totalBefore);
      });
    });
  });
});
