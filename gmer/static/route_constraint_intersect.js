function routeConstraintIntersect(response, constraintPolygon) {
//checks whether the route returned form the directionsService intersects with the
//constraint and if it does, returtns the route points just outside the 
//constraint
    
    var enterCoordinate = 0;
    var exitCoordinate = 0;
    //var newDisp = createDirectionsDisplay();
    //constraintConstructs -> constraint polygon
    var constraintPath = constraintPolygon.getPath();
    
    //boundingBox -> boundingBox.js
    var bbox = boundingBox(constraintPath);
    var bboxNELat = bbox.getNorthEast().lat();
    var bboxNELng = bbox.getNorthEast().lng();
    
    //alert("Initial route!");
    
    //newDisp.setDirections(response);
    //directionsDisplay.push(newDisp);
    
    var rect = new google.maps.Rectangle({
    bounds : bbox,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2	
    });
    //rect.setMap(map);
    
    var startLeg, endLeg;
    var inside = false;
    //var distToConstraint = distance(routeCoordinates[0].lng(), routeCoordinates[0].lat(), routeCoordinates[1].lng(), routeCoordinates[1].lat());
    var breakLoop = 0;
    

    for (var i = 0; i < response.routes[0].legs[0].steps.length; i++) {			
        for (var j = 0; j < response.routes[0].legs[0].steps[i].path.length; j++) {
            var current = response.routes[0].legs[0].steps[i].path[j];
            var currentX = current.lng();
            var currentY = current.lat();
            
            var title = "step: " + i + " path: " + j;
            //placeMarkerTitle(current, title);
            
            if (bbox.contains(current)) {
                if (pointInPolygon(currentX, currentY, constraintPath) == 1) {
                    if (enterCoordinate == 0) {
                        if (j > 0) {
                            enterCoordinate = response.routes[0].legs[0].steps[i].path[j - 1];
                        } else {
                            enterCoordinate = response.routes[0].legs[0].steps[i - 1].path[path.length - 1];
                        }
                    }
                    
                    inside = true;
                } else {
                    if (inside == true && exitCoordinate == 0) { 
                        exitCoordinate = current;
                        inside = false;
                    }
                }
            } else {
                if (inside == true) {
                    exitCoordinate = current;
                    inside = false;
                }

            }
        }
    }
    
    if (enterCoordinate == 0 && exitCoordinate == 0) {
        //alert('enterCoordinate = 0 AND exitCoordinate = 0');
                
        for (var i = 0; i < response.routes[0].legs[0].steps.length; i++) {			
            for (var j = 0; j < response.routes[0].legs[0].steps[i].path.length - 1; j++) {
                var current = response.routes[0].legs[0].steps[i].path[j];
                var next = response.routes[0].legs[0].steps[i].path[j+1];
                //var currentX = current.lng();
                //var currentY = current.lat();
                
                var first_segment = new Array(new Array(current.lng(), current.lat()), new Array(next.lng(), next.lat()));
                //alert("segment: " + j + " of: " + response.routes[0].legs[0].steps[i].path.length/2 + " segments");
                
                for (var k = 0; k < constraintPath.getLength() - 1; k++) {
                    var current_path = constraintPath.getAt(k);
                    var next_path = constraintPath.getAt(k+1);
                    var second_segment = new Array(new Array(current_path.lng(), current_path.lat()), new Array(next_path.lng(), next_path.lat()));
                    
                    var test234 = line_intersection(first_segment, second_segment)
                    
                    if (test234 == 1) {
                        alert('YES!');
                        enterCoordinate = current;
                        exitCoordinate = next;
                    }
                    
                }
                
                /*
            
                var newDistToConstraint = distance(currentX, currentY, bboxNELng, bboxNELat);				
                //alert(distToConstraint);
                //alert(newDistToConstraint);
                //alert(newDistToConstraint < distToConstraint);
                        
                if (newDistToConstraint > distToConstraint) {
                    alert("Experiment!");
                    var enterTempCoordinate;
                    
                    if (j > 0) {
                        enterTempCoordinate = response.routes[0].legs[0].steps[i].path[j - 1];
                    } else {
                        enterTempCoordinate = response.routes[0].legs[0].steps[i - 1].path[path.length - 1];
                    }
                    
                    alert("i: " + i + "j: " + j);
                    
                    distToStart1 = distance(enterTempCoordinate.lng(), enterTempCoordinate.lat(), routeCoordinates[0].lng(), routeCoordinates[0].lat());
                    distToStart2 = distance(current.lng(), current.lat(), routeCoordinates[0].lng(), routeCoordinates[0].lat());
                    
                    if (distToStart1 < distToStart2) {
                        enterCoordinate = enterTempCoordinate;
                        exitCoordinate = current;
                    } else {
                        enterCoordinate = current;
                        exitCoordinate = enterTempCoordinate;
                    }
                    
                    alert("Enough! Breaking!");
                    breakLoop = 1;
                    break;
                }
                
                distToConstraint = newDistToConstraint;
                
                */
            }
            
        //if (breakLoop == 1) { break; }
        }
        

    }
    
    
    //alert(enterCoordinate);
    
    if (enterCoordinate !=0 && exitCoordinate !=0) {
        
        placeMarker(enterCoordinate, false);
        //alert(exitCoordinate);
        placeMarker(exitCoordinate, false);
        //alert("Got it!");
    
    } else {
        //lert('Got nothin!');
    }
    
    return new Array(enterCoordinate, exitCoordinate);
}