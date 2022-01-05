/*
Gets the device information inputted into the form on the first page.

It then checks the input to ensure that the input is a valid device id within a range (10 or less in this example)
*/
let theme = "dark"
async function getDevice(){
    let input = document.getElementById("deviceNumber").value;
    input = input.substr(4);
    if(input != "" && parseInt(input) > 0 && parseInt(input) <= 30 && !(isNaN(input))){

        // TODO Implement backend form validation and IoT device connection

        let targetedDisplay = document.getElementById("deviceNumberHeader");

        if(input <= 9){
            let inputString = '00' + parseInt(input, 10);
            targetedDisplay.innerHTML = "BOT -  " + inputString;
        }else if(input <= 99){
            let inputString = '0' + parseInt(input, 10);
            targetedDisplay.innerHTML = "BOT - " + inputString;
        }else{
            targetedDisplay.innerHTML = "BOT - " + parseInt(input, 10);
        }

        // Firing off the toast for the user to see.
        Swal.fire({
          customClass: {
          popup: 'popup_window'
          },
          title: '<h3 class="data_header">SUCCESS!</h3>',
          html:
            '<div style="width: 100%; height: 100%;" class="true_center">' +
            '<lottie-player src="https://assets9.lottiefiles.com/packages/lf20_irpov3s6.json" style="height: 70%; width: 70%;" background="transparent" speed="1" loop autoplay></lottie-player>' +
            '<div>',
          showConfirmButton: false,
          timer: 2500,
          confirmButtonText:
            '<i class="fa fa-thumbs-up"></i> Great!',
          confirmButtonAriaLabel: 'Thumbs up, great!',
          cancelButtonText:
            '<i class="fa fa-thumbs-down"></i>',
          cancelButtonAriaLabel: 'Thumbs down'
        })

        onTransitionPage();
        await sleep(1.8);
        fullpages.moveSectionDown();
        onMiddlePage();
        let header = document.getElementById("header");
        header.classList.remove("hide");
        await sleep(1.0);
        if(allowDataGeneration === false){
            generateChartData();
        }

    }
    // Error Handling
    else{
        // Base information if for whatever reason no cases get triggered.
        // But Trust Me That Should Not Happen Lol
        let errorTitle = "Oops...";
        let errorMessage = "Something went wrong on our end. Hold my Root-beer, I will fix this.";
        let errorIcon = "question";
        let buttonText = "Sounds Fine";

        if(input == ""){ // Blank form was submitted
            errorTitle = "Empty Form";
            errorMessage = "Please provide your bot's ID. This is located somewhere on your robot.";
            errorIcon = "warning";
            buttonText = "Sounds Fine";
        }
        else if(parseInt(input) < 0 || parseInt(input) > 30){ // Bot ID given was outside the arbitrary range
            errorTitle = "Invalid Bot ID";
            errorMessage = "The provided bot ID (" + input + ") is not valid. This is more than likely outside your organization's fleet range."
            errorIcon = "error";
            buttonText = "Try Again";
        }
        else if(isNaN(input)){ // String was submitted
            errorTitle = "Not Numeric Bot ID";
            errorMessage = "The provided bot ID is not a numeric value. Please provide your bot's ID. This is located somewhere on your robot.";
            errorIcon = "error";
            buttonText = "Try Again";
        }
        else{ // Any Other Error
            errorTitle = "Oops...";
            errorMessage = "Something went wrong on our end. Hold my Root-beer, I will fix this.";
            errorIcon = "question";
            buttonText = "Sounds Fine";

        }

        // Creates the popup with the relavant information
        Swal.fire({
          customClass: {
          popup: 'popup_window',
          confirmButton: 'popup_button'
          },
          title: '<h3 class="data_header">' + errorTitle+ '</h3>',
          html:
            '<div style="width: 100%; height: 100%;" class="true_center">' +
            '<p class="sub_header align_left">' + errorMessage + '</p>' +
            '<div>',
          showCloseButton: false,
          showCancelButton: false,
          confirmButtonText:
            ''+buttonText+'',
          confirmButtonAriaLabel: 'Thumbs up, great!',
          cancelButtonText:
            '<i class="fa fa-thumbs-down"></i>',
          cancelButtonAriaLabel: 'Thumbs down'
        })
    }
}

