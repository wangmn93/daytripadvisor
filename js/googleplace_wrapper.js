var currentRestaurant;
var currentCoordinates;
function recenter_map(jsonResponse) {     
    var cooridnates = jsonResponse["results"][0]["geometry"]["location"];
    //    alert(cooridnates);
    map = new google.maps.Map(document.getElementById('map'), {
        center: cooridnates,
        zoom: 15
    });    
}

function getCoordinates(jsonResponse) {
    return jsonResponse["results"][0]["geometry"]["location"];
}

//convert city name to geographic coordinates
//adapt to JS api???
function geocode(address, callbacks){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var jsonResponse = JSON.parse(xhttp.responseText); 
            var city = "";
            //exec callbacks
            for(var i=0;i<callbacks.length;i++) 
                callbacks[i](jsonResponse);

        }
    };

    xhttp.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key=AIzaSyC6pHIUUibmZz5iFCQTffRZpy6ihbkPjZk&language=en", true);
    xhttp.send();
}

function findLocality(jsonResponse) {
    var locality = "";
    var flag = false;
    for(var i in jsonResponse["results"][0]["address_components"]) {
        for(var j in jsonResponse["results"][0]["address_components"][i]["types"]) {
            if(jsonResponse["results"][0]["address_components"][i]["types"][j]=="locality") {
                locality = jsonResponse["results"][0]["address_components"][i]["long_name"];
                flag = true;
                break;
            }
        }
        if(flag) break;
    }
    console.log("locality, "+locality);
    //    if(flag) search(locality);
    return locality;

}

function findState(jsonResponse) {
    var state = "";
    var flag = false;
    for(var i in jsonResponse["results"][0]["address_components"]) {
        for(var j in jsonResponse["results"][0]["address_components"][i]["types"]) {
            if(jsonResponse["results"][0]["address_components"][i]["types"][j]=="administrative_area_level_1") {
                state = jsonResponse["results"][0]["address_components"][i]["short_name"];
                flag = true;
                break;
            }
        }
        if(flag) break;
    }
    console.log("state, "+state);
    //    if(flag) search(locality);
    return state;
}

function findCountry(jsonResponse) {
    var country = "";
    var flag = false;
    for(var i in jsonResponse["results"][0]["address_components"]) {
        for(var j in jsonResponse["results"][0]["address_components"][i]["types"]) {
            if(jsonResponse["results"][0]["address_components"][i]["types"][j]=="country") {
                country = jsonResponse["results"][0]["address_components"][i]["short_name"];
                flag = true;
                break;
            }
        }
        if(flag) break;
    }
    console.log("country, "+country);
    //    if(flag) search(locality);
    return country;
}

function search_place(name, lat, lon) {
    var pyrmont = new google.maps.LatLng(lat,lon);
    var request = {
        query:name,
        location: pyrmont,
        radius: 500,
        type:'food'
    };
    service.textSearch(request, merge);
}

function request_restaurants(jsonResponse, minPriceLevel=0, maxPriceLevel=4){
    //    var cooridnates = jsonResponse["results"][0]["geometry"]["location"];
    coordinates = getCoordinates(jsonResponse);
    service.nearbySearch({
        location: coordinates,
        radius: 10000,
        //        minPriceLevel: 0,
        //        maxPriceLevel: 4,
        type: ['food']
    }, callback);
}

function request_sightseeings(jsonResponse) {
    //    var cooridnates = jsonResponse["results"][0]["geometry"]["location"];
    coordinates = getCoordinates(jsonResponse);

    service.textSearch({
        location: coordinates,
        radius: 10000,
        query: 'sightseeing+museum'
    }, callback2);
}

//get detail information of a place
function getDetail(placeId, marker) {
    //    alert(placeId);

    var request = {
        placeId: placeId
    };
    service.getDetails(request, function callback(place, status) {
        //        alert(status);
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            //    createMarker(place);
            //            alert(place["url"]);
            console.log(place);
            //            console.log(JSON.stringify(place, null, 4));
            var br = "<br>";

            var detail = place["name"]+br
            +place["formatted_address"]+br
            +place["formatted_phone_number"]+br
            +place["rating"]+br
            +place["website"]+br
            +place["url"];
            var open = "";
            for(var i in place["opening_hours"]["weekday_text"]) {
                open += place["opening_hours"]["weekday_text"][i]+br;
            }
            var photos = "";
            for(var i in place["photos"]) {
                photos += "<img src='"+place["photos"][i].getUrl({maxWidth: 160})+"'>";
            }
            console.log(photos);
            //            var open = place["opening_hours"]["periods"][0]

            //            var detail2 = "<iframe src='"+place["url"]+"'></iframe>";
            infowindow.setContent(detail+open+photos+"<br><a href='#'>reviews</a>");
            infowindow.open(map, marker);
        }
    });
}



