var paths = [];

var firstPath = {
  label: 'circle0 to circle1',
  type: 'L',
  points: [
    {x: pois[0].cx, y: pois[0].cy},
    {x: pois[3].cx, y: pois[4].cy},
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

d3.select('select[name="style"]').on('change', function() {
  switch d3.select(this).property('value') {
  case: 'color':
  case: 'color-weight':
  case: 'heat'
  default:
    break;
  }

});
