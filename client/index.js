'use strict';

async function boot() {
    if(await checkAuth()) {
        // display main page
        generatePage_main();
    } else {
        // display login splash screen
        generatePage_splash();
    }
}

window.addEventListener("load", boot);