var count = 0;
function findPath(path, waypoints, obstacles) {
  var points = path.points.slice(),
    result;

  // try direct path
  var intersection = findFirstIntersection({points: points}, obstacles);
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
      var segmentIntersection = findFirstIntersection({points: testPoints.slice(-3,-1)}, obstacles);
      if (segmentIntersection) {
        continue;
      }

      var testPoints = findPath({points: testPoints}, testWaypoints, obstacles);
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

      var intersection = findFirstIntersection({points: testPath}, obstacles);
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

var colorScale = d3.scale.linear()
  .range(['#00cc00', '#ffcc00', '#cc0000'])
  .domain([0,0.5,1]);

var testPaths = [{
  label: 'circle0 to circle1',
  type: 'L',
  value: 0.1,
  points: [
    {x: pois[0].cx, y: pois[0].cy},
    {x: pois[1].cx, y: pois[1].cy},
  ],
  intersections: []
},{
  label: 'circle0 to circle2',
  type: 'L',
  value: 1,
  points: [
    {x: pois[0].cx, y: pois[0].cy},
    {x: pois[2].cx, y: pois[2].cy},
  ],
  intersections: []
},{
  label: 'circle0 to circle3',
  type: 'L',
  value: 0.5,
  points: [
    {x: pois[0].cx, y: pois[0].cy},
    {x: pois[3].cx, y: pois[3].cy},
  ],
  intersections: []
},{
  label: 'circle0 to circle4',
  type: 'L',
  value: 0.2,
  points: [
    {x: pois[0].cx, y: pois[0].cy},
    {x: pois[4].cx, y: pois[4].cy},
  ],
  intersections: []
}];

var lineGen = d3.svg.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; })
  .interpolate('cardinal');


function drawPaths() {
  var path = d3.select('svg g#paths')
    .selectAll('path.path')
    .data(testPaths);

  path.exit().remove();

  path.enter()
    .append('path')
      .classed('path', true)
      .attr({
        d: function(d) {
          var points = findPath(d, waypoints, walls);
          return lineGen(points);
        },
        'stroke-width': function(d) {
          return d.value * 10;
        },
        'stroke': function(d) {
          return colorScale(d.value);
        }
      });
}

drawPaths();
