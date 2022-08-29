var searchButton = document.getElementById('searchButton');
var searchCity = document.getElementById('city');
var forecast = document.getElementById('forecast');
var cityList;
if (localStorage.getItem('cityname') === null) {
    cityList = [];
} else {
    cityList = JSON.parse(localStorage.getItem('cityname'));
}
const apiKey = 'cc14ffc03b442925b564b8a1b5bba2c9';

searchButton.addEventListener('click', function () {
    var city = searchCity.value;
    displayWeather(city);
    if (cityList.indexOf(city) === -1) {
        storeCity(city);
        previousSearches(city);
    }

    // console.log('click');
});

function storeCity(cityname) {
    cityList.push(cityname);
    console.log(cityList);
    localStorage.setItem('cityname', JSON.stringify(cityList));
}

function searchHistory() {
    // var savedCities = JSON.parse(localStorage.getItem('cityname'));
    // console.log('this is get item', savedCities);
    for (i = 0; i < cityList.length; i++) {
        previousSearches(cityList[i]);
    }
}

function uvindex(lat, lon) {
    var request2URL =
        'https://api.openweathermap.org/data/2.5/onecall?lat=' +
        lat +
        '&lon=' +
        lon +
        '&units=imperial&appid=' +
        apiKey +
        '&exclude=minutely,hourly,alerts';

    fetch(request2URL)
        .then(function (response2) {
            return response2.json();
        })
        .then(function (data) {
            // console.log('THIS IS UVI DATA', data);
            // console.log(data.current.uvi);
            var currentUVI = document.getElementById('uvi');
            currentUVI.textContent = 'UV INDEX: ' + data.daily[0].uvi;
            displayFiveday(data.daily);
        });
}

function previousSearches(city) {
    var prevSearchEl = document.getElementById('recent');
    var recentSearchBtn = document.createElement('button');
    recentSearchBtn.textContent = city;
    // console.log(recentSearchBtn);
    recentSearchBtn.addEventListener('click', function () {
        console.log(this.innerHTML);
        displayWeather(this.innerHTML);
    });
    prevSearchEl.appendChild(recentSearchBtn);
}

// funtions to fetch API's to show present and future weather
function displayWeather(city) {
    var request1URL =
        'https://api.openweathermap.org/data/2.5/weather?q=' +
        city +
        ',us&units=imperial&appid=' +
        apiKey;

    fetch(request1URL)
        .then(function (response1) {
            return response1.json();
        })

        .then(function (data) {
            var currentTempEl = document.getElementById('temp');
            var currentWindEl = document.getElementById('wind');
            var currentHumidityEl = document.getElementById('humidity');
            var cityname = document.getElementById('cityname');
            var currentDates = moment.unix(data.dt).format('MM/DD/YYYY');
            var imageEl = document.createElement('img');
            var imageIcon = data.weather[0].icon;

            imageEl.src =
                'http://openweathermap.org/img/w/' + imageIcon + '.png';
            cityname.innerHTML = data.name + ' ' + currentDates;
            cityname.appendChild(imageEl);
            currentTempEl.textContent = data.main.temp;
            currentWindEl.textContent = data.wind.speed;
            currentHumidityEl.textContent = data.main.humidity;
            // console.log(data.main.temp);
            // console.log(data.wind.speed);
            // console.log(data.main.humidity);
            uvindex(data.coord.lat, data.coord.lon);
        });
}

function displayFiveday(daily) {
    // console.log(daily);
    forecast.innerHTML = '';
    for (i = 1; i < 6; i++) {
        // console.log(daily[i]);
        // console.log(daily[i].dt);
        // console.log(daily[i].humidity);
        // console.log(daily[i].temp.day);
        // console.log(daily[i].wind_speed);
        // console.log(daily[i].weather[0].icon);
        var subContainer = document.createElement('div');
        subContainer.classList.add('card');
        var dates = document.createElement('p');
        var currentDates = moment.unix(daily[i].dt).format('MM/DD/YYYY');
        // console.log(currentDates);
        dates.textContent = currentDates;
        subContainer.appendChild(dates);

        var imageEl = document.createElement('img');
        imageEl.src =
            'http://openweathermap.org/img/w/' +
            daily[i].weather[0].icon +
            '.png';
        // console.log(imageEl);
        subContainer.appendChild(imageEl);

        var tempEl = document.createElement('p');
        tempEl.textContent = 'temp: ' + daily[i].temp.day + ' F';
        subContainer.appendChild(tempEl);

        var windEl = document.createElement('p');
        windEl.textContent = 'wind speed: ' + daily[i].wind_speed + ' MPH';
        subContainer.appendChild(windEl);

        var humidityEl = document.createElement('p');
        humidityEl.textContent = 'humidity: ' + daily[i].humidity + '%';
        subContainer.appendChild(humidityEl);
        forecast.appendChild(subContainer);
    }
}

searchHistory();