function rasterize(start, end, polygon, numberOfCells) {
// Rasterazation of the constraint(s) and start/end points of the route
	//Latitude -> local Y-coordinate
	//Longitude -> local X-coordinate
  
	var start = new Array(start.lng(), start.lat());
	var end = new Array(end.lng(), end.lat());
	var numCells = numberOfCells;
	var polygonPaths = polygon.getPath();    //MVCArray
	var stepLat, stepLng;
	var grid = [];
	var gridStartX, gridStartY, bbox;

	bbox = boundingBox(polygonPaths);
	
	var definedGrid = defineGrid(bbox, start, end, numCells);
	//var definedGrid = defineGrid(sortedX, sortedY, start, end, numCells);
	gridStartX = definedGrid[0];
	gridStartY = definedGrid[1];
	stepLat = definedGrid[2];
	stepLng = definedGrid[3];

	for (var i = 0; i < numCells; i++) { grid[i] = new Array(numCells);}
	
		for (var y = 0; y < numCells; y++) {
			var currentLat = gridStartY + (y * stepLat);
		
			for (var x = 0; x < numCells; x++) {
				var currentLng = gridStartX + (x * stepLng);
			
				if (bbox.contains(new google.maps.LatLng(currentLat, currentLng))) {
					grid[x][y] = pointInPolygon(currentLng, currentLat, polygonPaths);
				} else {
					grid[x][y] = 0;
				}	
		};
	};
	
	var lngLat2gridStartX = Math.round((start[0] - gridStartX) / stepLng);
	var lngLat2gridStartY = Math.round((start[1] - gridStartY) / stepLat);
	var lngLat2gridEndX = Math.round((end[0] - gridStartX) / stepLng);
	var lngLat2gridEndY = Math.round((end[1] - gridStartY) / stepLat);
	
	return new Array (grid, new Array(lngLat2gridStartX,lngLat2gridStartY), new Array(lngLat2gridEndX,lngLat2gridEndY), definedGrid);
}

function defineGrid(bbox, start, end, numCells) {
//function defineGrid(sortX, sortY, start, end, numCells) {

// creates the grid

	var startX = start[0];
	var startY = start[1];
	var endX = end[0];
	var endY = end[1];
	
	//var boundingBox = new google.maps.LatLngBounds(new google.maps.LatLng(minLat, minLng), new google.maps.LatLng(maxLat, maxLng));
	var rect = new google.maps.Rectangle({
	bounds : bbox,
	fillColor: "#FF0000",
	fillOpacity: 0.35,
	strokeColor: "#FF0000",
	strokeOpacity: 0.8,
	strokeWeight: 2	
	});
//	rect.setMap(map);

	var centerX = bbox.getCenter().lng();
	var centerY = bbox.getCenter().lat();
	var upperRightX = bbox.getNorthEast().lng();
	var upperRightY = bbox.getNorthEast().lat();
	
	var firstDist = distance(startX,startY,centerX,centerY);
	var secondDist = distance(endX,endY,centerX,centerY);
	var thirdDist = distance(centerX,centerY,upperRightX,upperRightY);
	
	if (firstDist < thirdDist && secondDist < thirdDist) {
		gridStartX = bbox.getSouthWest().lng() - thirdDist;
		gridStartY = bbox.getNorthEast().lat() + thirdDist;
		gridEndX = bbox.getNorthEast().lng() + thirdDist;
		gridEndY = bbox.getSouthWest().lat() - thirdDist;		
	} else {
		if (firstDist > secondDist) {
			gridStartX = bbox.getSouthWest().lng() - firstDist;
			gridStartY = bbox.getNorthEast().lat() + firstDist;
			gridEndX = bbox.getNorthEast().lng() + firstDist;
			gridEndY = bbox.getSouthWest().lat() - firstDist;			
		} else {
			gridStartX = bbox.getSouthWest().lng() - secondDist;
			gridStartY = bbox.getNorthEast().lat() + secondDist;
			gridEndX = bbox.getNorthEast().lng() + secondDist;
			gridEndY = bbox.getSouthWest().lat() - secondDist;
		}
	}
	
	var stepLat = (gridEndY - gridStartY) / numCells;
	var stepLng = (gridEndX - gridStartX) / numCells;
	
	return new Array(gridStartX, gridStartY, stepLat, stepLng);
}
