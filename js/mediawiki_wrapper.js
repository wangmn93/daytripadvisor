var basic;
var search_id;
var geosearch_id;
var search_title;
var geosearch_title;
var search_tuple, geosearch_tuple;
var search_flag = false;
var geosearch_flag = false;
var found_locality;

//request information box by city name
function getInfoBox(city, callback=null) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //convert response to json object
            var jsonResponse = JSON.parse(xhttp.responseText);
            var div = document.createElement('div');
            div.innerHTML = jsonResponse["parse"]["text"]["*"];
//            var isInsideGeosearch = _.intersection(geosearch_id,[jsonResponse["parse"]["pageid"]]).length == 1;
//            console.log("isInsideGeosearch"+isInsideGeosearch);
            var element = div.firstChild;
            var infoBox = element.getElementsByClassName("infobox geography vcard");
            if(infoBox.length>=1) {

                infoBox = infoBox[0];
                //modify href 
                var hrefs;
                hrefs = infoBox.getElementsByTagName("a");
                var newRef = "";
                for(var i = 0; i < hrefs.length; i++){
                    newRef = hrefs[i].href.replace("http://127.0.0.1","https://en.wikipedia.org");
                    hrefs[i].setAttribute("href", newRef);
                }
                //add element to html
                document.getElementById("info").appendChild(infoBox);

                //return local schema !!!

            }else{
                alert("No information box found!");
            }

        }
    };

    xhttp.open("GET", "https://cors-anywhere.herokuapp.com/"+"https://en.wikipedia.org/w/api.php?action=parse&page="+city+"&format=json&prop=text", true);
    xhttp.send();

}

//request information box by city name
function getInfoBoxById(id, callback=null) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //convert response to json object
            var jsonResponse = JSON.parse(xhttp.responseText);
            var div = document.createElement('div');
            div.innerHTML = jsonResponse["parse"]["text"]["*"];
//            var isInsideGeosearch = _.intersection(geosearch_id,[jsonResponse["parse"]["pageid"]]).length == 1;
//            console.log("isInsideGeosearch"+isInsideGeosearch);
            var element = div.firstChild;
            var infoBox = element.getElementsByClassName("infobox geography vcard");
            if(infoBox.length>=1) {

                infoBox = infoBox[0];
                //modify href 
                var hrefs;
                hrefs = infoBox.getElementsByTagName("a");
                var newRef = "";
                for(var i = 0; i < hrefs.length; i++){
                    newRef = hrefs[i].href.replace("http://127.0.0.1","https://en.wikipedia.org");
                    hrefs[i].setAttribute("href", newRef);
                }
                //add element to html
                document.getElementById("info").innerHTML = "";
                document.getElementById("info").appendChild(infoBox);
                
                //return local schema !!!
                if(callback!=null) {
                    
                }

            }else{
                alert("No information box found!");
            }

        }
    };

    xhttp.open("GET", "https://cors-anywhere.herokuapp.com/"+"https://en.wikipedia.org/w/api.php?action=parse&pageid="+id+"&format=json&prop=text", true);
    xhttp.send();

}

function search(city) {
    search_flag = false;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //convert response to json object
            var jsonResponse = JSON.parse(xhttp.responseText);
            console.log(jsonResponse);
            var searchresult = "";
            var id = [];
            var title = [];
            for(var i in jsonResponse["query"]["search"]) {
                searchresult += jsonResponse["query"]["search"][i]["title"]+","+
                    jsonResponse["query"]["search"][i]["pageid"]+"<br>";
                id.push(jsonResponse["query"]["search"][i]["pageid"]);
                title.push(jsonResponse["query"]["search"][i]["title"]);
            }
            search_id=id;
            search_title = title;
            search_flag = true;
            if(search_flag && geosearch_flag) intersect_result();
//            document.getElementById("searchresult").innerHTML = searchresult;

        }
    };

    xhttp.open("GET", "https://cors-anywhere.herokuapp.com/"+"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="+city+"&srlimit=5000&format=json", true);
    xhttp.send();
}

function geosearch(jsonResponse) {
    geosearch_flag = false;
    var coordinates = jsonResponse["results"][0]["geometry"]["location"];
    console.log("geoserach"+coordinates["lat"]+","+coordinates["lng"])
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //convert response to json object
            var jsonResponse = JSON.parse(xhttp.responseText);
//            console.log(jsonResponse);
            var searchresult = "";
            var id = [];
            var title = [];
            for(var i in jsonResponse["query"]["geosearch"]) {
                searchresult += jsonResponse["query"]["geosearch"][i]["title"]+","+
                    jsonResponse["query"]["geosearch"][i]["pageid"]+","
                    +jsonResponse["query"]["geosearch"][i]["dist"]+"<br>";
                id.push(jsonResponse["query"]["geosearch"][i]["pageid"]);
                title.push(jsonResponse["query"]["geosearch"][i]["title"]);
            }
            geosearch_id = id;
            geosearch_title = title;
            geosearch_flag = true;
            if(search_flag && geosearch_flag) intersect_result();
//            document.getElementById("geosearchresult").innerHTML = searchresult;

        }
    };

    xhttp.open("GET", "https://cors-anywhere.herokuapp.com/"+"https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gslimit=500&gsradius=10000&gscoord="+coordinates["lat"]+"%7C"+coordinates["lng"]+"&format=json", true);
    xhttp.send();
}





function performSrsearch(jsonResponse) {
    found_locality = findLocality(jsonResponse);
    search(found_locality);
}



function intersect_result() {
    var common_ids = _.intersection(search_id,geosearch_id);
    var common_titles = _.intersection(search_title,geosearch_title);
    var similarity = [];
    var similarity2 = [];
//    console.log(common_ids);
//    console.log(common_titles);
//    console.log(found_locality);
    
    for(var i in geosearch_title) {
//        console.log(geosearch_title[i]+", "+geosearch_title[i].levenstein_similarity(found_locality));
        similarity2.push({"id":geosearch_id[i],"title":geosearch_title[i],"score":geosearch_title[i].levenstein_similarity(found_locality)});    
    }
    
    for(var i in common_titles) {
//        console.log(common_titles[i]+", "+common_titles[i].levenstein_similarity(found_locality));
        similarity.push({"id":common_ids[i],"title":common_titles[i],"score":common_titles[i].levenstein_similarity(found_locality)});
    }
//    var locality = findLocality(jsonResponse);
    similarity.sort(function(a, b) {
    return parseFloat(b.score) - parseFloat(a.score);
});
    similarity2.sort(function(a, b) {
    return parseFloat(b.score) - parseFloat(a.score);
});
//    console.log(similarity);
//    console.log(similarity2);
    if(similarity.length>0) {
        if(similarity[0].score==1)
            getInfoBoxById(similarity[0].id);
        else
            display_possible_pages(similarity);//handle non-unique
    }else{
        //no intersection
            display_possible_pages(similarity2);//handle non-unique
    }
    
}




