/*
ERRORS
- 401 - did not specify api key in request, wrong key, or fetching disallowed info (paid vs unpaid subscription)
- 404 - wrong city name, ZIP, or city ID. or wrong request format
- 429 - surpassing limit of free subscription
- 500, 502, 503, 504 - CONTACT OpenWeather via email with example of api request that failed
*/

const searchBtn = $("#search-button")
const clearHistoryEl = $(".clear-history");
const clearHomeEl = $(".clear-home");
var cityName = "";
var buttonCity = "";
var homeAddress = [];
// var zip = "";
var state = "";
var country = "";
var toggle;
var latitude = "";
var longitude = "";
var cityHistory = [];
var lastCity = [];

// changes view to results page
function changeToResultsHtml() {
    window.location.pathname = ("./results.html") // testing locally
    // window.location.pathname = ("./five-day-weather-forecast/results.html") // format for live page
}

// changes view to home page
function changeToLandingHtml() {
    window.location.pathname = ("./index.html") // testing locally
    // window.location.pathname = ("./five-day-weather-forecast/") // format for live page
}

// get string from localStorage with proper noun capitalization
function capitalizeFirstLetter(string) {
    var upperCase = string.split(" ");
    var prettyCity = [];
    for (var i = 0; i < upperCase.length; i++) {
        prettyCity.push(upperCase[i].charAt(0).toUpperCase() + upperCase[i].slice(1));
    }
    return prettyCity.join(" ");
}

// checks if search is a duplicate and where in localStorage index location duplicate is found
function duplicateCheck(cityName) {
    var matchingCity = false; // placeholder true/false
    var citiesStorage = JSON.parse(localStorage.getItem("history"));
    if (citiesStorage === null) {
        return false;
    }
    // scans array of objects to see if city name is repeated. set to true if found repeated/duplicate values
    for (var m = 0; m < citiesStorage.length; m++) { 
        if (cityName === (citiesStorage[m]).city) {
            matchingCity = true;
            break
        }
    }
    return [matchingCity, m] // true means found a match, false means no match found
}

// returns true or false if a city is matched or not matched to localStorage
function repeatCity(cityName) {
    let matchCheck = duplicateCheck(cityName);
    const matchedCity = matchCheck[0];
    return matchedCity;
}

// returns index number from localStorage of desired previously-searched city
function storageLocation(cityName) {
    let matchCheck = duplicateCheck(cityName);
    const matchedIndex = matchCheck[1];
    return matchedIndex;
}

// adds text and event listeners to sidebar
function populateSidebar() {
    var parentListEl = $(".past-cities-landing"); // parent container of landing page list
    var childListEl = $(".home-search-item") // class of items added to/removed from landing page list
    var citiesStorage = JSON.parse(localStorage.getItem("history"));
    if (citiesStorage) {
        childListEl.remove(); // resets container to empty before changes
    }
    for (var i = 0; i < citiesStorage.length; i++) {
        var cityItem = $("<li>", {
            class: "home-search-item nav-item",
        })
        parentListEl.append(cityItem);
        var anchor = $("<a>", {
            href: "#",
            class: "home-search-item bg-info text-dark text-center nav-link active px-4",
            id: "city-button-"+ i,
            ariaCurrent: "page",
            text: capitalizeFirstLetter((citiesStorage[i]).city)
        })
        cityItem.append(anchor);
        // creates event listener per search history item that retrieves city name text of button
        // var historyButtonEl = $("#city-button-" + i);
        // historyButtonEl.click(function(event) {
        //     event.preventDefault();
        //     if (window.location.pathname === ("./five-day-weather-forecast/")) {
        //         changeToResultsHtml();
        //     }
        //     // retrieves button text as lowercase and finds the matching localStorage object to be reused
        //     var newIndex = storageLocation($(this).text().toLowerCase()); // retrieves localStorage index location of city
        //     weatherAtGeneralCoordinates((citiesStorage[newIndex]).geolocation[0], (citiesStorage[newIndex]).geolocation[1]);
        // })
        // on page refresh, shows random weather in local storage based on this for loop, probably...
        // this code will eventually be removed, see below
        // weatherAtGeneralCoordinates(((citiesStorage[i]).geolocation[0]), ((citiesStorage[i]).geolocation[1]));
    }
    /* 
    This is where code needs to be added, inside the for loop. 
    Make a new localStorage keyword called "here". 
    Store buttonclick lat and lon in an object using the same format as "Home City," where adding a new value removes the old value.
    Then use localStorage "here" to persist on the page after a refresh
    */
}

