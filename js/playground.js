var count = 0;
function findPath(path, waypoints) {
  var points = path.points.slice(),
    result;

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

      var testPoints = findPath({points: testPoints}, testWaypoints);
      if (testPoints) {
        return testPoints;
      }
    }
  }

  if (!result) {
    console.debug('Could not find path between those two points');
    return [];
  }

  // check if we can remove any loops
  for (var start = 1; start < result.length-2; start++) {
    for (var count = 1; count < result.length-start; count++) {
      var testPath = result.slice();
      testPath.splice(start, count);

      var intersection = findFirstIntersection({points: testPath}, walls);
      if (!intersection) {
        result = testPath;
        start = 1;
        count = 1;
      }
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
