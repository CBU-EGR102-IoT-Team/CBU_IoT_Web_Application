/*
Gets the device information inputted into the form on the first page.

It then checks the input to ensure that the input is a valid device id within a range (10 or less in this example)

THIS IS NOT THE FINAL FORM VALIDATION.
We should be checking form validation on the backend to prevent malicious users from submited bad content. This validation is just to avoid
sending needless requests to the backend.
*/
async function getDevice(){
    let input = document.getElementById("deviceNumber").value;
    input = input.substr(4);
    if(input != "" && parseInt(input) > 0 && parseInt(input) <= 30 && !(isNaN(input))){

        // TODO Implement backend form validation and IoT device connection

        let targetedDisplay = document.getElementById("deviceNumberHeader");

        if(input <= 9){
            let inputString = '00' + parseInt(input, 10);
            targetedDisplay.innerHTML = "Device ID: " + inputString;
        }else if(input <= 99){
            let inputString = '0' + parseInt(input, 10);
            targetedDisplay.innerHTML = "Device ID: " + inputString;
        }else{
            targetedDisplay.innerHTML = "Device ID: " + parseInt(input, 10);
        }

        // Firing off the toast for the user to see.
        const Toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        Toast.fire({
            icon: 'success',
            title: 'Connected To Device'
        })

        onTransitionPage();
        await sleep(1.4);
        fullpages.moveSectionDown();
        onMiddlePage();
        await sleep(1.0);
        generateChartData();
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
            buttonText = "Ok";
        }
        else if(parseInt(input) < 0 || parseInt(input) > 30){ // Bot ID given was outside the arbitrary range
            errorTitle = "Invalid Bot ID";
            errorMessage = "The provided bot ID (" + input + ") is not a valid Bot ID."
            errorIcon = "error";
            buttonText = "Ok";
        }
        else if(isNaN(input)){ // String was submitted
            errorTitle = "Not Numeric Bot ID";
            errorMessage = "The provided bot ID is not a numeric value. Please provide your bot's ID. This is located somewhere on your robot.";
            errorIcon = "error";
            buttonText = "Ok";
        }
        else{ // Any Other Error
            errorTitle = "Oops...";
            errorMessage = "Something went wrong on our end. Hold my Root-beer, I will fix this.";
            errorIcon = "question";
            buttonText = "Sounds Fine";

        }

        // Creates the popup with the relavant information
        Swal.fire({
            icon: errorIcon,
            title: errorTitle,
            text: errorMessage,
            confirmButtonText: buttonText,
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

    targetedDisplay.innerHTML = "Device ID: ___";
    onTransitionPageUp();
    fullpages.moveSectionUp();
    await sleep(0.6);
    onTopPage();
    generateChartData();
}




async function deviceHelp(){
    Swal.fire({
        html:
            '<lottie-player src="https://assets5.lottiefiles.com/packages/lf20_mnjh1lq9.json"  background="transparent"  speed="1"  style="margin-left: auto; margin-right: auto; max-height: 200px; max-width: 200px;"  loop  autoplay></lottie-player>' +
            '<h1><strong>Finding Your Bot ID</strong></h1> ' +
            '<p>If your bot was CBU issued, it will have an ID written onto the box containing your Raspberry Pi.</p>',
        showCloseButton: false,
        showDenyButton: true,
        focusConfirm: false,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Ok',
        denyButtonText: '<i class="fa fa-thumbs-down"></i> Not My Problem',
    }).then((result) => {
        if (result.isConfirmed) {
        } else if (result.isDenied) {
            Swal.fire({
                icon: 'error',
                title: 'Troubleshooting',
                html:
                    '<p style="text-align: left;">Ensure that your bot is on and connected to wifi.</p>' +
                    '<p style="text-align: left;">Switch to a supported browser.</p>' +
                    '<p style="text-align: left;">Restart the bot and ensure cables are connected.</p>',
                confirmButtonText: '<i class="fa fa-thumbs-up"></i> Ok',
            })
        }
    })
}