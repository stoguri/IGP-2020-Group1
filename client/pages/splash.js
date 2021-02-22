// functions todo with displaying the splash page
'use strict';

function generatePage_splash() {
    const header = document.querySelector('header');

    // header buttons
    // - login
    const button_login = document.createElement('button');
    header.appendChild(button_login);
    button_login.classList.add('button');
    button_login.classList.add('header_button');

    button_login.textContent = 'Login';
    button_login.onclick = login;    
}