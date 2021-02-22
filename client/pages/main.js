// functions todo with displaying the main page
'use strict';

function generatePage_main() {
    const header = document.querySelector('header');

    // header buttons
    // - login
    const button_logout = document.createElement('button');
    header.appendChild(button_logout);
    button_logout.classList.add('button');
    button_logout.classList.add('header_button');

    button_logout.textContent = 'Logout';
    button_logout.onclick = logout;    
}