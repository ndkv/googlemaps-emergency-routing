//Utility library containing
//pointInPolygon(currentX, currentY, polygonPath)
//side_test(pointX, pointY, line) 
//line_intersection(first_line, second_line)
//boundingBox(polygonPaths)
//sortNumber(a, b) 
//distance(firstX, firstY, secondX, secondY)



function pointInPolygon(currentX, currentY, polygonPath) {
// A "winding" point in polygon algorithm. 

	var check = 0;
	var total = 0;
	var a, b, c, alpha, det;
	var stop;
	var polygonX = [];
	var	polygonY = [];

	for (var i = 0; i < polygonPath.getLength(); i++) {
		polygonX.push(polygonPath.getAt(i).lng());
		polygonY.push(polygonPath.getAt(i).lat());	
	}
	
	polygonX.push(polygonPath.getAt(0).lng());
	polygonY.push(polygonPath.getAt(0).lat());
	
	stop = polygonX.length - 1;
	
	for (var i = 0; i < stop; i++) {
		//cosine rule
		c = (Math.sqrt(Math.pow(currentX - polygonX[i+1],2) + Math.pow(currentY-polygonY[i+1],2)));	
		a = (Math.sqrt(Math.pow(polygonX[i+1]-polygonX[i],2) + Math.pow(polygonY[i+1] - polygonY[i],2)));
		b = (Math.sqrt(Math.pow(polygonX[i]-currentX,2) + Math.pow(polygonY[i]-currentY,2)));
		alpha = (180 / Math.PI) * (Math.acos((Math.pow(b,2) + Math.pow(c,2)-Math.pow(a,2))/(2*b*c)));
		
		/* Counterclockwise
		det = (polygonX[i+1]*polygonY[i] + polygonY[i+1]*currentX + polygonX[i]*currentY - polygonY[i]*currentX - polygonY[i+1]*polygonX[i] - polygonX[i+1]*currentY);				
		if (det < 0.0) {alpha = -alpha;}
			total = total + alpha;
		*/
		
		//Clockwise
		//det = (polygonX[i]*(polygonY[i+1] - currentY)) - (polygonX[i+1]*(polygonY[i]-currentY)) + (currentX*(polygonY[i] - polygonY[i+1]));
		det = side_test(currentX, currentY, new Array(new Array(polygonX[i], polygonY[i]), new Array(polygonX[i+1], polygonY[i+1])));
		if (det > 0.0) {
			alpha = -alpha;
		}		
		total = total + alpha;
		
	}
	
	if (total > 359.0) {
		check = 1;
	}
	
	return check;
}

function side_test(pointX, pointY, line) {
	//line: Array(Array(startX, startY), Array(endX, endY))
	
	//side test according to 
	//               | px py 1 |
	//side = det | rx ry 1 |
	//               | qx qy 1 |
	
	//return (polygonX[i]*(polygonY[i+1] - currentY)) - (polygonX[i+1]*(polygonY[i]-currentY)) + (currentX*(polygonY[i] - polygonY[i+1]));
	return (line[0][0]*(line[1][1] - pointY)) - (line[1][0]*(line[0][1]-pointY)) + (pointX*(line[0][1] - line[1][1]));
}

function line_intersection(first_line, second_line) {
	det1 = side_test(second_line[0][0], second_line[0][1], first_line);
	det2 = side_test(second_line[1][0], second_line[1][1], first_line);
	
	det3 = side_test(first_line[0][0], first_line[0][1], second_line);
	det4 = side_test(first_line[1][0], first_line[1][1], second_line);
	
	//alert("det1: " + det1 + " det2: " + det2 + " det3: " + det3 + " det4: " + det4);
	
	if ((det1 < 0 && det2 > 0) || (det1 > 0 && det2 < 0)) {
		//alert("det1 and det2 are of opposite sign");
		if ((det3 < 0 && det4 > 0) || (det3 > 0 && det4 < 0)) {
			alert("det3 and det4 are of opposite sign");
			return 1;
		}
	}
	
	return 0;
}

function boundingBox(polygonPaths) {
	//Creates a GM LatLngBounds from a polygon by finding the SouthWest 
	//and NorthEast max coords of said polygon
	
	var sortedX = [];
	var sortedY = [];
	var minLng, maxLng, minLat, maxLat;
	

	for (var i = 0; i < polygonPaths.length; i++) {
		sortedX.push(polygonPaths.getAt(i).lng());
		sortedY.push(polygonPaths.getAt(i).lat());
	}
	
	sortedX.sort(sortNumber);
	sortedY.sort(sortNumber);
	
	minLng = sortedX[0];
	maxLng = sortedX[sortedX.length - 1];
	minLat = sortedY[0];
	maxLat = sortedY[sortedY.length - 1];

	return new google.maps.LatLngBounds(new google.maps.LatLng(minLat, minLng), new google.maps.LatLng(maxLat, maxLng));
}

function sortNumber(a, b) { return a - b; }

function distance(firstX, firstY, secondX, secondY) {
//calculate the Cartesian distance between two points. 
	var dist = Math.sqrt(Math.pow(secondX - firstX,2) + Math.pow(secondY - firstY,2));
	return dist;
}

//
// BOARD DISPLAY
//
//displays the board
function visualize(board, path) {
    w = window.open();
    w.document.open();
    w.document.write("<html><head></head><body>");
    w.document.write("<table>");
    var rows = board.length;
    var columns = board.length;
    
    /*
    for (var i = 0; i < path.length; i++) {
        w.document.write("<tr>");
        w.document.write("<td>");
        w.document.write("x:" + path[i].x + " y:" + path[i].y);
        w.document.write("</td>");
        w.document.write("</tr>");  
    }
    */
    
    w.document.write("</table>");
    
    for (var y = 0; y < rows; y++)
    {
        w.document.write("<div>");
        for (var x = 0; x < columns; x++)        
        {
            w.document.write("<div id='board_"+x+"_"+y+"' style='"
                        + "float: left;"
                        + " width: 10; height: 10;"
                        + " border: thin solid black;"
                        + " background-color: "+(board[x][y] == 0 ? "white" : "black")
                        + "'></div>");
        }
      w.document.write("<div style='clear: both;'></div>");
      w.document.write("</div>");
    }

     for (var i = 0; i < path.length; i++) {
            w.document.getElementById("board_" + path[i].x + "_" + path[i].y).style.backgroundColor = "red";
    }
    w.document.write("</body></html>");
}