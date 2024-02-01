Components to deploy to the higher environments.
1.Remote site setting - Open_Weather
2.Custom Label - OpenWeatherAPIKey
3.Custom Object1 - Location__c
4.Custom Object2 - Weather_Info__c
5.Apex Class - WeatherIntegration
6.Apex Class - TaskController
7.LWC - weatherDisply
8.LWC - taskManager
9.Home record page
10.WeatherLocation Record Page

In order to test the task manager solution 
login to the salesforce org.
Navigate to the sales app from app launcher and click on the home tab
find the task manager component on the right-hand side
Click on Create New Task button to create a new task
Tasks assigned to the current logged-in user can be found in the table along with the required fields
There is a complete button at the end of each record to mark the task as completed.

====================================================
In order to test the weather location solution
login to the salesforce org.
search for the WeatherLocation tab and create a new record. Provide name, latitude, and longitude data and save.
There is a custom lwc component on the right-hand side added to the Location records.
Observe the weather information displayed based on the coordinates provided. and the same data is also updated as a related list record.

