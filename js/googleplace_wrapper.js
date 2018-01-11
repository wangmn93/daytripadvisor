var currentRestaurant;
var currentRestaurantDetail;
var yelp_reviews;
var matchedRestaurant;
var currentCoordinates;
var currentMarker;
var detailFlag = false;
var matchedFlag = false;
var reviewFlag = false;

function getCoordinates(jsonResponse) {
    return jsonResponse["results"][0]["geometry"]["location"];
}

function recenter_map(jsonResponse) {     
    currentCoordinates = getCoordinates(jsonResponse);
    //    var cooridnates = jsonResponse["results"][0]["geometry"]["location"];
    //    alert(cooridnates);
    map = new google.maps.Map(document.getElementById('map'), {
        center: currentCoordinates,
        zoom: 15
    });    
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

function inverse_geocode(lat,lng, callbacks){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var jsonResponse = JSON.parse(xhttp.responseText); 
//            var city = "";
            //exec callbacks
            for(var i=0;i<callbacks.length;i++) 
                callbacks[i](jsonResponse);

        }
    };

    xhttp.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&key=AIzaSyC6pHIUUibmZz5iFCQTffRZpy6ihbkPjZk&language=en", true);
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
    var location = new google.maps.LatLng(lat,lon);
    var request = {
        query:name,
        location: location,
        radius: 500,
        type:'food'
    };
    service.textSearch(request, merge);
}

//function request_restaurants(jsonResponse, minPriceLevel=0, maxPriceLevel=4){
//    var cooridnates = jsonResponse["results"][0]["geometry"]["location"];
//    currentCoordinates = getCoordinates(jsonResponse);
//    search_restaurants(currentCoordinates["lat"],currentCoordinates["lng"],5000);
//    service.nearbySearch({
//        location: currentCoordinates,
//        radius: 10000,
//        //        minPriceLevel: 0,
//        //        maxPriceLevel: 4,
//        type: ['food']
//    }, callback);
//}

function request_sightseeings(jsonResponse) {
    //    var cooridnates = jsonResponse["results"][0]["geometry"]["location"];
    currentCoordinates = getCoordinates(jsonResponse);
    service.textSearch({
        location: currentCoordinates,
        radius: 20000,
        query: 'sightseeing+museum'
    }, callback2);
    document.getElementById("defaultOpen").click()
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
            var google_reviews = place["reviews"];
            var reviews = "";

            for (var i in google_reviews) {
                reviews += "<b>"+google_reviews[i]["author_name"] + "</b>: " + google_reviews[i]["text"] + ",<b>Rating: " + google_reviews[i]["rating"]+"</b><br>";
            }
            var detail = "<b>"+place["name"]+"</b>"+br
            +place["formatted_address"]+br
            +place["formatted_phone_number"]+br
            +"Rating: "+place["rating"]+br
            +"<a href='"+place["website"]+"'>Website</a>"+br
            +"<a href='"+place["url"]+"'>google</a>"+br;
            var open = "";
            if("opening_hours" in place){
                
                  for(var i in place["opening_hours"]["weekday_text"]) {
                open += place["opening_hours"]["weekday_text"][i]+br;
            }
            }
          
            var photos = "";
            for(var i in place["photos"]) {
                if(i==1){
                    photos += "<div class='item active'><img src='"+place["photos"][i].getUrl({maxWidth: 640})+"'></div>";
                }else{
                    photos += "<div class='item'><img src='"+place["photos"][i].getUrl({maxWidth: 640})+"'></div>";
                }

            }
            var carousel = '<div id="myCarousel" class="carousel slide" data-ride="carousel"> <div class="carousel-inner">'+photos+'</div><a class="left carousel-control" href="#myCarousel" data-slide="prev"><span class="glyphicon glyphicon-chevron-left"></span><span class="sr-only">Previous</span></a><a class="right carousel-control" href="#myCarousel" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span><span class="sr-only">Next</span></a></div>';
            console.log(photos);
            //            var open = place["opening_hours"]["periods"][0]

            //            var detail2 = "<iframe src='"+place["url"]+"'></iframe>";
            

            var review_btn = "<a id='review_btn'>Reviews</a><div id='reviews'></div>";
            

            infowindow.setContent(detail+open+review_btn+carousel);
            infowindow.open(map, currentMarker);
            document.getElementById('review_btn').onclick = function() {
                document.getElementById('reviews').innerHTML = reviews;

            };
        }
    });
}



