//
//DIRECTION DISPLAY - management
//
//creates the directionsDisplay(s). They are more than one since each can show only 10 waypoints
//while some routes have more than 10 waypoints.
function createDirectionsDisplay() {
	var newDirectionsDisplay = new google.maps.DirectionsRenderer({preserveViewport: true});
	newDirectionsDisplay.setMap(map);
	return newDirectionsDisplay;
}

function destroyDirectionsDisplay() {
	if (directionsDisplay != undefined) {
		for (i in directionsDisplay) {
            //removes them from the screen
			directionsDisplay[i].setMap(null);
		}
		directionsDisplay = [];
	}	
}

//
// DIRECTIONS DISPLAY - usage
//
//displays the route as returned by Douglas-Peucker. The route needs to be chopped 
//in pieces of 10 waypoints otherwise it is not accepted by the directionsService

//function is called from route.js
//dpRoute is a the Douglas-Peucker simplified route
function drawRoute (dpRoute) {
	var waypts = [];
	var segments = [];
	var origin, destination;
		
	for (var i = 0; i < dpRoute.length; i++) {				
		segments.push(dpRoute[i]);
		
		if (segments.length == 10) {
			origin = segments[0];
			destination = segments[segments.length - 1];
			
			for (var j = 1; j < segments.length - 1; j++) {
				waypts.push({
				location : segments[j],
				stopover : false
				});
			}
            
            //purely for display			
			invokeDirectionsService(origin, destination, waypts);
			waypts = [];
			segments = [];
			segments.push(dpRoute[i]);
		}
		
        //interesting bit here.. 
		if (segments.length <= 9 && (dpRoute.length - i) == 1) {
			origin = segments[0];
			destination = segments[segments.length - 1];
			
			for (var j = 1; j < segments.length - 1; j++) {
				waypts.push({
				location : segments[j],
				stopover : false
				});
			}
			
			invokeDirectionsService(origin, destination, waypts);
			waypts = [];
			segments = [];
		}		
	}
}


//TODO: return a route object with distance 
function invokeDirectionsService (origin, destination, waypts) {
//invokes the Google Maps directionsService
	
	if (waypts.length > 0) {
		var request = {
		origin: origin,
		destination: destination,
		waypoints: waypts,
		travelMode: mode
		};
	} else {
		var request = {
		origin: origin,
		destination: destination,
		travelMode: mode
		};
	}
	
	directionsService.route(request, function(response, status) {
		//alert(status);
		if (status == google.maps.DirectionsStatus.OK) {
			//display the result on the map using the built-in displayer
			
			var total_length = 0;
			
			for(var i=0; i<response.routes[0].legs.length; i++) {
			    total_length += response.routes[0].legs[i].distance.value;
			    
			}
			
			
			response.gmii_total_length = total_length;
			//alert(response.gmii_total_length);
			
			var newDisp = createDirectionsDisplay();
			newDisp.setDirections(response);
			directionsDisplay.push(newDisp);
		}
	});
}
