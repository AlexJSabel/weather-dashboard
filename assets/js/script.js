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

    var apiKey = 'fef5e65c3470b94af62f84b03235dd31'

    var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
    // this fetch refers to the lat/lon
    fetch(requestUrl)
        .then(function(response) {
           return response.json()
        })
        .then(function(data){
            if (data.length === 0) {
                defaultPage();

                alert("Please check your spelling!");

            } else {

               
                console.log("location", data);

                if (savedCities.includes(data[0].name)) {
                    console.log('Do nothing');
                } else {
                    savedCities.push(data[0].name)

                    localStorage.setItem('cities', JSON.stringify(savedCities));
                    buildExistingCities(data);
                    console.log('make div')
                }


                
                // get current date and set to appropriate hmtl element
                var currentDate = moment().format("(MM/DD/YYYY)");
                console.log("Current date: ", currentDate);
                currentDateEl.innerText = currentDate;

                // initialize variables to get data from fetch for lat and lon
                var lon = data[0].lon
                var lat= data[0].lat
                
                // input url to get city weather concatenated with lat and lon
                var cityWeatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`

                // using lat/lon, search for weather
                fetch(cityWeatherUrl)
                    .then(function(response) {
                        return response.json()
                    })
                    .then(function(data) {
                        console.log("weather", data);
    
                        // set weather icon for current day
                        var currentWeatherIcon = data.current.weather[0].icon;
                        currentWeatherIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + currentWeatherIcon + "@2x.png");
                       
                        // set data for current day
                        currentTempEl.innerHTML = data.current.temp + " °F";
                        currentHumidityEl.innerHTML = data.current.humidity + " %";
                        currentWindSpeedEl.innerHTML = data.current.wind_speed + " mph";
    
                        // set uv index logic for current day
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
    
                        // loop through creating the card for each data value needed for card
                        function addCards() {
    
                            // clear out any info when search initiated again
                            forecastContainerEl.innerHTML = "";
    
                            // dynamically created elements for 5 day forecast
                            for (i= 0; i <=4; i++) {
                                // create a new card
                                var newCard = document.createElement("div");
                                newCard.className = "card";
                                newCard.setAttribute("id", "card-style");
                                forecastContainerEl.appendChild(newCard);
    
                                // create the card body for card
                                var cardBody = document.createElement("div");
                                cardBody.className = "card-body";
    
                                // create title element for card
                                var cardTitle = document.createElement("h5");
                                cardTitle.className = "day-title";
                                var currentDate = moment().add(i + 1, 'days').format("(MM/DD/YYYY)");
                                cardTitle.innerHTML = currentDate;
    
                                // create img element for card
                                var cardIcon = document.createElement("img");
                                cardIcon.className = "day-icon";
                                var dailyWeatherIcon = data.daily[i].weather[0].icon;
                                cardIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + dailyWeatherIcon + "@2x.png");
    
                                // create temp element for card
                                var cardTemp = document.createElement("p");
                                cardTemp.className = "day-temp";
                                cardTemp.innerHTML = "Temp: " + data.daily[i].temp.max + " °F";
    
                                // create wind element for card
                                var cardWind = document.createElement("p");
                                cardWind.className = "day-wind";
                                cardWind.innerHTML = "Wind: " + data.daily[i].wind_speed + "mph";
    
                                // create humidity element for card
                                var cardHumidity = document.createElement("p");
                                cardHumidity.className = "day-humidity";
                                cardHumidity.innerHTML = "Humidity: " + data.daily[i].humidity + "%";
    
    
                                // append elements to each card
                                newCard.appendChild(cardBody);
                                cardBody.appendChild(cardTitle);
                                cardBody.appendChild(cardIcon);
                                cardBody.appendChild(cardTemp);
                                cardBody.appendChild(cardWind);
                                cardBody.appendChild(cardHumidity);
    
                            }
    
                        }
    
                        addCards();
    
                    })


            }

        })
}

function searchForCityClick(event) {
    event.preventDefault();

    // get value from input and set to appropriate html element
    var searchedCity = cityEl.value;
    getWeather(searchedCity);
    searchedCityName.innerHTML = searchedCity;

}

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

// when search button is clicked, run this function
searchBtnEl.addEventListener("click", searchForCityClick);
