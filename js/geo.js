function searchnearby(lat, lng) {
    var north = Math.ceil(lat);
    var south = Math.floor(lat);
    var east = Math.ceil(lng);
    var west = Math.floor(lng);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //convert response to json object
            var jsonResponse = JSON.parse(xhttp.responseText);
            console.log(jsonResponse);
            var recommendations = "";
            for(var i in jsonResponse["geonames"]) {
                recommendations += jsonResponse["geonames"][i]["name"]+","
                    +jsonResponse["geonames"][i]["lat"]+","+
                    jsonResponse["geonames"][i]["lng"]+"<br>";
            }
            
            document.getElementById("recommendation").innerHTML = recommendations;

        }
    };

    xhttp.open("GET", "http://api.geonames.org/citiesJSON?north="+north+"&south="+south+"&east="+east+"&west="+west+"&lang=en&username=wangmn93", true);
    xhttp.send();
    
}

function auto_searchnearby() {
    if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                       
                            var lat = position.coords.latitude;
                            var lng = position.coords.longitude;
                            searchnearby(lat,lng);
                       
                    });
                }
}

function searchnearbyByAddress(jsonResponse) {
    var coordiantes = getCoordinates(jsonResponse);
//    var lat = jsonResponse["results"][0]["geometry"]["location"]["lat"];
//        var lng = jsonResponse["results"][0]["geometry"]["location"]["lng"];
    searchnearby(coordiantes["lat"], coordiantes["lng"]);
}