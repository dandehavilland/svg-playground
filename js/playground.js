var count = 0;
function findPath(path, waypoints, depth) {
  var points = path.points.slice(),
    result;

  if (typeof depth === 'undefined') {
    depth = 0;
  }

  // try direct path
  var intersection = findFirstIntersection({points: points}, walls);
  if (!intersection) {
    result = points;
  }
  else {

    if (waypoints.length === 0) {
      return null;
    }

    // if has intersections, try all paths with a single waypoint
    var sortedWaypoints = getSortedWaypoints(intersection, waypoints);
    for (var i = 0; i < sortedWaypoints.length; i++) {
      count++;
      var testPoints = points.slice();
      testPoints.splice(-1, 0, sortedWaypoints[i]);

      var testWaypoints = sortedWaypoints.slice();
      testWaypoints.splice(i, 1);

      // check if the last 2 waypoints are directly connected
      var segmentIntersection = findFirstIntersection({points: testPoints.slice(-3,-1)}, walls);
      if (segmentIntersection) {
        continue;
      }

      var testPoints = findPath({points: testPoints}, testWaypoints, depth+1);
      if (testPoints) {
        return testPoints;
      }
    }
  }

  // second pass on the waypoints to check if they're all strictly necessary
  for (var i = result.length-2; i > 0; i--) {
    var testPath = result.slice();
    testPath.splice(i,1);
    var intersection = findFirstIntersection({points: testPath}, walls);
    if (!intersection) {
      result.splice(i,1);
      i++;
    }
  }

  return result;
}

var ITERATIONS = 1;

d3.select('svg').on('click', function() {
  var then = new Date();
  for (var i = 0; i < ITERATIONS; i++) {
    var coords = d3.mouse(this);
    firstPath.points[1] = {x: coords[0], y: coords[1]};
    var validPoints = findPath(firstPath, waypoints);
    path.datum(validPoints).attr('d', lineGen);
  }
  var now = new Date();

  console.log(ITERATIONS, ' iterations:', now-then, 'ms');
});
