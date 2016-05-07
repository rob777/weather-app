//--------------------------toggle button begin--------------------------//
(function ($) {
    $.fn.extend({
        Segment: function () {
            $(this).each(function () {
                var self = $(this);
                var onchange = self.attr('onchange');
                var wrapper = $("<div>", {
                    class: "ui-segment"
                });
                $(this).find("option").each(function () {
                    var option = $("<span>", {
                        class: 'option',
                        onclick: onchange,
                        text: $(this).text(),
                        value: $(this).val()
                    });
                    if ($(this).is(":selected")) {
                        option.addClass("cel");
                    } else {
                        option.addClass("fah")
                    }
                    wrapper.append(option);
                });
                wrapper.find("span.option").click(function () {
                    wrapper.find("span.option").removeClass("active");
                    $(this).addClass("active");
                    self.val($(this).attr('value'));
                });
                $(this).after(wrapper);
                $(this).hide();
            });
        }
    });
})(jQuery);

$(".segment-select").Segment();


//--------------------------toggle button end--------------------------//
var APPID = "422ff6b63cc2df82cbc04a95aff1cbf1";
var temp, loc, icon;

function updateByCity(city) {
    var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APPID;
    sendRequest(url);
}

function updateByGeoLoc(lat, lon) {
    var url = "http://api.openweathermap.org/data/2.5/weather?" + "lat=" + lat + "&lon=" + lon + "&APPID=" + APPID;
    sendRequest(url);
}

function sendRequest(url) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            var weather = {};
            weather.temp = "Choose temperature units";
            weather.loc = data.name;
            weather.icon = data.weather[0].id;
            update(weather);
            $(".fah").click(function () {
                temp.innerHTML = kelToFah(data.main.temp);
            });
            $(".cel").click(function () {
                temp.innerHTML = kelToCel(data.main.temp);
            });
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}

function kelToCel(kel) {
    return Math.round(kel - 273.15);
}

function kelToFah(kel) {
    return Math.round(kel * (9 / 5) - 459.67);
}

function update(weather) {
    temp.innerHTML = weather.temp;
    loc.innerHTML = weather.loc;
    icon.src = "images/" + weather.icon + ".png";
}

function curGeoLoc(geo) {
    updateByGeoLoc(geo.coords.latitude, geo.coords.longitude);
}

window.onload = function () {
    temp = document.getElementById("temperature");
    loc = document.getElementById("location");
    icon = document.getElementById("icon");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(curGeoLoc);
    } else {
        var city = window.prompt("Enter your city please");
        updateByCity(city);
    }
}