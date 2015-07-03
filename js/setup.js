var paths = [];

var firstPath = {
  label: 'circle0 to circle1',
  type: 'L',
  points: [
    {x: pois[0].cx, y: pois[0].cy},
    {x: pois[1].cx, y: pois[1].cy},
  ],
  intersections: []
};

// draw the walls
d3.select('svg g#walls')
  .selectAll('path.wall')
  .data(walls)
  .enter()
    .append('path')
    .classed('wall', true)
    .attr({
      d: pathData,
      name: elemLabel
    });

// annotate the wall coordinates
var annotations = d3.select('svg g#annotations')
  .selectAll('text.annotation')
    .data(walls).enter();

annotations.append('text')
  .classed('annotation', true)
  .attr({
    x: function(d) { return d.points[0].x; },
    y: function(d) { return d.points[0].y; },
    'text-anchor': 'start'
  })
  .text(function(d) {
    return ''+d.points[0].x+','+d.points[0].y;
  });

annotations.append('text')
  .classed('annotation', true)
  .attr({
    x: function(d) { return d.points[d.points.length-1].x; },
    y: function(d) { return d.points[d.points.length-1].y; },
    'text-anchor': 'start'
  })
  .text(function(d) {
    return ''+d.points[d.points.length-1].x+','+d.points[d.points.length-1].y;
  });

// draw the POIs
d3.select('svg g#pois')
  .selectAll('circle.poi')
  .data(pois)
  .enter()
    .append('circle')
    .classed('poi', true)
    .attr({
      name: elemLabel,
      cx: function(d) { return d.cx; },
      cy: function(d) { return d.cy; },
      r: function(d) { return d.r; },
    });

d3.select('svg g#waypoints')
  .selectAll('circle.waypoint')
  .data(waypoints)
  .enter()
    .append('circle')
    .classed('waypoint', true)
    .attr({
      cx: function(d) { return d.x; },
      cy: function(d) { return d.y; },
      r: 5
    });

d3.select('svg g#waypoints')
  .selectAll('text.annotation')
  .data(waypoints)
  .enter()
    .append('text')
    .classed('annotation', true)
    .attr({
      x: function(d) { return d.x; },
      y: function(d) { return d.y; }
    })
    .text(function(d, i) {return i;});

// draw our test path
d3.select('svg g#paths')
  .append('path')
    .classed('path', true)
    .datum(firstPath)
    .attr('d', pathData);

var lineGen = d3.svg.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; })
  .interpolate('cardinal');

var path = d3.select('svg g#paths')
  .append('path')
    .classed('path alternative', true)
    .datum(firstPath.points)
    .attr('d', lineGen);

// // calculate intersections points for the test path
// var intersection = findFirstIntersection(firstPath, walls);
//
// // display intersections
// // showIntersections([intersectingLine]);
// var sortedWaypoints = getSortedWaypoints(intersection, waypoints);
// var depth = 0;
// var heap = [];
//
//
//
// var findPath = function(depth) {
//   var viablePath;
//   for (var i = 0;  i < depth; i++) {
//     findPath(depth-1)
//   }
// };
//
// while (intersection && sortedWaypoints.length >= 0) {
//   if (sortedWaypoints.length === 0) {
//     sortedWaypoints = getSortedWaypoints(intersection, waypoints);
//     if (depth < sortedWaypoints.length) {
//       heap = [sortedWaypoints[depth]];
//
//     } else {
//       break;
//     }
//   }
//
//   console.log(intersection);
//   appendCircle(intersection);
//   // var completePath = findPath(intersection, waypoints, firstPath.points, walls)
//   var waypoint = sortedWaypoints[0];
//   var sortedWaypoints = getSortedWaypoints(intersection, sortedWaypoints.slice(1));
//
//   var testPath = {points: firstPath.points.slice()};
//
//   heap.forEach(function(wp) {
//     testPath.points.splice(-1,0,wp);
//   });
//
//   testPath.points.splice(-1,0,waypoint);
//   intersection = findFirstIntersection(testPath, walls);
//
//   path.datum(testPath.points).attr('d', lineGen);
//
//   depth++;
// }






// extrapolate new coordinates based on intersections
// while (intersectingLines.length > 0) {
//   var line = intersectingLines.shift();
//
//   line.intersection.points
//     .forEach(function(subject) {
//       // var closestWaypoint = getNextWaypoint(subject, waypoints, line);
//       //
//       // var checkPoints = firstPath.points.slice().splice(-1, 0, closestWaypoint);
//       // var checkIntersections = findIntersections({points: checkPoints}, walls);
//       //
//       // if (checkIntersections.length === 0) {
//       //   firstPath.points.splice(-1, 0, closestWaypoint);
//       // } else {
//       //   return;
//       // }
//
//
//       console.log(complatePath);
//     });
//   // if (intersectingLines.length === 0) {
//   //   intersectingLines = findIntersections(firstPath, walls);
//   // }
// }


//
// d3.select('svg g#paths')
//   .append('path')
//     .classed('path alternative', true)
//     .datum(firstPath.points)
//     .attr('d', lineGen);
//
// intersectingLines = findIntersections(firstPath, [walls[6]]);
//
// showIntersections(intersectingLines);

