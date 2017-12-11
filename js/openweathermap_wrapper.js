
function request_weatherforecast(city, date) {}

//request weather forecast by city name
function getWeather() {
    var city = "stuttgart";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            var jsonResponse = JSON.parse(xhttp.responseText);
            var ref_date = new Date("2017-01-01");
            var filtered_list = filter_weather_forecast(jsonResponse["list"],ref_date);
            console.log(filtered_list);
}
    };
    //other request format???
    xhttp.open("GET", "http://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid=6f55331d038a49fb7d958810010e4b78", true);
    xhttp.send();
}

//filter weather list by date,  remove weather forecast before reference date
function filter_weather_forecast(weather_list, ref_date) {
    var new_list = [];
    for(var i in weather_list){
                var dt_txt = weather_list[i]["dt_txt"];
                var temp = dt_txt.split(" ");
                var date = new Date(temp[0]);
                if(date > ref_date) new_list.push(weather_list[i]);
//                var time = temp[1];
            }
    return new_list;
}
