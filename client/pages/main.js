// functions todo with displaying the main page
'use strict';

function generatePage_main() {
    const header = document.querySelector('header');

    //--- header content ---//

    // title text
    const title_wrapper = document.createElement('div');
    const title_text = document.createElement('h1');
    title_wrapper.appendChild(title_text);
    header.appendChild(title_wrapper);
    title_wrapper.classList.add('title-wrapper');
    title_text.classList.add('title-text');
    title_text.textContent = 'Home'; // TODO make textContent change depending on content that is being displayed

    // logout button
    const button_logout = document.createElement('button');
    header.appendChild(button_logout);
    button_logout.classList.add('logout-button');
    button_logout.classList.add('header-button');
    button_logout.textContent = 'Logout';
    button_logout.onclick = logout;
}