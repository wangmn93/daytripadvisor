//convert city name to geographic coordinates
function geoencode(){
    
            var city = "stuttgart";
            var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
       document.getElementById("weather").innerHTML = xhttp.responseText;
    }
};
xhttp.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?address="+city+"&key=AIzaSyC6pHIUUibmZz5iFCQTffRZpy6ihbkPjZk", true);
xhttp.send();
        
    }

function search(city){
    alert(city);
}

//check if the city name is valid
function validate_city(city) {
    //
}