function fusion(yelp_restaurant,google_restaurant) {
    console.log("start fusion");
    console.log(yelp_restaurant);
    console.log(google_restaurant);

    var br = "<br>";
    var sl = "/";
    //data from google place
    var name = google_restaurant["name"];
    var address = google_restaurant["formatted_address"];
    var google_rating = google_restaurant["rating"];
    var google_url = "<a href='"+google_restaurant["url"]+"'>google</a>";
    var website = google_restaurant["website"];
    var google_phone = google_restaurant["international_phone_number"];
    var google_photos = google_restaurant["photos"];
    var google_reviews = google_restaurant["reviews"];
    var google_open;
    if("opening_hours" in google_restaurant){
        google_open = google_restaurant["opening_hours"]["periods"];
    }else{
        google_open = [];
    }


    //data from yelp
    var categories = "";
    for(var i in yelp_restaurant["categories"]){
        categories += yelp_restaurant["categories"][i]["title"] + ", ";
    }
    var yelp_url = "<a href='"+yelp_restaurant["url"]+"'>yelp</a>";
    var price_level = yelp_restaurant["price"];
    var yelp_rating = yelp_restaurant["rating"];
    var yelp_phone = yelp_restaurant["phone"];
    var yelp_photos = yelp_restaurant["photos"];
    var yelp_open;
    if("hours" in yelp_restaurant){
        yelp_open = yelp_restaurant["hours"][0]["open"];;
    }else{
        yelp_open = [];
    }
    

    var reviews = "";

    for (var i in google_reviews) {
        reviews += "<b>"+google_reviews[i]["author_name"] + "</b>: " + google_reviews[i]["text"] + ",<b>Rating: " + google_reviews[i]["rating"]+"</b><br>";
    }

    for (var i in yelp_reviews["reviews"]) {
        reviews += "<b>"+yelp_reviews["reviews"][i].user.name+"</b> "+yelp_reviews["reviews"][i]["text"] + ",<b>Rating: " + yelp_reviews["reviews"][i]["rating"]+"</b><br>";
    }


    var imgs = "";
    for(var i in google_photos) {
        if(i==1){
            imgs += "<div class='item active'><img src='"+google_photos[i].getUrl({maxWidth: 640})+"'></div>";
        }else{
            imgs += "<div class='item'><img src='"+google_photos[i].getUrl({maxWidth: 640})+"'></div>";     
        }



    }
    for(var i in yelp_photos) {
        imgs += "<div class='item'><img src='"+yelp_photos[i]+"'></div>";
    }
    var carousel = '<div id="myCarousel" class="carousel slide" data-ride="carousel"> <div class="carousel-inner">'+imgs+'</div><a class="left carousel-control" href="#myCarousel" data-slide="prev"><span class="glyphicon glyphicon-chevron-left"></span><span class="sr-only">Previous</span></a><a class="right carousel-control" href="#myCarousel" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span><span class="sr-only">Next</span></a></div>';
    var imgs = "";

    if(!("opening_hours" in google_restaurant)){
        //bucket open 
        var open = [[],[],[],[],[],[],[]];
        var close = [[],[],[],[],[],[],[]];
        for(var i in google_open) {
            open[google_open[i].open.day].push(google_open[i].open.time);
            close[google_open[i].close.day].push(google_open[i].close.time)
        }

        for(var i in yelp_open) {
            open[(yelp_open[i].day+1)%7].push(yelp_open[i].start);
            close[(yelp_open[i].day+1)%7].push(yelp_open[i].end);
        }

        for(var i in open) {
            open[i]=_.union(open[i]);
            close[i]=_.union(close[i]);
        }

        console.log(open);
        console.log(close);

    }else{
        var open_text = "";
        for(var i in google_restaurant["opening_hours"]["weekday_text"]) {
            open_text += google_restaurant["opening_hours"]["weekday_text"][i]+br;
        }
    }
    var review_btn = "<a id='review_btn'>Reviews</a><div id='reviews'></div>";
    console.log(google_restaurant["opening_hours"].weekday_text);
    //    var open 
    //    google_phone.replace(/\s/g, '');
    var content = "<b>"+name+"</b>" + br + address + br + google_phone + br +google_url+" , "+yelp_url +br + "Rating: "+(google_rating+yelp_rating)/2.+br + "Price: "+price_level+br +"Categories: "+categories+br+open_text+review_btn+carousel;


    infowindow.setContent(content);
    infowindow.open(map, currentMarker);
    document.getElementById('review_btn').onclick = function() {
        document.getElementById('reviews').innerHTML = reviews;

    };

    //reset flags
    matchedFlag = false;
    detailFlag = false;
    reviewFlag = false;
}


