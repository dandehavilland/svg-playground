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

  // if line is north->south
  if (angle === 90) {
    var closestPoint = getClosestPoint(subject, line.points[0], line.points[1]);

    appendCircle(closestPoint.x, closestPoint.y);

    var newPoints = firstPath.points.slice();
    newPoints.splice(1, 0, closestPoint);

    var newPath = {
      type: 'Q',
      points: newPoints
    };

    d3.select('svg g#paths')
      .append('path')
        .classed('path', true)
        .datum(newPath)
        .attr('d', pathData);
  }

  console.log(angle);
});
