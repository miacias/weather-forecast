# Open Weather API

Keys
- API key: c6923045c685289a8524ccba359c3265
- endpoint for calls: api.openweathermap.org
- example call: api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=c6923045c685289a8524ccba359c3265
- Current & Forecast weather data collection: 5 Day / 3 Hour Forecast
    - documentation: https://openweathermap.org/forecast5
    - GETTING STARTED: https://openweathermap.org/appid

SAMPLE FETCH REQUEST RETURN DATA LONDON, UK in JSON data format
{
    "coord":{
        "lon":-0.1257,
        "lat":51.5085
    },
    
    "weather":[
        {"id":804,
        "main":"Clouds",
        "description":"overcast clouds",
        "icon":"04n"}
    ],
    
    "base":"stations",
    
    "main":{
        "temp":284.59,
        "feels_like":284.06,
        "temp_min":283.31,
        "temp_max":285.45,
        "pressure":996,
        "humidity":87
    },
    
    "visibility":10000,
    
    "wind":{
        "speed":4.92,
        "deg":220,
        "gust":7.15
    },
    
    "clouds":{
        "all":100
    },
    
    "dt":1672431798,
    
    "sys":{
        "type":2,
        "id":2075535,
        "country":"GB",
        "sunrise":1672387574,
        "sunset":1672415961
    },
    
    "timezone":0,
    
    "id":2643743,
    
    "name":"London",
    
    "cod":200
}