function pre_fusion(yelp_restaurant,google_restaurant) {
    console.log("get detail from google: "+google_restaurant["restaurant"]["place_id"]);
    var request = {
        placeId: google_restaurant["restaurant"]["place_id"]
    };
    service.getDetails(request, function callback(place, status) {
        //        alert(status);
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            //            console.log("sss");
            fusion(yelp_restaurant,place) 
        }else{
            console.log(status);
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
        //        var correspondJaccard = [];
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
                //                console.log(newName2);
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
                //                console.log(lat2+","+lon2);
                var jaccard = _.intersection(newName,newName2).length/_.union(newName,newName2).length;
                var jaccard2 = _.intersection(newAddress,newAddress2).length/_.union(newAddress,newAddress2).length;
                //                console.log("diff: "+diff);
                //                console.log(newAddress2);
                //                console.log("jaccard: "+jaccard);
                //                console.log("jaccard2: "+jaccard2);
                if((0.3*jaccard+0.7*jaccard2)>0.3) {
                    possibleResult.push({"restaurant":results[i],"j1":jaccard,"j2":jaccard2});
                    //                    correspondJaccard.push({"j1":jaccard,"j2":jaccard2});
                }

            }


        }
        possibleResult.sort(function(a,b){
            return parseFloat(b.j1*0.3+b.j2*0.7) - parseFloat(a.j1*0.3+a.j2*0.7);
        });
        //        console.log(possibleResult);
        //start fusion
        if(possibleResult.length>=1) {
            matchedFlag = true;
            match_restaurant = possibleResult[0];
        }

        if(matchedFlag && detailFlag && reviewFlag) {
            pre_fusion(currentRestaurantDetail,match_restaurant);
        }
        //            console.log(correspondJaccard);
        //        console.log("#restaurants "+results.length);
        //        if (pagination.hasNextPage) {
        //            pagination.nextPage();
        //        }
    }
}

//function callback(results, status, pagination) {
//    if (status === google.maps.places.PlacesServiceStatus.OK) {
//        for (var i = 0; i < results.length; i++) {
//            createRestaurantMarker(results[i]);
//        }
//        console.log("#restaurants "+results.length);
//        if (pagination.hasNextPage) {
//            var moreButton = document.getElementById('more');
//
//            moreButton.disabled = false;
//
//            moreButton.addEventListener('click', function() {
//                moreButton.disabled = true;
//                pagination.nextPage();
//            });
//        }
//    }
//}

function callback2(results, status, pagination) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            if(getDistanceFromLatLonInKm(results[i].geometry.location.lat(),results[i].geometry.location.lng(),currentCoordinates.lat,currentCoordinates.lng)<20)
//            if(Math.sqrt(results[i].geometry.location.lat()-currentCoordinates.lat)+Math.sqrt(results[i].geometry.location.lng()-currentCoordinates.lng)<4)
                createSightseeingMarker(results[i]);
        }
        console.log("#sightseeing "+results.length);
        //        console.log(results);
        if (pagination.hasNextPage) {
            pagination.nextPage();
            //            var moreButton = document.getElementById('more2');
            //
            //            moreButton.disabled = false;
            //
            //            moreButton.addEventListener('click', function() {
            //                moreButton.disabled = true;
            //                pagination.nextPage();
            //            });
        }
    }
}

