// ==================== GLOBAL STATE ====================
let currentUser = null;
let allTasks = [];
let currentPage = 1;
let totalPages = 1;
let currentFilters = {
  status: 'All',
  category: 'All',
  search: '',
  sortBy: 'createdAt'
};
let selectedTaskIds = new Set();

// ==================== TOAST NOTIFICATION SYSTEM ====================
function showToast(message, type = 'info', description = '') {
  const toastContainer = document.getElementById('toastContainer');

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <div class="toast-content">
      <div class="toast-message">${message}</div>
      ${description ? `<div class="toast-description">${description}</div>` : ''}
    </div>
    <button class="toast-close">&times;</button>
  `;

  toastContainer.appendChild(toast);

  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.remove();
  });

  setTimeout(() => {
    toast.remove();
  }, 5000);
}

// ==================== AUTHENTICATION CHECK ====================
function checkAuth() {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    window.location.href = '/index.html';
    return null;
  }

  currentUser = JSON.parse(userStr);
  return currentUser;
}

// ==================== INITIALIZE USER PROFILE ====================
function initializeUserProfile() {
  const userEmail = document.getElementById('userEmail');
  const userRole = document.getElementById('userRole');
  const profileImage = document.getElementById('profileImage');

  if (currentUser) {
    userEmail.textContent = currentUser.email;
    userRole.textContent = currentUser.role;

    if (currentUser.profilePicture) {
      profileImage.src = currentUser.profilePicture;
    } else {
      profileImage.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.email)}&background=4f46e5&color=fff`;
    }
  }
}

// ==================== THEME TOGGLE ====================
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  const themeIcon = document.querySelector('.theme-icon');
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

document.getElementById('themeToggle').addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);

  showToast('Theme changed', 'success', `Switched to ${newTheme} mode`);
});

// ==================== LOGOUT ====================
document.getElementById('logoutBtn').addEventListener('click', async () => {
  try {
    await fetch('/api/logout', { method: 'POST' });
    localStorage.removeItem('user');
    showToast('Logged out', 'success', 'Goodbye!');
    setTimeout(() => {
      window.location.href = '/index.html';
    }, 1000);
  } catch (error) {
    showToast('Error', 'error', 'Failed to logout');
  }
});

// ==================== FETCH TASKS ====================
async function fetchTasks() {
  const loadingSkeleton = document.getElementById('loadingSkeleton');
  const taskListContainer = document.getElementById('taskListContainer');
  const emptyState = document.getElementById('emptyState');
  const pagination = document.getElementById('pagination');

  // Show loading state
  loadingSkeleton.style.display = 'flex';
  taskListContainer.style.display = 'none';
  emptyState.style.display = 'none';
  pagination.style.display = 'none';

  try {
    const params = new URLSearchParams({
      status: currentFilters.status,
      category: currentFilters.category,
      search: currentFilters.search,
      page: currentPage,
      limit: 10
    });

    const response = await fetch(`/api/tasks?${params}`);
    const data = await response.json();

    if (data.success) {
      allTasks = data.tasks;
      totalPages = data.totalPages;

      // Hide loading, show content
      loadingSkeleton.style.display = 'none';

      // Sort tasks
      sortTasks();

      if (allTasks.length === 0) {
        emptyState.style.display = 'block';
        const emptyMessage = document.getElementById('emptyStateMessage');

        if (currentFilters.search) {
          emptyMessage.textContent = `No tasks found matching "${currentFilters.search}"`;
        } else if (currentFilters.status !== 'All' || currentFilters.category !== 'All') {
          emptyMessage.textContent = 'No tasks match your current filters';
        } else {
          emptyMessage.textContent = 'Create your first task to get started!';
        }
      } else {
        taskListContainer.style.display = 'block';
        renderTasks();
        updatePagination(data);
        pagination.style.display = 'flex';
      }

      updateStatistics(data);
    }
  } catch (error) {
    loadingSkeleton.style.display = 'none';
    showToast('Error', 'error', 'Failed to load tasks');
  }
}

// ==================== SORT TASKS ====================
function sortTasks() {
  const sortBy = currentFilters.sortBy;

  allTasks.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);

      case 'priority':
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];

      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);

      case 'createdAt':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });
}

// ==================== RENDER TASKS ====================
function renderTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  allTasks.forEach(task => {
    const taskItem = createTaskElement(task);
    taskList.appendChild(taskItem);
  });
}

