/*
- set localStorage to save my-home key with city name and attach to home icon
- set localStorage to save city names as key with fetched object as data?
- auto update interval: every 10 minutes
- calling more than once per 10 min on free plan will auto-suspend key (code 429: blocked account)

ERRORS
- 401 - did not specify api key in request, wrong key, or fetching disallowed info (paid vs unpaid subscription)
- 404 - wrong city name, ZIP, or city ID. or wrong request format
- 429 - surpassing limit of free subscription
- 500, 502, 503, 504 - CONTACT OpenWeather via email with example of api request that failed
*/

const citySearchEl = $(".city-search");
var cityName = "";
var zip = "";
var state = "";
var country = "";
var toggle;
var latitude = "";
var longitude = "";

// function display() {
//     if (???) {
//         $(".search-for-location").addClass("d-none");
//     }
// }

// sets units of measurement based on measurement system
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

// adds specific data to HTML
function postWeather(data) {
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
    var iconEl = $("#today-icon");
    iconEl.attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");
    var temperature = $("#temp");
    temperature.text(Math.floor(data.list[0].main.temp) + units().temp);
    // upper-right-side text with humidity, wind, air pressure, high, low
    var humidity = $("#humidity");
    var wind = $("#wind");
    var airPressure = $("#air-pressure");
    var tempHigh = $("#high-temp");
    var tempLow = $("#low-temp");
    humidity.text("Humidity: " + (Math.floor(data.list[0].main.humidity) + " " + units().humidPercent));
    wind.text("Wind speed: " + (Math.floor(data.list[0].wind.speed) + units().speed));
    airPressure.text("Air pressure: " + (Math.floor(data.list[0].main.pressure) + units().pressure)); // CONVERSION REQUIRED?!
    tempHigh.text("High temp: " + (Math.floor(data.list[0].main.temp_max) + units().temp));
    tempLow.text("Low temp: " + (Math.floor(data.list[0].main.temp_min) + units().temp));
    // lower-right-side text with 5-day forecast icon, temperature
    var fiveDay = $(".five-day");
    // i++ on h6 elements; *7 on list location (*8 would produce one day short)
    for (var i = 0; i < data.list.length; i ++) { // each day has 8 datasets (3hr-increment updates = 40 datasets per 5 days)
        fiveDay.eq(i).find(".days").text((new Date((data.list[(i+1) * 7].dt) * 1000)).toDateString().split(" ")[0]) // day name
        fiveDay.eq(i).find(".temps").text(Math.floor(data.list[(i+1) * 7].main.temp) + units().temp); // temperature
        fiveDay.eq(i).find(".winds").text(Math.floor(data.list[(i+1) * 7].wind.speed) + units().speed); // wind speed
        fiveDay.eq(i).find(".humidities").text(Math.floor(data.list[(i+1) * 7].main.humidity) + units().humidPercent); // humidity percentage
    }
}

// converts user-proivded CITY NAME to longitude and latitude
function getGeocoordinates(cityName, state, country) {
    var limit = 1; // max number of cities with shared names. possible values: 1-5
    const apiKey = "c6923045c685289a8524ccba359c3265";
    var geoCodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${state},${country}&limit=${limit}&appid=${apiKey}&units=${measurementSystem()}`
    // prevents submitting empty value OR renames URL if state is missing
    if (!cityName) {
        return alert("Please specify a city to continue.");
    } else if (!country) {
        return alert("Please specify a country to continue.");
    } else {
        geoCodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${country}&limit=${limit}&appid=${apiKey}&units=${measurementSystem()}`
    }
    fetch(geoCodeUrl)
    .then(function (response) {
        // add 100-500 error codes? and 200s?
        return response.json();
    })
    .catch(function(error) {
        console.log("An error occurred.");
        console.log(error);
    })
    .then(function (data) {
        console.log(data)
        latitude = data[0].lat;
        longitude = data[0].lon;
        coordinatesWeather(latitude, longitude);
    })
    return [latitude, longitude];
}

// fetch longitude and latitude
function coordinatesWeather(latitude, longitude) {
    const apiKey = "c6923045c685289a8524ccba359c3265";
    const coordinateQueryUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${measurementSystem()}`;
    fetch(coordinateQueryUrl)
    .then(function (response) {
        // add 100-500 error codes? and 200s?
        return response.json();
    })
    .catch(function(error) {
        console.log("An error occurred.");
        console.log(error);
    })
    // linking JSON to DOM
    .then(function (data) {
        console.log(data);
        postWeather(data);
    })
}

// collects city info to put into query
citySearchEl.submit(function(event) {
    event.preventDefault();
    cityName = $("#city-text").val();
    state = $("#state-text").val();
    zip = $("#zip-text").val();
    country = $("#country-text").val();
    // if (!cityName) {
    //     return alert("Please specify a city to continue.");
    // } else if (!country) {
    //     return alert("Please specify a country to continue.");
    // } else {
    //     geoCodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${country}&limit=${limit}&appid=${apiKey}&units=${measurementSystem()}`
    // }
    getGeocoordinates(cityName, state, country);
    window.location.href = "/results.html";
})

/* 
- when you click Search, open next results.html
- save local storage from search
    - localStorage.setItem(cityName, JSON.stringify({
            latitude: latitude,
            longitude: longitude,
            }))
- if localStorage is true, home.html search history d-none to d-flex
- search history list item = local storage key name
        - create a formatting that ensures either all caps or first character capital letter
*/