//function createRestaurantMarker(place) {
//    var placeLoc = place.geometry.location;
//    var marker = new google.maps.Marker({
//        map: map,
//        label:'R',
//        position: place.geometry.location
//    });
//
//    google.maps.event.addListener(marker, 'click', function() {
//        infowindow.open(map, marker);
//        getDetail(place.place_id, marker);
//        //        infowindow.setContent(place.name+"<br>"+place.place_id);
//        //        infowindow.open(map, this);
//        //merge here!!!
//
//    });
//}

function createRestaurantMarker2(lat,lon,name,restaurant) {
    var location = {lat: lat, lng: lon};
    var marker = new google.maps.Marker({
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        position: location
    });
    var li = document.createElement('LI');
    li.innerHTML = "<a>"+name +"(" +restaurant["categories"][0]["title"] +","+ restaurant["price"]+")"+"</a>";
    //    li.style.color = 'black';
    li.onclick = function() {
         infowindow.setContent("Requesting data...");
        infowindow.open(map, marker);
        currentRestaurant = restaurant;
        currentMarker = marker;
        detailFlag = false;
        reviewFlag = false;
        //        matchedFlag = false;
        //request detail from yelp
        getBusiness(restaurant["id"],function(jsonResponse) {
            detailFlag = true;
            currentRestaurantDetail = jsonResponse;
            if(matchedFlag && detailFlag && reviewFlag) {
                pre_fusion(currentRestaurantDetail,match_restaurant);
            }
        });

        getReviews(restaurant["id"],function(jsonResponse) {
            reviewFlag = true;
            yelp_reviews = jsonResponse;
            if(matchedFlag && detailFlag && reviewFlag) {
                pre_fusion(currentRestaurantDetail,match_restaurant);
            }
        });

        search_place(name,lat,lon);
        //        getDetail(place.place_id, marker);
        //        infowindow.setContent(place.name+"<br>"+place.place_id);
        //        infowindow.open(map, this);
        //merge here!!!
    };
    document.getElementById("restaurants").appendChild(li);

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent("Requesting data...");
        infowindow.open(map, marker);
        currentRestaurant = restaurant;
        currentMarker = marker;
        detailFlag = false;
        reviewFlag = false;
        //        matchedFlag = false;
        //request detail from yelp
        getBusiness(restaurant["id"],function(jsonResponse) {
            detailFlag = true;
            currentRestaurantDetail = jsonResponse;
            if(matchedFlag && detailFlag && reviewFlag) {
                pre_fusion(currentRestaurantDetail,match_restaurant);
            }
        });

        getReviews(restaurant["id"],function(jsonResponse) {
            reviewFlag = true;
            yelp_reviews = jsonResponse;
            if(matchedFlag && detailFlag && reviewFlag) {
                pre_fusion(currentRestaurantDetail,match_restaurant);
            }
        });


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
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        position: place.geometry.location
    });


    var li = document.createElement('LI');
    li.innerHTML = "<a>"+place["name"]+", "+(Math.round((getDistanceFromLatLonInKm(place.geometry.location.lat(),place.geometry.location.lng(),currentCoordinates.lat,currentCoordinates.lng))*100)/100)+" km</a>";
    li.onclick = function() {
         infowindow.setContent("Requesting data...");
        infowindow.open(map, marker);
        getDetail(place.place_id, marker);
    };
    document.getElementById("sightseeings").appendChild(li);

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent("Requesting data...");
        infowindow.open(map, marker);
        getDetail(place.place_id, marker);
        //        infowindow.setContent(place.name+"<br>"+place.place_id);
        //        infowindow.open(map, this);
    });
}
