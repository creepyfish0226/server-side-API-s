var prevWeather = JSON.parse(localStorage.getItem("weather")) || []
var apiKey = "943a8be4d92ebe84f436b7d27f887868"

function weatherSearch(name) {
    $.get('https://api.openweathermap.org/data/2.5/weather?q=' + name + '&appid=' + apiKey)
        .then(function (results) {
            $.get('http://api.openweathermap.org/data/2.5/uvi/history?appid=' + apiKey + '&lat=' + results.coord.lat + '&lon=' + results.coord.lon + '&start='+results.dt+'&end='+results.dt)
                .then(function (UV) {
                    console.log(results)
                    console.log(UV)
                    $(".current").empty()
                    var jumbo = $("<div>").addClass("jumbotron")
                    var h3 = $("<h3>")
                    h3.text(results.name + " (" + moment.unix(results.dt).format("L") + ")")
                    var icon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + results.weather[0].icon + ".png")
                    h3.append(icon)
                    var wind = $("<div>").text("Wind speed: "+results.wind.speed)
                    var uv = $("<div>").text("UV index: "+UV[0].value)
                    jumbo.append(h3,wind, uv)
                    $(".current").append(jumbo)
                })
        })
}

function prevList() {
    $("#previous").empty()
    for (var i = 0; i < prevWeather.length; i++) {
        var newDiv = $("<div>").text(prevWeather[i])
        newDiv.addClass("card prevSearch text-center py-1")
        newDiv.attr("data-name", prevWeather[i])
        $("#previous").append(newDiv)
    }
}

$("#search").click(function () {
    var userSearch = $("#cityText").val()
    prevWeather.unshift(userSearch)
    localStorage.setItem("weather", JSON.stringify(prevWeather))
    weatherSearch(userSearch)
    prevList()
})
prevList()
$("#previous").on("click", ".prevSearch", function () {
    var searchName = $(this).attr("data-name")
    weatherSearch(searchName)
})