function createTaskElement(task) {
  const taskItem = document.createElement('div');
  taskItem.className = 'task-item';
  taskItem.dataset.taskId = task.id;

  if (task.completed) {
    taskItem.classList.add('completed');
  }

  // Check if task is overdue
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  if (isOverdue) {
    taskItem.classList.add('overdue');
  }

  const dueDateDisplay = task.dueDate
    ? `<span class="task-date ${isOverdue ? 'overdue' : ''}">
         📅 ${isOverdue ? 'OVERDUE: ' : ''}${formatDate(task.dueDate)}
       </span>`
    : '';

  taskItem.innerHTML = `
    <input type="checkbox" class="task-select-checkbox" data-task-id="${task.id}">
    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-task-id="${task.id}">
    <div class="task-content">
      <div class="task-name">${escapeHtml(task.name)}</div>
      ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
      <div class="task-meta">
        <span class="task-priority ${task.priority}">${task.priority}</span>
        <span class="task-category">${task.category}</span>
        ${dueDateDisplay}
      </div>
    </div>
    <div class="task-actions">
      <button class="btn-edit" data-task-id="${task.id}">✏️ Edit</button>
      <button class="btn-delete" data-task-id="${task.id}">🗑️ Delete</button>
    </div>
  `;

  // Add event listeners
  const checkbox = taskItem.querySelector('.task-checkbox');
  checkbox.addEventListener('change', () => toggleTaskComplete(task.id, checkbox.checked));

  const selectCheckbox = taskItem.querySelector('.task-select-checkbox');
  selectCheckbox.addEventListener('change', () => handleTaskSelection(task.id, selectCheckbox.checked));

  const editBtn = taskItem.querySelector('.btn-edit');
  editBtn.addEventListener('click', () => openEditModal(task));

  const deleteBtn = taskItem.querySelector('.btn-delete');
  deleteBtn.addEventListener('click', () => openDeleteModal(task));

  return taskItem;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// ==================== UPDATE STATISTICS ====================
function updateStatistics(data) {
  document.getElementById('totalTasks').textContent = data.total || 0;

  const active = allTasks.filter(t => !t.completed).length;
  const completed = allTasks.filter(t => t.completed).length;

  document.getElementById('activeTasks').textContent = active;
  document.getElementById('completedTasks').textContent = completed;
  document.getElementById('showingTasks').textContent = allTasks.length;
}

// ==================== UPDATE PAGINATION ====================
function updatePagination(data) {
  document.getElementById('currentPage').textContent = data.page;
  document.getElementById('totalPages').textContent = data.totalPages;

  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');

  prevBtn.disabled = data.page === 1;
  nextBtn.disabled = data.page === data.totalPages || data.totalPages === 0;
}

// ==================== PAGINATION CONTROLS ====================
document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchTasks();
  }
});

document.getElementById('nextPage').addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchTasks();
  }
});

// ==================== FILTER AND SORT CONTROLS ====================
document.getElementById('filterStatus').addEventListener('change', (e) => {
  currentFilters.status = e.target.value;
  currentPage = 1;
  fetchTasks();
});

document.getElementById('filterCategory').addEventListener('change', (e) => {
  currentFilters.category = e.target.value;
  currentPage = 1;
  fetchTasks();
});

document.getElementById('sortBy').addEventListener('change', (e) => {
  currentFilters.sortBy = e.target.value;
  sortTasks();
  renderTasks();
  showToast('Tasks sorted', 'info', `Sorted by ${e.target.options[e.target.selectedIndex].text}`);
});

document.getElementById('resetFilters').addEventListener('click', () => {
  currentFilters = {
    status: 'All',
    category: 'All',
    search: '',
    sortBy: 'createdAt'
  };

  document.getElementById('filterStatus').value = 'All';
  document.getElementById('filterCategory').value = 'All';
  document.getElementById('sortBy').value = 'createdAt';
  document.getElementById('searchInput').value = '';

  currentPage = 1;
  fetchTasks();
  showToast('Filters reset', 'info');
});

// ==================== SEARCH WITH DEBOUNCING ====================
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', (e) => {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    currentFilters.search = e.target.value.trim();
    currentPage = 1;
    fetchTasks();
  }, 500); // 500ms debounce
});

