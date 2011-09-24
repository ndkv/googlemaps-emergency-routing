//COMMENTS
function send_comment() {
    var content = $("#content").val();
    var user = "Klaas";
    var obstacle_id = current_selection.gmii_id;
    
    
    if (content === "") {
        alert("Please fill in a value...");
    } else {
        $.get(server + "add_comment/", {"user": user, "comment": content, "obstacle_id":obstacle_id}, function(data) {            
            var parsed = $.parseJSON(data);
            $("#status").html(parsed.status);           
        })
    }
}


//TODO: return the contents of the comments, do not print them here. 
function get_comments() {
    if (current_selection !== null) {
        $("#comments-content").html("");
        
        $.get(server + "get_comments/",{"obstacle_id": current_selection.gmii_id}, function(data) {
            
            
            var parsed = $.parseJSON(data);
            var comments = parsed.comments;
            
            if (parsed.status !== "Failure!") {
                $.each(comments, function (index, value) {        
                    var html = "<div id='inner-content'>";
                    html += "<div id='comment_header'>";
                        html += "<div id='user'>User: " + value.user + "</div>";
                        html += "<div id='date'>Date: " + value.year + "/" + value.month + "/" + value.day + "</div>";
                    html += "</div><div>";
                        html += "<div id='comment_content' class='comment_contentzz'>" + value.content + "</div>";
                    html += "</div>";
                    
                    //$("#comments-content").append(html).page();                
                    $("#comments-content").append(html);
//                    $("#comment-content").addClass("comment-content");
                });
            } else {
                $("#comments-content").append("No comments");
            }
        });
    }
}


//
//GET - AJAX!
//
//
//TODO: return the coordinates, do not draw them here.. how to do this? 
function get_constraints() {
    
    $.get(server + "get_geometry/", function(data) {

        $("#output").html(data);
        
        var parsed = $.parseJSON(data);
        var obstacles = parsed.objects;
        
        if (obstacles !== undefined) {
            $.each(obstacles, function(index, obstacle) {
                var new_constraint = draw_constraint(obstacle);
                new_constraint.gmii_id = obstacle.pk;
                new_constraint.gmii_version = obstacle.version;
                new_constraint.gmii_num_comments = obstacle.comments
            });
                        
        } else {
            $("#status").html("The database is empty.");
        }
    }).error(function(request, error) {
            if (request.status === 0) { alert("Same origin policy?"); }
    });
}


function draw_constraint(obstacle) {
    var coordinates = obstacle.geometry.coordinates[0] //we do not expect holes
    var path = [];
    
    $.each(coordinates, function(index, coordinate_pair) {
       var lat = parseFloat(coordinate_pair[1]);
       var lng = parseFloat(coordinate_pair[0]);
       path.push(new google.maps.LatLng(lat,lng));
    });
    
    path.pop();
    return buildConstraint(path);
}
    /*
    $.each(obstacles, function(index, obstacle) {
        var coordinates = obstacle.geometry.coordinates[0]; //we do not expect holes
    
        var path = [];
        $.each(coordinates, function(index, coordinate_pair) {
            var lat = parseFloat(coordinate_pair[1]);
            var lng = parseFloat(coordinate_pair[0]);
            path.push(new google.maps.LatLng(lat,lng))        
        });
    
        var bermudaTriangle = new google.maps.Polygon({
            paths: path,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35
        });
    
        bermudaTriangle.pk = obstacle.pk;

        bermudaTriangle.setMap(map);
        constraintConstructs.push(bermudaTriangle);
        google.maps.event.addListener(bermudaTriangle, 'click', constraint_select)
    });
}
*/

//
//SAVE - AJAX!
//
//
function to_wkt(constraint)
{
    //alert("Save!");
    
    var path = constraint.getPath();
    var path_length = path.getLength();
    var wkt = "POLYGON((";

    
    for (var i=0; i < path_length - 1; i++) {
        wkt += String(path.getAt(i).lng()) + " " + String(path.getAt(i).lat()) + ", ";
    }
    
    wkt += String(path.getAt(path_length - 1).lng()) + " " + String(path.getAt(path_length - 1).lat()) + ", ";
    wkt += String(path.getAt(0).lng()) + " " + String(path.getAt(0).lat())+ "))";
    //alert(wkt);
    
    return wkt;
//    }
    
}

function save_constraint(constraint) {
    var geom = to_wkt(constraint);
    
    $.get(server + "set_geometry/", {geometry: geom, user_comment:"empty.. "}, function(data) {
        
        var parsed = $.parseJSON(data);
        
        $("#status").html("Save: " + parsed.status);

        constraint.gmii_id = parsed.pk;
        constraint.gmii_version = 0
    });
}


function save_updated_constraint(constraint) {
    var geom = to_wkt(constraint);
    alert(geom);
    
    alert("updating");
    $.get(server + "update_geometry", {geometry:geom, id:constraint.gmii_id}, function(data) {
        var parsed = $.parseJSON(data);
        alert(parsed.version);
        
        constraint.gmii_version = parsed.version;       
    })
}
//
//DELETE - AJAX!
//
//

function delete_constraint() {
    var current_pk = current_selection.gmii_id;
    $.get(server + "delete_geometry/", {pk:current_pk}, function(data) {
        var parsed = $.parseJSON(data);
        $("#status").html("Delete polygon with ID " + String(current_pk) + ": " + parsed.status);
    });
    
    constraintConstructs.pop();
    current_selection.setMap(null);
    current_selection = null;
}

function get_point_constraints() {
    $.get(server + "get_points/", function(data) {
        var parsed = $.parseJSON(data)
        var objects = parsed.objects;
        
        if (objects !== undefined) {
            $.each(objects, function(index, value) {
                var coords = value.geometry.coordinates
                placeMarker(new google.maps.LatLng(coords[0], coords[1]));
            });
           
        } else {
            $("#status").html("The database is empty.");
        }
        

        
    });
}

function set_route(polyline) {
    var wkt = "LINESTRING(";
    var route = polyline.getPath(); 
    
    for (var i=0; i < route.length - 1; i++){
        wkt += route.getAt(i).lat() + " " + route.getAt(i).lng() + ", ";
    }
    
    wkt += route.getAt(route.length - 1).lat() + " " + route.getAt(route.length - 1).lng() + ")";
    //alert(wkt);
    
    $.get(server + "set_route/", {geometry: wkt}, function(data) {});    
}

function get_route() {
    $.get(server + "get_route/", function(data) {
       var parsed = $.parseJSON(data);
       var objects = parsed.objects
       
       $.each(objects, function(index, value) {
           var path = [];
           
           $.each(value.geometry, function(index, coords) {
               path.push(new google.maps.LatLng(coords[0], coords[1]));
           });
           
           //alert(path);
           drawDP(path);           
       });
    });
    
}
