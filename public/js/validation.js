document.addEventListener('DOMContentLoaded', function() {
    // Login form validation
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('Please enter a valid email address.');
                e.preventDefault(); // Prevent form submission
            }

            if (password.length < 1) {
                alert('Please enter your password.');
                e.preventDefault(); // Prevent form submission
            }
        });
    }

    // Register form validation
    const registerForm = document.querySelector('.register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            const familyName = document.getElementById('family-name').value;
            const firstName = document.getElementById('first-name').value;
            const username = document.getElementById('username').value;
            const screenName = document.getElementById('screen-name').value;
            const birthDate = document.getElementById('birth-date').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const userAgreement = document.getElementById('user-agreement').checked;
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const userAgreement1 = document.getElementById('user-agreement-1').checked;
            const userAgreement2 = document.getElementById('user-agreement-2').checked;

            // Error messages
            let errors = [];

            if (!familyName) 
                errors.push('Family Name is required.');
            if (!firstName) 
            errors.push('First Name is required.');
            if (!username) 
                errors.push('Username is required.');
            if (!screenName)
                errors.push('Screen Name is required.');
            if (!birthDate) 
                errors.push('Birth Date is required.');
            if (!emailPattern.test(email)) 
                errors.push('Please enter a valid email address.');
            if (password.length < 6) 
                errors.push('Your password must be at least 6 characters long.');
            if (!userAgreement1 || !userAgreement2)
                errors.push('You must agree to all terms and conditions.');

            if (errors.length > 0) {
                alert('Please correct the following errors:\n' + errors.join('\n'));
                e.preventDefault(); // Prevent form submission
            }
        });
    }
});