// ==================== ADD TASK ====================
document.getElementById('addTaskForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const taskName = document.getElementById('taskName').value.trim();
  const taskDescription = document.getElementById('taskDescription').value.trim();
  const taskPriority = document.getElementById('taskPriority').value;
  const taskCategory = document.getElementById('taskCategory').value;
  const taskDueDate = document.getElementById('taskDueDate').value;

  const taskNameError = document.getElementById('taskNameError');
  taskNameError.textContent = '';

  if (taskName.length < 3) {
    taskNameError.textContent = 'Task name must be at least 3 characters';
    showToast('Validation error', 'error', 'Please check your input');
    return;
  }

  const addTaskBtn = document.getElementById('addTaskBtn');
  addTaskBtn.classList.add('loading');
  addTaskBtn.disabled = true;

  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: taskName,
        description: taskDescription,
        priority: taskPriority,
        category: taskCategory,
        dueDate: taskDueDate || null
      })
    });

    const data = await response.json();

    if (data.success) {
      showToast('Task added!', 'success', data.message);
      document.getElementById('addTaskForm').reset();
      fetchTasks();
    } else {
      showToast('Failed to add task', 'error', data.message);
    }
  } catch (error) {
    showToast('Error', 'error', 'Failed to add task');
  } finally {
    addTaskBtn.classList.remove('loading');
    addTaskBtn.disabled = false;
  }
});

// ==================== TOGGLE TASK COMPLETE ====================
async function toggleTaskComplete(taskId, completed) {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });

    const data = await response.json();

    if (data.success) {
      showToast(
        completed ? 'Task completed!' : 'Task reopened',
        'success'
      );
      fetchTasks();
    }
  } catch (error) {
    showToast('Error', 'error', 'Failed to update task');
    fetchTasks();
  }
}

// ==================== EDIT TASK MODAL ====================
function openEditModal(task) {
  const modal = document.getElementById('editModal');
  modal.classList.add('active');

  document.getElementById('editTaskId').value = task.id;
  document.getElementById('editTaskName').value = task.name;
  document.getElementById('editTaskDescription').value = task.description || '';
  document.getElementById('editTaskPriority').value = task.priority;
  document.getElementById('editTaskCategory').value = task.category;
  document.getElementById('editTaskDueDate').value = task.dueDate || '';
}

function closeEditModal() {
  const modal = document.getElementById('editModal');
  modal.classList.remove('active');
  document.getElementById('editTaskForm').reset();
  document.getElementById('editTaskNameError').textContent = '';
}

document.getElementById('closeEditModal').addEventListener('click', closeEditModal);
document.getElementById('cancelEditBtn').addEventListener('click', closeEditModal);

// Close modal on backdrop click
document.getElementById('editModal').addEventListener('click', (e) => {
  if (e.target.id === 'editModal') {
    closeEditModal();
  }
});

// Edit form submission
document.getElementById('editTaskForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const taskId = document.getElementById('editTaskId').value;
  const taskName = document.getElementById('editTaskName').value.trim();
  const taskDescription = document.getElementById('editTaskDescription').value.trim();
  const taskPriority = document.getElementById('editTaskPriority').value;
  const taskCategory = document.getElementById('editTaskCategory').value;
  const taskDueDate = document.getElementById('editTaskDueDate').value;

  const editTaskNameError = document.getElementById('editTaskNameError');
  editTaskNameError.textContent = '';

  if (taskName.length < 3) {
    editTaskNameError.textContent = 'Task name must be at least 3 characters';
    return;
  }

  const saveEditBtn = document.getElementById('saveEditBtn');
  saveEditBtn.classList.add('loading');
  saveEditBtn.disabled = true;

  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: taskName,
        description: taskDescription,
        priority: taskPriority,
        category: taskCategory,
        dueDate: taskDueDate || null
      })
    });

    const data = await response.json();

    if (data.success) {
      showToast('Task updated!', 'success', data.message);
      closeEditModal();
      fetchTasks();
    } else {
      showToast('Failed to update task', 'error', data.message);
    }
  } catch (error) {
    showToast('Error', 'error', 'Failed to update task');
  } finally {
    saveEditBtn.classList.remove('loading');
    saveEditBtn.disabled = false;
  }
});

// ==================== DELETE TASK MODAL ====================
let taskToDelete = null;

function openDeleteModal(task) {
  taskToDelete = task;
  const modal = document.getElementById('deleteModal');
  modal.classList.add('active');
  document.getElementById('taskToDelete').textContent = task.name;
}

function closeDeleteModal() {
  taskToDelete = null;
  const modal = document.getElementById('deleteModal');
  modal.classList.remove('active');
}

document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);

document.getElementById('deleteModal').addEventListener('click', (e) => {
  if (e.target.id === 'deleteModal') {
    closeDeleteModal();
  }
});

