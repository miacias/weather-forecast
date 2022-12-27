const apiKey = c6923045c685289a8524ccba359c3265;
const city; // store user input in this var as a query. state and country need to be specified as well
const queryUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

/*
set up user city input so that fetch will work
*/

fetch(queryUrl)


