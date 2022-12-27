// const apiKey = c6923045c685289a8524ccba359c3265;
// const city; // store user input in this var as a query. state and country need to be specified as well
// const queryUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

/*
- set localStorage to save my-home key with city name and attach to home icon
- set up user city input so that fetch will work
- set up what happens to returned data on page
- auto update interval: every 10 minutes
- recommended to represent weather with central point in territory instead of all 200,000+ cities
- calling more than once per 10 min on free plan will auto-suspend key (code 429: blocked account)
*/

// fetch(queryUrl);