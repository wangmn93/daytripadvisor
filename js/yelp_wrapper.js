var token = "nDzvWPWmaK3pq1aybl9uiOgu9nqCAxBIpmEB09jSxqU01nbwE4ubfbvpKGsuscOrPhGmSKgNQacxxDvEo8SC3OcKSnQGJLJMbTKR1-xyJ0lUVESq3cfGiYBJ9n0yWnYx";


function getBusiness(id, callback=null) {
    console.log("get business: "+id);
    var url = "https://cors-anywhere.herokuapp.com/"+"https://api.yelp.com/v3/businesses/"+id;
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

function getReviews(id, callback=null) {
    var url = "https://cors-anywhere.herokuapp.com/"+"https://api.yelp.com/v3/businesses/"+id+"/reviews";
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

function collect_check_box(lat,lon, radius){
    var price = ""; 
    var categories = "";
    var inputElements = document.getElementsByClassName('price_check');
    for(var i=0; inputElements[i]; ++i){
        if(inputElements[i].checked){
            price += inputElements[i].value + ",";
//            if(i!=inputElements.length-1) price+=",";
        }
    }
    
    inputElements = document.getElementsByClassName('category_check');
    for(var i=0; inputElements[i]; ++i){
        if(inputElements[i].checked){
            categories += inputElements[i].value + ",";;
//            if(i!=inputElements.length-1) categories+=",";
        }
    }
    if(price.length!=0) price=price.slice(0, -1)
    if(categories.length!=0) categories=categories.slice(0, -1)
    console.log("price: "+ price);
    console.log("categories: "+categories);
    return {"price":price,"categories":categories};
}




function search_restaurants(lat,lon, radius,price="1,2,3,4",categories="chinese",offset=0) {
    var check_box = collect_check_box();
    price = check_box.price;
    categories = check_box.categories;
    //    console.log(token);
    var xhr = new XMLHttpRequest();		
    //    xhr.open('GET', "https://cors-anywhere.herokuapp.com/"+"https://api.yelp.com/v3/businesses/search?term=food&offset="+offset+"&categories="+categories+"&limit=50&latitude="+lat+"&longitude="+lon+"&radius="+radius, true);
    xhr.open('GET', "https://cors-anywhere.herokuapp.com/"+"https://api.yelp.com/v3/businesses/search?term=food&offset="+offset+"&price="+price+"&categories="+categories+"&limit=50&latitude="+lat+"&longitude="+lon+"&radius="+radius, true);
    // bearer token is evaluated and sent off immediately in our query request to Fusion
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {            	          	             
            var jsonResponse = JSON.parse(xhr.responseText);
            console.log(jsonResponse);
            console.log("total: "+jsonResponse["total"]);
            console.log("bussiness: "+jsonResponse["businesses"].length);
//            document.getElementById("geosearchresult").innerHTML = "";
            document.getElementById('more3').innerHTML = "More ("+jsonResponse["total"]+"restaurants in total),"+categories+","+price;
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
                    search_restaurants(lat,lon,radius,price,categories,offset+jsonResponse["businesses"].length);
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

function request_restaurants(jsonResponse) {
    console.log("get restaurants from yelp");
    search_restaurants(jsonResponse["results"][0]["geometry"]["location"]["lat"],jsonResponse["results"][0]["geometry"]["location"]["lng"],5000);
}




