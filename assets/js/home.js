/*
- auto update interval: every 10 minutes

ERRORS
- 401 - did not specify api key in request, wrong key, or fetching disallowed info (paid vs unpaid subscription)
- 404 - wrong city name, ZIP, or city ID. or wrong request format
- 429 - surpassing limit of free subscription
- 500, 502, 503, 504 - CONTACT OpenWeather via email with example of api request that failed
*/

const citySearchHomeEl = $(".city-search-home");
const citySearchResultsEl = $(".city-search-results");
var cityName = "";
var homeAddress = [];
// var zip = "";
var state = "";
var country = "";
var toggle;
var latitude = "";
var longitude = "";
var cityHistory = [];

// get string from localStorage with proper noun capitalization
function capitalizeFirstLetter(string) {
    var upperCase = string.split(" ");
    var prettyCity = [];
    for (var i = 0; i < upperCase.length; i++) {
        prettyCity.push(upperCase[i].charAt(0).toUpperCase() + upperCase[i].slice(1));
    }
    return prettyCity.join(" ");
  }

// function landingShowHideHome() {
//     // hide-show home city on landing page
//     var homeStorage = JSON.parse(localStorage.getItem("home"));
//     if (homeStorage) { // if it exists
//         $(".home-weather").show();
//         weatherAtHomeCoordinates(homeStorage[0].geolocation[0], homeStorage[0].geolocation[1]);
//     } else {
//         $(".home-weather").hide();
//     }
// }

// hide-show search history on home page
function landingShowHide() {
    // hide-show search history on landing page
    var sidebarListEl = $(".past-cities-home");
    var listEl = $(".past-cities-home");
    var citiesStorage = JSON.parse(localStorage.getItem("history"));
    if (citiesStorage) {
        $(".search-history-item").remove(); // reset container to empty before changes
        sidebarListEl.show();
        for (var i = 0; i < citiesStorage.length; i++) {
            var cityItem = $("<li>", {
                class: "search-history-item nav-item",
            })
            listEl.append(cityItem);
            var anchor = $("<a>", {
                href: "#",
                class: "search-history-item nav-link active px-4",
                ariaCurrent: "page",
                text: capitalizeFirstLetter((citiesStorage[i]).city)
            })
            cityItem.append(anchor);
        }
    } else {
        sidebar.hide();
    }
    // hide-show home city on landing page
    var homeStorage = JSON.parse(localStorage.getItem("home"));
    if (homeStorage) { // if it exists
        $(".home-weather").show();
        weatherAtHomeCoordinates(homeStorage[0].geolocation[0], homeStorage[0].geolocation[1]);
    } else {
        $(".home-weather").hide();
    }
}
landingShowHide()

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

// // adds specific data to HTML
function postHomeWeather(data) {
    if (homeAddress) {
        $(".home-weather").show();
    }
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
    iconEl.attr("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);
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
    for (var i = 0; i < (data.list.length)/8; i ++) { // .length is /8 to get 5 days since each day has 8 datasets (3hr-increment updates = 40 datasets per 5 days)
        icon = data.list[(i+1) * 7].weather[0].icon;
        fiveDay.eq(i).find(".icons").attr("src", `http://openweathermap.org/img/wn/${icon}@2x.png`)
        fiveDay.eq(i).find(".days").text((new Date((data.list[(i+1) * 7].dt) * 1000)).toDateString().split(" ")[0]) // day name (has TypeError: Cannot read properties of undefined (reading 'dt'))
        fiveDay.eq(i).find(".temps").text(Math.floor(data.list[(i+1) * 7].main.temp) + units().temp); // temperature
        fiveDay.eq(i).find(".winds").text(Math.floor(data.list[(i+1) * 7].wind.speed) + units().speed); // wind speed
        fiveDay.eq(i).find(".humidities").text(Math.floor(data.list[(i+1) * 7].main.humidity) + units().humidPercent); // humidity percentage
    }
}

// fetch longitude and latitude
function weatherAtHomeCoordinates(latitude, longitude) {
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
        postHomeWeather(data);
    })
}

// converts user-proivded CITY NAME to longitude and latitude
function saveGeoCoordinates(cityName, state, country) {
    var limit = 1; // max number of cities with shared names. possible values: 1-5
    const apiKey = "c6923045c685289a8524ccba359c3265";
    var geoCodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${state},${country}&limit=${limit}&appid=${apiKey}&units=${measurementSystem()}`
    // prevents submitting empty value OR renames URL if state is missing
    if (!state) {
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
        latitude = data[0].lat;
        longitude = data[0].lon;
        // localStorage for HOME or GENERAL SEARCH
        if ($(".form-check-input").prop("checked")) { // home selected
            // setup localStorage for home address
            var homeLocation = {
                homeCity: cityName,
                geolocation: [latitude, longitude]
            }
            homeAddress = JSON.parse(localStorage.getItem("home"));
            if (homeAddress === null) {
                homeAddress = []; // resets value to [] instead of localStorage.getItem
                homeAddress.push(homeLocation);
            } else {
                homeAddress.splice(0, 1, homeLocation); // replaces previous home location
            }
            localStorage.setItem("home", (JSON.stringify(homeAddress)));
            weatherAtHomeCoordinates(latitude, longitude);
        } else { // home not selected, thus general search
            // prevent home city from being added to other searches, and doesn't brake if home city hasn't been set yet
            if (((JSON.parse(localStorage.getItem("home"))) !== null) && (cityName === ((JSON.parse(localStorage.getItem("home")))[0]).homeCity)) {
                return
            }
            // setup localStorage for city history
            var searchLocation = {
                city: cityName,
                geolocation: [latitude, longitude]
            }
            cityHistory = JSON.parse(localStorage.getItem("history")); // history is localStorage key word
            if (cityHistory === null) {
                cityHistory = []; // resets value to [] instead of localStorage.getItem
            }
            var flag = false; // placeholder true/false
            for (var i = 0; i< cityHistory.length; i++) { // scan array of objects to see if city name is repeated. set to true if found repeated values
                if (cityName === cityHistory[i].city) {
                    flag = true;
                    break
                }
            }
            if (!flag) { // if false
                cityHistory.push(searchLocation);
                localStorage.setItem("history", JSON.stringify(cityHistory));
            }
        }
    })
}

// collects city info from landing page to put into query
citySearchHomeEl.click(function(event) {
    event.preventDefault();    
    cityName = $("#city-text").val();
    state = $("#state-text").val();
    // zip = $("#zip-text").val();
    country = $("#country-text").val();
    if (!cityName) {
        return alert("Please specify a city to continue.");
    } else if (!country) {
        return alert("Please specify a country to continue.");
    } else {
        saveGeoCoordinates(cityName.toLowerCase(), state, country);
    }
})

const clearHistoryEl = $(".clear-history");
const clearHomeEl = $(".clear-home");

clearHistoryEl.click(function() {
    localStorage.removeItem("history");
    landingShowHide();
})

clearHomeEl.click(function() {
    localStorage.removeItem("home");
    landingShowHide();
})