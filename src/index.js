//Date / Time

function formatDate(timestamp) {
  let currentDate = new Date(timestamp);
  let weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = weekDays[currentDate.getDay()];
  let showDay = document.querySelector("#date");
  showDay.innerHTML = day;

  let showTime = document.querySelector("#time");
  showTime.innerHTML = `${formatHours(timestamp)}`;
}

function formatHours(timestamp) {
  let currentDate = new Date(timestamp);
  let hours = currentDate.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = currentDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

//Show WeatherCondition

function displayWeatherCondition(response) {
  let cityElement = document.querySelector("#city");
  let temperature = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#temp-special");
  let iconElement = document.querySelector("#icon");
  cityElement.innerHTML = response.data.name;
  temperatureElement.innerHTML = `${temperature}`;
  celsiusTemperature = temperature;

  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  document.querySelector("#currentMin").innerHTML = Math.round(
    response.data.main.temp_min
  );
  document.querySelector("#currentMax").innerHTML = Math.round(
    response.data.main.temp_max
  );

  document.querySelector(".country").innerHTML = response.data.sys.country;

  document.querySelector("#feelsLike").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#descriptionLong").innerHTML =
    response.data.weather[0].description;

  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].main);
}

//Units

function displayCelsius(event) {
  event.preventDefault();
  celsius.classList.remove("active");
  fahrenheit.classList.add("active");
  let temperatureElement = document.querySelector("#temp-special");
  temperatureElement.innerHTML = celsiusTemperature;
}

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", displayCelsius);

function displayFahrenheit(event) {
  event.preventDefault();
  celsius.classList.add("active");
  fahrenheit.classList.remove("active");
  let fahrenheitTemp = (celsiusTemperature * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temp-special");
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
}

let celsiusTemperature = null;
let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", displayFahrenheit);

//Forecast

function displayForecast(response) {
  let forecastElement = document.querySelector(".forecast");
  forecastElement.innerHTML = null;
  let forecast = null;
  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
          <div class="col-2">
            <img
              src= "http://openweathermap.org/img/wn/${
                forecast.weather[0].icon
              }@2x.png"
                    class="card-img-top"
                    alt="weatherimg"
            />
            <h5 class="card-title">${formatHours(forecast.dt * 1000)}</h5>

            <p class="card-text"> ${Math.round(
              forecast.main.temp_max
            )}° ${Math.round(forecast.main.temp_min)}°</p>
 
        
              </div>`;
  }
  let currentDate = new Date();
  let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = null;
  for (let index = 1; index <= 6; index++) {
    day = weekDays[currentDate.getDay() + index];
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
          <div class="col-2">
            <img
              src= "http://openweathermap.org/img/wn/${
                forecast.weather[0].icon
              }@2x.png"
                    class="card-img-top"
                    alt="weatherimg"
            />
            <h5 class="card-title">${day}</h5>
        
            <p class="card-text"> ${Math.round(
              forecast.main.temp_max
            )}° ${Math.round(forecast.main.temp_min)}°</p>
 
        
              </div>`;
  }
}

//Show City

function searchCity(city) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios
    .get(apiUrl)
    .then(displayWeatherCondition)
    .catch((err) => {
      if (err.response != undefined) {
        if (err.response.status === 404) {
          alert("City not found");
        }
      }
    });

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

//GPS Button

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

function searchLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "metric";
  let apiKey = "8928143376b6d241d15f969b0a4f9c51";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function getPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let searchForm = document.querySelector("form");
searchForm.addEventListener("submit", handleSubmit);

let gpsButton = document.querySelector("#gpsButton");
gpsButton.addEventListener("click", getPosition);

searchCity("Lisbon");
formatDate(Date.now());
