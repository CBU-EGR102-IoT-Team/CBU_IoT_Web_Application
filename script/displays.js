/*Add a pause*/
function sleep(duration) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, duration * 1000)
    })
}

/*
Used to interact with the fullPage.js library.

This is to allow the web application to interact with every element on both pages
without increasing the complexity needlessly.

Also adds some cool animations when loading in the new page.
*/
let fullpages = new fullpage('#fullpage', {
    licenseKey: 'E3EEB2F7-135F45D4-B3672D06-FA885484',
    autoScrolling:true,
    scrollOverflow: true,

    onLeave: function(origin, destination, direction){
        let leavingSection = this;

        if(destination.index == 1 && direction == 'down' && pendingCapture == true){
            pendingCapture = true;
            togglePendingCaptureOff();
            fullpage_api.reBuild();
        }
    }
});

/*Used for device input text-field. Used so we can have a nice
little prefix before the text field. */
let cleave = new Cleave('.textfield', {
    prefix: 'BOT',
    delimiter: '-',
    blocks: [3, 3],
    uppercase: true
});

/*
Runs immediatly as soon as the DOM has loaded on the webpage. Used to fun the onTopPage function
which is used to "disable" scrolling to the other two "pages".
*/
document.addEventListener("DOMContentLoaded", function(){
    onTopPage();
});

/*Disables scrolling to the data and capture pages.*/
function onTopPage(){
    let blockScrolling = document.getElementById('data_display');
    blockScrolling.classList.remove("fp-section");
    blockScrolling = document.getElementById('capture_display');
    blockScrolling.classList.remove("fp-section");
}

/*Enables scrolling to the middle page from the top page.
USED ONLY IN TRANSITION SO THAT THE LIBRARIES ANIMATION DOES NOT BUG OUT
*/
function onTransitionPage(){
    let unBlockScrolling = document.getElementById('data_display');
    unBlockScrolling.classList.add("fp-section");
}

/*
Called after onTransitionPage() to disable scrolling back to the top
page.
*/
function onMiddlePage(){
    let blockScrolling = document.getElementById('connect_display');
    blockScrolling.classList.remove("fp-section");
}

/*
Called to allow scrolling to the capture page. Enabled once the user
has used the capture feature at least one time.
*/
function onBottomPages(){
    let unBlockScrolling = document.getElementById('capture_display');
    unBlockScrolling.classList.add("fp-section");
}

/*Enables scrolling to the top page from the middle page.
USED ONLY IN TRANSITION SO THAT THE LIBRARIES ANIMATION DOES NOT BUG OUT
*/
function onTransitionPageUp(){
    let unBlockScrolling = document.getElementById('connect_display');
    unBlockScrolling.classList.add("fp-section");
    sleep(1000);
}