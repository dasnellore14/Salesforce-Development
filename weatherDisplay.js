import { LightningElement, api, wire } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import getWeatherInfo from '@salesforce/apex/WeatherIntegration.getWeatherInfo';
import getCoordsFromLocationRecord from '@salesforce/apex/WeatherIntegration.getCoordsFromLocationRecord';
import upsertWeatherInfo from '@salesforce/apex/WeatherIntegration.upsertWeatherInfo';


export default class WeatherDisplay extends LightningElement {
    @api recordId; // To get the record Id
    latitude;
    longitude;
    weatherData;
    description;
    iconurl;

    connectedCallback() {
        this.loadCoordinates();
    }

    loadCoordinates() {
        getCoordsFromLocationRecord({ recordId: this.recordId })
            .then(result => {
                if (result && result.Latitude__c && result.Longitude__c) {
                    this.latitude = result.Latitude__c;
                    this.longitude = result.Longitude__c;
                    this.loadWeatherData();
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    loadWeatherData() {
        getWeatherInfo({ latitude: this.latitude, longitude: this.longitude })
            .then(result => {
                this.weatherData = result;
                if (this.weatherData && this.weatherData.weather && this.weatherData.weather.length > 0) {
                    this.description = this.weatherData.weather[0].description;
                    this.iconurl =  "http://openweathermap.org/img/w/" + this.weatherData.weather[0].icon + ".png";
                } 
                this.storeWeatherData();
            })
            .catch(error => {
                console.error(error);
                this.showToast('Error', 'An error occurred while loading weather data', 'error');
            });
    }

    storeWeatherData() {
        upsertWeatherInfo({ latitude: this.latitude, longitude: this.longitude, temperature:this.weatherData.main.temp,Description:this.description,LocID:this.recordId })
            .then(result => {
                if(result == 'Success'){
                    this.showToast('success', 'Weather Data fetched and stored successfully', 'success');
                }else{
                this.showToast('error', result, 'error');
                }
            })
            .catch(error => {
                console.error(error);
                this.showToast('Error', 'An error occurred while upserting the weather data', 'error');
            });
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
}