document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
  if (!taskToDelete) return;

  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  confirmDeleteBtn.classList.add('loading');
  confirmDeleteBtn.disabled = true;

  try {
    const response = await fetch(`/api/tasks/${taskToDelete.id}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      showToast('Task deleted!', 'success', data.message);
      closeDeleteModal();
      fetchTasks();
    } else {
      showToast('Failed to delete task', 'error', data.message);
    }
  } catch (error) {
    showToast('Error', 'error', 'Failed to delete task');
  } finally {
    confirmDeleteBtn.classList.remove('loading');
    confirmDeleteBtn.disabled = false;
  }
});

// ==================== TASK SELECTION (BULK ACTIONS) ====================
function handleTaskSelection(taskId, isSelected) {
  if (isSelected) {
    selectedTaskIds.add(taskId);
  } else {
    selectedTaskIds.delete(taskId);
  }

  updateBulkActionsBar();
  updateSelectAllCheckbox();
}

function updateBulkActionsBar() {
  const bulkActionsBar = document.getElementById('bulkActionsBar');
  const selectedCount = document.getElementById('selectedCount');

  if (selectedTaskIds.size > 0) {
    bulkActionsBar.style.display = 'flex';
    selectedCount.textContent = selectedTaskIds.size;
  } else {
    bulkActionsBar.style.display = 'none';
  }
}

function updateSelectAllCheckbox() {
  const selectAllCheckbox = document.getElementById('selectAllCheckbox');
  if (allTasks.length === 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  } else if (selectedTaskIds.size === allTasks.length) {
    selectAllCheckbox.checked = true;
    selectAllCheckbox.indeterminate = false;
  } else if (selectedTaskIds.size > 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = true;
  } else {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  }
}

// Select All Checkbox
document.getElementById('selectAllCheckbox').addEventListener('change', (e) => {
  const isChecked = e.target.checked;

  document.querySelectorAll('.task-select-checkbox').forEach(checkbox => {
    checkbox.checked = isChecked;
    const taskId = parseInt(checkbox.dataset.taskId);
    if (isChecked) {
      selectedTaskIds.add(taskId);
    } else {
      selectedTaskIds.delete(taskId);
    }
  });

  updateBulkActionsBar();
});

// Clear Selection
document.getElementById('clearSelectionBtn').addEventListener('click', () => {
  selectedTaskIds.clear();
  document.querySelectorAll('.task-select-checkbox').forEach(checkbox => {
    checkbox.checked = false;
  });
  updateBulkActionsBar();
  updateSelectAllCheckbox();
});

// Bulk Complete
document.getElementById('bulkCompleteBtn').addEventListener('click', async () => {
  if (selectedTaskIds.size === 0) return;

  const bulkCompleteBtn = document.getElementById('bulkCompleteBtn');
  bulkCompleteBtn.classList.add('loading');
  bulkCompleteBtn.disabled = true;

  try {
    const response = await fetch('/api/tasks/bulk-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskIds: Array.from(selectedTaskIds) })
    });

    const data = await response.json();

    if (data.success) {
      showToast('Tasks completed!', 'success', data.message);
      selectedTaskIds.clear();
      updateBulkActionsBar();
      fetchTasks();
    } else {
      showToast('Failed to complete tasks', 'error', data.message);
    }
  } catch (error) {
    showToast('Error', 'error', 'Failed to complete tasks');
  } finally {
    bulkCompleteBtn.classList.remove('loading');
    bulkCompleteBtn.disabled = false;
  }
});

// Bulk Delete
document.getElementById('bulkDeleteBtn').addEventListener('click', async () => {
  if (selectedTaskIds.size === 0) return;

  if (!confirm(`Are you sure you want to delete ${selectedTaskIds.size} task(s)?`)) {
    return;
  }

  const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
  bulkDeleteBtn.classList.add('loading');
  bulkDeleteBtn.disabled = true;

  try {
    const response = await fetch('/api/tasks/bulk-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskIds: Array.from(selectedTaskIds) })
    });

    const data = await response.json();

    if (data.success) {
      showToast('Tasks deleted!', 'success', data.message);
      selectedTaskIds.clear();
      updateBulkActionsBar();
      fetchTasks();
    } else {
      showToast('Failed to delete tasks', 'error', data.message);
    }
  } catch (error) {
    showToast('Error', 'error', 'Failed to delete tasks');
  } finally {
    bulkDeleteBtn.classList.remove('loading');
    bulkDeleteBtn.disabled = false;
  }
});

// ==================== INITIALIZE ====================
window.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  if (!checkAuth()) return;

  // Initialize UI
  initializeUserProfile();
  initializeTheme();

  // Seed data on first load (for demo purposes)
  const isFirstLoad = !localStorage.getItem('dataSeeded');
  if (isFirstLoad) {
    try {
      await fetch('/api/seed', { method: 'POST' });
      localStorage.setItem('dataSeeded', 'true');
    } catch (error) {
      console.error('Failed to seed data:', error);
    }
  }

  // Load tasks
  fetchTasks();
});
