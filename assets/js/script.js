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
const cityId = "?id=numbers";
const geoLocation = "?lat=numbers&lon=numbers";
var cityName = ""; // store user input in this var as a query. state and country need to be specified as well

function tempConversions(kelvin) {
    var celcius = Math.round(parseFloat(kelvin) - 273.15);
	var fahrenheit = Math.round(((parseFloat(kelvin) - 273.15) * 1.8) + 32);
    // var temperature = $("#temp");
    // if (locale === usa) {
        // temperature.text(fahrenheit + "\u00B0" + "F");
        return fahrenheit + "\u00B0" + "F";
    // } else {
        // temperature.text(celcius + "\u00B0" + "C");
        // return celcius;
    // }
}

function findWeatherByName(cityName) {
    // variables used to fetch
    const apiKey = "c6923045c685289a8524ccba359c3265";
    const queryUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    fetch(queryUrl) // user input and API key complete URL
    // async promise function initiates AFTER fetch
    .then(function (response) {
        // returns JSON data
        // add 100-500 error codes? and 200s?
        return response.json();
    })
    .catch(function() {
        console.log("An error occurred.");
    })
    // linking JSON to DOM
    .then(function (data) {
        console.log(data)
        // left-side image with date, city, temp, description
        var weekday = $("#weekday");
        var monthDate = $("#month-date");
        var city = $("#city-name");
        var description = $("#weather-event");
        // sets HTML in left-side
        weekday.text(dayjs().format("dddd"));
        monthDate.text(dayjs().format("MMMM Do"));
        city.text(data.name);
        description.text(data.weather[0].main);
        var kelvin = data.main.temp;
        var temperature = $("#temp");
        temperature.text(tempConversions(kelvin));
        // upper-right-side text with humidity, wind, air pressure, high, low
        var humidity = $("#humidity");
        var wind = $("#wind");
        var airPressure = $("#air-pressure"); // convert from hPa to mb
        var tempHigh = $("#high-temp");
        var tempLow = $("#low-temp");
        humidity.append(document.createTextNode(data.main.humidity + "%"));
        wind.append(document.createTextNode(data.wind.speed + "m/s")); // create conversion function for wind
        airPressure.append(document.createTextNode(data.main.pressure + "hPa")); // conversion?
        tempHigh.append(document.createTextNode(tempConversions(data.main.temp_max)));
        tempLow.append(document.createTextNode(tempConversions(data.main.temp_min)));
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
}

runCitySearch.submit(function(event) {
    event.preventDefault();
    cityName = $("#form-text").val();
    findWeatherByName(cityName);
})