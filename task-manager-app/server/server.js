const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// In-memory storage (simulating a database)
let users = [
  {
    id: 1,
    email: 'admin@test.com',
    password: 'Admin@123',
    role: 'Admin',
    profilePicture: null
  },
  {
    id: 2,
    email: 'user@test.com',
    password: 'User@123',
    role: 'User',
    profilePicture: null
  }
];

let tasks = [];
let taskIdCounter = 1;
let currentUser = null;

// Simulate network delay for loading state demonstration
const simulateDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== AUTH ROUTES ====================

// Login endpoint
app.post('/api/login', async (req, res) => {
  await simulateDelay(500);

  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    currentUser = user;
    res.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  await simulateDelay(500);

  const { email, password, role, profilePicture } = req.body;

  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered'
    });
  }

  const newUser = {
    id: users.length + 1,
    email,
    password,
    role: role || 'User',
    profilePicture: profilePicture || null
  };

  users.push(newUser);
  currentUser = newUser;

  res.json({
    success: true,
    message: 'Registration successful!',
    user: {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      profilePicture: newUser.profilePicture
    }
  });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  currentUser = null;
  res.json({ success: true, message: 'Logged out successfully' });
});

// ==================== TASK ROUTES ====================

// Get all tasks (with optional filters)
app.get('/api/tasks', async (req, res) => {
  await simulateDelay(); // Simulate loading

  const { status, category, search, page = 1, limit = 10 } = req.query;

  let filteredTasks = [...tasks];

  // Filter by status
  if (status && status !== 'All') {
    if (status === 'Active') {
      filteredTasks = filteredTasks.filter(t => !t.completed);
    } else if (status === 'Completed') {
      filteredTasks = filteredTasks.filter(t => t.completed);
    }
  }

  // Filter by category
  if (category && category !== 'All') {
    filteredTasks = filteredTasks.filter(t => t.category === category);
  }

  // Search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredTasks = filteredTasks.filter(t =>
      t.name.toLowerCase().includes(searchLower) ||
      (t.description && t.description.toLowerCase().includes(searchLower))
    );
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  res.json({
    success: true,
    tasks: paginatedTasks,
    total: filteredTasks.length,
    page: parseInt(page),
    totalPages: Math.ceil(filteredTasks.length / limit)
  });
});

// Create new task
app.post('/api/tasks', async (req, res) => {
  await simulateDelay(300);

  const { name, description, priority, category, dueDate } = req.body;

  // Check for duplicate task name
  const duplicate = tasks.find(t => t.name.toLowerCase() === name.toLowerCase());
  if (duplicate) {
    return res.status(400).json({
      success: false,
      message: 'Task with this name already exists'
    });
  }

  const newTask = {
    id: taskIdCounter++,
    name,
    description: description || '',
    priority: priority || 'Medium',
    category: category || 'Personal',
    dueDate: dueDate || null,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);

  res.json({
    success: true,
    message: 'Task created successfully!',
    task: newTask
  });
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
  await simulateDelay(300);

  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  const updatedTask = {
    ...tasks[taskIndex],
    ...req.body
  };

  tasks[taskIndex] = updatedTask;

  res.json({
    success: true,
    message: 'Task updated successfully!',
    task: updatedTask
  });
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  await simulateDelay(300);

  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  tasks.splice(taskIndex, 1);

  res.json({
    success: true,
    message: 'Task deleted successfully!'
  });
});

// Bulk delete tasks
app.post('/api/tasks/bulk-delete', async (req, res) => {
  await simulateDelay(400);

  const { taskIds } = req.body;

  if (!Array.isArray(taskIds) || taskIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No tasks selected'
    });
  }

  tasks = tasks.filter(t => !taskIds.includes(t.id));

  res.json({
    success: true,
    message: `${taskIds.length} task(s) deleted successfully!`
  });
});

// Bulk complete tasks
app.post('/api/tasks/bulk-complete', async (req, res) => {
  await simulateDelay(400);

  const { taskIds } = req.body;

  if (!Array.isArray(taskIds) || taskIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No tasks selected'
    });
  }

  tasks = tasks.map(t => {
    if (taskIds.includes(t.id)) {
      return { ...t, completed: true };
    }
    return t;
  });

  res.json({
    success: true,
    message: `${taskIds.length} task(s) marked as complete!`
  });
});

// ==================== SEED DATA ROUTE ====================

// Reset and seed data (useful for testing)
app.post('/api/seed', async (req, res) => {
  tasks = [
    {
      id: 1,
      name: 'Complete project documentation',
      description: 'Write comprehensive docs for the new feature',
      priority: 'High',
      category: 'Work',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Buy groceries',
      description: 'Milk, eggs, bread, vegetables',
      priority: 'Medium',
      category: 'Shopping',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Review pull requests',
      description: 'Check and merge pending PRs',
      priority: 'High',
      category: 'Work',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      name: 'Call dentist',
      description: 'Schedule annual checkup appointment',
      priority: 'Low',
      category: 'Personal',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 5,
      name: 'Update resume',
      description: 'Add recent projects and skills',
      priority: 'Medium',
      category: 'Personal',
      dueDate: null,
      completed: false,
      createdAt: new Date().toISOString()
    }
  ];

  taskIdCounter = 6;

  res.json({
    success: true,
    message: 'Data seeded successfully!',
    tasksCount: tasks.length
  });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`🚀 Task Manager Server running at http://localhost:${PORT}`);
  console.log(`📝 Login credentials:`);
  console.log(`   Admin: admin@test.com / Admin@123`);
  console.log(`   User: user@test.com / User@123`);
});
