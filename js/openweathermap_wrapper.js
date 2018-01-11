
//function request_weatherforecast(city, date) {}

//request weather forecast by city name
//function getWeather() {
//    var city = "stuttgart";
//    var xhttp = new XMLHttpRequest();
//    xhttp.onreadystatechange = function() {
//        if (this.readyState == 4 && this.status == 200) {
//            // Typical action to be performed when the document is ready:
//            var jsonResponse = JSON.parse(xhttp.responseText);
//            //            var ref_date = new Date("2017-01-01");
//            //            var filtered_list = filter_weather_forecast(jsonResponse["list"],ref_date);
//            //            console.log(filtered_list);
//            console.log(jsonResponse);
//            var weather = [["time","temperature"]];
//            var detail = "";
//            for(var i =0;i<5;i++) {
//                var t = new Date(jsonResponse["list"][i].dt*1000);
//                //                t.setSeconds( jsonResponse["list"][i].dt );
//                weather.push([t.toLocaleDateString(),jsonResponse["list"][i].temp.day-273.15]);
//            }
//            console.log(weather);
//            var data = google.visualization.arrayToDataTable(weather);
//
//            var options = {
//                title: 'Weather forecast',
//                curveType: 'function',
//                legend: { position: 'bottom' }
//            };
//
//            var chart = new google.visualization.LineChart(document.getElementById('weatherchart'));
//
//            chart.draw(data, options);
//
//        }
//    };
//    //other request format???
//    xhttp.open("GET", "https://cors-anywhere.herokuapp.com/"+"http://samples.openweathermap.org/data/2.5/forecast/daily?q="+city+"&appid=6f55331d038a49fb7d958810010e4b78", true);
//    xhttp.send();
//}
//get weather forecast from darksky
function getWeather2(lat,lng) {
    //    var city = "stuttgart";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            var jsonResponse = JSON.parse(xhttp.responseText);
            //            var ref_date = new Date("2017-01-01");
            //            var filtered_list = filter_weather_forecast(jsonResponse["list"],ref_date);
            //            console.log(filtered_list);
            console.log(jsonResponse);
            var weather = [["time","temperature"]];
            var weather2 = [["time","temperature","wind","rain"]]
            var detail = "";
            var aggregation = {};
            for(var i in jsonResponse["list"]) {
                var t = new Date(jsonResponse["list"][i].dt*1000);
                //                t.setSeconds( jsonResponse["list"][i].dt );
                var re = /(\d{4}-\d{2}-\d{2})/g;
                var date = jsonResponse["list"][i]["dt_txt"].match(re)[0];
                var hour = parseInt(jsonResponse["list"][i]["dt_txt"].match(/(\d{2}):\d{2}:\d{2}/g)[0]);
                if(hour>=6 && hour<=18) {
                    if( date in aggregation) {
                        aggregation[date][hour] = jsonResponse["list"][i];
                    }else{
                        aggregation[date]={};
                        aggregation[date][hour] = jsonResponse["list"][i];
                    } 
                }  

                weather.push([jsonResponse["list"][i]["dt_txt"],(jsonResponse["list"][i].main.temp-273.15)]);
            }
            //process aggregation
            var table = new google.visualization.DataTable();
            table.addColumn('string', 'Date');
            table.addColumn('string', 'Average')
            table.addColumn('string', '6:00');
            table.addColumn('string', '9:00');
            table.addColumn('string', '12:00');
            table.addColumn('string', '15:00');
            table.addColumn('string', '18:00');

            console.log(aggregation);
            var daily = {};
            var index=0;
            var score_list = [];
            for(var key in aggregation) {
                var avg_temp = 0;
                var avg_wind = 0;
                var avg_humidity = 0;
                var temp = "";
                var desc = "";
                var clear = 0;
                var cloud = 0;
                var rain = 0;
                //                var main;
                var row=[key,"avg","","","","",""];
                for(var t in aggregation[key]) {
                    row[t/3]= ""+(Math.round((aggregation[key][t].main.temp-273.15)*100)/100)+" Celsius<br>"+aggregation[key][t].wind.speed+" m/s<br>"+aggregation[key][t].main.humidity+" %<br>"+aggregation[key][t].weather[0].main;
                    avg_temp += aggregation[key][t].main.temp-273.15;
                    avg_wind += aggregation[key][t].wind.speed;
                    avg_humidity += aggregation[key][t].main.humidity;
                    temp += aggregation[key][t].main.temp-273.15+"/";
                    desc += aggregation[key][t].weather[0].main+"/";
                    if(aggregation[key][t].weather[0].main == "Rain") rain +=1;
                    if(aggregation[key][t].weather[0].main == "Clouds") cloud +=1;
                    if(aggregation[key][t].weather[0].main == "Clear") clear +=1;

                }
                
                daily[key] = {"avg_temp":(avg_temp/Object.keys(aggregation[key]).length),"avg_wind":avg_wind/Object.keys(aggregation[key]).length,"avg_humidity":avg_humidity/Object.keys(aggregation[key]).length,"temp":(temp),"desc":desc,"rain":(Math.round((rain/Object.keys(aggregation[key]).length)*100)/100),"cloud":(Math.round((cloud/Object.keys(aggregation[key]).length)*100)/100),"clear":(Math.round((clear/Object.keys(aggregation[key]).length)*100)/100)};
//                daily[key].push({"score":0.6*daily[key].clear+0.3*daily[key].cloud+0.1*daily[key].rain});
                weather2.push([key,daily[key].avg_temp,daily[key].avg_wind,daily[key].rain]);
                row[1] = (Math.round((daily[key].avg_temp)*100)/100)+" Celsius<br>"+(Math.round((daily[key].avg_wind)*100)/100)+" m/s<br>"+daily[key].avg_humidity+" % Humidity<br>"+daily[key].rain+" Rain/ "+daily[key].cloud + " Clouds/ "+daily[key].clear +" Clear";
                table.addRows([row]);
                score_list.push({index:index,date:key,score:0.6*daily[key].clear+0.3*daily[key].cloud+0.1*daily[key].rain,avg_temp:daily[key].avg_temp});
                index+=1;
            }
            
            //label recommend date
            console.log(score_list);
            var best_weather_index = score_list.sort(function(a,b){return b.score-a.score})[0].index;
            var best_temp_index = score_list.sort(function(a,b){return b.avg_temp-a.avg_temp})[0].index;
            
            console.log("best1: "+best_temp_index);
            console.log("best2: "+best_weather_index);
            table.setCell(best_weather_index,0,table.getValue(best_weather_index,0)+"<br><b>* Best condition</b>");
            table.setCell(best_temp_index,0,table.getValue(best_temp_index,0)+"<br><b>* Highest temperature</b>");
            for(var i=0;i<7;i++){
                    
                
                    
               
                    
                 table.setProperty(best_weather_index, i, 'style', 'background-color: #42f480;');
                table.setProperty(best_temp_index, i, 'style', 'background-color: #f7ce7e;');
            }
            
           


            console.log(daily);
            var data = google.visualization.arrayToDataTable(weather2);
            console.log(data);
            var options = {
                title: 'Weather forecast',
                curveType: 'function',
                legend: { position: 'bottom' }
            };

            
            
var chart = new google.visualization.LineChart(document.getElementById('weatherchart'));
            chart.draw(data, options);
            document.getElementById("daily").onclick=function() {
//                alert("dd");
                 chart = new google.visualization.LineChart(document.getElementById('weatherchart'));
                chart.draw(data, options);
            };
            
            document.getElementById("3_h").onclick=function() {
var tab = new google.visualization.Table(document.getElementById('weatherchart'));

                tab.draw(table, {showRowNumber: false,allowHtml:true, width: '100%', height: '100%'});
            };

        }
    };
    //other request format???
    xhttp.open("GET", "https://cors-anywhere.herokuapp.com/"+"http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lng+"&appid=6f55331d038a49fb7d958810010e4b78", true);
    xhttp.send();
}


function request_weather(jsonResponse) {
    getWeather2(jsonResponse["results"][0]["geometry"]["location"]["lat"],jsonResponse["results"][0]["geometry"]["location"]["lng"]);
}


//filter weather list by date,  remove weather forecast before reference date
//function filter_weather_forecast(weather_list, ref_date) {
//    var new_list = [];
//    for(var i in weather_list){
//        var dt_txt = weather_list[i]["dt_txt"];
//        var temp = dt_txt.split(" ");
//        var date = new Date(temp[0]);
//        if(date > ref_date) new_list.push(weather_list[i]);
//        //                var time = temp[1];
//    }
//    return new_list;
//}
