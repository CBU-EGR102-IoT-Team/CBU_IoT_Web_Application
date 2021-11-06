// Used for HTML element ids. Used to future proof so if we ever need to access
// specfic captures we can easily.
let captureCount = 0;
// Used to alternate through various header colors if desired. (range 0-2- 3 header colors)
let captureColor = 0;
// Used to prompt the user with a notification if they have a "pending" or unseen capture.
let pendingCapture = false;

/*
1. Used to capture the values of the HTML H1 elements that display the sensor values.
2. Toggles on pending capture notification.
3. Generates a capture card for the user on the capture page.

*/
function captureChartData(){
    let lightSensor1 = document.getElementById("light_sensor_1").innerHTML;
    let lightSensor2 = document.getElementById("light_sensor_2").innerHTML;
    let distanceSensor1 = document.getElementById("distance_sensor_1").innerHTML;
    let distanceSensor2 = document.getElementById("distance_sensor_2").innerHTML;
    let voltageSensor1 = document.getElementById("voltage_sensor_1").innerHTML;
    let voltageSensor2 = document.getElementById("voltage_sensor_2").innerHTML;

    generateCaptureDisplay(lightSensor1, lightSensor2, distanceSensor1, distanceSensor2, voltageSensor1, voltageSensor2);

    onBottomPages();
    togglePendingCaptureOn();
}

/*
Generates the capture card using various html elements.

I know this is messy, but in order to have the correct CSS styling I believe this is the
only way to do it.

TODO: Add charts to each card.
*/
function generateCaptureDisplay(lightSensor1, lightSensor2, distanceSensor1, distanceSensor2, voltageSensor1, voltageSensor2){
    captureCount = captureCount + 1;

    // Creating the parent capture div
    let newCapture = document.createElement('div');
    let newCaptureId = 'capture_' + captureCount;
    newCapture.id = newCaptureId;
    newCapture.classList.add("capture_parent");
    newCapture.classList.add("container-fluid");

    // Creating the header for each new capture
    let newCaptureHeader = document.createElement('div');
    newCaptureHeader.classList.add(headerColor());

    let captureTitle = document.createElement('p');
    captureTitle.classList.add("capture_header_title");
    captureTitle.innerHTML = 'Capture ' + captureCount;

    let today = new Date();
    let captureTime = document.createElement('p');
    captureTime.classList.add("capture_header_time");
    captureTime.innerHTML = today.getHours() + ":" + today.getMinutes();
    newCaptureHeader.appendChild(captureTitle);
    newCaptureHeader.appendChild(captureTime);

    // Creating the body for each new cpature
    let newCaptureBody = document.createElement('div');
    newCaptureBody.id = newCaptureId;
    newCaptureBody.classList.add("capture_body");

    let captureData = document.createElement('div');
    captureData.classList.add("capture_data");
    let lightSensors = document.createElement('p');
    lightSensors.innerHTML = '<i class="bi-lightbulb"></i>' + ' ' + lightSensor1 + ', ' + lightSensor2;
    let distanceSensors = document.createElement('p');
    distanceSensors.innerHTML = '<i class="bi-rulers"></i>' + ' ' + distanceSensor1 + ', ' + distanceSensor2;
    let voltageSensors = document.createElement('p');
    voltageSensors.innerHTML = '<i class="bi-lightning"></i>' + ' ' + voltageSensor1 + ', ' + voltageSensor2;
    captureData.appendChild(lightSensors);
    captureData.appendChild(distanceSensors);
    captureData.appendChild(voltageSensors);

    newCaptureBody.appendChild(captureData);



    newCapture.appendChild(newCaptureHeader);
    newCapture.appendChild(newCaptureBody);

    let capturePage = document.getElementById("capture_page");
    capturePage.appendChild(newCapture);
}

/*
Picks out a header color based on which number the global variable is on.

0 = blue
1 = yellow
2 = red (resets back to 0)
*/
function headerColor(){
    if(captureColor == 0){
        captureColor = captureColor + 1;
        return 'capture_header_blue';
    }else if(captureColor == 1){
        captureColor = captureColor + 1;
        return 'capture_header_yellow';
    }else{
        captureColor = 0;
        return 'capture_header_red';
    }

}
/*
Toggles on the Lottie File animation that indicates to the user that they have a pending
unseen capture and should swipe down on their device to view it.

Called on each time the user clicks the capture button. But will only toggle if it was previously off.
*/
function togglePendingCaptureOn(){
    if(pendingCapture == false){
        let pendingAnimation = document.getElementById('new_capture_animation');
        pendingAnimation.classList.remove('hidden');
        pendingCapture = true;
    }
}

/*
Toggles off the Lottie File animation that indicates to the user that they have a pending
unseen capture.

Called on by displays.js when fullpage.js detects that the user has scrolled down to the captures page.
*/
function togglePendingCaptureOff(){
    if(pendingCapture == true){
        let pendingAnimation = document.getElementById('new_capture_animation');
        pendingAnimation.classList.add('hidden');
        pendingCapture = false;
    }
}