/*
Used to disconnect from the current datastream and return to the original device
connection page.
*/
async function destroyDevice(){
    let input = document.getElementById("deviceNumber");
    input.value = "BOT-";
    let targetedDisplay = document.getElementById("deviceNumberHeader");
    
    targetedDisplay.innerHTML = "BOT-";
    onTransitionPageUp();
    fullpages.moveSectionUp();
    await sleep(0.6);
    onTopPage();
    generateChartData();
    Swal.close()
}




async function deviceHelp(){
    Swal.fire({
        customClass: {
            popup: 'popup_window',
            confirmButton: 'popup_button',
            denyButton: 'popup_button_alt'
        },
        title: '<h3 class="data_header">Finding Your Bot ID</h3>',
        html:
            '<p class="sub_header align_left">If your bot is issued by CBU, it will have an ID written on the box containing the Raspberry Pi.</p>',
        showCloseButton: false,
        showDenyButton: true,
        focusConfirm: false,
        confirmButtonText: 'Return to connect',
        denyButtonText: 'Not my problem',
    }).then((result) => {
        if (result.isConfirmed) {
        } else if (result.isDenied) {
            Swal.fire({
                customClass: {
                    popup: 'popup_window',
                    confirmButton: 'popup_button'
                },
                title: '<h3 class="data_header">Suggested Troubleshooting</h3>',
                html:
                    '<p class="sub_header align_left"><i class="bi bi-arrow-right-short"></i>Ensure that your bot is on and connected to wifi.</p>' +
                    '<p class="sub_header align_left"><i class="bi bi-arrow-right-short"></i>Switch to a supported browser.</p>' +
                    '<p class="sub_header align_left"><i class="bi bi-arrow-right-short"></i>Contact your organization for your Bot ID.</p>' +
                    '<p class="sub_header align_left"><i class="bi bi-arrow-right-short"></i>Restart the bot and ensure cables are connected.</p>',
                confirmButtonText: 'Return to connect',
            })
        }
    })
}

