// $(document).ready(function() {
// button variables
var submitBtn = document.getElementById('submitBtn');
var degrees = document.getElementById('temp');
var moisture = document.getElementById('humidity');
var windSpeed = document.getElementById('wind');
var UVindex = document.getElementById('uv');

// variables for locations on the page
var dateTime = document.querySelector('.dateTime h2');

// weather icon url: http://openweathermap.org/img/wn/10d@2x.png
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
        }).catch(function(res){
            dateTime.textContent = city;
            dateTime.style.textTransform = 'capitalize';
            dateTime.append(' not found.');
            var error
        })
}
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
            console.log(res);
        });
};


// display functions
function locationDisplay(spot, stats) {
    dateTime.textContent = spot;
    dateTime.style.textTransform = "capitalize";
    var d = new Date();
    var today = (d.getMonth() + 1) + "/" + (d.getDate() + "/" + (d.getFullYear()));
    dateTime.append(" " + today);
    degrees.textContent = ('Temperature: ' + stats.main.temp + '\u00B0F');
    moisture.textContent = ('Humidity: ' + stats.main.humidity + '%');
    windSpeed.textContent = ('Wind Speed: ' + stats.wind.speed + ' MPH');
}
    // colors = [#43B91E, #FCC721, #FB741B, #F81116, #866FFF] identified by https://imageresizer.com/color-picker from chart at http://www.foresthillweather.com/images/UV/UVdesc-final.gif

function uvIndex(stuff) {
    UVindex.textContent = ('UV Index: ');
    var index = stuff.daily[0].uvi;
    var element = document.createElement("BUTTON");
    var text = document.createTextNode(index);
    if(index <= 2) {
        element.setAttribute('style','background-color:43B91E;border-radius:5px;border-style:solid;border-color:43B91E');
    } else if (index >= 3 && index < 6) {
        element.setAttribute('style','background-color:FCC721;border-radius:5px;border-style:solid;border-color:FCC721');
    } else if (index >= 6 && index < 8) {
        element.setAttribute('style','background-color:FB741B;border-radius:5px;border-style:solid;border-color:FB741B');
    } else if (index >= 8 && index < 11) {
        element.setAttribute('style','background-color:F81116;border-radius:5px;border-style:solid;border-color:F81116');
    } else {element.setAttribute('style','background-color:866FFF;border-radius:5px;border-style:solid;border-color:866FFF');}
    element.appendChild(text);
    UVindex.append(element);
};

// function secondDisplay() {
    
// }

// Need to look at available images and icons for response cards
submitBtn.addEventListener("click", firstCall)
// });