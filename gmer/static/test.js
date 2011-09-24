/**
 * @author Siem
 */

function initialObject () {
    this.a = "test1";
    this.b = "test2";
    
    var c = 3;
    
    this.returnC = function () {
        return c;
    }
}


var currentObject = new initialObject();

alert("a: " + currentObject.a);
alert("b: " + currentObject.b);
alert("c: " + currentObject.c);
alert("d: " + currentObject.d);


initialObject.prototype.a = "a1";
initialObject.prototype.a = "a3";
initialObject.prototype.b = "b1";
initialObject.prototype.c = "c1";
initialObject.prototype.c = "czzz";

initialObject.prototype.d = "testZZZ";

/*
currentObject.a = "zzz1";
currentObject.b = "zzz1"
currentObject.c = "zzz1"
currentObject.d = "zzz1"
*/


alert("a1: " + currentObject.a);
alert("b1: " + currentObject.b);
alert("c1: " + currentObject.c);
alert("cget: " + currentObject.returnC());
alert("d1: " + currentObject.d);

secondObject = new initialObject();

alert("a2: " + secondObject.a);
alert("b2: " + secondObject.b);
alert("c2: " + secondObject.c);
alert("d2: " + secondObject.d);




