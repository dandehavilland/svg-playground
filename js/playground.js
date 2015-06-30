var paths = [];

var firstPath = {
  label: 'circle0 to circle1',
  type: 'L',
  points: [
    {x: pois[0].cx, y: pois[0].cy},
    {x: pois[1].cx, y: pois[1].cy},
  ]
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

// draw our test path
d3.select('svg g#paths')
  .append('path')
    .classed('path', true)
    .datum(firstPath)
    .attr('d', pathData);

// calculate intersections points for the test path
var intersectingLines = [];
walls.forEach(function(wall, idx) {
  intersectingLines = intersectingLines.concat(calcIntersections(firstPath, wall));
});

intersectingLines = intersectingLines
  .filter(function(line) {
    return line.intersection.status === 'Intersection';
  });

// display intersections
intersectingLines.forEach(function(line) {
  appendCircle(line.intersection.points[0].x, line.intersection.points[0].y);
});

intersectingLines.forEach(function(line) {
  var angle = getAngle(line.points[0], line.points[1]);
  var subject = line.intersection.points[0];

  line.intersection.points.forEach(function(subject) {
    var closestPoint = getClosestPoint(subject, line.points[0], line.points[1]);

    var transposeAmount;
    if (closestPoint.y < subject.y) {
      transposeAmount = -20;
    } else {
      transposeAmount = 20;
    }

    var amendedPoint = transposePoint(closestPoint, angle, transposeAmount);

    appendCircle(closestPoint.x, closestPoint.y);

    firstPath.points.splice(-1, 0, amendedPoint);
  });
});

var lineGen = d3.svg.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; })
  .interpolate('cardinal');

d3.select('svg g#paths')
  .append('path')
    .classed('path alternative', true)
    .datum(firstPath.points)
    .attr('d', lineGen);
