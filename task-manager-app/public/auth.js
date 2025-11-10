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

  // Close button handler
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.remove();
  });

  // Auto dismiss after 5 seconds
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

// ==================== TAB SWITCHING ====================
const tabButtons = document.querySelectorAll('.tab-btn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tab = button.dataset.tab;

    // Update active tab
    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Show corresponding form
    if (tab === 'login') {
      loginForm.classList.add('active');
      registerForm.classList.remove('active');
    } else {
      registerForm.classList.add('active');
      loginForm.classList.remove('active');
    }
  });
});

// ==================== PASSWORD TOGGLE ====================
document.querySelectorAll('.toggle-password').forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.target;
    const input = document.getElementById(targetId);

    if (input.type === 'password') {
      input.type = 'text';
      button.querySelector('.eye-icon').textContent = '👁️‍🗨️';
    } else {
      input.type = 'password';
      button.querySelector('.eye-icon').textContent = '👁️';
    }
  });
});

// ==================== EMAIL VALIDATION ====================
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showEmailValidation(inputId, errorId, validationId) {
  const input = document.getElementById(inputId);
  const errorSpan = document.getElementById(errorId);
  const validationSpan = document.getElementById(validationId);

  input.addEventListener('blur', () => {
    const email = input.value.trim();

    if (email === '') {
      errorSpan.textContent = '';
      if (validationSpan) validationSpan.textContent = '';
      return;
    }

    if (!validateEmail(email)) {
      errorSpan.textContent = 'Please enter a valid email address';
      if (validationSpan) {
        validationSpan.textContent = '✕ Invalid email format';
        validationSpan.className = 'validation-message error';
      }
    } else {
      errorSpan.textContent = '';
      if (validationSpan) {
        validationSpan.textContent = '✓ Valid email';
        validationSpan.className = 'validation-message success';
      }
    }
  });
}

// Apply email validation
showEmailValidation('loginEmail', 'loginEmailError');
showEmailValidation('registerEmail', 'registerEmailError', 'registerEmailValidation');

// ==================== PASSWORD STRENGTH CHECKER ====================
const registerPassword = document.getElementById('registerPassword');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

const criteriaElements = {
  length: document.getElementById('criteriaLength'),
  uppercase: document.getElementById('criteriaUppercase'),
  lowercase: document.getElementById('criteriaLowercase'),
  number: document.getElementById('criteriaNumber'),
  special: document.getElementById('criteriaSpecial')
};

function checkPasswordStrength(password) {
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&]/.test(password)
  };

  // Update criteria checklist
  Object.keys(criteria).forEach(key => {
    if (criteria[key]) {
      criteriaElements[key].classList.add('valid');
    } else {
      criteriaElements[key].classList.remove('valid');
    }
  });

  // Calculate strength
  const metCriteria = Object.values(criteria).filter(Boolean).length;

  let strength = 'weak';
  let strengthLevel = 'Weak';

  if (metCriteria >= 5) {
    strength = 'strong';
    strengthLevel = 'Strong';
  } else if (metCriteria >= 3) {
    strength = 'medium';
    strengthLevel = 'Medium';
  }

  // Update UI
  strengthBar.className = `strength-bar-fill ${strength}`;
  strengthText.textContent = `Password Strength: ${strengthLevel}`;
  strengthText.className = `strength-text ${strength}`;

  return criteria;
}

function validatePassword(password) {
  const criteria = checkPasswordStrength(password);
  return Object.values(criteria).every(Boolean);
}

registerPassword.addEventListener('input', (e) => {
  checkPasswordStrength(e.target.value);
});

// ==================== FILE UPLOAD WITH PREVIEW ====================
const profilePictureInput = document.getElementById('profilePicture');
const imagePreview = document.getElementById('imagePreview');
const profilePictureError = document.getElementById('profilePictureError');

profilePictureInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  profilePictureError.textContent = '';
  imagePreview.innerHTML = '';

  if (!file) return;

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    profilePictureError.textContent = 'Please upload a valid image (JPG, PNG, or GIF)';
    profilePictureInput.value = '';
    return;
  }

  // Validate file size (2MB max)
  const maxSize = 2 * 1024 * 1024; // 2MB in bytes
  if (file.size > maxSize) {
    profilePictureError.textContent = 'File size must be less than 2MB';
    profilePictureInput.value = '';
    return;
  }

  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = document.createElement('img');
    img.src = e.target.result;
    imagePreview.appendChild(img);
  };
  reader.readAsDataURL(file);
});

// ==================== LOGIN FORM HANDLER ====================
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const rememberMe = document.getElementById('rememberMe').checked;

  // Validation
  const loginEmailError = document.getElementById('loginEmailError');
  const loginPasswordError = document.getElementById('loginPasswordError');

  loginEmailError.textContent = '';
  loginPasswordError.textContent = '';

  let hasError = false;

  if (!email) {
    loginEmailError.textContent = 'Email is required';
    hasError = true;
  } else if (!validateEmail(email)) {
    loginEmailError.textContent = 'Please enter a valid email address';
    hasError = true;
  }

  if (!password) {
    loginPasswordError.textContent = 'Password is required';
    hasError = true;
  }

  if (hasError) {
    showToast('Please fix the errors', 'error');
    return;
  }

  // Show loading state
  const loginBtn = document.getElementById('loginBtn');
  loginBtn.classList.add('loading');
  loginBtn.disabled = true;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      showToast('Login successful!', 'success', 'Redirecting to dashboard...');

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1000);
    } else {
      showToast('Login failed', 'error', data.message);
      loginBtn.classList.remove('loading');
      loginBtn.disabled = false;
    }
  } catch (error) {
    showToast('Error', 'error', 'An error occurred. Please try again.');
    loginBtn.classList.remove('loading');
    loginBtn.disabled = false;
  }
});

// ==================== REGISTER FORM HANDLER ====================
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const role = document.getElementById('registerRole').value;
  const profilePicture = document.getElementById('profilePicture').files[0];

  // Validation
  const registerEmailError = document.getElementById('registerEmailError');
  const registerPasswordError = document.getElementById('registerPasswordError');
  const registerRoleError = document.getElementById('registerRoleError');

  registerEmailError.textContent = '';
  registerPasswordError.textContent = '';
  registerRoleError.textContent = '';

  let hasError = false;

  if (!email) {
    registerEmailError.textContent = 'Email is required';
    hasError = true;
  } else if (!validateEmail(email)) {
    registerEmailError.textContent = 'Please enter a valid email address';
    hasError = true;
  }

  if (!password) {
    registerPasswordError.textContent = 'Password is required';
    hasError = true;
  } else if (!validatePassword(password)) {
    registerPasswordError.textContent = 'Password must meet all criteria';
    hasError = true;
  }

  if (!role) {
    registerRoleError.textContent = 'Please select a role';
    hasError = true;
  }

  if (hasError) {
    showToast('Please fix the errors', 'error');
    return;
  }

  // Show loading state
  const registerBtn = document.getElementById('registerBtn');
  registerBtn.classList.add('loading');
  registerBtn.disabled = true;

  try {
    // Convert profile picture to base64 if exists
    let profilePictureData = null;
    if (profilePicture) {
      profilePictureData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(profilePicture);
      });
    }

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        role,
        profilePicture: profilePictureData
      })
    });

    const data = await response.json();

    if (data.success) {
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));

      showToast('Registration successful!', 'success', 'Redirecting to dashboard...');

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1000);
    } else {
      showToast('Registration failed', 'error', data.message);
      registerBtn.classList.remove('loading');
      registerBtn.disabled = false;
    }
  } catch (error) {
    showToast('Error', 'error', 'An error occurred. Please try again.');
    registerBtn.classList.remove('loading');
    registerBtn.disabled = false;
  }
});

// ==================== CHECK IF USER IS LOGGED IN ====================
window.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('user');
  if (user) {
    // User is already logged in, redirect to dashboard
    window.location.href = '/dashboard.html';
  }
});
