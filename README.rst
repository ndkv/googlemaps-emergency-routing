====
gmER
====

**gmER is a Google Maps mashup that finds the shortest path between two points around a user-specified polygon.** The use case is the calculation of shortest paths in an urban environment that has a damaged infrastructure as the result of a (natural) disaster. 

This application stems from a practical assignment for the TU Delft Geomatics course Crisis Management. The application started out as a study on the feasibility of web mapping platforms to perform some basic spatial analyses that may be useful to rescue workers. It turns out that first responders still rely heavily on paper maps to mark blockages and navigate the road network. The advent of mobile devices brings more advanced and automatic means of performing these tasks.

The application consists of two parts: data collection and shortest path analysis. Recent disasters have demonstrated the crowd's power to aid the rescue process. This app enables people to collect infrastructure information from multiple sources, be it eye witness reports, news reports, satellite images, Twitter messages, etc. by letting them mark damaged infrastructure on a map. Once all damages are marked, a shortest path algorithm calculates the fastest route between two points taking the marked damages into account.  

The **desktop** version of the app is deployed at http://gmer.ndkv.nl/desktop/

The **mobile** version of the app is deployed at http://gmer.ndkv.nl/mobile/

The code lives at http://www.github.com/ndkv/gmer/

Usage
=====
Users create obstacles by placing polygons on a map. Each polygon represents an area impassable to the shortest path algorithm. Users can specify obstacle properties and attach comments to each one.  

Obstacles
---------
To create an obstacle left-click *Create Constraint* and click on the map to place polygon vertices.  The markers are draggable. The polygon vertices have to be placed in a clockwise order. Right-click to place the last marker and create the obstacle polygon. 

Route
-----
Click the *Create Route* button to start. A left-click creates the departing point, while a right-click creates the destination. Click *Build Route* to calculate the shortest path. The solution you get (blue line) is probably not so pretty (see below_). You can adjust it by hovering over the red line and moving the markers around. Hit *Recalculate Route* after you're done. 

Comments and properties
-----------------------
Clicking a polygon selects it. The *Properties* tab on the right of the desktop screen shows some basic polygon properties and some polygon management controls. Click *Update Constraint* to enter edit mode. Move the markers around and hit *Done* to save your changes. The *Comments* tab displays all comments for the selected polygon. 


How does it work?
=================
.. _below:

Coming soon... 

TO DO
=====
* Document and refactor code
* Implement POST instead of GET methods
* Twitter user login
* Make consistent status codesi
* Implement GeoJSON
* Make the desktop client mobile device friendly
* Automatic reload of comments after a new one has been submitted
* Export of route solutions in KML, GML, GeoJSON, etc.
* Redesign the interfaces

Publications
============

http://www.isprs.org/proceedings/XXXVIII/Gi4DM/CDDATA/authorIndex.html
