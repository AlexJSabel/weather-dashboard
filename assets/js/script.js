// query selectors for html
var searchBtnEl = document.querySelector("#city-search");
var cityEl = document.querySelector("#city");
var searchedCityName = document.querySelector("#searched-city-name");
var previousSearchContainerEl = document.querySelector("#previous-search-btns");
var updatedForecastEl = document.querySelector("#updated-forecast");
var currentDateEl = document.querySelector("#current-date");
var currentWeatherIconEl = document.querySelector("#weather-icon");
var currentTempEl = document.querySelector("#temperature");
var currentHumidityEl = document.querySelector("#humidity");
var currentWindSpeedEl = document.querySelector("#wind-speed");
var currentUVIndexEl = document.querySelector("#uv-index");
var forecastContainerEl = document.querySelector("#forecast-container");
forecastContainerEl.addClass = "row";
var lastSearchEl;

var savedCities = JSON.parse(localStorage.getItem('cities')) || [];

function buildCity(data) {

    // for each previous search, create new div that shows what was searched for
    var lastSearchEl = document.createElement("div");
    lastSearchEl.setAttribute("id", "previous-search");
    lastSearchEl.innerHTML = data[0].name;
    previousSearchContainerEl.appendChild(lastSearchEl);

    lastSearchEl.addEventListener("click", function() {
        var previousCity = lastSearchEl.innerHTML;
        getWeather(previousCity);
        searchedCityName.innerHTML = previousCity;

    })
}

function buildExistingCities(data) {
    for (var i = 1; i <= localStorage.length; i++) {
        buildCity(data);
    }
}

// create function to get the weather
function getWeather(city) {

    var apiKey = '91d4161a1433d45e7d7152f7adf492fd'

    var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
    // this fetch refers to the lat/lon
    fetch(requestUrl)
        .then(function(response) {
           return response.json()
        })
        .then(function(data){
            if (data.length === 0) {
                defaultPage();

                alert("Invalid name");

            } else {

               
                console.log("location", data);

                if (savedCities.includes(data[0].name)) {
                    console.log('null');
                } else {
                    savedCities.push(data[0].name)

                    localStorage.setItem('cities', JSON.stringify(savedCities));
                    buildExistingCities(data);
                    console.log('make div')
                }


                
                // get date 
                var currentDate = moment().format("(MM/DD/YYYY)");
                console.log("Current date: ", currentDate);
                currentDateEl.innerText = currentDate;

               // lat and long assign to variables
                var lon = data[0].lon
                var lat= data[0].lat
                
                // making url accept lat lon
                var cityWeatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`

                // search for weather
                fetch(cityWeatherUrl)
                    .then(function(response) {
                        return response.json()
                    })
                    .then(function(data) {
                        console.log("weather", data);
    
                        // current day icon
                        var currentWeatherIcon = data.current.weather[0].icon;
                        currentWeatherIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + currentWeatherIcon + "@2x.png");
                       
                        // current day data
                        currentTempEl.innerHTML = data.current.temp + " °F";
                        currentHumidityEl.innerHTML = data.current.humidity + " %";
                        currentWindSpeedEl.innerHTML = data.current.wind_speed + " mph";
    
                        // st uv color with if statement
                        currentUVIndexEl.innerHTML = data.current.uvi; 
                        if (data.current.uvi <= 3) {
                            currentUVIndexEl.style.backgroundColor = "green";
                        } else if (data.current.uvi > 3 && data.current.uvi <= 6) {
                            currentUVIndexEl.style.backgroundColor = "yellow";
                        } else if (data.current.uvi > 6 && data.current.uvi <= 8) {
                            currentUVIndexEl.style.backgroundColor = "orange";
                        } else {
                            currentUVIndexEl.style.backgroundColor = "red";
                        }
    


        })
}

// default blank page
function defaultPage() {
    searchedCityName.innerHTML = "";
    currentDateEl.innerHTML = "";
    currentWeatherIconEl.setAttribute("src", "");
    currentTempEl.innerHTML = "";
    currentHumidityEl.innerHTML = "";
    currentWindSpeedEl.innerHTML = "";
    currentUVIndexEl.innerHTML = "";
    forecastContainerEl.innerHTML = "";

}

