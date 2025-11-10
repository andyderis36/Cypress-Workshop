# 🚀 Cypress Testing Workshop - Task Manager App

A comprehensive task manager application with automated Cypress end-to-end tests for learning and demonstration purposes.

---

## 📖 What's Inside?

This project has **two folders**:

1. **task-manager-app** - Task manager application with Cypress tests configured
2. **WorkshopThings** - Configuration templates and workshop materials

---
## Slide 
<p align="left">
  <!-- Slides / Presentation -->
  <a href="https://www.canva.com/design/DAG379H2T-c/_r8j18UBjgRM3KyqiNentw/edit?utm_content=DAG379H2T-c&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton" target="_blank">
    <img src="https://img.shields.io/badge/Canva%20Slides-00C4CC?style=for-the-badge&logo=Canva&logoColor=white" alt="Canva Slides"/>
  </a>
</p>



## 🛠️ Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
</p>

<p align="left">
  <img src="https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white" alt="Cypress"/>
</p>

---

## 📱 How to Use the Task Manager App

### 1️⃣ Install & Start

```bash
cd task-manager-app
npm install
npm start
```

Open browser: **http://localhost:3000**

### 2️⃣ Login

Use these credentials:
- Email: `admin@test.com`
- Password: `Admin@123`

### 3️⃣ Create Tasks

1. Click **"Add New Task"**
2. Fill in task name and details
3. Choose priority (Low/Medium/High)
4. Set a due date
5. Click **"Add Task"**

### 4️⃣ Manage Tasks

- ✅ **Complete**: Click the checkbox
- ✏️ **Edit**: Click "Edit" button
- 🗑️ **Delete**: Click "Delete" button
- 🔍 **Search**: Type in the search box
- 📊 **Filter**: Use the filter buttons
- 🎨 **Theme**: Click sun/moon icon for dark/light mode

---

## 📦 Installation

### Step 1: Install Node.js

<p align="left">
  <a href="https://nodejs.org/" target="_blank">
    <img src="https://img.shields.io/badge/Download%20Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Download Node.js"/>
  </a>
</p>

Download and install Node.js (v14 or higher) from the official website.

### Step 2: Install Dependencies

Navigate to the project folder and install all dependencies:

```bash
cd task-manager-app
npm install
```

This will automatically install:
- Express.js (for the server)
- Cypress (for testing)

### Step 3: Verify Installation

Check if Cypress is installed correctly:

```bash
npx cypress --version
```

---

## 🧪 Run Tests

### Step 1: Start the Application Server

First, start the task manager application:

```bash
cd task-manager-app
npm start
```

The server will run at **http://localhost:3000**

### Step 2: Run Cypress Tests (Open New Terminal)

**Option A: Open Cypress Interactive Mode (Recommended for Development)**
```bash
npm run cypress:open
```
This opens the Cypress Test Runner where you can:
- Select and run individual test files
- Watch tests run in real-time in a browser
- Debug tests easily

**Option B: Run Tests in Headless Mode (for CI/CD)**
```bash
npm run cypress:run
```
This runs all tests in the terminal without opening a browser UI.

**Option C: Run Specific Test Files**
```bash
npx cypress run --spec "cypress/e2e/task-manager.cy.js"
```

---

## 📊 Test Results

### View Test Results in Cypress

- **Screenshots**: Automatically captured on test failures in `cypress/screenshots/`
- **Videos**: Recorded test runs available in `cypress/videos/`
- **Console Output**: Real-time test results in the terminal

### Cypress Dashboard (Optional)

You can view test results in the browser while running in interactive mode with `npm run cypress:open`.

---

## � Project Structure

```
task-manager-app/
├── cypress/
│   ├── e2e/
│   │   └── task-manager.cy.js    # Test specifications
│   ├── fixtures/                  # Test data
│   ├── support/
│   │   ├── commands.js            # Custom Cypress commands
│   │   └── e2e.js                 # Test configuration
├── public/
│   ├── index.html                 # Login page
│   ├── dashboard.html             # Task dashboard
│   ├── app.js                     # Frontend logic
│   ├── auth.js                    # Authentication logic
│   └── styles.css                 # Styling
├── server/
│   └── server.js                  # Express backend
├── cypress.config.js              # Cypress configuration
├── package.json                   # Dependencies and scripts
└── .gitignore                     # Git ignore rules
```

## 🧪 Available Tests

Current test suite (`cypress/e2e/task-manager.cy.js`):

1. **Should load the login page** - Verifies the login page loads correctly
2. **Should allow login** - Tests user authentication with credentials

## 📚 Official Documentation

### Cypress

<p align="left">
  <a href="https://www.cypress.io/" target="_blank">
    <img src="https://img.shields.io/badge/Cypress%20Website-17202C?style=for-the-badge&logo=cypress&logoColor=white" alt="Cypress Website"/>
  </a>
  <a href="https://docs.cypress.io/" target="_blank">
    <img src="https://img.shields.io/badge/Cypress%20Docs-17202C?style=for-the-badge&logo=cypress&logoColor=white" alt="Cypress Docs"/>
  </a>
</p>

---

## 🎉 Quick Start Guide

### For Using the Application:
1. Install Node.js
2. `cd task-manager-app`
3. `npm install`
4. `npm start`
5. Open http://localhost:3000
6. Login with `admin@test.com` / `Admin@123`

### For Running Tests:
1. Make sure the app is running (`npm start`)
2. Open a new terminal
3. `cd task-manager-app`
4. `npm run cypress:open`
5. Select `task-manager.cy.js` and watch tests run!

## 🔧 NPM Scripts

Available commands in `package.json`:

- `npm start` - Start the Express server
- `npm run dev` - Start server in development mode
- `npm run cypress:open` - Open Cypress Test Runner (interactive)
- `npm run cypress:run` - Run tests in headless mode
- `npm run clean` - Clean test artifacts (screenshots, videos, reports)

## 🐛 Troubleshooting

**Server not starting?**
- Make sure port 3000 is not in use
- Check if Node.js is installed: `node --version`

**Cypress tests failing?**
- Ensure the server is running at http://localhost:3000
- Check `cypress.config.js` has correct `baseUrl`
- Clear browser cache and restart Cypress

**Can't find elements in tests?**
- Verify element IDs/selectors in HTML files
- Use Cypress Selector Playground in Test Runner

---
**Happy Testing! 🚀 Created By Hafeez Ilias**
