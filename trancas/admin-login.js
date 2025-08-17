// Admin Login JavaScript

// Sample user credentials (in production, this would be handled by a backend)
const validUsers = {
    'admin': 'admin123',
    'funcionario1': 'func123',
    'funcionario2': 'func456'
};

// DOM Elements
const loginForm = document.getElementById('loginForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');

// Initialize login page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        window.location.href = 'admin-dashboard.html';
    }
    
    // Set focus on username field
    document.getElementById('username').focus();
});

// Login form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Validate credentials
    if (validUsers[username] && validUsers[username] === password) {
        // Store user session
        const userData = {
            username: username,
            loginTime: new Date().toISOString(),
            remember: remember
        };
        
        if (remember) {
            localStorage.setItem('currentUser', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(userData));
        }
        
        // Show success message
        showMessage('Login realizado com sucesso!', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 1000);
        
    } else {
        showMessage('Usuário ou senha incorretos!', 'error');
        
        // Clear password field
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }
});

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleBtn.className = 'fas fa-eye';
    }
}

// Show forgot password form
function showForgotPassword() {
    document.querySelector('.login-form').style.display = 'none';
    forgotPasswordForm.style.display = 'block';
}

// Show login form
function showLoginForm() {
    document.querySelector('.login-form').style.display = 'block';
    forgotPasswordForm.style.display = 'none';
}

// Send recovery email
function sendRecoveryEmail() {
    const email = document.getElementById('emailRecovery').value;
    
    if (!email) {
        showMessage('Por favor, insira seu e-mail.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Por favor, insira um e-mail válido.', 'error');
        return;
    }
    
    // Simulate sending recovery email
    showMessage('Link de recuperação enviado para seu e-mail!', 'success');
    
    setTimeout(() => {
        showLoginForm();
        document.getElementById('emailRecovery').value = '';
    }, 2000);
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show message function
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(messageDiv);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

// Handle Enter key on form fields
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const activeForm = document.querySelector('.login-form:not([style*="display: none"])') || 
                          document.querySelector('.forgot-password-form:not([style*="display: none"])');
        
        if (activeForm) {
            const submitBtn = activeForm.querySelector('button[type="submit"], button[onclick*="send"]');
            if (submitBtn) {
                submitBtn.click();
            }
        }
    }
});

// Add loading state to login button
loginForm.addEventListener('submit', function() {
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Security: Clear sensitive data on page unload
window.addEventListener('beforeunload', function() {
    // Clear any temporary data
    const tempData = sessionStorage.getItem('tempLoginData');
    if (tempData) {
        sessionStorage.removeItem('tempLoginData');
    }
});

// Prevent multiple login attempts
let loginAttempts = 0;
const maxAttempts = 5;
const lockoutTime = 5 * 60 * 1000; // 5 minutes

function checkLoginAttempts() {
    const lockoutData = localStorage.getItem('loginLockout');
    
    if (lockoutData) {
        const { attempts, timestamp } = JSON.parse(lockoutData);
        const now = new Date().getTime();
        
        if (attempts >= maxAttempts && (now - timestamp) < lockoutTime) {
            const remainingTime = Math.ceil((lockoutTime - (now - timestamp)) / 1000 / 60);
            showMessage(`Muitas tentativas de login. Tente novamente em ${remainingTime} minutos.`, 'error');
            return false;
        } else if ((now - timestamp) >= lockoutTime) {
            localStorage.removeItem('loginLockout');
        }
    }
    
    return true;
}

function recordFailedAttempt() {
    loginAttempts++;
    
    if (loginAttempts >= maxAttempts) {
        const lockoutData = {
            attempts: loginAttempts,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('loginLockout', JSON.stringify(lockoutData));
        showMessage('Muitas tentativas de login. Conta temporariamente bloqueada.', 'error');
    }
}

// Update login form submission to include attempt checking
const originalSubmitHandler = loginForm.onsubmit;
loginForm.onsubmit = function(e) {
    e.preventDefault();
    
    if (!checkLoginAttempts()) {
        return;
    }
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    if (validUsers[username] && validUsers[username] === password) {
        // Reset login attempts on successful login
        loginAttempts = 0;
        localStorage.removeItem('loginLockout');
        
        const userData = {
            username: username,
            loginTime: new Date().toISOString(),
            remember: remember
        };
        
        if (remember) {
            localStorage.setItem('currentUser', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(userData));
        }
        
        showMessage('Login realizado com sucesso!', 'success');
        
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 1000);
        
    } else {
        recordFailedAttempt();
        showMessage('Usuário ou senha incorretos!', 'error');
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }
};