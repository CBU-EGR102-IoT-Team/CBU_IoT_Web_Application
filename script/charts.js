/*
Used to create and interact with the various charts in the web application.

We are utilizing the Chart.js library to create and dynamically update the graphs in real time.
*/

// --------------------------------
// Light sensor chart.js definition
// --------------------------------
let lightctx = document.getElementById('lightChart').getContext('2d');
let lightChart = new Chart(lightctx, {
    type: 'doughnut',
    data: {
        labels: ['OK', 'WARNING'],
        datasets: [{
            label: '',
            data: [0, 0],
            backgroundColor: [
                'rgba(235, 76, 83, 1)',
                'rgba(122, 126, 194, 1)'
            ],
            borderColor: [
                'rgba(235, 76, 83, 1)',
                'rgba(122, 126, 194, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        circumference: 360,
        percentageInnerCutout: 1,
        responsive: true,
        maintainAspectRatio: false,
        plugins:{
            legend:{
                display: false
            },
            datalabels:{
                anchor: 'end',
                align: 'end',
                clamp: true,
                offset: -1,
            }
        },
        events: []
    }
});

// --------------------------------
// Distance sensor chart.js definition
// --------------------------------
let distancectx = document.getElementById('distanceChart').getContext('2d');
let distanceChart = new Chart(distancectx, {
    plugins: [ChartDataLabels],
    type: 'bar',
    data: {
        labels: ['', ''],
        datasets: [{
            label: '',
            data: [0, 0],
            backgroundColor: [
                'rgba(122, 126, 194, 1)',
                'rgba(235, 76, 83, 1)'

            ],
            borderColor: [
                'rgba(122, 126, 194, 1)',
                'rgba(235, 76, 83, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        maintainAspectRatio: false,
        plugins:{
            legend:{
                display: false,
            },
            datalabels:{
                color: '#26308f',
                anchor: 'end',
                align: 'end',
                font:{
                    size: 15,
                    family: 'Mulish',
                    weight: 600
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                display: false,
                max: 200
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
let voltagectx = document.getElementById("voltageChart").getContext('2d');
let voltageChart = new Chart(voltagectx, {
    plugins: [ChartDataLabels],
    type: 'line',
    data: {
        labels: ["", "", "", ""],
        datasets: [
            {
                label: '',
                data: [0, 0, 0, 0],
                fill: false,
                borderColor: 'rgba(122, 126, 194, 1)',
                backgroundColor: 'rgba(122, 126, 194, 1)',
                borderWidth: 4
            },
            {
                label: '',
                data: [0, 0, 0, 0],
                fill: false,
                borderColor: 'rgba(235, 76, 83, 1)',
                backgroundColor: 'rgba(235, 76, 83, 1)',
                borderWidth: 4
            }
        ]
    },
    options: {
        yAxes: [{
          scaleLabel: {
            display: false,
            labelString: 'value',
          },
          ticks: {
            max: 100,
            min: -100
          }
        }],
        pointStyle: 'line',
        layout: {
            padding: {
                left: 15,
                right: 15
            }
        },
        plugins:{
            legend:{
                display: false
            },
            datalabels:{
                color: '#26308f',
                anchor: 'end',
                align: 'end',
                display: function(voltagectx){
                    return (voltagectx.dataIndex === 3);
                },
                font:{
                    size: 15,
                    family: 'Mulish',
                    weight: 600,
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                display: false,
                max: 7,
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

// --------------------------------
// Energy sensor chart.js definition
// --------------------------------
let energyctx = document.getElementById("energyChart").getContext('2d');
let energyChart = new Chart(energyctx, {
    type: 'line',
    data: {
        labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        datasets: [
            {
                label: '',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                fill: false,
                borderColor: 'rgba(122, 126, 194, 1)',
                backgroundColor: 'rgba(122, 126, 194, 1)',
                borderWidth: 4
            }
        ]
    },
    options: {
        yAxes: [{
          scaleLabel: {
            display: false,
            labelString: 'value',
          },
          ticks: {
            max: 100,
            min: -100
          }
        }],
        pointStyle: 'line',
        layout: {
            padding: {
                left: 15,
                right: 15
            }
        },
        plugins:{
            legend:{
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                display: true,
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
    
    for(let i = 0; i < energyChart.data.datasets.length; i++){
        for(let j = 0; j < energyChart.data.datasets[i].data.length - 1; j++){
            let shiftedValue = j + 1;
            energyChart.data.datasets[i].data[j] = energyChart.data.datasets[i].data[shiftedValue];
        }
        let sensorID = 'energy';
        energyChart.data.datasets[i].data[energyChart.data.datasets[i].data.length - 1] = document.getElementById(sensorID).innerHTML;
    }

    energyChart.update();
}

// Used along with the generateChartData method to generate data constantly.
let allowDataGeneration = false;
function toggleDataGeneration(){
    allowDataGeneration = !allowDataGeneration;
}

// Reads data from the database every 1.5 seconds and updates the charts accordingly
async function generateChartData(){
    toggleDataGeneration();
    let lightSensorA = document.getElementById("light_sensor_1");
    let lightSensorB = document.getElementById("light_sensor_2");
    let distanceSensorA = document.getElementById("distance_sensor_1");
    let distanceSensorB = document.getElementById("distance_sensor_2");
    let voltageSensorA = document.getElementById("voltage_sensor_1");
    let voltageSensorB = document.getElementById("voltage_sensor_2");
    let energy = document.getElementById("energy");
    
    while(allowDataGeneration == true){
        $.ajax({
            type: 'GET',
            url: "https://qm6z7raeic.execute-api.us-west-1.amazonaws.com/prod?botId="+connectedBotID,
            async: false,
            success: function(data){
                let statusCode = data["statusCode"];
                if(statusCode === 200){
                    lightSensorA.innerHTML = data["data"]["lightA"];
                    lightSensorB.innerHTML = data["data"]["lightB"];
                    distanceSensorA.innerHTML = data["data"]["distanceA"];
                    distanceSensorB.innerHTML = data["data"]["distanceB"];
                    voltageSensorA.innerHTML = data["data"]["voltageA"];
                    voltageSensorB.innerHTML = data["data"]["voltageB"];
                    energy.innerHTML = data["data"]["energy"];
                }
            }
        })
        
        updateAllCharts();
        await sleep(0.3);

    }
}