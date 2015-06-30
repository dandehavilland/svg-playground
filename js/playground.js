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
var intersections = [];
walls.forEach(function(wall, idx) {
  intersections = intersections.concat(calcIntersections(firstPath, wall));
});

intersections = intersections
  .filter(function(intersection) {
    return intersection.status === 'Intersection';
  });

// display intersections
intersections.forEach(function(intersection) {
  d3.select('svg g#intersections')
    .append('circle')
    .datum(intersection)
    .classed('intersection', true)
    .attr({
      cx: intersection.points[0].x,
      cy: intersection.points[0].y,
      r: 5
    });
});
