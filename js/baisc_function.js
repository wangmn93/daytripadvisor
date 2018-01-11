//main function
//function getRecommendation(city, date, budget=null) {
//    //validate name of city
//    //request datum
//    var info = request_basic(city,display_info_box);
//    var weather_forecast = request_weatherforecast(city, date);
//    var restaurants = request_restaurants(city, budget);
//    var sightseeings = request_sightseeings(city);
//    //display result
//    display_info_box(info);
//    display_weather_forecast(weather_forecast);
//    display_sightseeings(sightseeings);
//    display_restaurants(restaurants, budget);
//
//}
var titles = [
    "Afghan",
    "African",
    "Arabian",
    "Argentine",
    "Asian Fusion",
    "Australian",
    "Austrian",
    "Bangladeshi",
    "Basque",
    "Barbeque",
    "Belgian",
    "Bistros",
    "Brasseries",
    "Brazilian",
    "Breakfast & Brunch",
    "British",
    "Buffets",
    "Bulgarian",
    "Burgers",
    "Burmese",
    "Cafes",
    "Cafeteria",
    "Cajun/Creole",
    "Cambodian",
    "Caribbean",
    "Chicken Wings",
    "Chicken Shop",
    "Chinese",
    "Creperies",
    "Cuban",
    "Delis",
    "Diners",
    "Dinner Theater",
    "Ethiopian",
    "Filipino",
    "Fish & Chips",
    "Fondue",
    "Food Court",
    "Food Stands",
    "French",
    "Game Meat",
    "Gastropubs",
    "German",
    "Gluten-Free",
    "Greek",
    "Guamanian",
    "Halal",
    "Hawaiian",
    "Himalayan/Nepalese",
    "Honduran",
    "Hot Dogs",
    "Fast Food",
    "Hungarian",
    "Indonesian",
    "Indian",
    "International",
    "Irish",
    "Italian",
    "Japanese",
    "Kebab",
    "Korean",
    "Kosher",
    "Laotian",
    "Latin American",
    "Malaysian",
    "Mediterranean",
    "Mexican",
    "Middle Eastern",
    "Modern European",
    "Mongolian",
    "Moroccan",
    "Nicaraguan",
    "Noodles",
    "Pakistani",
    "Pan Asian",
    "Persian/Iranian",
    "Peruvian",
    "Pizza",
    "Polish",
    "Portuguese",
    "Live/Raw Food",
    "Russian",
    "Salad",
    "Sandwiches",
    "Scandinavian",
    "Seafood",
    "Singaporean",
    "Soup",
    "Spanish",
    "Sri Lankan",
    "Steakhouses",
    "Sushi Bars",
    "Syrian",
    "Taiwanese",
    "Tapas Bars",
    "Tapas/Small Plates",
    "Tex-Mex",
    "Thai",
    "American (Traditional)",
    "Turkish",
    "Ukrainian",
    "Vegan",
    "Vegetarian",
    "Vietnamese",
    "Waffles",
    "Wok"
];

var alias = [
    "afghani",
    "african",
    "arabian",
    "argentine",
    "asianfusion",
    "australian",
    "austrian",
    "bangladeshi",
    "basque",
    "bbq",
    "belgian",
    "bistros",
    "brasseries",
    "brazilian",
    "breakfast_brunch",
    "british",
    "buffets",
    "bulgarian",
    "burgers",
    "burmese",
    "cafes",
    "cafeteria",
    "cajun",
    "cambodian",
    "caribbean",
    "chicken_wings",
    "chickenshop",
    "chinese",
    "creperies",
    "cuban",
    "delis",
    "diners",
    "dinnertheater",
    "ethiopian",
    "filipino",
    "fishnchips",
    "fondue",
    "food_court",
    "foodstands",
    "french",
    "gamemeat",
    "gastropubs",
    "german",
    "gluten_free",
    "greek",
    "guamanian",
    "halal",
    "hawaiian",
    "himalayan",
    "honduran",
    "hotdog",
    "hotdogs",
    "hungarian",
    "indonesian",
    "indpak",
    "international",
    "irish",
    "italian",
    "japanese",
    "kebab",
    "korean",
    "kosher",
    "laotian",
    "latin",
    "malaysian",
    "mediterranean",
    "mexican",
    "mideastern",
    "modern_european",
    "mongolian",
    "moroccan",
    "nicaraguan",
    "noodles",
    "pakistani",
    "panasian",
    "persian",
    "peruvian",
    "pizza",
    "polish",
    "portuguese",
    "raw_food",
    "russian",
    "salad",
    "sandwiches",
    "scandinavian",
    "seafood",
    "singaporean",
    "soup",
    "spanish",
    "srilankan",
    "steak",
    "sushi",
    "syrian",
    "taiwanese",
    "tapas",
    "tapasmallplates",
    "tex-mex",
    "thai",
    "tradamerican",
    "turkish",
    "ukrainian",
    "vegan",
    "vegetarian",
    "vietnamese",
    "waffles",
    "wok"
];
//function display_full_categories() {
////    var close = document.createElement('A');
////    close.innerHTML = "close";
////    
////    close.onclick = function() {
////        document.getElementById('searchresult').style.visibility='hidden';
////    };
//    document.getElementById("searchresult").innerHTML = "<a onclick=\""+"document.getElementById('searchresult').style.visibility='hidden'"+"\">close</a><br>";
////    document.getElementById("searchresult").appendChild(close);
//    for(var i = 0;alias[i];++i){

//        document.getElementById("searchresult").innerHTML += '<input type="checkbox" name="price" class="category_check" value="'+alias[i]+'"> '+titles[i]+'|'
//
//    }
////    document.getElementById('searchresult').style.visibility='visible';
//}

//function display_info_box(info) {
//
//}
//
//function display_weather_forecast(weather_forecast) {
//
//}
//
//function display_restaurants(restaurants, filter) {
//
//}
//
//function display_sightseeings(sightseeings) {
//
//}

//function display_possible_pages(results) {
//    var possibleresult = "";
//    for(var i in results) {
//        possibleresult += results[i].id + " <a>"+results[i].title+"</a> " + results[i].score + "<br>"; 
//    }
//    document.getElementById("possibleresult").innerHTML = possibleresult;
//}