function merge(results, status, pagination) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log(results);
        console.log("current restaurant: ");
        console.log(currentRestaurant);
        var re = /([a-zA-z]+|\d+)/g;
        var address = (currentRestaurant["location"]["address1"]+","+
                       currentRestaurant["location"]["address2"]+","+
                       currentRestaurant["location"]["address3"]+","+
                       currentRestaurant["location"]["city"]+","+
                       currentRestaurant["location"]["country"]).toLowerCase().match(re);
        var name = currentRestaurant["name"].toLowerCase().match(re);
        var newName = name.slice();
        for(var i in name) {
            if(name[i].length>4) {
                for(var j=0;j<name[i].length-4+1;j++) {
                    newName.push(name[i].substring(j, Math.min(j+4,name[i].length)));
                }
            }
            //            newArray.concat(seperate_word(name[i]));

        }

        var newAddress = address.slice();
        for(var i in address) {
            if(address[i].length>4) {
                for(var j=0;j<address[i].length-4+1;j++) {
                    newAddress.push(address[i].substring(j, Math.min(j+4,address[i].length)));
                }
            }
            //            newArray.concat(seperate_word(name[i]));

        }

        var lat = currentRestaurant["coordinates"]["latitude"];
        var lon = currentRestaurant["coordinates"]["longitude"];
        console.log(newName);
        console.log(newAddress);
        console.log(lat+","+lon);
        var possibleResult = [];
        var correspondJaccard = [];
        for (var i = 0; i < results.length; i++) {
            var lat2 = results[i]["geometry"]["location"].lat();
            var lon2 = results[i]["geometry"]["location"].lng()
            var diff = (lat-lat2)*(lat-lat2)+(lon-lon2)*(lon-lon2);
            if(diff<1){
                var name2 = results[i]["name"].toLowerCase().match(re);
                var newName2 = name2.slice();
                for(var k in name2) {
                    if(name2[k].length>4) {
                        for(var j=0;j<name2[k].length-4+1;j++) {
                            newName2.push(name2[k].substring(j, Math.min(j+4,name2[k].length)));
                        }
                    }
                    //            newArray.concat(seperate_word(name[i]));

                }
                console.log(newName2);
                var address2 = results[i]["formatted_address"].toLowerCase().match(re);
                var newAddress2 = address2.slice();
                for(var k in address2) {
                    if(address2[k].length>4) {
                        for(var j=0;j<address2[k].length-4+1;j++) {
                            newAddress2.push(address2[k].substring(j, Math.min(j+4,address2[k].length)));
                        }
                    }
                    //            newArray.concat(seperate_word(name[i]));

                }
                console.log(lat2+","+lon2);
                var jaccard = _.intersection(newName,newName2).length/_.union(newName,newName2).length;
                var jaccard2 = _.intersection(newAddress,newAddress2).length/_.union(newAddress,newAddress2).length;
                console.log("diff: "+diff);
                console.log(newAddress2);
                console.log("jaccard: "+jaccard);
                console.log("jaccard2: "+jaccard2);
                
            }

        }
        //        console.log("#restaurants "+results.length);
        //        if (pagination.hasNextPage) {
        //            pagination.nextPage();
        //        }
    }
}

function callback(results, status, pagination) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createRestaurantMarker(results[i]);
        }
        console.log("#restaurants "+results.length);
        if (pagination.hasNextPage) {
            var moreButton = document.getElementById('more');

            moreButton.disabled = false;

            moreButton.addEventListener('click', function() {
                moreButton.disabled = true;
                pagination.nextPage();
            });
        }
    }
}

function callback2(results, status, pagination) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createSightseeingMarker(results[i]);
        }
        console.log("#sightseeing "+results.length);
        //        console.log(results);
        if (pagination.hasNextPage) {
            var moreButton = document.getElementById('more2');

            moreButton.disabled = false;

            moreButton.addEventListener('click', function() {
                moreButton.disabled = true;
                pagination.nextPage();
            });
        }
    }
}

function createRestaurantMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        label:'R',
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        getDetail(place.place_id, marker);
        //        infowindow.setContent(place.name+"<br>"+place.place_id);
        //        infowindow.open(map, this);
        //merge here!!!

    });
}

function createRestaurantMarker2(lat,lon,name,restaurant) {
    var location = {lat: lat, lng: lon};
    var marker = new google.maps.Marker({
        map: map,
        label:'R2',
        position: location
    });
    google.maps.event.addListener(marker, 'click', function() {
        currentRestaurant = restaurant;
        search_place(name,lat,lon);
        //        getDetail(place.place_id, marker);
        //        infowindow.setContent(place.name+"<br>"+place.place_id);
        //        infowindow.open(map, this);
        //merge here!!!

    });

}

function createSightseeingMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        label:'S',
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        getDetail(place.place_id, marker);
        //        infowindow.setContent(place.name+"<br>"+place.place_id);
        //        infowindow.open(map, this);
    });
}
