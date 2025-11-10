# 🚀 Cypress & Allure Testing Demo - Task Manager App

A simple task manager application with automated Cypress tests and beautiful Allure reports.

---

## 📖 What's Inside?

This project has **two folders**:

1. **task-manager-app** - Simple task manager app (no tests)
2. **WorkshopThings** - Tools needed to ease our job

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
  <img src="https://img.shields.io/badge/Allure-FF6C37?style=for-the-badge&logo=qameta&logoColor=white" alt="Allure"/>
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

## 📦 Install Cypress & Allure

### Step 1: Install Node.js

<p align="left">
  <a href="https://nodejs.org/" target="_blank">
    <img src="https://img.shields.io/badge/Download%20Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Download Node.js"/>
  </a>
</p>

Download and install Node.js from the official website.

### Step 2: Install Java (for Allure)

<p align="left">
  <a href="https://www.oracle.com/java/technologies/downloads/" target="_blank">
    <img src="https://img.shields.io/badge/Download%20Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Download Java"/>
  </a>
</p>

Download and install Java 8 or higher.

### Step 3: Install Cypress

<p align="left">
  <a href="https://docs.cypress.io/app/get-started/install-cypress" target="_blank">
    <img src="https://img.shields.io/badge/Cypress%20Docs-17202C?style=for-the-badge&logo=cypress&logoColor=white" alt="Cypress Documentation"/>
  </a>
</p>

```bash
cd task-manager-cypress-demo
npm install
```

This installs Cypress automatically!

### Step 4: Install Allure

<p align="left">
  <a href="https://allurereport.org/docs/install/" target="_blank">
    <img src="https://img.shields.io/badge/Allure%20Docs-FF6C37?style=for-the-badge&logo=qameta&logoColor=white" alt="Allure Documentation"/>
  </a>
</p>

**Windows:**
```bash
scoop install allure
```

**Mac:**
```bash
brew install allure
```

**Linux:**
```bash
sudo apt-get install allure
```

---

## 🧪 Run Tests

### Start the App First

```bash
cd task-manager-cypress-demo
npm start
```

### Run Tests (New Terminal)

**Open Cypress (Interactive):**
```bash
npm run cypress:open
```

**Run All Tests:**
```bash
npm run cypress:run
```

**Run Tests + Generate Report:**
```bash
npm run test:login
```

---

## 📊 View Allure Reports

After running tests, the report opens automatically!

Or manually open it:
```bash
npx allure serve allure-results
```

---

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

### Allure

<p align="left">
  <a href="https://allurereport.org/" target="_blank">
    <img src="https://img.shields.io/badge/Allure%20Website-FF6C37?style=for-the-badge&logo=qameta&logoColor=white" alt="Allure Website"/>
  </a>
  <a href="https://allurereport.org/docs/" target="_blank">
    <img src="https://img.shields.io/badge/Allure%20Docs-FF6C37?style=for-the-badge&logo=qameta&logoColor=white" alt="Allure Docs"/>
  </a>
</p>

---

## 🎉 Quick Start

1. Install Node.js & Java
2. `cd task-manager-app`
3. `npm install`
4. `npm start`
5. Open http://localhost:3000
6. Login with `admin@test.com` / `Admin@123`

**For Testing:**
1. `cd task-manager-cypress-demo`
2. `npm install`
3. `npm run test:login`
4. View the report!

---
**Happy Testing! 🚀 Created By Hafeez Ilias**
