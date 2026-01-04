// Supabase Configuration
const supabaseUrl = 'https://inobbejethxftzrplmcs.supabase.co';
const supabaseKey = 'sb_publishable_ZnZB7VuIDg9eKeZyZN-x-A_IhMkQ6AH';
const { createClient } = supabase;
const _supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');

    // Handle Signup
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = signupForm.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Creating...';

            const name = signupForm.querySelector('input[type="text"]').value;
            const email = signupForm.querySelector('input[type="email"]').value;
            const password = signupForm.querySelector('input[type="password"]').value;

            const { data, error } = await _supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name }
                }
            });

            if (error) {
                alert('Signup Error: ' + error.message);
                submitBtn.disabled = false;
                submitBtn.innerText = 'Create Account';
            } else {
                alert('Signup Successful! Please check your email for verification (if enabled) or proceed to login.');
                window.location.href = 'login.html';
            }
        });
    }

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = loginForm.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Signing In...';

            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;

            const { data, error } = await _supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                alert('Login Error: ' + error.message);
                submitBtn.disabled = false;
                submitBtn.innerText = 'Sign In';
            } else {
                window.location.href = 'index.html';
            }
        });
    }
});
