var as;
//request information box by city name
function getInfoBox(city) {
    var city = "stuttgart";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
        //convert to json object
        var jsonResponse = JSON.parse(xhttp.responseText);
        var div = document.createElement('div');
        div.innerHTML = jsonResponse["parse"]["text"]["*"];
         var element = div.firstChild;
        var infoBox = element.getElementsByClassName("infobox geography vcard");
        if(infoBox.length>=1) {
            infoBox = infoBox[0];
            
            //modify href 
            as = infoBox.getElementsByTagName("a");
            var newRef = "";
            for(var i = 0; i < as.length; i++){
                newRef = as[i].href.replace("http://127.0.0.1","https://en.wikipedia.org");
                as[i].setAttribute("href", newRef);
            }
            
            //
       document.getElementById("info").appendChild(infoBox);

            
            
        }else{
            alert("No information box!");
        }

    }
};
xhttp.open("GET", "https://en.wikipedia.org/w/api.php?action=parse&pageid=28565&format=json&prop=text", true);
xhttp.send();
}

//extract info box from json response
function extractorID(response) {
    
}

//display info box in html
function displayInfoBox(result) {
    
}