var KLD = window.KLD;
var Isx = KLD.Intersection

var walls = [
  {
    label: 'exterior',
    type: 'L',
    points: [
      {x: 0, y: 0},
      {x: 1200, y: 0},
      {x: 1200, y: 800},
      {x: 0, y: 800},
      {x: 0, y: 0}
    ],
  },{
    type: 'L',
    points: [
      {x: 0, y: 200},
      {x: 200, y: 200},
      {x: 200, y: 400}
    ],
  },{
    type: 'L',
    points: [
      {x: 0, y: 500},
      {x: 200, y: 500}
    ],
  },{
    type: 'L',
    points: [
      {x: 200, y: 800},
      {x: 200, y: 550}
    ],
  },{
    type: 'L',
    points: [
      {x: 400, y: 450},
      {x: 800, y: 450},
      {x: 800, y: 550},
      {x: 400, y: 550},
      {x: 400, y: 450}
    ],
  },{
    type: 'L',
    points: [
      {x: 600, y: 50},
      {x: 600, y: 350},
      {x: 1200, y: 350}
    ],
  },{
    type: 'L',
    points: [
      {x: 700, y: 0},
      {x: 700, y: 150},
      {x: 1100, y: 150}
    ],
  },{
    type: 'L',
    points: [
      {x: 900, y: 450},
      {x: 900, y: 700}
    ],
  },{
    type: 'L',
    points: [
      {x: 900, y: 550},
      {x: 1100, y: 550}
    ],
  },{
    type: 'L',
    points: [
      {x: 1100, y: 550},
      {x: 1200, y: 550}
    ],
  }
];

var pois = [
  {
    type: 'circle',
    cx: 50,
    cy: 50,
    r: 25
  },{
    type: 'circle',
    cx: 1000,
    cy: 100,
    r: 25
  },{
    type: 'circle',
    cx: 300,
    cy: 300,
    r: 25
  },{
    type: 'circle',
    cx: 100,
    cy: 750,
    r: 25
  },{
    type: 'circle',
    cx: 1050,
    cy: 600,
    r: 25
  },
];

var paths = [];

var firstPath = {
  label: 'circle0 to circle1',
  type: 'L',
  points: [
    {x: pois[0].cx, y: pois[0].cy},
    {x: pois[1].cx, y: pois[1].cy},
  ]
}

function calcIntersections(subjectPath, otherPath) {
  var pa = subjectPath.points,
      pb = otherPath.points,
      result = [];

  for (var i = 0; i < pb.length-1; i++) {
    var intersection = Isx.intersectLineLine(pa[0], pa[1], pb[i], pb[i+1]);
    if (intersection.status === 'Intersection') {
      result.push(intersection);
    }
  }

  return result;
}

function pathData(d) {
  var p = d.points;
  switch (d.type) {
  case 'Q':
    return [
      'M', p[0].x, ' ', p[0].y,
      'Q', p[1].x, ' ', p[1].y,
      ' ', p[2].x, ' ', p[2].y
    ].join('');
  case 'C':
    return [
      'M', p[0].x, ' ', p[0].y,
      'C', p[1].x, ' ', p[1].y,
      ' ', p[2].x, ' ', p[2].y,
      ' ', p[3].x, ' ', p[3].y,
    ].join('');
  case 'L':
  default:
    var path = ['M'+p[0].x+','+p[0].y];

    p.slice(1).forEach(function(coord) {
      path.push('L'+coord.x+','+coord.y);
    });

    return path.join(' ');
  }
}

function circle(d, idx) {
  return {
    label: elemLabel(d, idx),
    cx: d.cx,
    cy: d.cy
  }
}

function elemLabel(d, idx) {
  return d.label || this.tagName + idx;
}

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


// calculate intermediate points for the first path
// trying to avoid walls
walls.forEach(function(wall, idx) {
  var intersections = calcIntersections(firstPath, wall);
  intersections.forEach(function(intersection) {
    if (intersection.status === 'Intersection') {
      console.log(idx, intersection);
      d3.select('svg g#intersections')
        .append('circle')
        .datum(intersection)
        .classed('intersection', true)
        .attr({
          cx: intersection.points[0].x,
          cy: intersection.points[0].y,
          r: 5
        });
    }
  });
});


var path = d3.select('svg g#paths')
  .append('path')
    .datum(firstPath)
    .classed('path', true)
    .attr('d', pathData);

// find intersecting wall paths
// var intersectingWalls = d3.selectAll('path.wall')
//   .forEach(function() {
//     console.log(Isx.intersectShapes(this, path[0]));
//   });
