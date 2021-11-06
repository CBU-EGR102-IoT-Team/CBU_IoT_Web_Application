/*
Used to create and interact with the various charts in the web application.

We are utilizing the Chart.js library to create and dynamically update the graphs in real time.
*/

// --------------------------------
// Light sensor chart.js definition
// --------------------------------
const lightctx = document.getElementById('lightChart').getContext('2d');
const lightChart = new Chart(lightctx, {
    type: 'doughnut',
    data: {
        labels: ['OK', 'WARNING'],
        datasets: [{
            label: '',
            data: [0, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        plugins:{
            legend:{
                display: false
            }
        },
        events: []
    }
});

// --------------------------------
// Distance sensor chart.js definition
// --------------------------------
const distancectx = document.getElementById('distanceChart').getContext('2d');
const distanceChart = new Chart(distancectx, {
    type: 'bar',
    data: {
        labels: ['', ''],
        datasets: [{
            label: '',
            data: [0, 0],
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 99, 132, 0.2)'

            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        plugins:{
            legend:{
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                display: false
            },
            x: {
                display: false
            }
        },
        events: []
    }
});

// --------------------------------
// Voltage sensor chart.js definition
// --------------------------------
var voltagectx = document.getElementById("voltageChart").getContext('2d');
var voltageChart = new Chart(voltagectx, {
    type: 'line',
    data: {
        labels: ["", "", "", "", ""],
        datasets: [
            {
                label: '',
                data: [0, 0, 0, 0],
                fill: false,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1
            },
            {
                label: '',
                data: [0, 0, 0, 0],
                fill: false,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2',
                borderWidth: 1
            }
        ]
    },
    options: {
        plugins:{
            legend:{
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                display: false,
                max: 1000,
                min: 0,
            },
            x: {
                display: false
            }
        },
        events: [],
        responsive: true, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
    }
});


/*
Updates the data within each chart with the new data being displayed on the webpage.

Interacts with the pages <h1> elements instead of directly interacting with the data so that
if the method of data transmition is changed in the future this method will not have to change.
*/
function updateAllCharts(){
    // Updates light chart data
    lightChart.data.datasets[0].data[0] = document.getElementById('light_sensor_1').innerHTML;
    lightChart.data.datasets[0].data[1] = document.getElementById('light_sensor_2').innerHTML;
    lightChart.update();

    // Updates distance chart data
    distanceChart.data.datasets[0].data[0] = document.getElementById('distance_sensor_1').innerHTML;
    distanceChart.data.datasets[0].data[1] = document.getElementById('distance_sensor_2').innerHTML;
    distanceChart.update();

    // Updates voltage chart data. Nested for loop so it is easy to increase chart accuracy if desired.
    // (Only necessary because the chart is a line graph)
    for(let i = 0; i < voltageChart.data.datasets.length; i++){
        for(let j = 0; j < voltageChart.data.datasets[i].data.length - 1; j++){
            let shiftedValue = j + 1;
            voltageChart.data.datasets[i].data[j] = voltageChart.data.datasets[i].data[shiftedValue];
        }
        let sensorID = 'voltage_sensor_' + (i + 1);
        voltageChart.data.datasets[i].data[voltageChart.data.datasets[i].data.length - 1] = document.getElementById(sensorID).innerHTML;
    }

    voltageChart.update();
}

// Used along with the generateChartData method to generate data constantly.
let allowDataGeneration = false;
function toggleDataGeneration(){
    allowDataGeneration = !allowDataGeneration;
}

// Tempory method used to generate random data for the sensors. This method will be updated in the future
// when we set up the data collection.
async function generateChartData(){
    toggleDataGeneration();
    while(allowDataGeneration == true){
        let lightSensor = document.getElementById("light_sensor_1");
        lightSensor.innerHTML = Math.floor(Math.random() * (1000 - 1) + 1);
        lightSensor = document.getElementById("light_sensor_2");
        lightSensor.innerHTML = Math.floor(Math.random() * (1000 - 1) + 1);

        let distanceSensor = document.getElementById("distance_sensor_1");
        distanceSensor.innerHTML = Math.floor(Math.random() * (100 - 1) + 1);
        distanceSensor = document.getElementById("distance_sensor_2");
        distanceSensor.innerHTML = Math.floor(Math.random() * (100 - 1) + 1);

        let voltageSensor = document.getElementById("voltage_sensor_1");
        voltageSensor.innerHTML = Math.floor(Math.random() * (1000 - 1) + 1);
        voltageSensor = document.getElementById("voltage_sensor_2");
        voltageSensor.innerHTML = Math.floor(Math.random() * (1000 - 1) + 1);

        updateAllCharts();

        await sleep(2);
    }
}