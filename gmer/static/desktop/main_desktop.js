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
var directionsService = new google.maps.DirectionsService();
var mode = google.maps.DirectionsTravelMode.DRIVING;
var directionsDisplay = [];
var routeCoordinates = [];
var polylineMarkers = [];
var constraintMarkers = [];
var operatingMode;
var grid = [];
var raster = [];
var polyline;
var updateMarkers = [];
var constraintInitialCoordinates = [];

//sets up the map, its event listeners and hides some of the buttons
$(document).ready(function () {
	
	initialize_map();
	get_constraints();
	get_point_constraints();
	get_route();
	
	//event listener for left mouse click
	google.maps.event.addListener(map, 'click', function (event) {
        switch (operatingMode) {
            case "routing":
                if (routeCoordinates[0] == undefined) {
                    routeCoordinates[0] = event.latLng;
                    placeMarker(event.latLng, false);
                    
                }
                break;
            case "constraint":
                constraintMarkers.push(placeMarker(event.latLng, true));
                constraintInitialCoordinates.push(event.latLng);
                break;
        }
	});

	
	//event listener for right mouse click
    google.maps.event.addListener(map,'rightclick', function (event) {
        switch (operatingMode) {
            case "routing":
                if (routeCoordinates[1] == undefined) {
                    routeCoordinates[1] = event.latLng;
                    placeMarker(event.latLng, false);
                    //document.getElementById("buildRoute").disabled = false;
                    //document.getElementById("destroyRoute").disabled = false;
                    break;
                }
            case "constraint":
                constraintMarkers.push(placeMarker(event.latLng, true));
                if (constraintMarkers.length < 3) {
                    alert("Please supply " + (3 - constraintMarkers.length) + " more coordinate(s).");
                } else {
                    constraintInitialCoordinates.push(event.latLng);
                    
                    current_selection = buildConstraint(constraintInitialCoordinates);
                    save_constraint(current_selection);
                    $("button", ".deleteConstraint").button("enable"); 
                    
                    constraintInitialCoordinates = [];
                    destroyMarkers();
                    
                    operatingMode = "";
                }
                break;
        }
	});

    
    //JQUERY LAYOUT
    $('#tabs').tabs();
    $("button", ".defineConstraint").button();
    $("button", ".deleteConstraint").button();
    $("button", ".defineRoute").button();
    $("button", ".destroyRoute").button();
    $("button", ".buildRoute").button();
    $("button", ".recalculateRoute").button();
    $("button", ".updateConstraint").button();
    $("button", ".updateConstraintDone").button();
    //$("button", ".updateConstraintDone").button("option", "disabled", "true");
    $("button", ".updateConstraintDone").button("disable");
    
    
    //JQUERY ACTIONS
    $(".defineConstraint").click(function() {
        operatingMode = "constraint";
        $("button", ".deleteConstraint").button("option", "disabled", "true");
    });
    $(".deleteConstraint").click(delete_constraint);
    
    $(".defineRoute").click(function() {
    operatingMode = "routing";
    });
    
    $(".destroyRoute").click(destroyRoute);
    $(".buildRoute").click(buildRoute);
    $(".recalculateRoute").click(recalculateRoute);
    
    $("#submit").click(send_comment);
    $("#updateConstraint").click(function() {
        //$("button", ".updateConstraintDone").button("option", "enabled", "true");
        updateConstraint();
        $("button", ".updateConstraintDone").button("enable");
        $("button", ".updateConstraint").button("disable");
    });
        
    $("#updateConstraintDone").click(function() {
        //TODO: implement a return
        current_selection.setMap(null);
        
        var constraintCoordinates = [];        
        for (i in constraintMarkers) {
            constraintCoordinates.push(constraintMarkers[i].getPosition()); 
        }
        
        var current_selection_id = current_selection.gmii_id;
        current_selection = buildConstraint(constraintCoordinates);
        current_selection.gmii_id = current_selection_id;
        save_updated_constraint(current_selection);
        $("#version-content").html = current_selection.version; 
        
        $("button", ".updateConstraint").button("enable");
        $("button", ".updateConstraintDone").button("disable");
        
        destroyMarkers();   
    });
});


function updateConstraint() {
    //alert(current_selection.getPath().getAt(0).lng())
    var path = current_selection.getPath()
    var length = path.getLength()
    
    for (var i=0; i< length; i++) {
        constraintMarkers.push(placeMarker(new google.maps.LatLng(path.getAt(i).lat(),path.getAt(i).lng()), true));
    }
}

function placeMarkerTitle(location, title) {
	var marker = new google.maps.Marker({
		position: location,
		map: map, 
		title: title
	});
	
	//markers.push(marker);
	return marker;
}

function destroyMarkers() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
		//constraintMarkers[i].setMap(null);
	};
	markers = [];
	constraintMarkers = [];
}



