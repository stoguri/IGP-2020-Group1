'use strict';

async function boot() {
    if(await checkAuth()) {
        // display main page
        console.log("logged in")
    } else {
        // display login splash screen
        console.log("not logged in");
    }
}

window.addEventListener("load", boot);