var token = "yqwQxx-QnKss0BvoZsmeXaab6iRW5KVZp3Aq3stNDlIvlTd2Y-Ly6XZlwM95snXXwEA0a9IldDkFlo-gF3LLUyNurCBd7Wynns3Z3Iux43qNyFEImFTGeZdaPRQhWnYx";
//var city, state, country;
//function getToken(callback=null) {
//    var xhttp = new XMLHttpRequest();
//    var params = "grant_type=client_credentialsClient&client_id=-s4D4xn6fr0gpfWX4xi-sQ&client_secret=ngoLxOAtl1YbHoa32C7X2HJE7Wl9StK1vfeg7E0iPz5HSi4lVJqxm0YC19hbEF0a"; 
//    xhttp.onreadystatechange = function() {
//        if (this.readyState == 4 && this.status == 200) {
//            //convert response to json object
//            var jsonResponse = JSON.parse(xhttp.responseText);
//            console.log(jsonResponse);
//            token = jsonResponse["access_token"];
//            if(callback != null) callback();
//        }
//    };
//
//    xhttp.open("POST", "https://cors-anywhere.herokuapp.com/"+"https://api.yelp.com/oauth2/token", true);
//    //Send the proper header information along with the request
//    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//    xhttp.send(params);
//}

function match_restaurant() {}

function getBusiness(id, callback=null) {
    var url = "https://api.yelp.com/v3/businesses/id="+id;
    var xhr = new XMLHttpRequest();		
//    xhr.open('GET', "https://cors-anywhere.herokuapp.com/"+"https://api.yelp.com/v3/businesses/search?term=food&offset="+offset+"&categories="+categories+"&limit=50&latitude="+lat+"&longitude="+lon+"&radius="+radius, true);
    xhr.open('GET', url, true);
    // bearer token is evaluated and sent off immediately in our query request to Fusion
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {            	          	             
            var jsonResponse = JSON.parse(xhr.responseText);
            console.log(jsonResponse);
            if(callback!=null) callback(jsonResponse);
        }
    };		
    xhr.send();
}

function search_restaurants(lat,lon, radius,categories="chinese",offset=0) {
//    console.log(token);
    var xhr = new XMLHttpRequest();		
//    xhr.open('GET', "https://cors-anywhere.herokuapp.com/"+"https://api.yelp.com/v3/businesses/search?term=food&offset="+offset+"&categories="+categories+"&limit=50&latitude="+lat+"&longitude="+lon+"&radius="+radius, true);
    xhr.open('GET', "https://cors-anywhere.herokuapp.com/"+"https://api.yelp.com/v3/businesses/search?term=food&offset="+offset+"&limit=50&latitude="+lat+"&longitude="+lon+"&radius="+radius, true);
    // bearer token is evaluated and sent off immediately in our query request to Fusion
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {            	          	             
            var jsonResponse = JSON.parse(xhr.responseText);
            console.log(jsonResponse);
            console.log("total: "+jsonResponse["total"]);
            console.log("bussiness: "+jsonResponse["businesses"].length);
            for(var i in jsonResponse["businesses"]) {
                var coordinates = jsonResponse["businesses"][i]["coordinates"];
                var name =  jsonResponse["businesses"][i]["name"];
                createRestaurantMarker2(coordinates["latitude"],coordinates["longitude"],name,jsonResponse["businesses"][i]);    
            }
            
            if (jsonResponse["total"]>jsonResponse["businesses"].length+offset) {
                var moreButton = document.getElementById('more3');
                moreButton.disabled = false;
                moreButton.onclick = function() {
                     moreButton.disabled = true;
                    search_restaurants(lat,lon,radius,categories,offset+jsonResponse["businesses"].length);
                };
//                moreButton.addEventListener('click', function() {
//                    moreButton.disabled = true;
//                    search_restaurants(lat,lon,radius,categories,offset+jsonResponse["businesses"].length);
//                });
            }
        }
    };		
    xhr.send();
}

//function phone_search(phone) {
//    var xhr = new XMLHttpRequest();		
//		xhr.open('GET', "https://cors-anywhere.herokuapp.com/"+"https://api.yelp.com/v3/businesses/search/phone?phone="+phone, true);
//		// bearer token is evaluated and sent off immediately in our query request to Fusion
//		xhr.setRequestHeader("Authorization", "Bearer " + token);
//	  	xhr.onreadystatechange = function() {
//		   if (xhr.readyState == 4 && xhr.status == 200) {            	          	             
//	             var jsonResponse = JSON.parse(xhr.responseText);
//                    console.log(jsonResponse);
//	           }
//	  	};		
//		xhr.send();
//}

//function look_up(jsonResponse) {
//     var city = findLocality(jsonResponse);
//     var state = findState(jsonResponse);
//     var country = findCountry(jsonResponse);
////        var coordiantes = "";
//     var name = "Daily Burger";
//    
//    var xhr = new XMLHttpRequest();		
//		xhr.open('GET', "https://cors-anywhere.herokuapp.com/"+"https://api.yelp.com/v3/businesses/matches/best?name="+name+"&city="+city+"&state="+state+"&country="+country, true);
//		// bearer token is evaluated and sent off immediately in our query request to Fusion
//		xhr.setRequestHeader("Authorization", "Bearer " + token);
//	  	xhr.onreadystatechange = function() {
//		   if (xhr.readyState == 4 && xhr.status == 200) {            	          	             
//	             var jsonResponse = JSON.parse(xhr.responseText);
//                    console.log(jsonResponse);
//	           }
//	  	};		
//		xhr.send();
//}




