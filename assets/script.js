//Evoking the constructs

function startDashboard() {
  const APIKey = "bc197aaffd2fa653263bb878af4c2a9d";
  const cityReg = document.getElementById("city-input");
  const goSearch = document.getElementById("search-button");
  const historyClear = document.getElementById("clear-history");
  const nameCity = document.getElementById("city-name");
  const getcurPic = document.getElementById("current-pic");
  const getcurTemp = document.getElementById("temperature");
  const getcurHum = document.getElementById("humidity");4
  const getcurWind = document.getElementById("wind-speed");
  const getcurUV = document.getElementById("UV-index");
  const getHistory = document.getElementById("history");
  let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
  console.log(searchHistory);
  
//Convert temperature from Kelvin to Celcius - This is because we are Canadians!!
function Kel2Cel(K) {
  return Math.floor((K - 273.15) );
}

  
//Use the entry given by the user to display a current weather report including temp, Humidity, Wind Speed and UV Index via the API. Then this is parsed for display.
function getWeather(cityName) {
      let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
      axios.get(queryURL)
      .then(function(response){
          console.log(response);

          const currentDate = new Date(response.data.dt*1000);
          console.log(currentDate);
          const day = currentDate.getDate();
          const month = currentDate.getMonth() + 1;
          const year = currentDate.getFullYear();
          nameCity.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
          let weatherPic = response.data.weather[0].icon;
          getcurPic.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
          getcurPic.setAttribute("alt",response.data.weather[0].description);
          getcurTemp.innerHTML = "Temperature: " + Kel2Cel(response.data.main.temp) + " &#176c";
          getcurHum.innerHTML = "Humidity: " + response.data.main.humidity + "%";
          getcurWind.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
      let lat = response.data.coord.lat;
      let lon = response.data.coord.lon;
      let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
      axios.get(UVQueryURL)
      .then(function(response){
          let UVIndex = document.createElement("span");
          UVIndex.setAttribute("class","badge badge-danger");
          UVIndex.innerHTML = response.data[0].value;
          getcurUV.innerHTML = "UV Index: ";
          getcurUV.append(UVIndex);
      });


      
//Use the entry given by the user to display a current weather report including temp, Humidity, Wind Speed and UV Index via the API. Then this is parsed for display.
      let cityID = response.data.id;
      let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
      axios.get(forecastQueryURL)
      .then(function(response){
          console.log(response);
          const forecastEls = document.querySelectorAll(".forecast");
          for (i=0; i<forecastEls.length; i++) {
              forecastEls[i].innerHTML = "";
              const forecastIndex = i*8 + 4;
              const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
              const forecastDay = forecastDate.getDate();
              const forecastMonth = forecastDate.getMonth() + 1;
              const forecastYear = forecastDate.getFullYear();
              const forecastDateEl = document.createElement("p");
              forecastDateEl.setAttribute("class","mt-3 mb-0 forecast-date");
              forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
              forecastEls[i].append(forecastDateEl);
              const forecastWeatherEl = document.createElement("img");
              forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
              forecastWeatherEl.setAttribute("alt",response.data.list[forecastIndex].weather[0].description);
              forecastEls[i].append(forecastWeatherEl);
              const forecastTempEl = document.createElement("p");
              forecastTempEl.innerHTML = "Temp: " + Kel2Cel(response.data.list[forecastIndex].main.temp) + " &#176c";
              forecastEls[i].append(forecastTempEl);
              const forecastHumidityEl = document.createElement("p");
              forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
              forecastEls[i].append(forecastHumidityEl);
              }
          })
      });  
  }

  goSearch.addEventListener("click",function() {
      const searchTerm = cityReg.value;
      getWeather(searchTerm);
      searchHistory.push(searchTerm);
      localStorage.setItem("search",JSON.stringify(searchHistory));
      renderSearchHistory();
  })

  historyClear.addEventListener("click",function() {
      searchHistory = [];
      renderSearchHistory();
  })


  function renderSearchHistory() {
      getHistory.innerHTML = "";
      for (let i=0; i<searchHistory.length; i++) {
          const historyItem = document.createElement("input");
          historyItem.setAttribute("type","text");
          historyItem.setAttribute("readonly",true);
          historyItem.setAttribute("class", "form-control d-block bg-white");
          historyItem.setAttribute("value", searchHistory[i]);
          historyItem.addEventListener("click",function() {
              getWeather(historyItem.value);
          })
          getHistory.append(historyItem);
      }
  }

  renderSearchHistory();
  if (searchHistory.length > 0) {
      getWeather(searchHistory[searchHistory.length - 1]);
  }

}
startDashboard();