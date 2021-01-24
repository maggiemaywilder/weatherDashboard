// button variables
var submitBtn = document.getElementById('submitBtn');


// variables for locations on the page
var dateTime = document.querySelector('.dateTime h2');
var degrees = document.getElementById('temp');
var moisture = document.getElementById('humidity');
var windSpeed = document.getElementById('wind');
var UVindex = document.getElementById('uv');
var fiveDay = document.getElementById('dayCards');

function displayHistory () {
    console.log("doing this");
    if(localStorage.getItem('listedHistory') != null) {
        var previous = JSON.parse(localStorage.getItem('listedHistory'));
        for(var i = 0; i < previous.length; i++) {
            var list = document.getElementById('historyList');            
            var historyDiv = document.createElement('div');
            var listItem = previous[i];
            // listItem.style.textTransform = 'capitalize';
            var locale = document.createTextNode(listItem);
            console.log(locale);
            historyDiv.appendChild(locale);
            list.append(historyDiv);
        }
    }
}
var go = displayHistory();

// weather icon url example: http://openweathermap.org/img/wn/10d@2x.png
// call functions in javascript 
function firstCall() {
    var city = document.getElementById('cityInput').value;
    var apiKey = "ef409ac368d4ab00dfe422c92cd5522f";
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
        .then(function(res){
            return res.json();
        }).then(function(res){
            var place = city;
            var data = res;
            locationDisplay(place, data);
            secondCall(data);
        }).catch(function(){
            dateTime.textContent = city;
            dateTime.style.textTransform = 'capitalize';
            dateTime.append(' not found.');
        })
}
// takes response from first call to get latitude and longitude
function secondCall(latLong) {
    var lat = latLong.coord.lat;
    var lon = latLong.coord.lon;
    var apiKey = "ef409ac368d4ab00dfe422c92cd5522f";
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apiKey}&units=imperial`)
        .then(function(res){
            return res.json();
        }).then(function(res){
            var info = res;
            uvIndex(info);
            secondDisplay(info);
        });
};

// display functions
function locationDisplay(spot, stats) {
    dateTime.textContent = spot;
    dateTime.style.textTransform = "capitalize";
    var d = new Date();
    var today = (d.getMonth() + 1) + "/" + (d.getDate()) + "/" + (d.getFullYear());
    dateTime.append(" " + today);
    degrees.textContent = ('Temperature: ' + stats.main.temp + '\u00B0F');
    moisture.textContent = ('Humidity: ' + stats.main.humidity + '%');
    windSpeed.textContent = ('Wind Speed: ' + stats.wind.speed + ' MPH');
}

function uvIndex(stuff) {
    UVindex.textContent = ('UV Index: ');
    var index = stuff.daily[0].uvi;
    var element = document.createElement('BUTTON');
    var text = document.createTextNode(index);
    if(index <= 2) {
        element.className = "btn btn-primary";
    } else if (index >= 2 && index < 6) {
        element.className = "btn btn-warning";
    } else {element.className = "btn btn-danger"}
    element.appendChild(text);
    UVindex.append(element);
};

function secondDisplay(forward) {
    for (var i = 1; i < 6; i++) {
        var d2 = new Date();
        var card = fiveDay.children[i-1];
        var tomorrow = (d2.getMonth() + 1) + "/" + (d2.getDate()+i) + "/" + (d2.getFullYear());
        card.children[0].children[0].textContent = tomorrow;
        var a = card.children[0].children[1];
        var icon = forward.daily[i].weather[0].icon;
        var someLink = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        a.innerHTML = '<img src="' + someLink + '">';
        var tempSpot = card.children[0].children[2];
        tempSpot.textContent = ('Temperature: ' + forward.daily[i].temp.day + '\u00B0F');
        var humSpot = card.children[0].children[3];
        humSpot.textContent = ('Humidity: ' + forward.daily[i].humidity + '%');
        
    } 
    
}

function historyList () {
    // value input for location
    var place = document.getElementById('cityInput').value;
    console.log(place);
    // if no cities saved, save an empty array
    if(localStorage.getItem('listedHistory') == null) {
        localStorage.setItem('listedHistory', '[]');
    } 
    // getting local storage to populate list and then update
    var existingList = JSON.parse(localStorage.getItem('listedHistory'));
    if(existingList.includes(place)) {
        localStorage.setItem('listedHistory', JSON.stringify(existingList));
    } else {
        existingList.push(place);
        if(existingList.length > 5) {
            existingList.shift();
    } localStorage.setItem('listedHistory', JSON.stringify(existingList));    
    }
    displayHistory();
}
    

// Need to look at available images and icons for response cards
submitBtn.addEventListener("click", firstCall);
submitBtn.addEventListener("click", historyList);
// body.addEventListener('load', displayHistory);
