// Toggle between Sign In and Sign Up forms
const showSignUpBtn = document.getElementById('showSignUp');
const showSignInBtn = document.getElementById('showSignIn');
const signInBox = document.getElementById('signInBox');
const signUpBox = document.getElementById('signUpBox');
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');

// Show Sign Up form
showSignUpBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signInBox.classList.add('hidden');
    signUpBox.classList.remove('hidden');
});

// Show Sign In form
showSignInBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signUpBox.classList.add('hidden');
    signInBox.classList.remove('hidden');
});

// Handle Sign In with Supabase
signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        // Redirect to dashboard on success
        window.location.href = 'pages/dashboard.html';
    } catch (error) {
        alert('Invalid email or password: ' + error.message);
    }
});

// Handle Sign Up with Supabase
signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signUpName').value;
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('signUpConfirmPassword').value;
    
    // Validation
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }
    
    try {
        const { data, error} = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name
                }
            }
        });
        
        if (error) throw error;
        
        // Show success message
        alert(`Account created successfully! Please check your email to confirm your account.`);
        
        // Switch to sign in form
        signUpForm.reset();
        signUpBox.classList.add('hidden');
        signInBox.classList.remove('hidden');
    } catch (error) {
        alert('Error creating account: ' + error.message);
    }
});
