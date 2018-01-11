function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}


function cleanString(input) {
    var output = "";
    for (var i=0; i<input.length; i++) {
        if (input.charCodeAt(i) <= 127) {
            output += input.charAt(i);
        }
    }
    return output;
}

function set_address(jsonResponse) {
    document.getElementById("autocomplete").value=cleanString(jsonResponse["results"][0]["formatted_address"]);
    document.getElementById("autocomplete").focus();
}

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
            jsonResponse["geonames"].sort(function(a,b){
                return -getDistanceFromLatLonInKm(b.lat,b.lng,lat,lng)+getDistanceFromLatLonInKm(a.lat,a.lng,lat,lng);
            });
            var recommendations = "";
            for(var i in jsonResponse["geonames"]) {
//                    var address = jsonResponse["geonames"][i]["name"]+","+jsonResponse["geonames"][i]["countrycode"];
                recommendations += "<a onclick='inverse_geocode("+jsonResponse["geonames"][i]["lat"]+","+jsonResponse["geonames"][i]["lng"]+",[set_address])'><b>"+jsonResponse["geonames"][i]["name"]+"</b>,"
                    +"distance: "+ (Math.round((getDistanceFromLatLonInKm(jsonResponse["geonames"][i]["lat"],jsonResponse["geonames"][i]["lng"],lat,lng))*100)/100)+" km"
                    +"</a><br>";
//                var a = document.createElement('A');
//                a.innerHTML = jsonResponse["geonames"][i]["name"]+","
//                    +jsonResponse["geonames"][i]["lat"]+","+
//                    jsonResponse["geonames"][i]["lng"];
//                a.onclick = function() {
//                    console.log(jsonResponse["geonames"][i]["lat"]+","+
//                    jsonResponse["geonames"][i]["lng"]);
//                };
//                document.getElementById("recommendation").appendChild(a);
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