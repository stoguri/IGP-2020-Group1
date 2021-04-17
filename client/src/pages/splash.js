// functions todo with displaying the splash page
'use strict';

function generatePage_splash() {
    const header = document.querySelector('header');
    const main = document.querySelector('main');

    //--- header content ---//
    // Welcome text
    const welcome_wrapper = document.createElement('div');
    const welcome_text = document.createElement('h1');
    welcome_wrapper.appendChild(welcome_text);
    header.appendChild(welcome_wrapper);
    welcome_wrapper.classList.add('title-wrapper');
    welcome_text.classList.add('title-text');
    welcome_text.textContent = 'Welcome';

    // login button
    const button_login = document.createElement('button');
    header.appendChild(button_login);
    button_login.classList.add('button');
    button_login.classList.add('header-button');
    button_login.textContent = 'Login';
    button_login.onclick = login;

    //--- main content ---//
    // main paragraph
    const par_wrapper = document.createElement('div');
    const par = document.createElement('p');
    par_wrapper.appendChild(par);
    main.appendChild(par_wrapper);
    par_wrapper.classList.add('main-text-wrapper');
    par.classList.add('main-text');
    par.textContent = "Please login using the 'login' button and your Google account to gain access to the features of the website."
}