async function settings(){
    if(theme === "dark"){
        Swal.fire({
            customClass: {
                popup: 'settings_window',
                confirmButton: 'popup_button'
            },
            html:
                '<div style="height: 25% !important; width: 100% !important;">' +
                    '<h3 class="data_header align_left" style="">Settings</h3>' +
                    '<div class="true_center" style="display: flex; flex-direction: row; width: 100%;">' +
                        '<div style="width: 65%;">' +
                            '<h5 class="sub_header align_left">Disconnect</h5>' +
                        '</div>' +
                        '<div style="width: 35%; display: flex; justify-content: flex-start;">' +
                            '<label class="switch" onClick="destroyDevice();">' +
                                '<input type="checkbox">' +
                                '<span class="slider round"></span>' +
                            '</label>' +
                        '</div>' +
                    '</div>' +
                    
                    '<div class="true_center" style="display: flex; flex-direction: row; width: 100%;">' +
                        '<div style="width: 65%;">' +
                            '<h5 class="sub_header align_left">Dark Theme</h5>' +
                        '</div>' +
                        '<div style="width: 35%; display: flex; justify-content: flex-start"">' +
                            '<label class="switch">' +
                                '<input type="checkbox" onClick="toggleTheme();" Checked>' +
                                '<span class="slider round"></span>' +
                            '</label>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                
                '<div style="height: 15% !important; width: 100% !important;">' +
                    '<h3 class="data_header align_left">Need Help?</h3>' +
                    '<div class="true_center" style="display: flex; flex-direction: row; width: 100%;">' +
                        '<p class="sub_header align_left">Contact: devitia@calbaptist.edu</p>' +
                    '</div>' +
                '</div>' +
                
                '<div style="height: 50% !important; width: 100% !important;">' +
                '<h3 class="data_header align_left">The Team</h3>' +
                '<div class="" style="display: flex; flex-direction: row; width: 100%;">' +
                '<div class="col-6 align_left sub_header" style="margin: 0px !important; padding: 0px;">' +
                '<h5>Software</h5>' +
                '<h6>Kaleb Coggins</h6>' +
                '<h6>Jake Speyer</h6>' +
                '<h6>Hovag Apelian</h6>' +
                '<h6>Elijah Brown</h6>' +
                '<h6>Kevin Burga</h6>' +
                '<h6>Sarah Au</h6>' + 
                '<h6>Nathan Corso</h6>' +
                '<h6>Krystal Karman</h6>' +
                '<h6>Sarah Risma</h6>' +
                '</div>' +
                '<div class="col-6 align_left sub_header" style="margin: 0px !important; padding: 0px; flex-direction: flex-start !important; ">' +
                '<h5>Hardware</h5>' +
                '<h6>Zac Bohn</h6>' +
                '<h6>Seth Gil</h6>' +
                '<h6>Gabe Sandaya</h6>' +
                '<h5>Design</h5>' +
                '<h6>Hannah Smith</h6>' +
                '</div>' +
                '</div>' +
                '</div>',
            showCloseButton: false,
            showDenyButton: false,
            focusConfirm: false,
            confirmButtonText: 'Close',
            denyButtonText: 'Not my problem',
        })
    }else{
            Swal.fire({
        customClass: {
            popup: 'settings_window',
            confirmButton: 'popup_button'
        },
        html:
            '<h3 class="data_header align_left" style="margin-bottom: 5% !important; margin-top: 5%;">Settings</h3>' +
            '<div class="true_center" style="display: flex; flex-direction: row; width: 100%;">' +
            '<div style="width: 65%;">' +
            '<h5 class="sub_header align_left">Disconnect From Bot</h5>' +
            '</div>' +
            '<div style="width: 35%; display: flex; justify-content: flex-start;">' +
            '<label class="switch" onClick="destroyDevice();">' +
            '<input type="checkbox">' +
            '<span class="slider round"></span>' +
            '</label>' +
            '</div>' +
            '</div>' +
            
            '<div class="true_center" style="display: flex; flex-direction: row; width: 100%; margin-bottom: 10% !important;">' +
            '<div style="width: 65%;">' +
            '<h5 class="sub_header align_left">Dark Theme</h5>' +
            '</div>' +
            '<div style="width: 35%; display: flex; justify-content: flex-start"">' +
            '<label class="switch">' +
            '<input type="checkbox" onClick="toggleTheme();">' +
            '<span class="slider round"></span>' +
            '</label>' +
            '</div>' +
            '</div>' +
            
            '<h3 class="data_header align_left">Need Help?</h3>' +
            '<div class="true_center" style="display: flex; flex-direction: row; width: 100%; margin-bottom: 10% !important;">' +
            '<p class="sub_header align_left">Contact: devity@calbaptist.edu</p>' +
            '</div>' +
            
            '<h3 class="data_header align_left">The Team</h3>' +
            '<div class="" style="display: flex; flex-direction: row; width: 100%;">' +
            '<div class="col-6 align_left sub_header" style="margin: 0px !important; padding: 0px;">' +
            '<h5>Software</h5>' +
            '<h6>Kaleb Coggins</h6>' +
            '<h6>Jake Speyer</h6>' +
            '<h6>Hovag Apelian</h6>' +
            '<h6>Elijah Brown</h6>' +
            '<h6>Kevin Burga</h6>' +
            '<h6>Sarah Au</h6>' + 
            '<h6>Nathan Corso</h6>' +
            '<h6>Krystal Karman</h6>' +
            '<h6>Sarah Risma</h6>' +
            '</div>' +
            '<div class="col-6 align_left sub_header" style="margin: 0px !important; padding: 0px; flex-direction: flex-start !important; ">' +
            '<h5>Hardware</h5>' +
            '<h6>Zac Bohn</h6>' +
            '<h6>Seth Gil</h6>' +
            '<h6>Gabe Sandaya</h6>' +
            '<h5">Design</h5>' +
            '<h6>Hannah Smith</h6>' +
            '</div>' +
            '</div>',
        showCloseButton: false,
        showDenyButton: false,
        focusConfirm: false,
        confirmButtonText: 'Close',
        denyButtonText: 'Not my problem',
    })
    }

}

function toggleTheme(){
    console.log("called");
    if(theme === "dark"){
        let links = document.getElementsByClassName("link_dark");
        for (let i = 0; i < links.length; i++) {
            links[i].classList.add("link_light");
            links[i].classList.remove("link_dark");
        }
        
        let backgrounds = document.getElementsByClassName("page");
        for (let i = 0; i < backgrounds.length; i++) {
            backgrounds[i].classList.add("background_light");
            backgrounds[i].classList.remove("background_dark");
        }
        theme = "light";
    }
    else if(theme === "light"){
        let links = document.getElementsByClassName("link_light");
        for (let i = 0; i < links.length; i++) {
            links[i].classList.add("link_dark");
            links[i].classList.remove("link_light");
        }
        
        let backgrounds = document.getElementsByClassName("page");
        for (let i = 0; i < backgrounds.length; i++) {
            backgrounds[i].classList.add("background_dark");
            backgrounds[i].classList.remove("background_light");
        }
        console.log("Made It But In Another Color" + theme);
        theme = "dark";
    }
}