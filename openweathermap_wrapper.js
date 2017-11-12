//request weather forecast by city name
        function getWeather() {
            var city = "stuttgart";
            var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
       document.getElementById("weather").innerHTML = xhttp.responseText;
    }
};
            //other request format???
xhttp.open("GET", "http://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid=6f55331d038a49fb7d958810010e4b78", true);
xhttp.send();
        }
