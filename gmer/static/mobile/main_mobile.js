var operating_mode = "";

$(document).ready(function() {
    var server = "http://localhost:8000/";
    
    initialize_map();
    get_constraints();
    get_route();
    
    
    $("#submit").click(send_comment);
    
    $("#current_location").click(function() {
        operating_mode = "";
        //get location
        //alert(this);        
    });
    $("#refresh").click(function () { operating_mode = ""; })
    $("#blocked_road").click(function() { operating_mode = "blocked_road"; });
    $("#request_route").click(function() { operating_mode = "request_route"; });
    
    
    google.maps.event.addListener(map, 'click', addInfo);
})

function addInfo(event) {
    switch (operating_mode) {
        case "blocked_road":            
            placeMarker(event.latLng, true);
            setPointObstacle(event.latLng);
            break;
        
        case "request_route":
            alert("request_route");
            break;
    }
}

function setPointObstacle(latLng) {
    var geom = "POINT (" + latLng.lat() + " " + latLng.lng() + ")";
    $.get(server + "set_point/", {'geometry':geom}, function(data) {
        var parsed = $.parseJSON(data);
        alert(parsed.result);        
    });   
}