

# Sensible
<p  align="center">
<img  width="650"  src="https://i.imgur.com/mAKczba.png"  alt="The homescreen for the sensible application.">
</p>
<p  align="center">
A IOT Application Created By
<br>
CBU | Devitia
</p>

***
An IOT web application used by students at California Baptist University to collect data from there smart robots during a robotics competition.

* [About the course](#about-the-course)
* [Introduction](#introduction)
* [Usage](#usage)
* [Development](#development)
	* [Frontend](#frontend)
		* [Libraries and Frameworks](#libraries-and-frameworks)
		* [Style]( #style)
		* [Data Visualization](#data-visualization)
	* Backend
* [Devitia Team](#devitia-team)

## About The Course

Sensible was designed for the semester long EGR 102 course taught at California Baptist University.<br>
The course serves as an introduction to fundamental techniques used in engineering design and analysis. Different models of the design process will be examined. A collaborative team oriented design project will be undertaken.<br>
The final project of the course is a robotics competition. The goal of the teams competiting is to assemble robots to scan various sensors on a map which indicates the amount of ping pong balls that should be collected. Those ping pong balls would then be deposited in a scoring bin (see diagram below).
<br>
<p  align="center">
<img  width="650"  src="https://i.imgur.com/8sdGXuw.png "  alt="Robotics competition arena diagram.">
</p>
Until the introduction of Sensible students would connect their robots to a local network and use Google Sheets to view the data their robot collected (A less than ideal solution, but one that worked at the time). Now students interface with Sensible to view their data.

## Introduction
Sensible was developed to replace the outdated version of reading in the data of the sensors which was done through Google Sheets. The goal of Sensible is to deliver a more reliable, fast, and user-friendly interface for the EGR102 students to read the sensor data during the competition. The webapp is optimized to work on any mobile phone or desktop, whichever is more convenient for the students.

## Usage
To begin using Sensible users must first complete the construction of their robot. Then using the robots fixed ID (supplied by the institution) they can connect to their bot with the application (used below).
<p  align="center">
<img  width="650"  src="https://i.imgur.com/U5ZGvvp.png "  alt="The homescreen for the sensible application.">
</p>

To connect to a bot, the user enters their bot ID and clicks connect. Upon successful connection, the data of the sensors will be displayed and visualized with graphs.

On the display page, users can take a capture of the data at any point by clicking the camera icon located in the middle-top-right of the page. To access the captures, users can swipe or scroll down and see a list of all their captures which they can later screenshot to save (see below). 
<p  align="center">
<img  width="650"  src="https://i.imgur.com/FwEGkli.png "  alt="The data display for the sensible application.">
</p>
Clicking on the small sensible logo on the top right of the page opens the settings in which users can disconnect from their bot, switch between dark and light modes, and find contact information for support. In case users accidentally disconnect from their bot, they can connect back to it and still have access to their captures if the page was not refreshed. Refreshing the page or closing the tab will wipe out the captured data.

## Development

### Frontend
The Frontend of the application was developed using realtively simple HTML, CSS, and Javascript principles. 

#### Libraries and Frameworks
[Bootstrap](https://getbootstrap.com/) used to dynamically resize the webpage so the webapplication functions on most screen sizes.<br>
[SweetAlert2](https://sweetalert2.github.io/#handling-dismissals) used for error popups when handling incorrect user input and settings display.<br>
[Fullpage.js](https://github.com/alvarotrigo/fullPage.js/) used for transitions between pages. Webapplication only uses one HTML file as a result.<br>
[Chart.js](https://www.chartjs.org/) used for the dynamic graphs and data visualization.

#### Style
Styling was kept simple to ensure easy readability. All sizing was done within the HTML and all other attributes were modified by CSS classes. HTML ids were used only by JavaScript and are not used to style the webapp. Below is an example of how the entire web application is styled.

    <div id="header" class="navbar" style="width: 100vw;">
The width of this particular div (in this case the header of the webapp) is defined within the HTML to fill the entire length of the viewport.

    .navbar{
      position: fixed;
      z-index: 9;
    }
The above CSS styles that set up the Div with some basic positioning elements.
#### Data Visualization
To visualize the data sent to the application Chart.js is utilized. However, out of the box it does not support dynamic data labels that move with the data. As a result a plugin ([ChartDataLabels](https://chartjs-plugin-datalabels.netlify.app/)) had to be utilized. 

    const distancectx = document.getElementById('distanceChart').getContext('2d');
    const distanceChart = new Chart(distancectx, {
	    plugins: [ChartDataLabels],
	    type: 'bar',
The plugin is added to the header area of each chart that needs to utilize it (view code snippet above).

    plugins:{
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
    }
    
To customize the look of the added datalabels you must add the "datalabels" configuration option to the chart ([all text options should work here](https://chartjs-plugin-datalabels.netlify.app/guide/options.html) in addition to some others).

## Backend
The Backend of the Sensible app was handles the connection between the web client and the IoT Device. This is handled by various AWS services which is described in detail below.
<p  align="center">
<img  width="650"  src="https://i.imgur.com/MD2O75k.png"  alt="Backend flowchart">
</p>

#### IoT Core
IoT Core is used to fetch the data from the Raspberry PI robots that the students had built throughout the duration of the course.<br>

***Setting up IoT Devices***<br>
To make the IOT Devices we used the "Learn" option within IoT Core (located on the bottom left side of the screen at the time of writing this) to create multiple IoT Things quickly. This also provided a sample publish/subscription model template for Python which we modified for use on the Raspberry Pi devices.<br><br>
***Setting up Devices Software***<br>
Each Raspberry PI has a Python script running locally that "subscribes" to a specific MQTT topic on AWS. Topics are arbitrary channels that allow for IoT core to filter  through specific content differently. The code below sets the topc destination to "EGR102/Bots" (the full python script that was used for testing can be downloaded within the repository). 

    parser.add_argument("-t", "--topic", action="store", dest="topic", default="EGR102/Bots", help="Targeted topic")
Once the topic has been defined, the subscription must be established. The below code snippet connects to the previously defined MQTT topic (NOTE: If you get time out errors when running the script make sure that your IoT thing has the correct arn permissions in its policies).

    myAWSIoTMQTTClient.connect()
    if args.mode == 'both'  or args.mode == 'subscribe': 
        myAWSIoTMQTTClient.subscribe(topic, 1, customCallback) 
    time.sleep(2)
<br>***Connecting to Lambda***<br>
To foward the data collected by IoT Core to anywhere else in AWS an IoT rule must be defined. This will select data within the given constraints and foward it to the desired service (example below shows a rule written in SQL that grabs all data from the IoT Topic we defined previously).
<p  align="center">
<img  width="650"  src="https://i.imgur.com/MOoTVuz.png"  alt="Creating an IoT Rule">
</p>

#### Lambda
Two different Lambda Functions were written to preform two different crucial tasks: Obtaining data from IoT Core and inserting it into a DynamoDB database (Bot-Data-Handler) as well as retrieving data from the database on demand based on an API Gateway Call (Bot-Database-Handler). <br>
***Bot-Data-Handler***<br>
The Bot-Data-Handler function is written in Node.js 14.x and was assigned an execution role on creation that allows it to interact with DynamoDB and API Gateway (one universal execution role was created for both functions even though this one only needed access to the DynamoDB database).
<p  align="center">
<img  width="650"  src="https://i.imgur.com/KgVBJT7.png"  alt="Giving Lambda a role">
</p>
The below code connects to the DynamoDB Database and attempts to insert the data as an item. It may seem like a lot, but broken down it becomes much easier to understand.

    const AWS = require('aws-sdk');
    const docClient = new AWS.DynamoDB.DocumentClient({region: 'region'});
    exports.handler = function(e, ctx, callback) {
        const botData = e.body ? JSON.parse(e.body) : e;
        let dataList = botData.data;
        let bot = dataList[0];
        let sensors = dataList.slice(1);
        let params = {
            Item: {
                botid: bot,
                data: sensors
            },
            TableName: "Sensible-App-Bot-Data"
        };
        docClient.put(params, function(err, data){
            if(err){
                callback(err, null);
            }else{
                callback(null, data);
            }
        })
    };

It is important that the script requires the AWS-sdk and defines the region that the rest if the web application is hosted on. This is defined on the first two lines of the above and the code snippet below.

    const AWS = require('aws-sdk');
    const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-west-1'});

Within the defined function a new constant define bd as botData is created and assigned to the incomming JSON sent by IoT Core. The subsequent lines following this definition simply devide botData up into  a more readable format so that it can be easily stored and retrieved from the DynamoDB database.

    const botData = e.body ? JSON.parse(e.body) : e;

Finally we must define the "item" that we want to insert into the database. This is done with "Params" which contains the singular bot id as well as the a value for each sensor attached to the robot.

    let params = {
            Item: {
                botid: bot,
                data: sensors
            },
            TableName: "Sensible-App-Bot-Data"
        };

Once that has been defined the item can then be inserted into the database with the code snippet below (this also catches any errors that could arise).

    docClient.put(params, function(err, data){
            if(err){
                callback(err, null);
            }else{
                callback(null, data);
            }
        })

## Devitia Team
Devitia is a cloud based software development team founded at California Baptist University. Devitia is entirely student lead, and provides software solutions for both internal and external clients. To learn more or to get in touch with us please visit us at our [website](https://www.devitia.net/).<br>
Documentation written by Jake Speyer and Hovag Apelian.
