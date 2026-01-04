// Supabase Configuration
const supabaseUrl = 'https://inobbejethxftzrplmcs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlub2JiZWpldGh4ZnR6cnBsbWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MDI1ODAsImV4cCI6MjA4MzA3ODU4MH0.OCOzsimGatNoOpg4cXMH16_kMci6PYSljKF-CR12CCc';
const { createClient } = supabase;
const _supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is already logged in
    const { data: { session } } = await _supabase.auth.getSession();
    if (session) {
        // User already logged in, redirect to index
        window.location.href = 'index.html';
        return;
    }

    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');

    // Handle Signup
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Signup form submitted');

            const submitBtn = signupForm.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Creating...';

            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;

            console.log('Signup attempt:', { name, email });

            try {
                const { data, error } = await _supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: name }
                    }
                });

                if (error) {
                    console.error('Signup error:', error);
                    alert('Signup Error: ' + error.message);
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'Create Account';
                } else {
                    console.log('Signup successful:', data);
                    alert('Signup Successful! Welcome to PostApp!');
                    window.location.href = 'index.html';
                }
            } catch (err) {
                console.error('Unexpected error:', err);
                alert('Unexpected error: ' + err.message);
                submitBtn.disabled = false;
                submitBtn.innerText = 'Create Account';
            }
        });
    }

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Login form submitted');

            const submitBtn = loginForm.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Signing In...';

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            console.log('Login attempt:', { email });

            try {
                const { data, error } = await _supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) {
                    console.error('Login error:', error);
                    alert('Login Error: ' + error.message);
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'Sign In';
                } else {
                    console.log('Login successful:', data);
                    window.location.href = 'index.html';
                }
            } catch (err) {
                console.error('Unexpected error:', err);
                alert('Unexpected error: ' + err.message);
                submitBtn.disabled = false;
                submitBtn.innerText = 'Sign In';
            }
        });
    }
});
