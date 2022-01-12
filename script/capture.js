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
    captureAnimation();
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

async function captureAnimation(){
    let captureAnimationDiv = document.getElementById("flash");
    captureAnimationDiv.classList.remove("disabled");

    await sleep(5);
    captureAnimationDiv.classList.add("disabled");
}

/*
Generates the capture card using various html elements.

I know this is messy, but in order to have the correct CSS styling I believe this is the
only way to do it.

*/
function generateCaptureDisplay(lightSensor1, lightSensor2, distanceSensor1, distanceSensor2, voltageSensor1, voltageSensor2){
    captureCount = captureCount + 1;

    // Creating the parent capture div
    let newCapture = document.createElement('div');
    newCapture.id = 'capture_' + captureCount;
    newCapture.classList.add("window");
    newCapture.classList.add("capture");
    
    let cloneChart = (chart, newLoc, labels) => new Chart(
       newLoc, {
        plugins: [labels && ChartDataLabels],
        type: chart.config.type,
        data: chart.config.data, 
        options:chart.config.options
    });
    
    // Distance
    let distanceSliver = document.createElement('div');
    distanceSliver.classList.add('capture_sliver');
    distanceSliver.innerHTML = 
        "<div class=\"distance_data_header\" style=\"width: 100%; text-align: center\"><h5 class=\"sub_header\" style=\"height: 20%\">Distance</h5></div>";
    
    let distanceCaptureCanvas = document.createElement('canvas');
    distanceCaptureCanvas.id = `c${captureCount}-d`;
    
    let distanceCaptureContainer = document.createElement('div');
    distanceCaptureContainer.style.height = '19vh';
    distanceCaptureContainer.style.width = '30vw';
    distanceCaptureContainer.style.padding = '2vw';
    
    distanceCaptureContainer.appendChild(distanceCaptureCanvas);
    distanceSliver.appendChild(distanceCaptureContainer);
    newCapture.appendChild(distanceSliver);
    
    // Separator
    let sep = document.createElement('div');
    sep.classList.add('separator');
    newCapture.appendChild(sep);
    
    // Light
    let lightSliver = document.createElement('div');
    lightSliver.classList.add('capture_sliver');
    lightSliver.innerHTML = 
        "<div class=\"light_data_header\" style=\"width: 100%; text-align: center\"><h5 class=\"sub_header\" style=\"height: 20%\">Light</h5></div>";
    
    let lightCaptureCanvas = document.createElement('canvas');
    lightCaptureCanvas.id = `c${captureCount}-l`;
    
    let lightCaptureContainer = document.createElement('div');
    lightCaptureContainer.style.height = '12vh';
    lightCaptureContainer.style.width = '30vw';
    lightCaptureContainer.style.padding = '2vw';
    
    lightCaptureContainer.appendChild(lightCaptureCanvas);
    
    let ls1 = document.getElementById('light_sensor_1').cloneNode(true);
    ls1.style.paddingRight = '5px';
    lightSliver.appendChild(ls1);
    
    lightSliver.appendChild(lightCaptureContainer);
    
    let ls2 = document.getElementById('light_sensor_2').cloneNode(true);
    ls2.style.paddingLeft = '5px';
    lightSliver.appendChild(ls2);
    
    newCapture.appendChild(lightSliver);
    
    // Separator
    sep = document.createElement('div');
    sep.classList.add('separator');
    newCapture.appendChild(sep);
    
    // voltage
    let voltageSliver = document.createElement('div');
    voltageSliver.classList.add('capture_sliver');
    voltageSliver.innerHTML = 
        "<div class=\"voltage_data_header\" style=\"width: 100%; text-align: center\"><h5 class=\"sub_header\" style=\"height: 20%\">Voltage</h5></div>";
    
    let voltageCaptureCanvas = document.createElement('canvas');
    voltageCaptureCanvas.id = `c${captureCount}-v`;
    
    let voltageCaptureContainer = document.createElement('div');
    voltageCaptureContainer.style.height = '19vh';
    voltageCaptureContainer.style.width = '30vw';
    voltageCaptureContainer.style.padding = '2vw';
    
    voltageCaptureContainer.appendChild(voltageCaptureCanvas);
    voltageSliver.appendChild(voltageCaptureContainer);
    newCapture.appendChild(voltageSliver);

    let capturePage = document.getElementById("capture_page");
    capturePage.style.overflow = 'visible';
    capturePage.appendChild(newCapture);
    
    cloneChart(distanceChart, document.getElementById(`c${captureCount}-d`).getContext('2d'), true);
    cloneChart(lightChart, document.getElementById(`c${captureCount}-l`).getContext('2d'), false);
    cloneChart(voltageChart, document.getElementById(`c${captureCount}-v`).getContext('2d'), true);
}

/*
Picks out a header color based on which number the global variable is on.

0 = blue
1 = yellow
2 = red (resets back to 0)
*/
function headerColor(){
    if (captureColor == 0) {
        captureColor = captureColor + 1;
        return 'capture_header_blue';
    } else if (captureColor == 1) {
        captureColor = captureColor + 1;
        return 'capture_header_yellow';
    } else {
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