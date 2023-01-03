// /*
// - set localStorage to save my-home key with city name and attach to home icon
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
var count = 1;

// function tempConversions(kelvin) {
//     var celcius = Math.round(parseFloat(kelvin) - 273.15);
// 	var fahrenheit = Math.round(((parseFloat(kelvin) - 273.15) * 1.8) + 32);
//     // var temperature = $("#temp");
//     // if (locale === usa) {
//         // temperature.text(fahrenheit + "\u00B0" + "F");
//         return fahrenheit + "\u00B0" + "F";
//     // } else {
//         // temperature.text(celcius + "\u00B0" + "C");
//         // return celcius;
//     // }
// }

// set of units of measurement based on measurement system
function units() {
    var imperialUnits = {
        temp: " \u00B0" + "F",
        speed: " mph",
        pressure: " mb",
        humidPercent: "%"
    };
    var metricUnits = {
        temp: " \u00B0" + "C",
        speed: " m/s",
        pressure: " hPa",
        humidPercent: "%"
    };
    if ($(".switch").prop("checked")) {
        return imperialUnits;
    } else {
        return metricUnits;
    }
}

// sets page to return data in Imperial or Metric
function measurementSystem() {
    if ($(".switch").prop("checked")) {
        return "imperial";
    } else {
        return "metric";
    }
}

function findWeatherByName(cityName) {
    // variables used to fetch
    const apiKey = "c6923045c685289a8524ccba359c3265";
    const queryUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${measurementSystem()}`;
    // prevents empty value from being submitted
    if (!cityName) {
        return alert("Please select a city to view.");
    }
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
        // sample of how to print today's day name, example: Tue
        // var todayData = Date((data.list[0].dt) * 1000).split(" ");
        // var today = todayData[0];
        city.text(data.city.name + ", " + data.city.country);
        description.text(data.list[0].weather[0].description);
        var icon = data.list[0].weather[0].icon;
        var iconEl = $("#today-icon")
        iconEl.children().attr("href", "http://openweathermap.org/img/wn/" + icon + "@2x.png");
        var temperature = $("#temp");
        temperature.text(Math.floor(data.list[0].main.temp) + units().temp);
        // upper-right-side text with humidity, wind, air pressure, high, low
        var humidity = $("#humidity");
        var wind = $("#wind");
        var airPressure = $("#air-pressure");
        var tempHigh = $("#high-temp");
        var tempLow = $("#low-temp");
        humidity.append(document.createTextNode(Math.floor(data.list[0].main.humidity) + " " + units().humidPercent));
        wind.append(document.createTextNode(Math.floor(data.list[0].wind.speed) + units().speed)); // create conversion function for wind
        airPressure.append(document.createTextNode(Math.floor(data.list[0].main.pressure) + units().pressure)); // conversion?
        tempHigh.append(document.createTextNode(Math.floor(data.list[0].main.temp_max) + units().temp));
        tempLow.append(document.createTextNode(Math.floor(data.list[0].main.temp_min) + units().temp));
        // lower-right-side text with 5-day forecast icon, temperature
        var fiveDay = $(".five-day");
        var day;
        for (var i = 0; i < fiveDay.length; i++) {
            // dt value changes correctly but .text keeps printing first day
            day = Date((data.list[i+1].dt) * 1000).split(" ")
            fiveDay.eq(i).find("h6").text(day[0]); 
            // ...text(day[0]) === name of search-day and no extra info. example: Tue
            // ...text(day[0])[i] === day of search-day posted one letter at a time. example: T - u - e
            fiveDay.eq(i).find("p").text(Math.floor(data.list[i+1].main.temp) + units().temp); // correct temps posting
        }
    })
}

runCitySearch.submit(function(event) {
    event.preventDefault();
    cityName = $("#form-text").val();
    findWeatherByName(cityName);
})

// failed: each() is not a function?
// $(".reset").on("click", function() {
//     $("#detailed-weather").children().text().each(function() {
//         $(this).text(($(this).split(" "))[0]);
//     })
// }) 


$(".reset").on("click", function() {
    $("#detailed-weather").children().each(function() {
        // console.log(($(this).text())) // 5 strings
        // console.log($(this).text().split(" ")) // 5 arrays separated by word, example: humidity-92%
        // slice off unit of measure and number from array (last two items)
        console.log($(this).text().split(" ").splice(-1))
        // console.log($(this).text().split("")) // 5 arrays separated by letter, example: h-u-m-i-d-i-t-y
        // console.log(
        //     $(this).text(
        //         ($(this).text().split(" "))[0]))
        // $(this).text(($(this).split(" "))[0]);
    })
}) 

// failed: setting HTML inner text to a var to try to get .each() to work
// var weatherDetails = $("#detailed-weather").children().text()
// $(".reset").on("click", function() {
//     weatherDetails.each(function() {
//         $(this).text(($(this).split(" "))[0]);
//     })
// }) 