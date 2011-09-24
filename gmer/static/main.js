/* Introducing obtacles to Google Maps.
This file sets the thing up, sets up event listeners and takes care of DP polyline, constraints and markers.

route.js: called after user pushes Build Route -> intersection, rasterize, a_star, douglas_peucker
route_constraint_intersect.js: checks which route segments intersect with polygon
rast_grid.js: rasterize
aStar.js: a_star algorithm
douglas_peucker.js: douglas peucker simplification algorithm
directions_service.js: sets-up the Directions Service and draws the routes. 
util.js: holds utility functions: point_in_polygon, side-test, line intersection


Simeon Nedkov
Msc. Geomatics, TU Delft, The Netherlands
s.b.nedkov@student.tudelft.nl
*/

//global vars
var map;
var server="http://localhost:8000/";

//store the Google polygon objects
var constraintConstructs = [];
var current_selection = null;
var markers = [];


function initialize_map() {
	var latlng = new google.maps.LatLng(51.998, 4.3761);
	var myOptions = {
		zoom: 13,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		disableDoubleClickZoom: true
	};

	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		
	google.maps.Polygon.prototype.gmii_id = 0;
	google.maps.Polygon.prototype.gmii_version = 0;
}


// toggling functionality of constraints
function constraint_select() {
    if (current_selection != null) {
            current_selection.setOptions({fillOpacity:0.35});
    }

    this.setOptions({fillOpacity: 0.8});
    current_selection = this;
       
    $("#polygonID-content").html(this.gmii_id);
    $("#version-content").html(this.gmii_version);
    $("#numberOfComments-content").html(this.gmii_num_comments);
    
    get_comments();
}

function buildConstraint(constraintCoordinates) {

    var bermudaTriangle = new google.maps.Polygon({
    paths: constraintCoordinates,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35
    });
    
    bermudaTriangle.setMap(map);
    
    //Click event for obstacle
    google.maps.event.addListener(bermudaTriangle, 'click', constraint_select)
    
    constraintConstructs.push(bermudaTriangle);
    
    //disable the event listener
    operatingMode = "";
    
    return bermudaTriangle;
}

function placeMarker(location, draggable) {
    var marker = new google.maps.Marker({
        position: location,
        //map: map, 
        draggable: draggable
    });
    
    marker.setMap(map);
    markers.push(marker);
    return marker;
}

//
//POLYLINE - result form DP simplification algorithm
//
function drawDP(dpPath) {
//function drawPath(dpPath) {
    //alert("drawing");
    destroyDP();
    polyline = new google.maps.Polyline ({
        path: dpPath,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 5
    });
    
    polyline.setMap(map);
    
    //google.maps.event.addListener(polyline, 'click', function(event) {set_route(polyline);});

    google.maps.event.addListener(polyline,'mouseover', function (event) {
        //alert("mouseover");
        if (polylineMarkers.length == 0) {
            for (i in dpPath) {
            //alert(dpPath[i]);
            polylineMarkers.push(placeMarker(dpPath[i], true)); 
            }
        }
    });     
}

function destroyDP() {
//function destroyPath() {
    if (polyline != undefined) {
        polyline.setMap(null);
        polylineMarkers = [];
    }
}
