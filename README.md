# 5-day-weather-forecast
server-side API provided by OpenWeather

## Description
This weather app fetches data from an OpenWeather API and presents it to the user

## Features 

- landing page displays static text with easy to read instructions on how to get started
- form inputs have placeholder text prompts on how to use
- imperial / metric toggle allows specifying units of measurement before search
- set as home checkbox allows saving a home address, which provides updated weather in a 10 min interval
- home city can be set and reset or cleared entirely as needed
- home city is visible or hidden on landing page depending on if it is set
- searching cities other than home city redirects to a results page
- search history sidebar displays previously searched cities with clickable buttons
- search history buttons display weather of given city when clicked


## Roadmap
Content will be added and adjusted as new coding projects are available! Some projects may phase out over time as my work becomes more specialized. Some desired features and functionality to be added in the future:
- persisting most recent search on screen after refresh
    1. Create a third localStorage keyword that stores the last / most recent search item (excluding Home City)
    2. Adjust functions that collect and post weather to focus on this new localStorage key. Remove references to other localStorage keys from functions that post weather to the screen
    3. This new localStorage keyword collects data from form submit and search history button click
    4. A new form submit or button click overwrites the stored data, similar to how the Home City can be overwritten
- adapting weather card background image depending on main weather event: 
    - thunderstorm (current image)
    - drizzle or rain
    - snow
    - clear
    - clouds
    - atmosphere
- mobile-friendly responsive view using Bootstrap classes and breakpoints
- live update of units of measure when switching toggle back and forth between imperial and metric systems instead of measurements set on search


## Credits

Documentation referenced:
- Mozilla Developer Network
- Slack Overflow forums
- Day.js.org
- Bootstrap
- OpenWeather

Tutorials referenced:
- Samantha Ming, [SamanthaMing.com](https://www.samanthaming.com/tidbits/86-window-location-cheatsheet/) - window location
- Moomez Blog, [YouTube](https://www.youtube.com/watch?v=Atc0qPkDeKM) - Bootstrap toggle
- [JavaScriptTutorial.net](https://www.javascripttutorial.net/javascript-return-multiple-values/) - returning multiple values from one function

Tutor credit:
- Alexis San Javier [GitHub](https://github.com/code-guy21)
    - value of utils.js file
    - Bootstrap vs jQuery values - Bootstrap overrides jQuery if the file loads last in HTML
    - destructuring discussions
    - comparison functions work most consistently with all lowercase
    - [JS URL functions](https://javascript.info/url)
- Mia Dilberovic [GitHub](https://github.com/Dilberovicka31) - how to organize HTML to pair with jQuery methods .append() versus .text()

U Penn Bootcamp study groups: 
- [Fredrick Chang](https://github.com/LearnedDr)
- [Stevie O'Connell](https://github.com/OConnell-Coder)
- [Josh Eflin](https://github.com/JoshEflin)
- [Dan Gardner](https://github.com/gardnerd06)

U Penn Bootcamp instructor(s): Dan Gross

Artists: 
- Jonathan Bowers [Unsplash.com](Unsplash.com) - thunderstorm photograph

Weather data provided by [OpenWeather](https://openweathermap.org/) ![OpenWeather logo with setting sun over open water](./assets/images/OpenWeather-Master-Logo%20RGB2.png)


## License 

 Please refer to the LICENSE in the repo.