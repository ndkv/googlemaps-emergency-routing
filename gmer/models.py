from django.contrib.gis.db import models

# Create your models here.
class Obstacle(models.Model):
    #obstacle_id = models.IntegerField()
    creator_comment = models.TextField(null=True)
    
class Comment(models.Model):
    obstacle = models.ForeignKey('Obstacle')
    content = models.TextField()
    date = models.DateTimeField()
    user = models.CharField(max_length=100)
    
class PointObstacle(models.Model):
    geom = models.PointField()
    date = models.DateTimeField()
    
class Version(models.Model):
    obstacle = models.ForeignKey('Obstacle')
    version = models.IntegerField()
    date = models.DateTimeField()
    
    geom = models.PolygonField()
    objects = models.GeoManager()
    
class Route(models.Model):
    geom = models.LineStringField();