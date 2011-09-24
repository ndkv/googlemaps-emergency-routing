// code: raymond hill
// theory: paul bourke
// url: http://paulbourke.net/geometry/polyarea/



// Point object
function Point(x,y) {
   this.x=x;
   this.y=y;
}

// Contour object
function Contour(a) {
   this.pts = []; // an array of Point objects defining the contour
     
   for (var i=0; i < a.length; i++) {
       //pritn(a.getAt(i))
       this.pts.push(new Point(a.getAt(i).lng(), a.getAt(i).lat()));
   }   
}
// ...add points to the contour...

Contour.prototype.area = function() {
   var area=0;
   var pts = this.pts;
   var nPts = pts.length;
   //var j=nPts-1;
   var p1; var p2;

   for (var i=0;i<nPts - 1;i++) {
      p1=pts[i]; p2=pts[i+1];
      area+=p1.x*p2.y;
      area-=p1.y*p2.x;
   }
   area/=2;
   return area;
};

Contour.prototype.centroid = function() {
   var pts = this. pts;
   var nPts = pts.length;
   var x=0; var y=0;
   var f;
   //var j=nPts-1;
   var p1; var p2;

   for (var i=0;i<nPts - 1;i++) {
      p1=pts[i]; p2=pts[i+1];
      f=p1.x*p2.y-p2.x*p1.y;
      x+=(p1.x+p2.x)*f;
      y+=(p1.y+p2.y)*f;
   }
   //alert("x: " + x + " y: " + y + " f: " + f);

   f=this.area()*6;
   //return new Point({x: x/f,y:y/f});
   return new Point(x/f, y/f);
};
