// Load user data
document.addEventListener('DOMContentLoaded', async () => {
    // Apply saved theme immediately
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
    
    // Check if user is logged in with Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        // Redirect to login if not logged in
        window.location.href = '../index.html';
        return;
    }
    
    // Display user name
    const userName = user.user_metadata.name || user.email.split('@')[0];
    document.getElementById('userName').textContent = userName;
    
    // Display user email
    document.getElementById('userEmail').textContent = user.email;
    
    // Load current theme
    loadCurrentTheme();
    
    // Setup event listeners
    setupEventListeners();
});

// Load current theme from localStorage
function loadCurrentTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Update active button
    document.querySelectorAll('.theme-option').forEach(btn => {
        if (btn.dataset.theme === currentTheme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Apply theme
    applyTheme(currentTheme);
}

// Apply theme to the page
function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Theme toggle buttons
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedTheme = btn.dataset.theme;
            
            // Update active state
            document.querySelectorAll('.theme-option').forEach(b => {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            
            // Save to localStorage
            localStorage.setItem('theme', selectedTheme);
            
            // Apply theme
            applyTheme(selectedTheme);
            
            // Show success message
            showNotification('Theme changed successfully!');
        });
    });
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        if (confirm('Are you sure you want to logout?')) {
            await supabase.auth.signOut();
            window.location.href = '../index.html';
        }
    });
    
    // Show password change form
    document.getElementById('showPasswordForm').addEventListener('click', () => {
        document.getElementById('passwordFormContainer').classList.remove('hidden');
        document.getElementById('showPasswordForm').disabled = true;
    });
    
    // Cancel password change
    document.getElementById('cancelPasswordChange').addEventListener('click', () => {
        document.getElementById('passwordFormContainer').classList.add('hidden');
        document.getElementById('showPasswordForm').disabled = false;
        document.getElementById('changePasswordForm').reset();
    });
    
    // Handle password change form submission
    document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate passwords match
        if (newPassword !== confirmPassword) {
            showNotification('Passwords do not match!', 'error');
            return;
        }
        
        // Validate password length
        if (newPassword.length < 6) {
            showNotification('Password must be at least 6 characters long!', 'error');
            return;
        }
        
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });
            
            if (error) throw error;
            
            // Success
            showNotification('Password updated successfully!');
            document.getElementById('passwordFormContainer').classList.add('hidden');
            document.getElementById('showPasswordForm').disabled = false;
            document.getElementById('changePasswordForm').reset();
        } catch (error) {
            showNotification('Error updating password: ' + error.message, 'error');
        }
    });
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    const bgColor = type === 'error' 
        ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
        : 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)';
    
    const shadowColor = type === 'error'
        ? 'rgba(239, 68, 68, 0.4)'
        : 'rgba(168, 85, 247, 0.4)';
    
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px ${shadowColor};
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
