function findPath(path, waypoints, depth) {
  var points = path.points.slice();

  if (typeof depth === 'undefined') {
    depth = 0;
  }

  // try direct path
  var intersection = findFirstIntersection({points: points}, walls);
  if (!intersection) { return points; }

  else {

    if (waypoints.length === 0) {
      return null;
    }

    // if has intersections, try all paths with a single waypoint
    var sortedWaypoints = getSortedWaypoints(intersection, waypoints);
    for (var i = 0; i < sortedWaypoints.length; i++) {
      var testPoints = points.slice();
      testPoints.splice(-1, 0, sortedWaypoints[i]);
      console.log(depth, i);
      var testWaypoints = sortedWaypoints.slice();
      testWaypoints.splice(i, 1);
      var testPoints = findPath({points: testPoints}, testWaypoints, depth+1);
      if (testPoints) {
        return testPoints;
      }
    }

    //
    // return findPath({points: points}, sortedWaypoints.slice(1));
    // // if has intersections, try all paths with 2 waypoints
    // // ...
    // // if has intersections, try all paths with n waypoints
    //
  }
}


var validPoints = findPath(firstPath, waypoints);
console.log(validPoints);
path.datum(validPoints).attr('d', lineGen);
