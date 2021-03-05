'use strict';

// Add event listeners
window.addEventListener('load', () => {
    boot(); // check if logged

    // 'click' events
    //TODO make click events on sidebar work properly
    const menu_links = document.querySelectorAll('.sidebar-link');
    for (let i = 0; i < menu_links.length; i++) {
        menu_links[i].addEventListener('click', navigate(i));
    }
});

async function boot() {
    if (await checkAuth()) {
        // display main page
        generatePage_main();
    } else {
        // display login splash screen
        generatePage_splash();
    }
}

function openNav() {
    document.getElementById("mySidebar").style.width = "15vw";
    document.getElementById("main").style.marginLeft = "15vw";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

function navigate(index) {
    console.log(index);
}