let submitBtn = document.querySelector('.login-btn');
let loginForm = document.querySelector('.login-form');
let registerForm = document.querySelector('.register-form');
let loginErrorMsg = document.querySelector('.login-error-msg');
let registerErrorMsg = document.querySelector('.register-error-msg');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let loginFormData = Object.fromEntries(new FormData(loginForm).entries())
    // let formValues = Object.values(formData);

    if(loginFormData.email === '' || loginFormData.password === ''){
        loginErrorMsg.textContent = 'Fields can not be empty'
    }
    else{
        fetch('https://login-rest-api.onrender.com/login', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginFormData)
        })
        .then(response => {
            return response.json()
        })
        .then(data =>{
            if(data.status === 'true'){
                localStorage.setItem("jwt", data.token)
                localStorage.setItem('auth', 1)
                location.href = './codex.html'
            }
            else{
                loginErrorMsg.textContent = data.message;
            }
        } )
    }
});

let registerLink = document.querySelector('.register-link');
registerLink.addEventListener('click', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
});

let loginLink = document.querySelector('.login-link');
loginLink.addEventListener('click', () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'flex';
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let registerFormData = Object.fromEntries(new FormData(registerForm).entries());

    if(registerFormData.name == '' || registerFormData.email === '' || registerFormData.password === ''){
        registerErrorMsg.textContent = 'Fields can not be empty'
    }
    else{
        fetch('https://login-rest-api.onrender.com/register', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerFormData)
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if(data.status === 'true'){
                location.href = './confirm.html'
            }
            else{
                registerErrorMsg.textContent = data.message;
            }
        })
    }
})