function mostRecentSearch() {
    // localStorage for HOME or GENERAL SEARCH
    if ($(".form-check-input").prop("checked")) { // home selected
        // setup localStorage for home address
        var mostRecent = {
            mostRecentCity: cityName,
            geolocation: [latitude, longitude]
        }
        lastCity = JSON.parse(localStorage.getItem("most-recent"));
        if (lastCity === null) {
            lastCity = []; // resets value to [] instead of localStorage.getItem
            lastCity.push(mostRecent);
        } else {
            lastCity.splice(0, 1, mostRecent); // replaces previous home location
        }
        localStorage.setItem("most-recent", (JSON.stringify(lastCity)));
        weatherAtGeneralCoordinates(latitude, longitude); // get weather from local storage
    }
    // if history localStorage has values, make the event listeners on the buttons
    var citiesStorage = JSON.parse(localStorage.getItem("history"));
    if (citiesStorage) {
        for (var i = 0; i < citiesStorage.length; i++) {
            var historyButtonEl = $("#city-button-" + i);
            historyButtonEl.click(function(event) {
                event.preventDefault();
                if (window.location.pathname === ("./five-day-weather-forecast/")) {
                    changeToResultsHtml();
                }
                // retrieves button text as lowercase and finds the matching localStorage object to be reused
                var newIndex = storageLocation($(this).text().toLowerCase()); // retrieves localStorage index location of city
                weatherAtGeneralCoordinates((citiesStorage[newIndex]).geolocation[0], (citiesStorage[newIndex]).geolocation[1]); // get weather from local storage!!!!
            })
        }
    }
    // collects city info from landing page to put into query
    searchBtn.click(function(event) {
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
    // save value from mostRecentSearch to new localStorage keyword: most-recent
}

// hide-show search history and home weather updates on landing page
function showHide() {
    var sidebar = $("#sidebar-home"); // entire sidebar
    var citiesStorage = JSON.parse(localStorage.getItem("history"));
    if (citiesStorage) {
        populateSidebar();
        sidebar.show();
    } else {
        sidebar.hide();
    }
    mostRecentSearch()
}
showHide(); // run on page load

function showHideHome() {
    // hide-show home city on landing page
    var homeStorage = JSON.parse(localStorage.getItem("home"));
    if (homeStorage /*&& (window.location.pathname === "./index.html")*/) { // if home city exists in local storage (and viewing homepage. this part does not behave as intended)
        $(".home-weather").show();
        weatherAtHomeCoordinates((homeStorage[0].geolocation[0]), (homeStorage[0].geolocation[1]));
    } else {
        $(".home-weather").hide();
    }
}
showHideHome();
setInterval(showHideHome, 60001); // refreshes home city weather every 10min

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

// adds specific fetch data to HTML's home city
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
    city.text(data.city.name + ", " + data.city.country);
    description.text(data.list[0].weather[0].description);
    var icon = data.list[0].weather[0].icon;
    var iconEl = $("#today-icon");
    iconEl.attr("src", `https://openweathermap.org/img/wn/${icon}@2x.png`);
    var temperature = $("#temp");
    temperature.text(Math.floor(data.list[0].main.temp) + units().temp);
    // upper-right-side text with humidity, wind, air pressure, high, low
    var humidity = $("#humidity");
    var wind = $("#wind");
    var airPressure = $("#air-pressure");
    var tempHigh = $("#high-temp");
    var tempLow = $("#low-temp");
    humidity.text("Humidity: " + (Math.floor(data.list[0].main.humidity) + " " + units().humidPercent)); // humidity
    wind.text("Wind speed: " + (Math.floor(data.list[0].wind.speed) + units().speed)); // wind speed
    airPressure.text("Air pressure: " + (Math.floor(data.list[0].main.pressure) + units().pressure)); // barometric pressure
    tempHigh.text("High temp: " + (Math.floor(data.list[0].main.temp_max) + units().temp)); // high temp
    tempLow.text("Low temp: " + (Math.floor(data.list[0].main.temp_min) + units().temp)); // low temp
    // lower-right-side text with 5-day forecast icon, temperature
    var fiveDay = $(".five-day");
    // i++ on h6 elements
    // ((i+1)*8)-1 on list location (+1 to begin at next day, i.e. tomorrow; -1 to stop at last index location 39 instead of going to 40)
    // .length is /8 to get 5 days since each day has 8 datasets (3hr-increment updates = 40 datasets per 5 days)
    for (var i = 0; i < (data.list.length)/8; i ++) { 
        icon = data.list[((i+1)*8) - 1].weather[0].icon; // icon code
        fiveDay.eq(i).find(".icons").attr("src", `https://openweathermap.org/img/wn/${icon}@2x.png`) // weather icon
        fiveDay.eq(i).find(".days").text((new Date((data.list[((i+1)*8) - 1].dt) * 1000)).toDateString().split(" ")[0]) // weekday
        fiveDay.eq(i).find(".temps").text(Math.floor(data.list[((i+1)*8) - 1].main.temp) + units().temp); // temperature
        fiveDay.eq(i).find(".winds").text(Math.floor(data.list[((i+1)*8) - 1].wind.speed) + units().speed); // wind speed
        fiveDay.eq(i).find(".humidities").text(Math.floor(data.list[((i+1)*8) - 1].main.humidity) + units().humidPercent); // humidity percentage
    }
}

// adds specific fetch data to HTML's general search city
function postGeneralWeather(data) {
    // left-side image with date, city, temp, description
    var weekday = $("#weekday-general");
    var monthDate = $("#month-date-general");
    var city = $("#city-name-general");
    var description = $("#weather-event-general");
    // sets HTML in left-side
    weekday.text(dayjs().format("dddd"));
    monthDate.text(dayjs().format("MMMM Do"));
    city.text(data.city.name + ", " + data.city.country);
    description.text(data.list[0].weather[0].description);
    var icon = data.list[0].weather[0].icon;
    var iconEl = $("#today-icon-general");
    iconEl.attr("src", `https://openweathermap.org/img/wn/${icon}@2x.png`);
    var temperature = $("#temp-general");
    temperature.text(Math.floor(data.list[0].main.temp) + units().temp);
    // upper-right-side text with humidity, wind, air pressure, high, low
    var humidity = $("#humidity-general");
    var wind = $("#wind-general");
    var airPressure = $("#air-pressure-general");
    var tempHigh = $("#high-temp-general");
    var tempLow = $("#low-temp-general");
    humidity.text("Humidity: " + (Math.floor(data.list[0].main.humidity) + " " + units().humidPercent)); // humidity
    wind.text("Wind speed: " + (Math.floor(data.list[0].wind.speed) + units().speed)); // wind speed
    airPressure.text("Air pressure: " + (Math.floor(data.list[0].main.pressure) + units().pressure)); // barometric pressure
    tempHigh.text("High temp: " + (Math.floor(data.list[0].main.temp_max) + units().temp)); // high temp
    tempLow.text("Low temp: " + (Math.floor(data.list[0].main.temp_min) + units().temp)); // low temp
    // lower-right-side text with 5-day forecast icon, temperature
    var fiveDay = $(".five-day-general");
    // i++ on h6 elements
    // ((i+1)*8)-1 on list location (+1 to begin at next day, i.e. tomorrow; -1 to stop at last index location 39 instead of going to 40)
    // .length is /8 to get 5 days since each day has 8 datasets (3hr-increment updates = 40 datasets per 5 days)
    for (var i = 0; i < (data.list.length)/8; i ++) { 
        icon = data.list[((i+1)*8) - 1].weather[0].icon; // icon code
        fiveDay.eq(i).find(".icons-general").attr("src", `https://openweathermap.org/img/wn/${icon}@2x.png`) // weather icon
        fiveDay.eq(i).find(".days-general").text((new Date((data.list[((i+1)*8) - 1].dt) * 1000)).toDateString().split(" ")[0]) // weekday
        fiveDay.eq(i).find(".temps-general").text(Math.floor(data.list[((i+1)*8) - 1].main.temp) + units().temp); // temperature
        fiveDay.eq(i).find(".winds-general").text(Math.floor(data.list[((i+1)*8) - 1].wind.speed) + units().speed); // wind speed
        fiveDay.eq(i).find(".humidities-general").text(Math.floor(data.list[((i+1)*8) - 1].main.humidity) + units().humidPercent); // humidity percentage
    }
}

// fetch longitude and latitude of home city
function weatherAtHomeCoordinates(latitude, longitude) {
    const apiKey = "c6923045c685289a8524ccba359c3265";
    const coordinateQueryUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${measurementSystem()}`;
    fetch(coordinateQueryUrl)
    .then(function (response) {
        // add 100-500 error codes? and 200s?
        return response.json();
    })
    .catch(function(error) {
        console.log("An error occurred here: weatherAtHomeCoordinates.");
        console.log(error);
    })
    // linking JSON to DOM
    .then(function (data) {
        postHomeWeather(data);
    })
}

// fetch longitude and latitude of general city search
function weatherAtGeneralCoordinates(latitude, longitude) {
    const apiKey = "c6923045c685289a8524ccba359c3265";
    const coordinateQueryUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${measurementSystem()}`;
    fetch(coordinateQueryUrl)
    .then(function (response) {
        // add 100-500 error codes? and 200s?
        return response.json();
    })
    .catch(function(error) {
        console.log("An error occurred here: weatherAtGeneralCoordinates.");
        console.log(error);
    })
    // linking JSON to DOM
    .then(function (data) {
        postGeneralWeather(data);
    })
}

// converts user-proivded CITY NAME to longitude and latitude
function saveGeoCoordinates(cityName, state, country) {
    var limit = 1; // max number of cities with shared names. possible values: 1-5
    const apiKey = "c6923045c685289a8524ccba359c3265";
    var geoCodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName},${state},${country}&limit=${limit}&appid=${apiKey}&units=${measurementSystem()}`
    // prevents submitting empty value OR renames URL if state is missing
    if (!state) {
        geoCodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName},${country}&limit=${limit}&appid=${apiKey}&units=${measurementSystem()}`
    }
    fetch(geoCodeUrl)
    .then(function (response) {
        // add 100-500 error codes? and 200s?
        return response.json();
    })
    .catch(function(error) {
        console.log("An error occurred here: saveGeoCoordinates.");
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
            // prevent home city from being added to other searches, and doesn't break if home city hasn't been set yet
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
            // check if search is a duplicate before pushing to localStorage
            if (!(repeatCity(cityName))) { // if false
            // if (!(duplicateCheck(cityName))) { // if false
                cityHistory.push(searchLocation);
                localStorage.setItem("history", JSON.stringify(cityHistory));
            }
            weatherAtGeneralCoordinates(latitude, longitude);
            changeToResultsHtml();
        }
    })
}


// // collects city info from landing page to put into query
// searchBtn.click(function(event) {
//     event.preventDefault();    
//     cityName = $("#city-text").val();
//     state = $("#state-text").val();
//     // zip = $("#zip-text").val();
//     country = $("#country-text").val();
//     if (!cityName) {
//         return alert("Please specify a city to continue.");
//     } else if (!country) {
//         return alert("Please specify a country to continue.");
//     } else {
//         saveGeoCoordinates(cityName.toLowerCase(), state, country);
//     }
// })

clearHistoryEl.click(function() {
    localStorage.removeItem("history");
    changeToLandingHtml();
    showHide();
})

clearHomeEl.click(function() {
    localStorage.removeItem("home");
    showHide();
})

$("#back").click(function(event) {
    event.preventDefault();
    changeToLandingHtml();
})