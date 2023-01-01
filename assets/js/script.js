// /*
// - set localStorage to save my-home key with city name and attach to home icon
// - set up user city input so that fetch will work
// - set up what happens to returned data on page
// - auto update interval: every 10 minutes
// - recommended to represent weather with central point in territory instead of all 200,000+ cities
// - calling more than once per 10 min on free plan will auto-suspend key (code 429: blocked account)

// ERRORS
// - 401 - did not specify api key in request, wrong key, or fetching disallowed info (paid vs unpaid subscription)
// - 404 - wrong city name, ZIP, or city ID. or wrong request format
// - 429 - surpassing limit of free subscription
// - 500, 502, 503, 504 - CONTACT OpenWeather via email with example of api request that failed
// */
const runCitySearch = $(".city-search");
const cityName = "London,UK"; // store user input in this var as a query. state and country need to be specified as well
const cityId = "?id=numbers";
const geoLocation = "?lat=numbers&lon=numbers";

// function findWeatherByName(cityName) {
    // variables used to fetch
    const apiKey = "c6923045c685289a8524ccba359c3265";
    const queryUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

    fetch(queryUrl) // user input and API key complete URL
    // async promise function initiates AFTER fetch
    .then(function (response) {
        // returns JSON data
        return response.json();
    })
    .catch(function() {
        console.log("An error occurred.");
    })
    .then(function (data) { // uses JSON data
        console.log(data)
        // linking JS to DOM

        // upper-right-side text with humidity, wind, air pressure, high, low
        var humidity = $("#humidity");
        var wind = $("#wind");
        var airPressure = $("#air-pressure");
        var tempHigh = $("#high-temp");
        var tempLow = $("#low-temp");
        // lower-right-side text with 5-day forecast icon, temperature
        var day1 = $("#day-1");
        var day2 = $("#day-2");
        var day3 = $("#day-3");
        var day4 = $("#day-4");
        var day5 = $("#day-5");
        
        // for loop that sets text to HTML elements
        for (var i = 0; i < data.length; i++) {

        }
    })
// }


runCitySearch.submit(function(event) {
    event.preventDefault();
    // findWeatherByName(cityName);
    console.log("button was clicked");
    console.log(cityName); // broken
})

        // left-side image with date, city, temp, description
        var weekday = $("#weekday");
        var monthDate = $("#month-date");
        var city = $("#city-name");
        var temperature = $("#temp")
        var description = $("#weather-event");
        // sets HTML in left-side
        // var advancedFormat = require('dayjs/plugin/advancedFormat')
        dayjs.extend(advancedFormat);
        weekday.text(dayjs().format("dddd"));
        monthDate.text(dayjs().format("MMM Do"));