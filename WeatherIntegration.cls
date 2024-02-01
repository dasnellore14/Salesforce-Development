public with sharing class WeatherIntegration {
    @AuraEnabled(cacheable=true)
    public static Map<String,Object> getWeatherInfo(Double latitude, Double longitude) {
        system.debug('In getWeatherInfo');
        String apiKey = System.Label.OpenWeatherAPIKey;
        String strUnit = 'metric';
        String apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey + '&units=' + strUnit;

        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(apiUrl);
        request.setMethod('GET');
        
        HttpResponse response = http.send(request);
        if (response.getStatusCode() == 200) {
            system.debug('In 200');
            Map<String, Object> jsonResponse = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            return jsonResponse;
        } else {
            return null;
        }
    }

    @AuraEnabled(cacheable=true)
    public static Location__c getCoordsFromLocationRecord(Id recordId) {
        system.debug('In getCoordsFromLocationRecord');
        Location__c loc = new Location__c();
        try {
            loc = [SELECT Latitude__c, Longitude__c FROM Location__c WHERE Id = :recordId LIMIT 1];
            
        } catch (Exception e) {
            System.debug('Error retrieving location or weather info: ' + e.getMessage());
        }
        return loc;
    }

    @AuraEnabled
    public static String upsertWeatherInfo(Double latitude, Double longitude, Double temperature, String Description, String LocID) {
        system.debug('In upsertWeatherInfo');
        List<Weather_Info__c> lstWeatherInfo = new List<Weather_Info__c>();
            lstWeatherInfo = [Select Id from Weather_Info__c where WeatherLocation__c =:LocID];
            
            Weather_Info__c weatherInfo = new Weather_Info__c();
            if(!lstWeatherInfo.isEmpty()){
                system.debug('In lstWeatherInfo'+ lstWeatherInfo);
                weatherInfo.Id = lstWeatherInfo[0].Id;
            }
            weatherInfo.Latitude__c = latitude;
            weatherInfo.Longitude__c = longitude;
            weatherInfo.Temperature__c = temperature;
            weatherInfo.Description__c = Description;
            weatherInfo.WeatherLocation__c = LocID;
            try {
            Upsert weatherInfo;
            return 'Success';
            }catch (Exception e) {
            System.debug('Error retrieving location or weather info: ' + e.getMessage());
            return 'Error - '+e.getMessage();
        }
    }
}