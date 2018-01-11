<?php 
function request($bearer_token, $host, $path, $url_params = array()) {
    // Send Yelp API Call
    try {
        $curl = curl_init();
        if (FALSE === $curl)
            throw new Exception('Failed to initialize');
        $url = $host . $path . "?" . http_build_query($url_params);
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,  // Capture response.
            CURLOPT_ENCODING => "",  // Accept gzip/deflate/whatever.
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "authorization: Bearer " . $bearer_token,
                "cache-control: no-cache",
            ),
        ));
        $response = curl_exec($curl);
        if (FALSE === $response)
            throw new Exception(curl_error($curl), curl_errno($curl));
        $http_status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        if (200 != $http_status)
            throw new Exception($response, $http_status);
        curl_close($curl);
    } catch(Exception $e) {
        trigger_error(sprintf(
            'Curl failed with error #%d: %s',
            $e->getCode(), $e->getMessage()),
                      E_USER_ERROR);
    }
    return $response;
}

function search($bearer_token, $term, $location) {
    $url_params = array();

    $url_params['term'] = $term;
    $url_params['location'] = $location;
    $url_params['limit'] = $GLOBALS['SEARCH_LIMIT'];

    return request($bearer_token, $GLOBALS['API_HOST'], $GLOBALS['SEARCH_PATH'], $url_params);
}

function get_business($bearer_token, $business_id) {
    $business_path = $GLOBALS['BUSINESS_PATH'] . urlencode($business_id);

    return request($bearer_token, $GLOBALS['API_HOST'], $business_path);
}

function query_api($term, $location) {     
    $bearer_token = "nDzvWPWmaK3pq1aybl9uiOgu9nqCAxBIpmEB09jSxqU01nbwE4ubfbvpKGsuscOrPhGmSKgNQacxxDvEo8SC3OcKSnQGJLJMbTKR1-xyJ0lUVESq3cfGiYBJ9n0yWnYx";
    $response = json_decode(search($bearer_token, $term, $location));
    //    $business_id = $response->businesses[0]->id;


    //    $response = get_business($bearer_token, $business_id);

    //    print sprintf("Result for business \"%s\" found:\n", $business_id);
    //    $pretty_response = json_encode(json_decode($response), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    //    print "$pretty_response\n";
    return $response;
}

function get2(){

   
$remote_url = 'https://api.yelp.com/v3/businesses/search?term=delis&latitude=37.786882&longitude=-122.399972';

// Create a stream
$opts = array(
    'http'=>array(
        'method'=>"GET",
        'header' => "Authorization: Bearer " . "nDzvWPWmaK3pq1aybl9uiOgu9nqCAxBIpmEB09jSxqU01nbwE4ubfbvpKGsuscOrPhGmSKgNQacxxDvEo8SC3OcKSnQGJLJMbTKR1-xyJ0lUVESq3cfGiYBJ9n0yWnYx"               
    )
);

$context = stream_context_create($opts);

// Open the file using the HTTP headers set above
$file = file_get_contents($remote_url, true, $context);
return $file;
//print($file);

}

$term = "dinner"; 
$location = "San Francisco, CA";
//query_api($term, $location);
echo get2();
//echo "abc";


?> 

