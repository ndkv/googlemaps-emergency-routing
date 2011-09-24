//calls rasterize, a_star and GDouglas_Peucker
//called directly from the button
function buildRoute() {
    var numberOfCells, raster, grid, gridRows, gridColumns, routeStartGrid;
    var routeEndGrid, gridTopLeftX, gridTopLeftY, aStarPath, stepLat, stepLng, xToLng, xToLat, dpPath;
    var origin, destination;
    var latLngPath = [], waypts = [];
    
    numberOfCells = document.getElementById("cellSize").value;
    alert(constraintConstructs.length);
    //global !!!!
    //routeStart = routeCoordinates[0];
    //routeEnd = routeCoordinates[1];
    
    //local
    var request = {
        origin: routeCoordinates[0],
        destination: routeCoordinates[1],
        travelMode: mode
    }
    
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            
            latLngPath.push(routeCoordinates[0]);
            
            var lengths = [];
            var id = {};
            
            for (var i=0; i < constraintConstructs.length; i++) {
                var contour = new Contour(constraintConstructs[i].getPath());
                
                var centroid_x = contour.centroid().x;
                var centroid_y = contour.centroid().y;
                //alert("distance: " + distance(centroid_x, centroid_y, routeCoordinates[0].lng(), routeCoordinates[0].lat()));
                var length = distance(centroid_x, centroid_y, routeCoordinates[0].lng(), routeCoordinates[0].lat());
                lengths.push(length);
                id[length] = i;
            }
            
            //TODO: figure out why the distances are not always right.. bell
            var sorted_length = lengths.sort(sortNumber);

            
            
            for (var k=0; k < sorted_length.length; k++) {
                //alert("sorted_length: " + sorted_length[k]);
                //alert("pk: " + constraintConstructs[id[sorted_length[k]]].gmii_id);
                
                //TODO: IMPLEMENT CHECK FOR EMPTY INTERSECTION

                var aStarCoordinate = routeConstraintIntersect(response, constraintConstructs[id[sorted_length[k]]]);
                
                var routeStart = aStarCoordinate[0];
                var routeEnd = aStarCoordinate[1];

                
                if (routeStart !=0 && routeEnd !=0) {
                    //alert('routeStart: ' + routeStart);
                    //alert('routeEnd: ' + routeEnd);
                
                    //call to rasterize function, defined in rastGrid.js
                    raster = rasterize(routeStart, routeEnd, constraintConstructs[id[sorted_length[k]]], numberOfCells);
                    grid = raster[0];
                    gridRows = document.getElementById("cellSize").value;
                    gridColumns = document.getElementById("cellSize").value;
                    routeStartGrid = raster[1];
                    routeEndGrid = raster[2];
                    
                    //call to a_star function, defined in aStart1.js
                    aStarPath = a_star(routeStartGrid, routeEndGrid, grid, gridRows, gridColumns);
                    alert("length: " + aStarPath.length);
                    gridTopLeftX = raster[3][0];
                    gridTopLeftY = raster[3][1];
                    stepLat = raster[3][2];
                    stepLng = raster[3][3];
                    
                    //alert(routeCoordinates[0]);
                    latLngPath.push(routeStart);

                    //transform the route as returned by the a_star algorithm to lat/lng so it can be fed to GDouglas-Peucker
                    for (var i = 1; i < aStarPath.length - 1; i++) {
                        xToLng = aStarPath[i].x*stepLng + gridTopLeftX;
                        xToLat = aStarPath[i].y*stepLat + gridTopLeftY;
                        latLngPath.push(new google.maps.LatLng(xToLat, xToLng));	
                    }
                    
                    latLngPath.push(routeEnd);
                } else {
                    alert(routeStart);
                    alert(routeEnd);
                }
            }
        
    
    
            latLngPath.push(routeCoordinates[1]);
                    
            //Douglas-Peucker, defined in DP.js
            dpPath = GDouglasPeucker(latLngPath, document.getElementById("dp").value);
            //draw the DP solution as a polyline
            drawDP(dpPath);
            //draw the Direction Service response based on DP
            drawRoute(dpPath);
            //visualize(grid, aStarPath);
            destroyMarkers();
            operatingMode = "";
        }
    });
}

function recalculateRoute() {
    var latLngPath = [];
    var dpPath, marker;
        
    if (polylineMarkers.length == 0) 
    {
        alert("You haven't made any changes to the route");
    } else {
        for (i in polylineMarkers) {
            marker = polylineMarkers[i];		
            latLngPath.push(marker.getPosition());
            marker.setMap(null);
        }
    
        destroyDirectionsDisplay();
        destroyDP();
        dpPath = GDouglasPeucker(latLngPath, document.getElementById("dp").value);
        drawDP(dpPath);
        drawRoute(dpPath);
    }
}



function destroyRoute() {
    destroyMarkers();
    routeCoordinates = [];

    //document.getElementById("destroyRoute").disabled = true;
    //document.getElementById("buildRoute").disabled = true;
    //document.getElementById("recalculateRoute").disabled = true;
    //document.getElementById("defineRoute").disabled = false;
    
    destroyDP();
    destroyDirectionsDisplay();
}

