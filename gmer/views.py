from gmer.models import Obstacle, Comment, PointObstacle, Version, Route
from django.http import HttpResponse
from django.shortcuts import render_to_response
from utils.gft import FusionTables
from django.db.models import Max
import json
import datetime

#TODO: impelement POST
#TODO: chnage status codes to machine readable i.e. 0/1 true/false 

def add_comment(request):
    content = request.GET['comment']
    obstacle_id = request.GET['obstacle_id']
    user = request.GET['user']
    
    comment = Comment()
    comment.content = content
    comment.obstacle = Obstacle.objects.get(pk=obstacle_id);
    comment.date = datetime.datetime.now()
    comment.user = user
    
    #TODO: catch certain exceptions, not all
    try:
        comment.save()
        response = {"status":"Success!"}
    except:
        response = {"status":"Failure"}
        
    return HttpResponse(json.dumps(response))

#TODO: implement the single version get_comment     
def get_comments(request):
    id = request.GET['obstacle_id']
    
    comments = Comment.objects.filter(obstacle=id)
    result = [{"id": item.id, "content": item.content, "user": item.user, "year": item.date.year, 
    "month": item.date.month, "day": item.date.day, "hour": item.date.hour, "minute":item.date.minute, 
    "second": item.date.second} for item in comments]
    
    if len(comments) != 0:
        response = {"status": "Success!", "comments": result}
    else:
        response = {"status":"Failure!", "message":"This polygon has no comments."}

    return HttpResponse(json.dumps(response))

def set_geometry(request):
        geom = request.GET['geometry']   
        creator_comment = request.GET['user_comment']
        
        #try:
        #    id = Obstacle.objects.only('obstacle_id').order_by('-obstacle_id')[0].obstacle_id + 1
        #except IndexError:
        #    id = 0
    
        obstacle = Obstacle()
        #obstacle.obstacle_id = id
        obstacle.creator_comment = creator_comment
        obstacle.save()
        
        version = Version()
        #version.obstacle = Obstacle.objects.get(obstacle_id=id)
        version.obstacle = obstacle
        version.version = 0
        version.date = datetime.datetime.now()
        version.geom = geom
        #obstacle.geom = 'POLYGON((0.0 0.0, 1.0 0.0, 1.0 1.0, 0.0 1.0, 0.0 0.0))'
        
        version.save()
        response = {"status":"Success!", "pk":obstacle.pk, "version":version.version}
    
        ### FUSION TABLES
        #print "Fusing"
        #try:
        #    gft = FusionTables(version.geom.kml)
        #    gft.save()
        #except AttributeError:
        #    print "GFT save failed";
 
        return HttpResponse(json.dumps(response))
    
def update_geometry(request):
    id = request.GET['id']
    geom = request.GET['geometry']
        
    latest_version = Version.objects.filter(obstacle=id).order_by('-version')[0].version
        
    version = Version()
    version.obstacle = Obstacle.objects.get(pk=id)
    version.version = latest_version + 1
    version.date = datetime.datetime.now()
    version.geom = geom
    version.save()
    
    response = {"status":"Success!", "version":version.version}
    
    return HttpResponse(json.dumps(response))
    
        
def get_geometry(request):

    #geometries = [obst.geom.geojson for obst in Obstacle.objects.all()]
    geom = []
    
    max_versions = Version.objects.values('obstacle').annotate(Max('version'))
    
    for objects in max_versions:
        item = Version.objects.get(obstacle=objects['obstacle'], version=objects['version__max'])
        comments = Comment.objects.filter(obstacle=item.obstacle.pk).count()
        
        geom.append({"version":item.version, "comments":comments, "pk":item.obstacle.pk, "geometry":{"type": item.geom.geom_type, "coordinates":item.geom.coords}})
    
    #for item in Obstacle.objects.all():        
    #    geom.append({"version":item.version, "pk":item.obstacle_id, "geometry":{"type": item.geom.geom_type, "coordinates":item.geom.coords}})
    
    if len(geom) == 0:
        response = {"status":"Database is empty"}
    else:
        response = {"status":"Sucess!", "objects":geom}
        
    return HttpResponse(json.dumps(response))
        
def delete_geometry(request):
    pk_delete = request.GET['pk']
#    try:
#        Obstacle.objects.get(obstacle_id=pk_delete, version=version).delete()
#        response = json.dumps({"status":"Success!"})
#    except Obstacle.DoesNotExist:
#        response = json.dumps({"status":"Failure, the polygon is not stored in the database."})

    for obstacle in Obstacle.objects.filter(pk=pk_delete):
        obstacle.delete()
        response = json.dumps({"status":"Success!"})
    
    return HttpResponse(response)

def set_point(request):
    geom = request.GET['geometry']
    
    obstacle = PointObstacle()
    obstacle.geom = geom
    obstacle.date = datetime.datetime.now()
    #obstacle.geom = 'POLYGON((0.0 0.0, 1.0 0.0, 1.0 1.0, 0.0 1.0, 0.0 0.0))'
    obstacle.save()
    
    response = {"status":"Success!", "pk":PointObstacle.objects.only('id').order_by('-id')[0].id}
    
    return HttpResponse(json.dumps(response))
    
def get_points(request):
    geom = []
        
    for item in PointObstacle.objects.all():
        geom.append({"pk":item.pk, "geometry":{"type": item.geom.geom_type, "coordinates":item.geom.coords}})
    
    if len(geom) == 0:
        response = {"status":"Database is empty"}
    else:
        response = {"status":"Sucess!", "objects":geom}
        
    return HttpResponse(json.dumps(response))

def set_route(request):
    geom = request.GET['geometry']
    
    route = Route()
    route.geom = geom
    route.save()
    
    return HttpResponse(json.dumps({"status":"Success!"}))

def get_route(request):
    geom = []
    
    for geometry in Route.objects.all(): 
        geom.append({"geometry":geometry.geom.coords})
        
    return HttpResponse(json.dumps({"status":"success!", "objects":geom}))
